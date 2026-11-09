---
tags: [go, interview, middle, kafka, cdc, flashcards/Kafka]
topic: Kafka outbox и CDC
---

Чем CDC-публикация outbox отличается от polling?::Polling workers читают outbox SQL-запросами и помечают rows; просто, но создают polling latency/load. CDC читает WAL/binlog и публикует committed outbox changes почти потоково. Оба требуют idempotency, schema и monitoring lag.

# Чем CDC-публикация outbox отличается от polling?

## Вопрос

Как выбрать relay для transactional outbox в Kafka?

## Краткий ответ

Polling workers читают outbox SQL-запросами и помечают rows; просто, но создают polling latency/load. CDC читает WAL/binlog и публикует committed outbox changes почти потоково. Оба требуют idempotency, schema и monitoring lag.

## Развёрнутый ответ мидла

Polling с `FOR UPDATE SKIP LOCKED` распределяет batch между workers. CDC connector управляет replication slot/offset и преобразует rows в Kafka records.

## Развёрнутый ответ сеньора: все тонкости

- Replication slot при остановленном CDC удерживает WAL и заполняет disk.
- Snapshot/bootstrap может повторить или переупорядочить относительно stream без protocol.
- Delete/cleanup outbox согласуют с lag/recovery.
- Event order берут из aggregate sequence, не только connector time.

## Если забыл: что это, зачем и где нужно

Polling спрашивает таблицу, CDC слушает журнал БД; гарантии повторов нужны обоим.

## Подробное объяснение простыми словами

Курьер может каждые секунды проверять лоток или получать копию каждой новой строки из журнала кассы. Второй способ быстрее, но требует следить, чтобы чтение журнала не остановилось.

## Подробное объяснение техническими терминами

Outbox relay consumes committed rows via SQL locking or logical decoding. Delivery remains at-least-once; connector offset/slot retention, snapshot consistency and event key ordering are operational invariants.
