---
tags: [go, interview, middle, redis, rate-limit, flashcards/Redis]
topic: Distributed rate limiter Redis
---

Как реализовать rate limiter в Redis?::Fixed window прост через INCR+EXPIRE, но допускает burst на границе. Sliding window точнее, но дороже. Token bucket хранит tokens и timestamp. Read-modify-write выполняют атомарно Lua/function, задают TTL и ограничивают cardinality keys.

# Как реализовать rate limiter в Redis?

## Вопрос

Какие компромиссы fixed/sliding window и token bucket и зачем атомарный script?

## Краткий ответ

Fixed window прост через INCR+EXPIRE, но допускает burst на границе. Sliding window точнее, но дороже. Token bucket хранит tokens и timestamp. Read-modify-write выполняют атомарно Lua/function, задают TTL и ограничивают cardinality keys.

## Развёрнутый ответ мидла

Key включает tenant/user/API scope. Ответ содержит allowed, remaining и retry-after. При недоступности Redis выбирают fail-open/fail-closed по риску, а не случайно.

## Развёрнутый ответ сеньора: все тонкости

- Clock source должен быть согласован; client clocks дают skew.
- Cluster sharding распределяет keys, но один hot tenant остаётся hotspot.
- Миллионы уникальных attacker keys создают memory DoS; TTL/validation обязательны.
- Global strict rate имеет latency/availability tradeoff, локальные лимиты приблизительны.

## Если забыл: что это, зачем и где нужно

Атомарно посчитай/пополни бюджет одного ключа и автоматически удали неактивное состояние.

## Подробное объяснение простыми словами

Каждому клиенту выдают ведро жетонов. Запрос тратит жетон, время добавляет новые. Сервер должен одной операцией проверить и списать, иначе два кассира выдадут лишнее.

## Подробное объяснение техническими терминами

Redis script serializes token-state update and expiration. Algorithm determines burst/error bounds; distributed deployment must address clock, key cardinality, shard hotspot and failure policy.
