# Как работает UPSERT в PostgreSQL?

Как `INSERT ... ON CONFLICT` атомарно обрабатывает конкурентное создание и чем `DO NOTHING` отличается от `DO UPDATE`?

===

@input

---

## Краткий ответ

`ON CONFLICT` использует unique/exclusion arbiter и атомарно выбирает вставку либо альтернативу при конфликте. `DO NOTHING` пропускает конфликтующую строку, `DO UPDATE` обновляет её с доступом к proposed row через `EXCLUDED`. Это безопаснее check-then-insert в приложении.

---

## Развёрнутый ответ мидла

```sql
INSERT INTO counters(key, value)
VALUES ($1, 1)
ON CONFLICT (key)
DO UPDATE SET value = counters.value + 1
RETURNING value;
```

Операция выполняется одной SQL-командой под механизмом уникального индекса. Conflict target указывает columns/constraint или позволяет inference подходящего unique index. `RETURNING` отдаёт вставленную/обновлённую строку.

`DO UPDATE ... WHERE` может не обновить строку после lock, и semantics результата нужно учитывать.

---

## Развёрнутый ответ сеньора: все тонкости

UPSERT не устраняет все deadlocks: разные keys/дополнительные updates могут образовать цикл. Частые updates одного key создают hotspot и bloat. Conditional update с version позволяет optimistic concurrency, а слепой update может потерять доменную проверку.

`MERGE` выражает более общие ветви matched/not matched, но имеет иные concurrency semantics; нельзя автоматически считать его синонимом UPSERT.

### Дополнительное техническое объяснение

Unique index arbitration и speculative insertion координируют concurrent inserters. `ON CONFLICT DO UPDATE` гарантирует атомарный insert-or-update outcome для каждой proposed row при обычном исполнении, сохраняя statement-level MVCC/locking semantics.

---

## Если забыл / Простыми словами

Вместо «посмотри, есть ли карточка, потом положи» мы одной командой говорим архиву: «если места нет, обнови существующую». Архив сам разруливает двух сотрудников, пришедших одновременно.

### Аналогия и объяснение

Главная защита — уникальный замок в самой БД. Предварительный SELECT приложения оставляет окно гонки; UPSERT закрывает решение внутри одной атомарной операции.
