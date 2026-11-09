---
tags:
  - go
  - interview
  - middle
  - network
  - resilience
  - flashcards/Сети
deck: "Сети"
topic: "Circuit breaker"
---

# Как работает circuit breaker?

## Вопрос

Чем breaker отличается от retry и как избежать общей синхронной волны half-open probes?

## Краткий ответ

Breaker переходит closed→open после достаточного числа ошибок/медленных ответов, быстро отклоняет новые вызовы, затем half-open пропускает ограниченные пробы. Он защищает ресурсы и даёт dependency восстановиться, но требует timeout, классификации ошибок и fallback.

## Развёрнутый ответ мидла

Retry пытается повторить операцию, breaker прекращает попытки при массовом сбое. Считают rolling rate после минимального sample, отделяя client errors от dependency failures.

## Развёрнутый ответ сеньора: все тонкости

- Breaker per instance может открыть/закрыть несинхронно; jitter полезен.
- Общий breaker для разных endpoints/tenants создаёт ложное влияние.
- Fallback может вернуть stale data, но обязан иметь явную семантику.
- Breaker не заменяет concurrency limits и load shedding.

### Дополнительное техническое объяснение

Circuit breaker is a state machine over rolling failure/latency metrics. Open state fails fast, half-open limits probes, closed resumes traffic. Scope, error taxonomy and recovery timing determine stability.

## Если забыл / Простыми словами

Retry продолжает стучать, breaker временно закрывает дверь после серии плохих ответов.

### Аналогия и объяснение

Если лифт постоянно ломается, охранник на время перестаёт пускать людей, а потом отправляет одного проверяющего. Так очередь не блокирует весь холл.
