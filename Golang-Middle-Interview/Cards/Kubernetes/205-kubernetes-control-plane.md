---
tags:
  - go
  - interview
  - middle
  - flashcards/Kubernetes
deck: "Kubernetes"
topic: "Из каких компонентов состоит control plane Kubernetes?"
---

# Из каких компонентов состоит control plane Kubernetes?

## Вопрос

Как взаимодействуют kube-apiserver, etcd, scheduler, controller-manager и kubelet при создании Pod?

## Краткий ответ

API server — вход и проверка всех API-операций, etcd — согласованное хранилище состояния, scheduler назначает unscheduled Pods nodes, controller-manager приводит фактическое состояние к желаемому. Kubelet на node наблюдает назначенные Pods и через runtime запускает containers.

## Развёрнутый ответ мидла

После создания Deployment API server сохраняет объект в etcd. Deployment controller создаёт ReplicaSet, тот — Pods. Scheduler записывает `nodeName` подходящего Pod. Kubelet выбранного node создаёт sandbox/containers, монтирует volumes и обновляет status через API.

Компоненты в основном не вызывают друг друга цепочкой напрямую, а watch-ят API и выполняют reconciliation. Это делает control plane eventually consistent.

## Развёрнутый ответ сеньора: все тонкости

etcd требует quorum, быстрый durable disk, backup и отдельный security lifecycle. API server stateless относительно persisted state и масштабируется за load balancer. Leader election не даёт нескольким controller replicas одновременно выполнять один active control loop.

Admission chain mutating/validating policy работает после authn/authz и до persistence. Watch cache, resourceVersion и optimistic concurrency важны для controllers.

### Дополнительное техническое объяснение

Kubernetes — level-based declarative system: controllers compare desired API objects with observed state and submit idempotent changes. etcd обеспечивает linearizable metadata store, API server — serialization/admission/watch boundary, scheduler — binding decision, kubelet — node executor.

## Если забыл / Простыми словами

API server — единое окно заявок, etcd — официальный журнал, scheduler — диспетчер мест, controllers — менеджеры, сравнивающие план с реальностью, kubelet — исполнитель в конкретном здании.

### Аналогия и объяснение

Никто не передаёт бумагу лично по длинной цепочке. Каждый смотрит в общий журнал, замечает работу своей компетенции и записывает результат. Поэтому система восстанавливается после временной остановки одного менеджера.
