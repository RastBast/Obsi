---
tags: [go, interview, middle, network, quic, flashcards/Сети]
topic: HTTP/3 и QUIC
---

# Чем HTTP/3 поверх QUIC отличается от HTTP/2 поверх TCP?

## Вопрос

Как QUIC уменьшает head-of-line blocking и что дают connection IDs и встроенный TLS?

## Краткий ответ

QUIC работает поверх UDP, реализует надёжные независимые streams, congestion control и TLS 1.3 в одном transport. Потеря packet одного stream не блокирует delivery других streams. Connection ID позволяет переживать смену IP/порта, например переход Wi‑Fi→mobile.

## Развёрнутый ответ мидла

- HTTP/3 использует QUIC streams и QPACK для headers.
- Handshake может требовать меньше round trips; 0-RTT доступен только с replay-safe семантикой.
- UDP middleboxes/firewalls могут блокировать или ухудшать путь, поэтому нужен fallback.
- QUIC шифрует больше transport metadata, усложняя старые способы диагностики.

## Развёрнутый ответ сеньора: все тонкости

- Независимость streams убирает transport HOL между ними, но не congestion effects общего path.
- 0-RTT подвержен replay: небезопасные операции нельзя принимать без защиты.
- User-space implementation ускоряет evolution, но потребляет CPU и требует tuning buffers/batching.
- Migration и connection ID добавляют privacy/linkability considerations.

## Если забыл: что это, зачем и где нужно

QUIC переносит функции TCP+TLS в новый защищённый transport с независимыми streams поверх UDP.

## Подробное объяснение простыми словами

Вместо одной очереди для всех заказов каждый заказ получает свою дорожку. А номер разговора сохраняется даже при смене сети телефона. Но общая пропускная способность дороги всё равно одна.

## Подробное объяснение техническими терминами

QUIC combines encrypted transport handshake, stream-level reliability, loss recovery and congestion control. Packet loss blocks only affected stream data, while connection IDs decouple session identity from network 4-tuple.
