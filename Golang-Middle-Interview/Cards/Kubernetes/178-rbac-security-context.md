---
tags:
  - go
  - interview
  - middle
  - kubernetes
  - security
  - flashcards/Kubernetes
deck: "Kubernetes"
topic: "RBAC, ServiceAccount и SecurityContext"
---

# Как ограничить права workload в Kubernetes?

## Вопрос

Чем API authorization отличается от прав процесса внутри container?

## Краткий ответ

ServiceAccount задаёт identity Pod для API, RBAC Role/ClusterRole разрешает verbs на resources, Binding связывает права с identity. SecurityContext ограничивает runtime UID, privileges, capabilities, filesystem и seccomp. Это разные уровни защиты.

## Развёрнутый ответ мидла

- Role namespace-scoped, ClusterRole может быть cluster-wide или reusable в RoleBinding.
- Не монтируют service account token, если API не нужен.
- `runAsNonRoot`, `allowPrivilegeEscalation: false`, drop capabilities и readOnlyRootFilesystem — полезная база.
- Secrets read/list/watch дают широкий доступ к значениям.

## Развёрнутый ответ сеньора: все тонкости

- Wildcards в RBAC расширяются при появлении новых resources.
- `create pods` часто позволяет косвенно получить credentials/host access в namespace.
- Admission policy проверяет security standards до создания.
- Node/kubelet compromise шире namespace RBAC; threat model многоуровневый.

### Дополнительное техническое объяснение

Kubernetes authentication binds Pod to ServiceAccount; authorizer evaluates RBAC tuples subject/resource/verb. Runtime securityContext configures UID/GID, capability set, privilege escalation, seccomp and mount behavior.

## Если забыл / Простыми словами

RBAC решает, что identity может в API; SecurityContext — что process может на node/container.

### Аналогия и объяснение

Пропуск определяет, какие документы сотрудник может запросить у администрации. Правила комнаты определяют, может ли он стать root, открыть сейф или менять стены.
