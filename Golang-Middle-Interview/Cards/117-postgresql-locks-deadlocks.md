---
tags: [go, interview, middle, postgresql, locks, flashcards/БД]
topic: Locks и deadlocks PostgreSQL
---

# Какие блокировки есть в PostgreSQL и как возникают deadlocks?

## Вопрос

Чем row lock отличается от table lock, что показывает `pg_locks` и как уменьшить deadlock?

## Краткий ответ

SQL-команды автоматически берут table-level modes, а updates/`FOR UPDATE` — row locks. Несовместимые modes ждут. Deadlock возникает при цикле ожидания; PostgreSQL обнаруживает его и отменяет одну transaction. Единый порядок обновлений и короткие transaction снижают риск.

## Развёрнутый ответ мидла

- `SELECT` обычно не блокируется обычным UPDATE благодаря MVCC.
- DDL часто требует сильные table locks и может ждать старые queries.
- `lock_timeout` ограничивает ожидание lock, `statement_timeout` — statement целиком.
- `NOWAIT`/`SKIP LOCKED` меняют протокол ожидания и подходят не всем задачам.

## Развёрнутый ответ сеньора: все тонкости

- Deadlock graph может включать advisory locks и внешние действия приложения.
- `SKIP LOCKED` полезен для work queue, но не гарантирует fairness и может голодать строки.
- Idle in transaction удерживает locks/snapshot и является operational bug.
- Мониторят blockers, wait events, transaction age и query/application identity.

## Если забыл: что это, зачем и где нужно

Lock защищает конфликтующее изменение; одинаковый порядок ресурсов ломает циклы ожидания.

## Подробное объяснение простыми словами

Один работник держит ключ A и ждёт B, другой держит B и ждёт A. База заметит круг и выгонит одного, но приложение должно повторить работу и брать ключи в одинаковом порядке.

## Подробное объяснение техническими терминами

PostgreSQL lock manager поддерживает compatibility matrix relation/advisory modes и tuple locking через tuple metadata/multixact. Deadlock detector строит wait graph; victim transaction aborts with retryable SQLSTATE.
