---
tags: [go, interview, middle, redis, flashcards/Redis]
topic: Типы данных Redis
---

# Какие структуры данных есть в Redis?

## Вопрос

Когда использовать string, hash, list, set, sorted set, bitmap и HyperLogLog?

## Краткий ответ

String хранит bytes/counter, hash — поля объекта, list — ordered deque, set — уникальные элементы, sorted set — элементы с score и range/rank. Bitmap компактно хранит boolean positions, HyperLogLog оценивает cardinality с ошибкой. Выбор определяется операциями, а не названием сущности.

## Развёрнутый ответ мидла

- `INCR` атомарно меняет integer string.
- Set поддерживает membership/intersection, sorted set — leaderboard/time index.
- List подходит простой очереди, но надёжная обработка требует протокола/Streams.
- Key naming включает namespace/tenant и не должен создавать огромную cardinality без TTL.

## Развёрнутый ответ сеньора: все тонкости

- Операция над большим key может блокировать single command execution; оценивают complexity.
- Hash экономит overhead для небольших объектов, но TTL обычно ставится на key целиком.
- HyperLogLog не возвращает сами элементы и даёт приблизительный count.
- Cluster multi-key операции требуют одинакового hash slot.

## Если забыл: что это, зачем и где нужно

Redis — не только key→string; выбирай структуру по нужным атомарным операциям и сложности.

## Подробное объяснение простыми словами

Это шкаф с разными контейнерами: строка, карточка полей, очередь, уникальная коробка и рейтинг. Если выбрать правильный контейнер, сервер выполнит нужное действие одной безопасной командой.

## Подробное объяснение техническими терминами

Redis exposes typed key values with command-specific atomicity and complexity. Data-model choice determines memory encoding, server event-loop time, cluster slot constraints и available set/range operations.
