# Как Kubernetes Service направляет трафик к Pods?

Зачем Service, если Pod уже имеет IP, и чем отличаются основные Service types?

===

@input

---

## Краткий ответ

Service даёт стабильный virtual IP/DNS и selector выбирает ready endpoints. ClusterIP доступен внутри cluster, NodePort открывает порт nodes, LoadBalancer просит внешний балансировщик. Headless Service не выдаёт virtual IP и возвращает endpoints через DNS.

---

## Развёрнутый ответ мидла

- Pod IP меняется при пересоздании, Service identity остаётся.
- `port` — порт Service, `targetPort` — порт Pod.
- EndpointSlice хранит масштабируемый список backend endpoints.
- Readiness failure удаляет endpoint, liveness — нет напрямую.

---

## Развёрнутый ответ сеньора: все тонкости

- kube-proxy/eBPF dataplane реализует virtual service различными способами.
- Session affinity ухудшает balance/failover и не заменяет state design.
- Internal/external traffic policy меняет locality и source IP.
- DNS caching и termination propagation создают короткие окна stale endpoints.

### Дополнительное техническое объяснение

Service abstraction selects Pods into EndpointSlices and exposes stable cluster identity. Dataplane load-balances transport flows to ready endpoints; DNS publishes service/headless records.

---

## Если забыл / Простыми словами

Service — стабильное имя и точка доступа к сменяющимся Pod IP.

### Аналогия и объяснение

Сотрудники меняются, но номер отдела остаётся один. Секретарь знает, кто сейчас готов, и переводит звонок на одного из них.
