---
tags: [go, interview, middle, kubernetes, jobs, flashcards/Kubernetes]
topic: Job и CronJob
---

Чем Job отличается от CronJob и Deployment?::Job запускает Pods до успешного completion, CronJob создаёт Jobs по расписанию, Deployment поддерживает постоянно работающие replicas. Job может повторять failed Pods, поэтому задача должна быть идемпотентной.

# Чем Job отличается от CronJob и Deployment?

## Вопрос

Как backoff, parallelism, completions и concurrencyPolicy влияют на batch-задачи?

## Краткий ответ

Job запускает Pods до успешного completion, CronJob создаёт Jobs по расписанию, Deployment поддерживает постоянно работающие replicas. Job может повторять failed Pods, поэтому задача должна быть идемпотентной.

## Развёрнутый ответ мидла

- `completions` — сколько успешных единиц, `parallelism` — сколько одновременно.
- `backoffLimit` ограничивает retries, active deadline — общее время.
- CronJob concurrency Allow/Forbid/Replace управляет overlap.
- History/TTL cleanup не дают завершённым Jobs расти бесконечно.

## Развёрнутый ответ сеньора: все тонкости

- Schedule может пропускаться при downtime/control-plane delay; `startingDeadlineSeconds` задаёт окно.
- Cron timezone и DST требуют явной политики/version support.
- Exactly-once запуск не гарантирован; задача использует business key/lease/unique constraint.
- Большой parallelism перегружает БД, нужен downstream-aware limit.

## Если забыл: что это, зачем и где нужно

Deployment живёт постоянно, Job должен завершиться, CronJob периодически создаёт Job.

## Подробное объяснение простыми словами

Охранник работает постоянно, разовая бригада уходит после результата, расписание каждую ночь вызывает новую бригаду. Повторный вызов не должен дважды списать деньги.

## Подробное объяснение техническими терминами

Job controller tracks terminal Pod successes against completion policy and retries failures. CronJob materializes Jobs from schedule with concurrency/deadline semantics, providing at-least-once-like execution rather than exactly once.
