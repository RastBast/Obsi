---
tags: [go, interview, middle, kubernetes, resources, flashcards/Kubernetes]
topic: Requests, limits и QoS
---

Чем resource request отличается от limit?::Request используется scheduler для размещения и обычно задаёт гарантированную долю CPU/ожидаемую память. Limit ограничивает runtime: CPU throttling, memory OOM kill. Соотношение requests/limits определяет QoS class и eviction priority.

# Чем resource request отличается от limit?

## Вопрос

Как requests/limits влияют на scheduling, throttling, OOM и QoS Pod?

## Краткий ответ

Request используется scheduler для размещения и обычно задаёт гарантированную долю CPU/ожидаемую память. Limit ограничивает runtime: CPU throttling, memory OOM kill. Соотношение requests/limits определяет QoS class и eviction priority.

## Развёрнутый ответ мидла

- Scheduler суммирует requests, а не фактическое текущее потребление.
- CPU — compressible: процесс замедляется; memory — incompressible: возможен OOM.
- Guaranteed требует равных requests/limits для всех CPU/memory containers по правилам QoS.
- Метрики throttling, working set, OOM и latency помогают right-size.

## Развёрнутый ответ сеньора: все тонкости

- Слишком маленький CPU limit создаёт tail latency даже при свободном node из-за CFS quota semantics.
- Слишком высокий request снижает bin packing, слишком низкий вызывает overcommit/eviction.
- Init container и sidecar учитываются по специальным scheduling rules.
- Go GOMEMLIMIT оставляет запас под non-heap memory ниже container limit.

## Если забыл: что это, зачем и где нужно

Request резервирует место в плане, limit ставит потолок во время работы.

## Подробное объяснение простыми словами

Request — заявленный размер стола при рассадке, limit — запрет занять больше. Процессор можно временно делить медленнее, а закончившуюся память приходится освобождать завершением процесса.

## Подробное объяснение техническими терминами

Scheduler performs bin packing on resource requests. Kubelet/runtime enforce cgroup CPU quota и memory limit; QoS classification influences eviction under node pressure.
