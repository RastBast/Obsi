---
tags:
  - go
  - interview
  - middle
  - kafka
  - partitioning
  - flashcards/Kafka
deck: "Kafka"
topic: "Ключи и порядок Kafka"
---

# Как key влияет на partition и порядок сообщений?

## Вопрос

Как сохранить порядок событий одной сущности и что случится при добавлении partitions?

## Краткий ответ

Producer partitioner обычно хеширует key, поэтому одинаковый key попадает в одну partition и сохраняет её order. Records без key распределяются для balance. При увеличении числа partitions mapping hash modulo меняется, и будущие события key могут перейти в другую partition.

## Развёрнутый ответ мидла

- В key кладут domain aggregate ID, если его события требуют порядка.
- Один популярный key создаёт hotspot и не распараллеливается внутри group.
- Consumer должен обрабатывать partition последовательно, если side effects требуют order.
- Timestamp не заменяет partition order при clock skew/retries.

## Развёрнутый ответ сеньора: все тонкости

- Repartition migration требует переходного протокола, если строгий per-key order нельзя нарушить.
- Custom partitioner должен быть одинаковым у producers и стабильно versioned.
- Async processing внутри consumer может переупорядочить completion даже при ordered fetch.
- Poison event блокирует строгую последовательность; политика skip/DLQ меняет semantics.

### Дополнительное техническое объяснение

Partitioner deterministically maps record key to partition, making partition log order the per-key sequencing mechanism. Topology change or consumer-side concurrency can violate end-to-end processing order beyond append order.

## Если забыл / Простыми словами

Одинаковый key связывает события с одной partition, но ограничивает параллелизм и усложняет repartition.

### Аналогия и объяснение

Все письма одного клиента отправляют в одну сортировочную линию, и их порядок сохраняется. Если линию разделили на большее число дорожек, правило выбора может перенаправить новые письма.
