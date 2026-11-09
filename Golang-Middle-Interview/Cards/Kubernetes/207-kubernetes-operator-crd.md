---
tags:
  - go
  - interview
  - middle
  - flashcards/Kubernetes
deck: "Kubernetes"
topic: "Что такое CRD и Kubernetes Operator?"
---

# Что такое CRD и Kubernetes Operator?

## Вопрос

Как custom resource, controller reconciliation и status/finalizer позволяют автоматизировать жизненный цикл stateful-системы?

## Краткий ответ

CRD добавляет собственный API kind/schema в Kubernetes. Operator — controller, который watch-ит custom resources и идемпотентно приводит реальные ресурсы/внешнюю систему к `spec`, записывая наблюдение в `status`. Finalizer блокирует удаление до cleanup.

## Развёрнутый ответ мидла

Custom resource описывает desired state, например кластер БД и его version/replicas. Reconcile получает key, читает текущее состояние, создаёт/обновляет дочерние ресурсы и requeue-ит при необходимости. Он должен переживать повторы и частичные ошибки.

`status.conditions` сообщают Ready/Degraded/Progressing с reason/message/observedGeneration. OwnerReference обеспечивает garbage collection дочерних Kubernetes objects.

## Развёрнутый ответ сеньора: все тонкости

Finalizer удаляют только после успешного или осознанно прекращённого external cleanup; иначе объект навсегда Terminating. Schema evolution, defaulting, conversion webhooks и backward compatibility становятся API-контрактом.

Controller использует work queue, rate limiting, leader election и optimistic concurrency. Нельзя хранить workflow только в памяти controller — после restart он восстанавливает решение из API/external state.

### Дополнительное техническое объяснение

CRD регистрирует REST resource в API discovery/storage. Reconciler является level-triggered control loop, а не последовательным обработчиком событий. Spec/status separation, generation и conditions обеспечивают convergent declarative automation.

## Если забыл / Простыми словами

CRD добавляет в Kubernetes новый тип заявки, например «Кластер PostgreSQL». Operator — опытный администратор-робот, который постоянно сверяет заявку с реальностью и выполняет следующий безопасный шаг.

### Аналогия и объяснение

Робот не должен помнить единственный план в голове. После перезапуска он снова читает заявку и состояние, понимает, что уже сделано, и продолжает. Поэтому каждое действие проектируют повторяемым.
