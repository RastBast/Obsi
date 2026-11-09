---
tags:
  - go
  - interview
  - middle
  - flashcards/Redis
deck: "Redis"
topic: "Как реализовать идемпотентную операцию через Redis Lua?"
---

# Как реализовать идемпотентную операцию через Redis Lua?

## Вопрос

Как атомарно проверить idempotency key, сохранить результат и не выполнить side effect дважды?

## Краткий ответ

Lua/function может атомарно проверить key и записать состояние/результат с TTL, не допуская двух concurrent winners внутри Redis. Но внешний side effect нельзя атомарно включить в script: нужен state machine `in_progress/completed`, owner/lease, durable source и reconcile для crash между шагами.

## Развёрнутый ответ мидла

Простой случай — операция целиком в Redis: script проверяет отсутствие key, изменяет данные, сохраняет response и TTL одной командой. Повтор получает сохранённый response.

Если затем вызывается payment/DB, процесс может умереть после side effect до `completed`. Нельзя просто дать другому worker повторить без idempotency upstream. Lease имеет token/expiry, а takeover проверяет status и бизнес-результат.

## Развёрнутый ответ сеньора: все тонкости

TTL — окно дедупликации; после него старый retry считается новым. Один key с другим payload должен вернуть conflict, поэтому сохраняют payload hash/operation identity. Cluster требует всех script keys в одном hash slot.

Failover/durability Redis влияют на correctness. Для критичной денежной операции unique constraint/transactional ledger и idempotency provider важнее cache-level key.

### Дополнительное техническое объяснение

Redis serialized script provides linearizable-like atomic transition on one shard under deployment guarantees. Cross-system exactly-once отсутствует; protocol требует fencing, durable idempotency key, state transition recovery and downstream deduplication.

## Если забыл / Простыми словами

Redis может выдать одному человеку талон «ты первый» и запомнить ответ. Но если человек ушёл после оплаты и до отметки «готово», следующий должен не платить снова, а проверить реальный результат.

### Аналогия и объяснение

Атомарная запись решает гонку за талон, но не объединяет два разных здания в одну транзакцию. Поэтому внешний сервис тоже должен понимать тот же idempotency key.
