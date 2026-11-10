---
tags:
  - go
  - interview
  - middle
  - postgresql
  - transactions
  - flashcards/БД
deck: "БД"
topic: "Savepoint"
---

# Для чего нужны SAVEPOINT и ROLLBACK TO?

## Вопрос

Как частично откатить transaction и почему после SQL-ошибки PostgreSQL требует rollback?

## Краткий ответ

Savepoint отмечает точку внутри transaction. `ROLLBACK TO` отменяет изменения после неё, не завершая всю transaction; `RELEASE` удаляет savepoint. В PostgreSQL ошибка переводит transaction в aborted state до rollback всей transaction или к savepoint.

## Развёрнутый ответ мидла

- Savepoint полезен для локальной ожидаемой ошибки в большом атомарном процессе.
- Он не делает внешние HTTP/Kafka effects откатываемыми.
- Go `database/sql` не имеет high-level Savepoint API, но SQL-команды можно выполнять через Tx с контролем имён/протокола.
- Вложенные application transactions обычно моделируют savepoints, а не настоящие независимые commits.

## Развёрнутый ответ сеньора: все тонкости

- Много subtransactions имеет overhead и ограничения внутренних структур PostgreSQL.
- Ошибку unique constraint часто лучше предотвратить `ON CONFLICT`, чем использовать savepoint на каждую строку.
- Release не commit-ит данные независимо; внешний rollback отменит всё.
- Transaction retry после serialization failure обычно повторяет целиком, а не спасает отдельным savepoint.

### Дополнительное техническое объяснение

Savepoint создаёт subtransaction boundary. Error marks current transaction command state aborted; rollback-to-savepoint restores parent subtransaction context. Durability и atomic visibility всё равно определяются outer commit.

## Если забыл / Простыми словами

Savepoint — закладка для частичного отката внутри одной ещё не завершённой transaction.

### Аналогия и объяснение

Это точка сохранения в игре. Можно отменить последние действия и продолжить, но окончательное сохранение всей партии происходит только при общем commit.
