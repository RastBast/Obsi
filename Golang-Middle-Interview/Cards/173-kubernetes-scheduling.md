---
tags: [go, interview, middle, kubernetes, scheduling, flashcards/Kubernetes]
topic: Labels, affinity и taints
---

Как управлять размещением Pods?::nodeSelector/required affinity задают обязательные labels, preferred affinity — предпочтения. Pod anti-affinity/topology spread распределяют replicas. Taint отталкивает Pods, toleration разрешает, но не гарантирует размещение. Scheduler также учитывает resources и constraints.

# Как управлять размещением Pods?

## Вопрос

Чем affinity отличается от taint/toleration и как распределить replicas по zones?

## Краткий ответ

nodeSelector/required affinity задают обязательные labels, preferred affinity — предпочтения. Pod anti-affinity/topology spread распределяют replicas. Taint отталкивает Pods, toleration разрешает, но не гарантирует размещение. Scheduler также учитывает resources и constraints.

## Развёрнутый ответ мидла

- Labels описывают node/workload attributes.
- Taint `NoSchedule` запрещает новое размещение без toleration; `NoExecute` может выселить.
- Topology key zone/hostname задаёт failure domain.
- Слишком строгие required rules оставляют Pod Pending.

## Развёрнутый ответ сеньора: все тонкости

- Anti-affinity на больших clusters может быть дорогой; topology spread часто яснее.
- Toleration не означает «размести именно здесь» — нужна affinity.
- Autoscaler должен уметь создать node, удовлетворяющий labels/taints/resources.
- Распределение Pods бесполезно, если storage или load balancer остаётся одной точкой отказа.

## Если забыл: что это, зачем и где нужно

Affinity притягивает, taint отталкивает, toleration разрешает терпеть taint.

## Подробное объяснение простыми словами

Можно попросить комнату с окном, запретить вход в служебный этаж без пропуска и разнести команду по разным зданиям. Слишком много обязательных условий оставит человека без комнаты.

## Подробное объяснение техническими терминами

Scheduler filters nodes by hard predicates and scores preferences. Taints/tolerations control admissibility; affinity and topology constraints encode placement/failure-domain policy.
