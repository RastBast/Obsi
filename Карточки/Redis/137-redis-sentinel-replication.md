---
tags:
  - go
  - interview
  - middle
  - redis
  - sentinel
  - flashcards/Redis
deck: "Redis"
topic: "Replication и Sentinel"
---

# Как Redis replication и Sentinel обеспечивают failover?

## Вопрос

Что делает replica, как Sentinel выбирает новый primary и какие consistency риски остаются?

## Краткий ответ

Replica асинхронно копирует command stream primary и может обслуживать stale reads. Sentinel instances наблюдают topology, достигают quorum о недоступности, выбирают replica, повышают её и сообщают clients новый primary. Failover не делает систему строго согласованной.

## Развёрнутый ответ мидла

- Replication lag означает, что новый primary может не иметь последние writes.
- Client должен поддерживать Sentinel discovery и переподключение.
- Read scaling на replicas требует допустимой stale semantics.
- Quorum и majority для failover настраивают с учётом независимых failure domains.

## Развёрнутый ответ сеньора: все тонкости

- Network partition может оставить старый primary принимающим writes до ограничений; clients должны переключиться.
- `min-replicas-to-write` уменьшает риск, но снижает availability и не даёт абсолютной гарантии.
- Full resync требует snapshot/bandwidth, partial resync зависит от backlog.
- Failover drills и мониторинг lag важнее наличия трёх процессов Sentinel на одном host.

### Дополнительное техническое объяснение

Redis asynchronous replication uses replication IDs/offset backlog for partial resync. Sentinel performs distributed failure detection, leader election и reconfiguration; resulting failover has explicit RPO and stale-read window.

## Если забыл / Простыми словами

Replica копирует, Sentinel обнаруживает сбой и назначает новую primary, но async lag допускает потерю/устаревание.

### Аналогия и объяснение

Помощники переписывают журнал главного с небольшой задержкой. Наблюдатели выбирают нового главного при аварии, но последние строки могли ещё не попасть в его копию.
