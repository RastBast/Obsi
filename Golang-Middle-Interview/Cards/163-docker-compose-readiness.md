---
tags: [go, interview, middle, docker, compose, flashcards/Docker]
topic: Docker Compose dependencies
---

Гарантирует ли depends_on готовность сервиса?::Простой `depends_on` задаёт порядок запуска, но запущенный container ещё не готов принимать запросы. В поддерживаемых вариантах Compose используют healthcheck condition, а приложение всё равно должно иметь retry с backoff и deadline.

# Гарантирует ли depends_on готовность сервиса?

## Вопрос

Как корректно запускать Go-сервис рядом с PostgreSQL или Kafka в Compose?

## Краткий ответ

Простой `depends_on` задаёт порядок запуска, но запущенный container ещё не готов принимать запросы. В поддерживаемых вариантах Compose используют healthcheck condition, а приложение всё равно должно иметь retry с backoff и deadline.

## Развёрнутый ответ мидла

- Service обращается к dependency по Compose service name, не localhost.
- Healthcheck проверяет реальную готовность нужного протокола.
- Startup retry ограничен общим timeout и логирует причину.
- Persistent data подключают named volumes.

## Развёрнутый ответ сеньора: все тонкости

- Ready dependency может упасть после старта, поэтому устойчивость нужна постоянно.
- Compose не заменяет production orchestration, secrets и HA.
- Миграции должны иметь одного владельца/lock и отдельную failure policy.
- Restart зависимого сервиса не обязан автоматически рестартовать consumers.

## Если забыл: что это, зачем и где нужно

Порядок старта не равен готовности; проверяй health и повторяй подключения безопасно.

## Подробное объяснение простыми словами

То, что магазин открыл дверь, не означает, что касса уже работает. Соседний сервис должен дождаться готовности, но и уметь пережить последующее временное закрытие.

## Подробное объяснение техническими терминами

Compose dependency graph controls creation/start ordering. Readiness requires health state or application-level connection retry; runtime availability remains governed by timeout, reconnect and idempotency protocols.
