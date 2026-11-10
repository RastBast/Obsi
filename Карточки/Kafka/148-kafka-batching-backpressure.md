---
tags:
  - go
  - interview
  - middle
  - kafka
  - performance
  - flashcards/Kafka
deck: "Kafka"
topic: "Batching и backpressure Kafka"
---

# Как batching и compression влияют на Kafka throughput?

## Вопрос

Что настраивают batch size/linger/compression и как consumer ограничивает in-flight обработку?

## Краткий ответ

Producer собирает records в batches на partition; больший batch и небольшой linger улучшают compression/network efficiency ценой latency и памяти. Consumer fetch тоже получает batches. Processing concurrency должна быть bounded, а fetch/pause согласованы с max poll и commit frontier.

## Развёрнутый ответ мидла

- Compression обычно применяется к batch, поэтому заполненность важна.
- Огромный record/batch должен укладываться в limits producer, broker и consumer.
- Bounded worker pool предотвращает memory growth.
- При перегрузке consumer pause partitions или снижает intake, а не продолжает бесконечно fetch.

## Развёрнутый ответ сеньора: все тонкости

- Concurrency выше числа partitions не даёт partition parallelism без внутренней обработки и рискует order.
- Out-of-order completion требует tracking минимального contiguous processed offset.
- Compression экономит network/disk, тратит producer/broker/consumer CPU в зависимости от codec.
- Tail latency учитывает linger плюс queueing, broker и processing.

### Дополнительное техническое объяснение

Partition-local batching amortizes protocol overhead and improves codec ratio. Flow control requires bounded in-flight records, partition pause/resume и commit watermark consistent with completed offsets.

## Если забыл / Простыми словами

Batch повышает throughput, но добавляет ожидание; backpressure ограничивает число ещё не обработанных records.

### Аналогия и объяснение

Грузовик выгоднее отправлять заполненным, но первый пакет ждёт остальных. Если склад получателя переполнен, нужно временно остановить новые грузовики, а не складывать коробки на улице бесконечно.
