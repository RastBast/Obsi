---
tags: [go, interview, middle, redis, messaging, flashcards/Redis]
topic: Pub/Sub и Streams
---

# Чем Redis Pub/Sub отличается от Streams?

## Вопрос

Какие гарантии хранения, replay и consumer state дают эти механизмы?

## Краткий ответ

Pub/Sub доставляет сообщение только текущим подписчикам и не хранит backlog; отключённый consumer пропускает события. Streams хранят ordered entries, позволяют читать с ID, replay и consumer groups с pending state. Для надёжной обработки Streams подходят лучше.

## Развёрнутый ответ мидла

- Pub/Sub хорош для ephemeral notifications, invalidation и live signal.
- Streams ограничивают длину retention/trimming policy.
- Consumer подтверждает entry через ACK; неподтверждённые остаются pending.
- И там, и там payload/schema/versioning проектирует приложение.

## Развёрнутый ответ сеньора: все тонкости

- Pub/Sub slow subscriber и output buffer требуют политики disconnect.
- Streams дают at-least-once при reclaim, поэтому handler идемпотентен.
- Pending list нужно мониторить и обрабатывать abandoned consumers.
- Redis Streams не автоматически заменяют Kafka для большого долговременного distributed log.

## Если забыл: что это, зачем и где нужно

Pub/Sub — эфир только сейчас, Stream — журнал, который можно дочитать и подтвердить.

## Подробное объяснение простыми словами

Радио не повторяет передачу тому, кто был выключен. Журнал хранит записи: читатель отмечает прочитанное и может вернуться после перерыва.

## Подробное объяснение техническими терминами

Pub/Sub is ephemeral fanout without persistence/offset. Streams maintain append-only IDs, retention, consumer-group delivery state и pending entries, enabling replay and at-least-once workflows.
