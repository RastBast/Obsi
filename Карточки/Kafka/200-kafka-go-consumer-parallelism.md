---
tags:
  - go
  - interview
  - middle
  - kafka
  - concurrency
  - flashcards/Kafka
deck: "Kafka"
topic: "Параллельный Kafka consumer на Go"
---

# Как распараллелить Kafka consumer в Go и корректно commit-ить offsets?

## Вопрос

Как сохранить порядок partition и не подтвердить незавершённые события?

## Краткий ответ

Безопаснее назначить последовательный worker каждой partition или хранить completion watermark. Нельзя commit-ить offset дальше незавершённого сообщения: crash потеряет работу. In-flight ограничивают, rebalance отменяет workers и ждёт/фиксирует завершённое.

## Развёрнутый ответ мидла

Reader loop poll-ит, передаёт в bounded workers, обрабатывает idempotently и commit-ит только contiguous processed prefix. Context rebalance/shutdown прекращает intake и освобождает assignment.

## Развёрнутый ответ сеньора: все тонкости

- Библиотеки имеют разные poll/heartbeat модели; blocking handler может вызвать rebalance.
- Межpartition parallelism естественен, внутрипартиционный ломает completion order.
- Batch commit балансирует overhead и duplicate window.
- Commit failure не означает, что effect нужно бездумно повторить немедленно.

### Дополнительное техническое объяснение

Consumer tracks per-partition in-flight offsets and advances commit watermark over contiguous completions. Bounded concurrency, generation cancellation and idempotent effects preserve at-least-once semantics during rebalance/crash.

## Если забыл / Простыми словами

Параллельность ограничена partitions; подтверждай только непрерывно завершённый участок.

### Аналогия и объяснение

Если пять писем выдали одновременно и пятое готово, а третье нет, нельзя ставить закладку после пятого: после аварии третье потеряется. Закладка двигается только через готовую непрерывную очередь.
