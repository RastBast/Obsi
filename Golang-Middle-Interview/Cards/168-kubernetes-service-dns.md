---
tags: [go, interview, middle, kubernetes, network, flashcards/Kubernetes]
topic: Service и DNS
---

Как Kubernetes Service направляет трафик к Pods?::Service даёт стабильный virtual IP/DNS и selector выбирает ready endpoints. ClusterIP доступен внутри cluster, NodePort открывает порт nodes, LoadBalancer просит внешний балансировщик. Headless Service не выдаёт virtual IP и возвращает endpoints через DNS.

# Как Kubernetes Service направляет трафик к Pods?

## Вопрос

Зачем Service, если Pod уже имеет IP, и чем отличаются основные Service types?

## Краткий ответ

Service даёт стабильный virtual IP/DNS и selector выбирает ready endpoints. ClusterIP доступен внутри cluster, NodePort открывает порт nodes, LoadBalancer просит внешний балансировщик. Headless Service не выдаёт virtual IP и возвращает endpoints через DNS.

## Развёрнутый ответ мидла

- Pod IP меняется при пересоздании, Service identity остаётся.
- `port` — порт Service, `targetPort` — порт Pod.
- EndpointSlice хранит масштабируемый список backend endpoints.
- Readiness failure удаляет endpoint, liveness — нет напрямую.

## Развёрнутый ответ сеньора: все тонкости

- kube-proxy/eBPF dataplane реализует virtual service различными способами.
- Session affinity ухудшает balance/failover и не заменяет state design.
- Internal/external traffic policy меняет locality и source IP.
- DNS caching и termination propagation создают короткие окна stale endpoints.

## Если забыл: что это, зачем и где нужно

Service — стабильное имя и точка доступа к сменяющимся Pod IP.

## Подробное объяснение простыми словами

Сотрудники меняются, но номер отдела остаётся один. Секретарь знает, кто сейчас готов, и переводит звонок на одного из них.

## Подробное объяснение техническими терминами

Service abstraction selects Pods into EndpointSlices and exposes stable cluster identity. Dataplane load-balances transport flows to ready endpoints; DNS publishes service/headless records.
