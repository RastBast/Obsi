---
tags:
  - go
  - interview
  - middle
  - kafka
  - schema
  - flashcards/Kafka
deck: "Kafka"
topic: "Schema evolution"
---

# Как безопасно менять schema Kafka-событий?

## Вопрос

Что означают backward/forward compatibility и почему producer/consumer обновляют независимо?

## Краткий ответ

Backward compatibility позволяет новому reader читать старые данные, forward — старому reader читать новые. При rolling deploy одновременно живут разные версии, поэтому добавляют optional/default fields, не переиспользуют field IDs и проверяют schema registry compatibility.

## Развёрнутый ответ мидла

- Event envelope содержит type/version/id/occurred_at/correlation metadata.
- Удаление поля проходит этап: consumers перестали использовать → producer перестал писать → schema эволюционирует.
- Unknown fields должны игнорироваться/сохраняться по формату.
- Breaking semantic change иногда требует нового event type/topic.

## Развёрнутый ответ сеньора: все тонкости

- Синтаксически совместимое поле может изменить смысл/единицы и сломать потребителей.
- Defaults применяются reader/writer schema по правилам Avro/Protobuf/JSON Schema по-разному.
- Upcaster может нормализовать старые версии, но становится важным кодом миграции.
- PII retention и право на удаление должны учитывать immutable log и downstream copies.

### Дополнительное техническое объяснение

Schema compatibility formalizes writer-reader resolution across independently deployed producers/consumers. Registry policy, stable field identifiers/defaults и semantic version governance обеспечивают replay safety.

## Если забыл / Простыми словами

События переживают код, поэтому новая и старая версии обязаны сосуществовать во время обновления и replay.

### Аналогия и объяснение

Старые письма останутся в архиве после обновления бланка. Новый сотрудник должен понимать старый бланк, а старый сотрудник — не ломаться от дополнительной необязательной строки.
