---
tags: [go, interview, middle, kafka, operations, flashcards/Kafka]
topic: Partition reassignment
---

Как безопасно переносить Kafka partitions между brokers?::Reassignment меняет replica placement и копирует log на новые brokers, затем удаляет старые replicas. Процесс потребляет disk/network и конкурирует с production traffic, поэтому его throttling, batch size, ISR и free space контролируют.

# Как безопасно переносить Kafka partitions между brokers?

## Вопрос

Зачем reassignment при добавлении broker и какие риски у массового переноса?

## Краткий ответ

Reassignment меняет replica placement и копирует log на новые brokers, затем удаляет старые replicas. Процесс потребляет disk/network и конкурирует с production traffic, поэтому его throttling, batch size, ISR и free space контролируют.

## Развёрнутый ответ мидла

Добавление broker само по себе не перемещает старые partitions автоматически во всех сценариях. План распределяет leaders/replicas по brokers/racks и выполняется постепенно.

## Развёрнутый ответ сеньора: все тонкости

- Source/target disk headroom учитывает временную двойную копию.
- Moving leader и replica имеют разный traffic impact.
- Under-replicated partitions и consumer/producer latency — stop signals.
- Tiered storage и controller mode/version меняют operational details.

## Если забыл: что это, зачем и где нужно

Новый broker не помогает старым данным, пока partitions не перераспределены; перенос ограничивают по нагрузке.

## Подробное объяснение простыми словами

Новый склад пуст, а старые переполнены. Товары нужно реально перевезти, но слишком много грузовиков одновременно заблокируют обычные доставки.

## Подробное объяснение техническими терминами

Replica reassignment performs inter-broker log replication and metadata transition. Operational safety requires bandwidth throttle, ISR preservation, storage headroom and staged leader balancing.
