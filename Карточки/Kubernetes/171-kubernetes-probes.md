---
tags:
  - go
  - interview
  - middle
  - kubernetes
  - probes
  - flashcards/Kubernetes
deck: "Kubernetes"
topic: "Startup, readiness и liveness probes"
---

# Чем startup, readiness и liveness probes отличаются?

## Вопрос

Что должна проверять каждая probe и почему readiness не должна быть копией liveness?

## Краткий ответ

Startup даёт приложению время запуститься и до успеха блокирует другие probes. Readiness решает, включать ли Pod в трафик. Liveness выявляет зависший процесс и вызывает restart. Неверная liveness может усилить аварию restart storm.

## Развёрнутый ответ мидла

- HTTP, TCP и exec probes имеют разные costs/семантику.
- Readiness может учитывать локальную готовность и критичную dependency осторожно.
- Liveness проверяет восстановимость restart, а не краткий downstream outage.
- Timeout/period/failureThreshold согласуют с latency и SLA.

## Развёрнутый ответ сеньора: все тонкости

- Probe endpoint обходит обычный auth только на безопасном внутреннем пути и не раскрывает данные.
- Все replicas, проверяющие БД каждую секунду, создают probe storm.
- Readiness flapping вызывает endpoint churn; используют устойчивые thresholds.
- Terminating Pod должен стать not-ready до завершения текущих запросов.

### Дополнительное техническое объяснение

Kubelet probe state gates container restart and Pod Ready condition. Endpoint controllers consume readiness; liveness failure invokes restart policy, startup probe suppresses premature health decisions.

## Если забыл / Простыми словами

Startup — «запустился?», readiness — «давать трафик?», liveness — «перезапустить?».

### Аналогия и объяснение

Сначала сотруднику дают время одеться. Затем табличка показывает, принимает ли он клиентов. Отдельная проверка решает, не завис ли он настолько, что поможет только перезапуск.
