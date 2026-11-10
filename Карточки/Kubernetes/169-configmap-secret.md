---
tags:
  - go
  - interview
  - middle
  - kubernetes
  - config
  - flashcards/Kubernetes
deck: "Kubernetes"
topic: "ConfigMap и Secret"
---

# Чем ConfigMap отличается от Secret?

## Вопрос

Как обновления попадают в Pod и почему переменные окружения не обновляются автоматически?

## Краткий ответ

ConfigMap хранит несекретную конфигурацию, Secret — чувствительные bytes, но base64 не является шифрованием. Оба можно передать через env или volume. Нужны RBAC, encryption at rest, внешний secret manager и ротация по риску.

## Развёрнутый ответ мидла

- Env значения фиксируются при старте container; для изменения нужен restart.
- Volume projection обновляется eventually, но приложение должно перечитать файл.
- Immutable config уменьшает случайные изменения.
- Deployment annotation/checksum часто запускает rollout при новой config.

## Развёрнутый ответ сеньора: все тонкости

- Secret может утечь через manifest, logs, process env, debug endpoint и backup etcd.
- CSI/external secrets синхронизируют внешний store, но добавляют failure mode.
- Ротация требует периода одновременной поддержки старого/нового credential.
- RBAC ограничивает чтение по namespace/service account и least privilege.

### Дополнительное техническое объяснение

Kubernetes API objects persist configuration in etcd and project data via env or volumes. Confidentiality depends on API authorization, at-rest encryption, transport, node exposure и rotation workflow.

## Если забыл / Простыми словами

Secret — не просто base64 ConfigMap: для него нужен полный безопасный lifecycle.

### Аналогия и объяснение

ConfigMap — инструкция на стене, Secret — ключ от сейфа. Записать ключ другими буквами не значит спрятать его; нужно ограничить, кто видит и как его заменяют.
