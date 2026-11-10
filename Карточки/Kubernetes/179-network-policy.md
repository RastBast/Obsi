---
tags:
  - go
  - interview
  - middle
  - kubernetes
  - network
  - flashcards/Kubernetes
deck: "Kubernetes"
topic: "NetworkPolicy"
---

# Что ограничивает Kubernetes NetworkPolicy?

## Вопрос

Как построить default deny и разрешить только нужные соединения?

## Краткий ответ

NetworkPolicy выбирает Pods и разрешает ingress/egress peers, ports и направления. После выбора Pod по направлению неразрешённый трафик блокируется, если CNI реализует policy. Это L3/L4 контроль, не полноценная HTTP authorization.

## Развёрнутый ответ мидла

- Создают default-deny ingress/egress, затем allow DNS и конкретные dependencies.
- Pod/namespace selectors используют labels; `ipBlock` — CIDR.
- Policies additive: разрешение любой подходящей policy допускает трафик.
- Проверяют поддержку CNI и тестируют фактический путь.

## Развёрнутый ответ сеньора: все тонкости

- DNS names обычно не являются portable primitive стандартной NetworkPolicy.
- NAT/service routing меняют видимый source/destination в зависимости от dataplane.
- HostNetwork и node-local traffic имеют особенности CNI.
- Policy не заменяет TLS, identity и application authorization.

### Дополнительное техническое объяснение

CNI dataplane enforces additive ingress/egress allowlists for selected Pod endpoints at IP/port layer. Zero-trust design дополняет policy workload identity, mTLS и L7 authorization.

## Если забыл / Простыми словами

Сначала запрети всё, затем разреши необходимые направления между labeled workloads.

### Аналогия и объяснение

Это межкомнатные двери: по умолчанию закрыты, а правила открывают только нужные пары комнат и порты. Но открытая дверь ещё не доказывает личность посетителя.
