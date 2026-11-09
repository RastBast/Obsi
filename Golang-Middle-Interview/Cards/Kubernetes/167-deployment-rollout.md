---
tags:
  - go
  - interview
  - middle
  - kubernetes
  - deployment
  - flashcards/Kubernetes
deck: "Kubernetes"
topic: "Deployment, ReplicaSet и rollout"
---

# Как Deployment обновляет Pods?

## Вопрос

Чем Deployment отличается от ReplicaSet и как контролировать безопасный rollout?

## Краткий ответ

Deployment описывает desired replicas и Pod template, создавая ReplicaSets. Изменение template запускает rolling update: постепенно увеличивается новый ReplicaSet и уменьшается старый по maxSurge/maxUnavailable. Readiness не допускает неготовые Pods в Service endpoints.

## Развёрнутый ответ мидла

- ReplicaSet поддерживает число Pods с selector.
- Deployment хранит revision history и позволяет rollback template.
- Progress deadline выявляет зависший rollout.
- PDB влияет на voluntary disruptions, но не гарантирует availability при crash.

## Развёрнутый ответ сеньора: все тонкости

- Rollback manifest не откатывает внешнюю DB migration.
- Readiness должна отражать способность обслуживать трафик, иначе rollout завершится ложно.
- Один mutable image tag усложняет понимание revision; используют digest/version.
- Canary/blue-green требуют traffic policy и метрик сверх стандартного rolling update.

### Дополнительное техническое объяснение

Deployment controller reconciles template hash ReplicaSets and scales them under rolling-update bounds. Availability depends on readiness conditions, desired/updated/available counts и progress timing.

## Если забыл / Простыми словами

Deployment управляет версиями ReplicaSet, а ReplicaSet — количеством Pods.

### Аналогия и объяснение

Менеджер постепенно нанимает новую смену и отпускает старую, не закрывая магазин. Если новые сотрудники не готовы, их не ставят к покупателям.
