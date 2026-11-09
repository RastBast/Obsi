# Когда выбирать Kafka, RabbitMQ или Redis Streams?

Как log, queue routing и in-memory stream модели отличаются по replay, throughput и operations?

===

@input

---

## Краткий ответ

Kafka — распределённый durable log с retention/replay и partition scalability. RabbitMQ — message broker с гибкой routing, per-message queue/ack и удобной task distribution. Redis Streams — более простой persistent stream рядом с Redis. Выбор делают по гарантиям и эксплуатации, не по популярности.

---

## Развёрнутый ответ мидла

- Kafka consumer хранит offset и может перечитать историю.
- RabbitMQ обычно удаляет acked message из queue и предлагает exchanges/routing keys.
- Redis Streams хранит IDs/consumer groups, но scale/retention ecosystem отличается.
- Все требуют idempotency для redelivery.

---

## Развёрнутый ответ сеньора: все тонкости

- Kafka порядок/parallelism привязаны к partitions; Rabbit queue может гибче раздавать отдельные tasks.
- Большой replay и event sourcing естественнее log model.
- Low-volume command queue с per-message priority/routing может быть проще в Rabbit.
- Команда должна учитывать managed offering, skills, failure recovery и capacity cost.

### Дополнительное техническое объяснение

Systems differ in storage model, consumer cursor/ack semantics, routing topology, partitioning, retention и operational envelope. Architecture выбирает required replay, ordering, fanout, throughput и failure semantics.

---

## Если забыл / Простыми словами

Kafka — журнал истории, RabbitMQ — маршрутизируемые очереди задач, Streams — журнал внутри Redis-экосистемы.

### Аналогия и объяснение

Kafka хранит книгу, которую разные читатели читают со своей закладки. RabbitMQ раздаёт конверты исполнителям и убирает после подтверждения. Redis Streams даёт похожий журнал в уже знакомом быстром хранилище.
