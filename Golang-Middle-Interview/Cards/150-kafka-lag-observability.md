# Как мониторить Kafka consumer lag и здоровье pipeline?

Почему lag в records недостаточен, какие метрики нужны producer, broker и consumer и как оценить время отставания?

===

@input

---

## Краткий ответ

Lag — разница log end offset и committed/processed offset по partition. Он показывает backlog records, но не их возраст/стоимость. Нужны oldest event age, consume/produce rate, processing latency/errors, rebalance, ISR, disk/network и under-replicated partitions.

---

## Развёрнутый ответ мидла

- Суммарный lag скрывает одну горячую partition; смотрят max/per-partition.
- Commit lag может не равняться processing lag при async workers.
- Lag растёт, если arrival rate выше sustainable processing rate.
- Alert привязывают к SLA времени, а не универсальному числу records.

---

## Развёрнутый ответ сеньора: все тонкости

- Low traffic partition с одной очень старой записью имеет маленький count и большой time lag.
- Compaction/retention и reset offsets меняют интерпретацию.
- Capacity headroom проверяют при broker/consumer failure, а не только steady state.
- Метрики без event timestamp требуют оценки по offsets/rates и могут быть неточны.

### Дополнительное техническое объяснение

Consumer backlog is partition-level offset delta; end-to-end freshness derives from event/ingest timestamp and processed watermark. Capacity model compares arrival rate λ, service rate μ, failure headroom и retention horizon.

---

## Если забыл / Простыми словами

Lag показывает очередь, age показывает нарушение времени; смотреть нужно по partition и вместе с throughput/errors.

### Аналогия и объяснение

Десять коротких писем и десять огромных задач — одинаковое число, но разная работа. Важны и длина очереди, и возраст самого старого письма, и скорость поступления против скорости обработки.
