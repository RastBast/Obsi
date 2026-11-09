---
tags: [go, interview, middle, kafka, delivery, flashcards/Kafka]
topic: Offset и delivery semantics
---

# Чем at-most-once, at-least-once и exactly-once отличаются?

## Вопрос

Когда commit-ить consumer offset относительно side effect и почему обычная обработка чаще at-least-once?

## Краткий ответ

Commit до обработки рискует потерять событие при crash — at-most-once. Обработка, затем commit может повторить side effect после crash между шагами — at-least-once. Exactly-once требует атомарно связать output и consumed offsets в поддерживаемой системе либо сделать side effect идемпотентным.

## Развёрнутый ответ мидла

- Offset обычно означает следующую позицию для чтения.
- Auto-commit может подтвердить ещё не завершённую асинхронную работу.
- Идемпотентный consumer хранит event ID/unique constraint вместе с effect.
- Batch commit увеличивает окно повторов, но уменьшает overhead.

## Развёрнутый ответ сеньора: все тонкости

- Kafka transactions дают EOS для Kafka read-process-write при `read_committed`, но не атомарно с произвольным HTTP.
- DB effect+offset можно связать inbox table, а Kafka offset восстановить из неё/координировать протоколом.
- Rebalance и out-of-order workers усложняют contiguous commit frontier.
- Exactly-once — end-to-end property, не одна настройка broker.

## Если забыл: что это, зачем и где нужно

До effect — возможна потеря; после effect — возможен повтор. Идемпотентность делает повтор безопасным.

## Подробное объяснение простыми словами

Если отметить письмо прочитанным до выполнения поручения, поручение потеряется при аварии. Если после — поручение могут сделать дважды. Уникальный номер позволяет второй раз узнать уже выполненное.

## Подробное объяснение техническими терминами

Delivery semantics определяются ordering of side-effect commit and offset commit. Atomic transaction boundary либо deduplication/inbox protocol превращает redelivery в observationally single effect.
