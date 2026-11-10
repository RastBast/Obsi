---
tags:
  - go
  - interview
  - middle
  - postgresql
  - transactions
  - flashcards/БД
deck: "БД"
topic: "Isolation levels PostgreSQL"
---

# Как PostgreSQL реализует isolation levels?

## Вопрос

Чем Read Committed, Repeatable Read и Serializable отличаются по snapshot и аномалиям?

## Краткий ответ

В PostgreSQL Read Committed берёт новый snapshot на каждый statement. Repeatable Read использует snapshot транзакции и предотвращает non-repeatable reads, но бизнес-конфликты всё ещё возможны. Serializable применяет SSI и может отменить transaction с serialization failure, которую нужно повторить.

## Развёрнутый ответ мидла

- Read Uncommitted фактически ведёт себя как Read Committed.
- Repeatable Read не видит commits после своего snapshot.
- `SELECT ... FOR UPDATE` блокирует/проверяет строки для update protocol.
- Isolation не заменяет constraints и atomic SQL updates.

## Развёрнутый ответ сеньора: все тонкости

- PostgreSQL Repeatable Read предотвращает часть phantom через snapshot, но write skew возможен.
- Serializable не означает глобальный mutex; SSI отслеживает опасные dependencies.
- Retry повторяет всю transaction с новым snapshot и без необратимых side effects.
- Read-only deferrable transaction может ждать безопасный snapshot для отчёта.

### Дополнительное техническое объяснение

MVCC snapshot scope differs by level; SSI detects rw-dependency structures that threaten serializability. Serialization failure is expected control flow requiring bounded whole-transaction retry.

## Если забыл / Простыми словами

Чем выше isolation, тем сильнее иллюзия последовательности, но тем больше конфликтов/повторов.

### Аналогия и объяснение

На Read Committed каждое обращение получает свежую фотографию. Repeatable Read держит одну фотографию весь разговор. Serializable следит, чтобы несколько разговоров можно было объяснить как очередь, и отменяет опасный.
