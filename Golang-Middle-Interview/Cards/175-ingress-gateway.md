# Что делает Ingress и чем Gateway API его дополняет?

Где завершается TLS и как host/path route связывается с Service?

===

@input

---

## Краткий ответ

Ingress описывает внешнюю HTTP(S)-маршрутизацию к Services, но требует Ingress Controller. Gateway API разделяет инфраструктурный Gateway и Routes, поддерживает более выразительные роли и протоколы. Объект без controller сам трафик не обрабатывает.

---

## Развёрнутый ответ мидла

- Controller создаёт/настраивает proxy/load balancer.
- TLS Secret содержит certificate/key для termination по host.
- Route указывает Service port, readiness его endpoints решает backend availability.
- Timeout/body limits/retries зависят от controller annotations/policy.

---

## Развёрнутый ответ сеньора: все тонкости

- Разные controllers интерпретируют extensions по-разному; portability проверяют.
- Forwarded headers доверяют только от known proxy chain.
- TLS passthrough не позволяет обычный L7 path routing без termination.
- Gateway API ReferenceGrant контролирует cross-namespace references.

### Дополнительное техническое объяснение

Ingress/Gateway resources are control-plane intent reconciled by controller into L7 data plane. Listener, TLS termination, hostname/path matching и backend references образуют routing graph.

---

## Если забыл / Простыми словами

Ingress/Gateway — декларация маршрута, controller — реальный proxy, Service — стабильный backend.

### Аналогия и объяснение

Правило на бумаге говорит, куда направлять `api.example.com`, но нужен настоящий диспетчер, который прочитает правило и будет переводить звонки.
