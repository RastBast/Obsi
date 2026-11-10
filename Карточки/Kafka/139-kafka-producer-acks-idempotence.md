---
tags:
  - go
  - interview
  - middle
  - kafka
  - producer
  - flashcards/Kafka
deck: "Kafka"
topic: "Kafka producer"
---

# Как acks и idempotent producer влияют на надёжность?

## Вопрос

Чем отличаются `acks=0/1/all`, зачем idempotence и почему retry может создать duplicate?

## Краткий ответ

`acks=0` не ждёт подтверждения, `acks=1` ждёт leader, `acks=all` — требуемые in-sync replicas. При потерянном ack producer повторяет record и без idempotence может записать duplicate. Idempotent producer использует producer ID и sequence numbers для дедупликации в рамках сессии/partition.

## Развёрнутый ответ мидла

- `acks=all` работает вместе с replication factor и `min.insync.replicas`.
- Retries должны быть ограничены delivery timeout и backoff.
- Batching/compression повышают throughput ценой ожидания/CPU.
- Ошибка отправки record должна быть наблюдаема; async callback нельзя игнорировать.

## Развёрнутый ответ сеньора: все тонкости

- Idempotence не дедуплицирует два бизнес-события из разных producer sessions.
- Max in-flight и ordering зависят от client/version/idempotent settings.
- `acks=all` при недостаточном ISR отвергает write, предпочитая durability availability.
- Transactional producer добавляет atomic multi-partition write/offset protocol, но требует stable transactional ID.

### Дополнительное техническое объяснение

Produce durability combines required acknowledgments, ISR replication and broker policy. Idempotent protocol assigns PID/epoch and per-partition sequence, suppressing retry duplicates while preserving ordered batches under configured constraints.

## Если забыл / Простыми словами

Acks определяют, кто подтвердил запись; idempotence защищает retry одного producer от дублей.

### Аналогия и объяснение

Курьер может уйти без подписи, получить подпись одного склада или дождаться копий на нескольких. Если квитанция потерялась, повторная доставка может создать две посылки; номер попытки помогает складу узнать повтор.
