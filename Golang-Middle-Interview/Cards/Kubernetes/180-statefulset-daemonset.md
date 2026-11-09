---
tags:
  - go
  - interview
  - middle
  - kubernetes
  - controllers
  - flashcards/Kubernetes
deck: "Kubernetes"
topic: "StatefulSet и DaemonSet"
---

# Чем StatefulSet и DaemonSet отличаются от Deployment?

## Вопрос

Когда стабильная identity действительно нужна и что controller не делает автоматически?

## Краткий ответ

StatefulSet даёт Pods стабильные ordinal names, ordered rollout и отдельные PVC, полезно stateful кластерам. DaemonSet поддерживает Pod на каждом подходящем node, например agent. Deployment управляет взаимозаменяемыми stateless replicas.

## Развёрнутый ответ мидла

- StatefulSet обычно использует headless Service для DNS identities.
- Удаление Pod сохраняет его PVC по policy; новый ordinal подключает прежнее хранилище.
- DaemonSet подходит log/network/node monitoring agents.
- Controller создаёт Pods, но не понимает replication protocol БД автоматически.

## Развёрнутый ответ сеньора: все тонкости

- Stateful quorum, backup, failover и fencing обеспечивает operator/application.
- Ordered rollout может остановиться на одном broken Pod.
- DaemonSet tolerations нужны для специальных nodes, но расширяют поверхность доступа.
- Parallel Pod management ускоряет start, но может нарушить bootstrap expectations.

### Дополнительное техническое объяснение

Controllers reconcile distinct identity semantics: ReplicaSet fungibility, StatefulSet ordinal/PVC association и DaemonSet node coverage. Application-level distributed state remains outside generic controller guarantees.

## Если забыл / Простыми словами

StatefulSet — стабильные имена/диски, DaemonSet — по Pod на node, Deployment — заменяемые replicas.

### Аналогия и объяснение

Deployment раздаёт одинаковых временных сотрудников. StatefulSet закрепляет за каждым номер кабинета и архив. DaemonSet ставит по одному смотрителю в каждом здании.
