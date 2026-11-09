---
tags: [go, interview, middle, redis, performance, flashcards/Redis]
topic: Redis pipelining
---

Как pipelining уменьшает RTT, сохраняется ли порядок ответов и гарантирует ли он атомарность?::Pipeline отправляет несколько команд без ожидания каждого ответа, сокращая сетевые round trips. Redis возвращает ответы в порядке команд. Pipeline сам по себе не атомарен: команды других clients могут выполняться между ними; MULTI/Lua решают атомарность.

# Чем pipeline отличается от transaction?

## Вопрос

Как pipelining уменьшает RTT, сохраняется ли порядок ответов и гарантирует ли он атомарность?

## Краткий ответ

Pipeline отправляет несколько команд без ожидания каждого ответа, сокращая сетевые round trips. Redis возвращает ответы в порядке команд. Pipeline сам по себе не атомарен: команды других clients могут выполняться между ними; MULTI/Lua решают атомарность.

## Развёрнутый ответ мидла

- Batch size балансирует throughput, latency и память client/server buffers.
- Ошибка transport может оставить неизвестным, какие команды выполнены.
- Cluster client разделяет pipeline по nodes/hash slots.
- Pipeline полезен для независимых bulk operations, но не заменяет MGET/MSET, если специальная команда лучше.

## Развёрнутый ответ сеньора: все тонкости

- Огромный pipeline блокирует fairness и создаёт burst response memory.
- Retry всего batch опасен для неидемпотентных команд вроде INCR.
- Backpressure нужен, чтобы producer не создавал бесконечные outstanding futures.
- Latency измеряют и на элемент, и на flush batch.

## Если забыл: что это, зачем и где нужно

Pipeline — транспортная упаковка ради меньшего RTT, transaction — гарантия отсутствия interleaving.

## Подробное объяснение простыми словами

Вместо отправки одного письма и ожидания ответа посылаем пачку. Ответы придут по порядку быстрее, но почтальон не обещает, что между письмами не обработает чужие.

## Подробное объяснение техническими терминами

Pipelining keeps multiple requests in flight over ordered connection, amortizing RTT/syscalls. It provides response correlation by order, not isolation; partial transport failure creates ambiguous execution boundary.
