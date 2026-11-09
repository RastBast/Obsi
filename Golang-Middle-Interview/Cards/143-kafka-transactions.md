---
tags: [go, interview, middle, kafka, transactions, flashcards/Kafka]
topic: Kafka transactions
---

Что может атомарно записать transactional producer и как fencing защищает от старого экземпляра?::Producer с `transactional.id` может атомарно записать records в несколько partitions и offsets consumer group. Broker использует producer epoch для fencing старого producer. Consumers с `read_committed` скрывают aborted и ещё не завершённые transactional records.

# Как работают Kafka transactions и read_committed?

## Вопрос

Что может атомарно записать transactional producer и как fencing защищает от старого экземпляра?

## Краткий ответ

Producer с `transactional.id` может атомарно записать records в несколько partitions и offsets consumer group. Broker использует producer epoch для fencing старого producer. Consumers с `read_committed` скрывают aborted и ещё не завершённые transactional records.

## Развёрнутый ответ мидла

- Begin → produce → send offsets → commit/abort transaction.
- Transaction timeout ограничивает зависшую transaction.
- Stable unique transactional ID привязывают к instance/shard задачи, не генерируют случайно каждый раз.
- EOS применима к поддерживаемому Kafka pipeline, не к произвольным внешним системам.

## Развёрнутый ответ сеньора: все тонкости

- Open transaction ограничивает last stable offset и может задерживать read_committed consumers.
- Coordinator/transaction state добавляет latency и operational complexity.
- Fenced producer должен прекратить работу, а не бесконечно retry.
- Для БД нужен outbox/inbox, CDC или иной dual-write protocol.

## Если забыл: что это, зачем и где нужно

Transaction связывает Kafka outputs и input offsets, epoch выгоняет старого writer, read_committed показывает только завершённое.

## Подробное объяснение простыми словами

Несколько записей и отметка о прочитанном кладутся в один конверт: видны либо все, либо ни одна. Если старый сотрудник вернулся, новый номер смены не позволяет ему продолжить запись.

## Подробное объяснение техническими терминами

Transactional producer coordinates PID epochs, partition markers and group offsets through transaction coordinator. Isolation `read_committed` reads only up to LSO and filters aborted batches, providing Kafka-scoped atomicity.
