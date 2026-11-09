---
tags: [go, interview, middle, network, ip, flashcards/Сети]
topic: IP, subnet и NAT
---

Как читать CIDR, зачем default gateway и как NAT влияет на соединения сервисов?::CIDR `/n` задаёт число бит network prefix; адреса с общим prefix относятся к сети по правилам маршрутизации. Gateway пересылает packets в другие сети. NAT переписывает адрес/порт и хранит state mapping, позволяя множеству private hosts использовать внешний адрес.

# Что такое subnet, CIDR и NAT?

## Вопрос

Как читать CIDR, зачем default gateway и как NAT влияет на соединения сервисов?

## Краткий ответ

CIDR `/n` задаёт число бит network prefix; адреса с общим prefix относятся к сети по правилам маршрутизации. Gateway пересылает packets в другие сети. NAT переписывает адрес/порт и хранит state mapping, позволяя множеству private hosts использовать внешний адрес.

## Развёрнутый ответ мидла

- `10.0.0.0/24` обычно содержит 256 адресов, но доступность network/broadcast зависит от среды.
- Routing выбирает наиболее специфичный prefix.
- Private ranges не маршрутизируются глобально напрямую.
- NAT mapping имеет timeout и может ломать долгие idle connections.

## Развёрнутый ответ сеньора: все тонкости

- Source IP за proxy/NAT не равен identity пользователя.
- SNAT с множеством outbound connections может исчерпать ephemeral ports.
- IPv6 уменьшает потребность в адресном NAT, но firewall/security policy остаётся.
- MTU, tunnel overhead и path MTU discovery влияют на большие packets.

## Если забыл: что это, зачем и где нужно

Subnet определяет адресный диапазон, route — следующий путь, NAT — переписывание адресов с состоянием.

## Подробное объяснение простыми словами

CIDR похож на общий индекс района: чем больше бит префикса, тем меньше район. NAT похож на секретаря с одним внешним номером, который помнит, кому внутри передать каждый ответ.

## Подробное объяснение техническими терминами

Longest-prefix routing выбирает next hop по destination address. Stateful NAT преобразует network 5-tuple и ведёт conntrack mapping; capacity ограничена table entries и source port space.
