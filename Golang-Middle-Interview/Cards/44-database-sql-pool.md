---
tags: [golang, interview, middle, sql, database]
topic: database/sql
---

# Как работает пул соединений database/sql?

## Вопрос

Что представляет собой `sql.DB`, как настраивать pool и какие правила нужны для `Rows`, `Row`, prepared statements и context?

## Краткий ответ

`sql.DB` — конкурентно-безопасный handle и пул соединений, а не одно соединение. Его создают один раз и переиспользуют. Настраивают max open/idle и lifetime по БД/нагрузке. `Rows` закрывают, ошибки итерации проверяют, запросы выполняют с context.

## Развёрнутый ответ мидла

```go
db, err := sql.Open(driver, dsn)
if err != nil { return err }
if err := db.PingContext(ctx); err != nil { return err }

db.SetMaxOpenConns(20)
db.SetMaxIdleConns(10)
db.SetConnMaxLifetime(30 * time.Minute)
```

`Open` может не устанавливать соединение сразу, поэтому readiness/startup проверяет `PingContext` по политике.

```go
rows, err := db.QueryContext(ctx, q, arg)
if err != nil { return err }
defer rows.Close()
for rows.Next() { /* Scan */ }
if err := rows.Err(); err != nil { return err }
```

Параметры передают placeholders драйвера, не собирают SQL конкатенацией.

## Развёрнутый ответ сеньора: все тонкости

Pool — очередь за ограниченным ресурсом. Слишком высокий `MaxOpenConns` перегружает БД, слишком низкий повышает latency ожидания. Смотрят `db.Stats`: InUse, Idle, WaitCount, WaitDuration, MaxIdleClosed/MaxLifetimeClosed. Лимит согласуют между всеми instance и server-side connection budget.

Не закрытые `Rows`/транзакции удерживают connection и могут исчерпать pool. `QueryRowContext` откладывает ошибку до `Scan`. Отмена context зависит от поддержки драйвера; соединение после отмены может быть закрыто/переиспользовано по его правилам.

Prepared `Stmt`, созданный на `DB`, абстрагирует подготовку на разных connections и безопасен для concurrent use, но не всегда даёт выигрыш: протокол/драйвер/БД могут кешировать иначе. Statement внутри Tx привязан к её connection.

`ConnMaxLifetime` и `ConnMaxIdleTime` помогают ротировать соединения и согласоваться с proxy/server timeout, но слишком синхронная ротация вызывает churn; полезен естественный разброс жизненных циклов на уровне флота.

`sql.DB.Close` обычно вызывают при shutdown приложения, не после каждого запроса. Readiness не должна создавать дорогой query storm; различают способность процесса работать и краткий сбой downstream.

## Если забыл: что это, зачем и где нужно

Главная фраза: **`sql.DB` — это pool, его переиспользуют**. Закрывай Rows, проверяй `rows.Err`, передавай context, ставь лимиты из общего connection budget и наблюдай `db.Stats`.
