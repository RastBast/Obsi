---
tags: [go, interview, middle, postgresql, pooling, flashcards/БД]
topic: PgBouncer и pooling
---

# Чем session, transaction и statement pooling отличаются?

## Вопрос

Что даёт PgBouncer и какие session features ломаются в transaction pooling?

## Краткий ответ

PgBouncer мультиплексирует client connections на меньшее число PostgreSQL backends. Session pooling закрепляет backend на всю сессию; transaction pooling — только на transaction; statement — на statement и сильно ограничивает семантику. Transaction mode повышает reuse, но session state не гарантирован.

## Развёрнутый ответ мидла

- Temporary tables, session advisory locks, LISTEN и некоторые prepared statement сценарии требуют осторожности.
- `SET LOCAL` внутри transaction безопаснее session `SET`.
- Go `sql.DB` pool и PgBouncer образуют два уровня; лимиты согласуют.
- Pool не ускоряет медленный query, а ограничивает дорогие backend connections.

## Развёрнутый ответ сеньора: все тонкости

- Слишком большая client queue повышает latency вместо отказа/backpressure.
- Prepared statement support зависит от protocol/PgBouncer version/config.
- Reserve pool и timeouts влияют на overload behavior.
- Failover сбрасывает backend connections; clients должны корректно повторять только безопасные операции.

## Если забыл: что это, зачем и где нужно

Pooler делит небольшое число дорогих соединений БД между большим числом клиентов.

## Подробное объяснение простыми словами

Вместо личного кабинета каждому посетителю кабинет выдаётся только на время сделки. Личные вещи между сделками оставлять нельзя, потому что следующий раз попадётся другой кабинет.

## Подробное объяснение техническими терминами

Transaction pooling reassigns server connection at transaction boundary, decoupling client and backend sessions. Session-scoped state and protocol objects требуют совместимой конфигурации; capacity planning учитывает оба pool layers.
