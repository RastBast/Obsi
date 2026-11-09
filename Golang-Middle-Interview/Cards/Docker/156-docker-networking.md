---
tags:
  - go
  - interview
  - middle
  - docker
  - network
  - flashcards/Docker
deck: "Docker"
topic: "Docker networking"
---

# Как работает Docker bridge network и публикация портов?

## Вопрос

Почему `localhost` внутри container не указывает на host или соседний container?

## Краткий ответ

Container получает отдельный network namespace и IP в bridge network. Containers в одной user-defined network находят друг друга по DNS-имени. `-p host:container` публикует порт на host; EXPOSE сам по себе порт не публикует.

## Развёрнутый ответ мидла

- `localhost` всегда loopback текущего network namespace.
- Сервис внутри container обычно слушает `0.0.0.0`, а не только 127.0.0.1.
- Для связи containers используют service/container DNS name и внутренний порт.
- Публикацию порта ограничивают нужным host interface и firewall policy.

## Развёрнутый ответ сеньора: все тонкости

- Bridge использует veth, routing/NAT и host firewall rules; детали зависят от platform/runtime.
- Docker Desktop работает через VM, поэтому host networking отличается от native Linux.
- Ephemeral source ports и conntrack могут стать bottleneck под нагрузкой.
- DNS/service discovery не заменяет timeout/retry/backpressure.

### Дополнительное техническое объяснение

Network namespace изолирует interfaces, routes и sockets. Bridge driver соединяет veth peers и предоставляет DNS; port publishing устанавливает host forwarding/NAT к container endpoint.

## Если забыл / Простыми словами

У каждого container свой localhost; сосед доступен по сетевому имени, внешний клиент — через published port.

### Аналогия и объяснение

Каждый контейнер живёт в своей квартире: `localhost` означает его собственную комнату. Чтобы зайти из дома или с улицы, нужен адрес соседа или открытая дверь-порт.
