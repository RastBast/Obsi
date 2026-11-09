---
tags: [go, interview, middle, kubernetes, lifecycle, flashcards/Kubernetes]
topic: Graceful termination Pod
---

Как Kubernetes завершает Pod?::При удалении Pod kubelet запускает preStop, отправляет SIGTERM main processes и ждёт terminationGracePeriodSeconds, затем SIGKILL. Параллельно endpoint удаляется из Service eventually. Приложение должно прекратить приём, завершить in-flight и выйти раньше deadline.

# Как Kubernetes завершает Pod?

## Вопрос

Как согласовать SIGTERM, readiness, preStop и load balancer propagation?

## Краткий ответ

При удалении Pod kubelet запускает preStop, отправляет SIGTERM main processes и ждёт terminationGracePeriodSeconds, затем SIGKILL. Параллельно endpoint удаляется из Service eventually. Приложение должно прекратить приём, завершить in-flight и выйти раньше deadline.

## Развёрнутый ответ мидла

- Go использует `signal.NotifyContext` и `http.Server.Shutdown`.
- PreStop входит в общий grace period, поэтому долгий sleep отнимает время приложения.
- Readiness переводят в false перед drain, если lifecycle требует.
- Background workers прекращают intake и подтверждают только завершённые задачи.

## Развёрнутый ответ сеньора: все тонкости

- Endpoint/load balancer updates не мгновенны; короткое окно новых connections неизбежно и требует retry.
- PDB не влияет на прямое удаление/неvoluntary failure одинаково.
- Sidecar termination ordering зависит от Kubernetes features/version.
- Необрабатываемый SIGKILL делает идемпотентность внешних side effects обязательной.

## Если забыл: что это, зачем и где нужно

SIGTERM — шанс на drain, grace period — общий бюджет, SIGKILL — жёсткий конец.

## Подробное объяснение простыми словами

Магазин сначала снимают с указателей, затем просят закрыться и дают время обслужить вошедших. После срока электричество отключат независимо от оставшейся работы.

## Подробное объяснение техническими терминами

Pod termination combines API deletion timestamp, endpoint convergence, lifecycle hook, TERM delivery and grace deadline. Application shutdown must fit budget and tolerate residual traffic/redelivery.
