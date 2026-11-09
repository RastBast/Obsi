---
tags: [go, interview, middle, network, proxy, flashcards/Сети]
topic: Load balancer и reverse proxy
---

На каком уровне они принимают решения, как выполняются health checks и что происходит с client IP/TLS?::L4 балансирует соединения по адресам/портам, не разбирая HTTP. L7 proxy завершает прикладной протокол и маршрутизирует по host/path/header. TLS может завершаться на proxy или проходить passthrough. Health check должен отражать готовность backend, а не только живой процесс.

# Чем L4 load balancer отличается от L7 reverse proxy?

## Вопрос

На каком уровне они принимают решения, как выполняются health checks и что происходит с client IP/TLS?

## Краткий ответ

L4 балансирует соединения по адресам/портам, не разбирая HTTP. L7 proxy завершает прикладной протокол и маршрутизирует по host/path/header. TLS может завершаться на proxy или проходить passthrough. Health check должен отражать готовность backend, а не только живой процесс.

## Развёрнутый ответ мидла

- Алгоритмы: round-robin, least-connections, hashing и weighted варианты.
- Connection pooling proxy означает, что один backend connection обслуживает разных клиентов последовательно/мультиплексировано.
- Client IP передают через trusted headers или proxy protocol.
- Retries proxy безопасны только для replayable/idempotent запросов.

## Развёрнутый ответ сеньора: все тонкости

- Sticky sessions ухудшают баланс и failover; состояние лучше выносить или шардировать осознанно.
- Active/passive health, outlier detection и slow start влияют на recovery.
- Нельзя доверять `X-Forwarded-For` от произвольного клиента; очищают chain на trust boundary.
- Timeout budget согласуют на всех hops, иначе proxy сдаётся раньше backend или наоборот.

## Если забыл: что это, зачем и где нужно

L4 видит соединение, L7 понимает HTTP. Proxy — отдельный hop со своими pool, timeout и retry.

## Подробное объяснение простыми словами

Диспетчер L4 видит только адрес на конверте, L7 может открыть служебную часть и отправить `/images` одной команде, `/api` другой. Ему нужно доверять только известным отметкам предыдущих диспетчеров.

## Подробное объяснение техническими терминами

L4 routing работает по transport tuple, L7 reverse proxy терминирует protocol/TLS и применяет content-aware routing. Он создаёт независимые downstream/upstream connections, failure policy и trusted metadata boundary.
