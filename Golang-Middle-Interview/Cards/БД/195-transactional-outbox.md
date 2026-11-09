---
tags:
  - go
  - interview
  - middle
  - database
  - distributed-systems
  - flashcards/БД
deck: "БД"
topic: "Transactional outbox"
---

# Как transactional outbox решает dual write БД и брокера?

## Вопрос

Какие гарантии даёт outbox и почему consumer всё равно должен быть идемпотентным?

## Краткий ответ

Бизнес-изменение и запись события в outbox table выполняются одной DB transaction. Отдельный relay/CDC публикует outbox в broker и отмечает/удаляет запись. Это исключает «БД committed, событие забыто», но доставка остаётся at-least-once.

## Развёрнутый ответ мидла

Outbox содержит event ID, aggregate ID/type, schema version, payload, time. Publisher batch-ит, retry-ит с backoff; cleanup сохраняет audit/retention policy.

## Развёрнутый ответ сеньора: все тонкости

- Crash после publish до mark создаёт duplicate.
- Polling с `SKIP LOCKED` масштабируется workers, CDC уменьшает polling latency.
- Порядок событий aggregate требует sequence и partition key.
- Poison row, schema evolution и backlog имеют monitoring/runbook.

### Дополнительное техническое объяснение

Outbox atomically persists domain mutation and integration event in one ACID boundary. Asynchronous publisher provides at-least-once transfer; event identity/consumer deduplication produce idempotent effect.

## Если забыл / Простыми словами

Сохрани данные и обещание отправить событие одной транзакцией, отправляй позже с безопасными повторами.

### Аналогия и объяснение

Кассир одновременно проводит покупку и кладёт письмо в надёжный лоток. Курьер может забрать письмо повторно, но оно не исчезнет между кассой и почтой.
