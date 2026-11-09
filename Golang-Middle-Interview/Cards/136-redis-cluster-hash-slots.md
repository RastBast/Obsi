---
tags: [go, interview, middle, redis, cluster, flashcards/Redis]
topic: Redis Cluster
---

# Как Redis Cluster распределяет keys?

## Вопрос

Что такое hash slots, MOVED/ASK redirects и hash tags для multi-key операций?

## Краткий ответ

Cluster делит keyspace на 16384 hash slots и назначает slots primary nodes. Client вычисляет slot и маршрутизирует команду; при изменении topology получает MOVED/ASK и обновляет mapping. Multi-key atomic operations требуют keys одного slot; `{tag}` заставляет общий hash fragment.

## Развёрнутый ответ мидла

- Replicas обеспечивают failover primary, но replication обычно asynchronous.
- Cluster-aware client хранит topology и connection pools к nodes.
- Resharding переносит slots/keys и временно использует redirects.
- Hash tag помогает co-location, но может создать hotspot.

## Развёрнутый ответ сеньора: все тонкости

- Cluster не даёт произвольной cross-slot transaction.
- Failover может потерять подтверждённые writes в определённых partition scenarios; consistency contract изучают.
- Replica reads могут быть stale.
- Capacity планируют по самому горячему slot/node, а не только суммарной памяти.

## Если забыл: что это, зачем и где нужно

Key хешируется в slot, slot принадлежит node, client идёт прямо туда. Совместные keys должны делить slot.

## Подробное объяснение простыми словами

Все ключи распределены по пронумерованным ячейкам, а серверы владеют диапазонами ячеек. При переезде ячейки указатель сообщает новый адрес. Скобки в имени позволяют положить связанные ключи рядом.

## Подробное объяснение техническими терминами

Redis Cluster computes CRC-based slot over key/hash tag, routes directly to slot owner и handles topology via MOVED/ASK. Atomic command scope ограничен single shard; failover inherits asynchronous replication tradeoffs.
