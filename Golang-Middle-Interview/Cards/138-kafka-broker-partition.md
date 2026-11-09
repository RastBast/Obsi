# Что такое topic, partition, broker и record в Kafka?

Как partitioning даёт масштабирование и какую границу порядка гарантирует Kafka?

===

@input

---

## Краткий ответ

Topic разделён на ordered partitions, размещённые на brokers. Record получает offset внутри partition. Producer выбирает partition, consumers читают log. Порядок гарантирован только внутри одной partition, не между всем topic. Число partitions ограничивает параллелизм consumer group.

---

## Развёрнутый ответ мидла

- Broker хранит segment files и обслуживает produce/fetch.
- Partition имеет leader и replicas.
- Offset — позиция записи, а не глобальный ID события.
- Retention удаляет старые segments независимо от того, прочитал ли конкретный consumer, если политика не иная.

---

## Развёрнутый ответ сеньора: все тонкости

- Больше partitions повышает parallelism, но увеличивает metadata, files, rebalance и cost порядка.
- Изменение partition count меняет mapping key→partition для обычного hash.
- Hot key создаёт hot partition, даже если cluster в среднем свободен.
- Durability определяется replication/acks/min ISR, не самим словом Kafka.

### Дополнительное техническое объяснение

Kafka stores append-only partition logs with monotonically increasing offsets and replicated leaders. Partition is unit of ordering, placement and consumer assignment; aggregate topic has no total order.

---

## Если забыл / Простыми словами

Topic — набор журналов-partitions; offset и порядок локальны одному журналу.

### Аналогия и объяснение

Большую книгу разрезали на несколько независимых томов и разложили по серверам. Страницы упорядочены внутри тома, но нельзя сказать, какая страница из разных томов была «раньше» без дополнительного времени/ключа.
