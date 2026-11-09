# Как Kubernetes завершает Pod?

Как согласовать SIGTERM, readiness, preStop и load balancer propagation?

===

@input

---

## Краткий ответ

При удалении Pod kubelet запускает preStop, отправляет SIGTERM main processes и ждёт terminationGracePeriodSeconds, затем SIGKILL. Параллельно endpoint удаляется из Service eventually. Приложение должно прекратить приём, завершить in-flight и выйти раньше deadline.

---

## Развёрнутый ответ мидла

- Go использует `signal.NotifyContext` и `http.Server.Shutdown`.
- PreStop входит в общий grace period, поэтому долгий sleep отнимает время приложения.
- Readiness переводят в false перед drain, если lifecycle требует.
- Background workers прекращают intake и подтверждают только завершённые задачи.

---

## Развёрнутый ответ сеньора: все тонкости

- Endpoint/load balancer updates не мгновенны; короткое окно новых connections неизбежно и требует retry.
- PDB не влияет на прямое удаление/неvoluntary failure одинаково.
- Sidecar termination ordering зависит от Kubernetes features/version.
- Необрабатываемый SIGKILL делает идемпотентность внешних side effects обязательной.

### Дополнительное техническое объяснение

Pod termination combines API deletion timestamp, endpoint convergence, lifecycle hook, TERM delivery and grace deadline. Application shutdown must fit budget and tolerate residual traffic/redelivery.

---

## Если забыл / Простыми словами

SIGTERM — шанс на drain, grace period — общий бюджет, SIGKILL — жёсткий конец.

### Аналогия и объяснение

Магазин сначала снимают с указателей, затем просят закрыться и дают время обслужить вошедших. После срока электричество отключат независимо от оставшейся работы.
