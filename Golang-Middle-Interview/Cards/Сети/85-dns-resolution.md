---
tags:
  - go
  - interview
  - middle
  - network
  - dns
  - flashcards/Сети
deck: "Сети"
topic: "DNS"
---

# Как работает DNS resolution и caching?

## Вопрос

Что происходит при разрешении имени, что означает TTL и почему DNS может быть причиной редких timeout?

## Краткий ответ

Resolver ищет записи через cache и DNS servers, следуя delegation/recursive resolution. TTL задаёт срок кеширования ответа, включая иногда отрицательный. DNS использует UDP и TCP, а modern environments могут добавлять DoH/DoT и service discovery.

## Развёрнутый ответ мидла

- A/AAAA дают адреса, CNAME — alias, SRV — service endpoint metadata.
- Один hostname может вернуть несколько адресов; client выбирает/перебирает их.
- TTL не гарантирует мгновенную смену: caches обновятся постепенно.
- NXDOMAIN отличается от временного сбоя resolver.

## Развёрнутый ответ сеньора: все тонкости

- Go resolver может использовать pure Go или системный resolver/cgo в зависимости от платформы и конфигурации.
- Search domains и `ndots` в контейнерах умножают запросы и latency.
- Успешный DNS не означает здоровый endpoint; stale addresses живут до TTL.
- Happy Eyeballs балансирует IPv6/IPv4 попытки, не дожидаясь долгого провала одного семейства.

### Дополнительное техническое объяснение

Recursive resolver кеширует RRsets по authoritative TTL и выполняет delegation chain. Client latency включает search expansion, negative caching, transport fallback и address selection; observability отделяет DNS phase от connect phase.

## Если забыл / Простыми словами

DNS переводит имя в данные маршрутизации, а TTL делает изменения постепенно согласованными.

### Аналогия и объяснение

DNS похож на телефонную книгу с копиями у многих помощников. После смены номера старые копии ещё действуют до срока хранения, поэтому часть звонков некоторое время идёт по старому адресу.
