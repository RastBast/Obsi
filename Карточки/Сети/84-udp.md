---
tags:
  - go
  - interview
  - middle
  - network
  - udp
  - flashcards/Сети
deck: "Сети"
topic: "UDP"
---

# Чем UDP отличается от TCP?

## Вопрос

Какие гарантии даёт UDP, когда он подходит и что приложение должно реализовать само?

## Краткий ответ

UDP отправляет отдельные datagrams без установления соединения и не гарантирует доставку, порядок, уникальность или congestion control приложения. Он подходит для DNS, telemetry, real-time и как основа QUIC, когда задержка и контроль протокола важнее встроенной надёжности TCP.

## Развёрнутый ответ мидла

- Одна отправка соответствует datagram, но пакет может потеряться или продублироваться.
- Datagram больше безопасного path MTU рискует fragmentation/drop.
- UDP «connection» в API обычно лишь фиксирует peer и фильтрует packets, handshake не появляется.
- Retry, sequence, dedupe и auth проектирует прикладной протокол.

## Развёрнутый ответ сеньора: все тонкости

- UDP легко spoof-ить и использовать для amplification; сервер ограничивает response/request ratio и валидирует client.
- NAT mapping имеет timeout, поэтому долгий сеанс требует keepalive/перепривязки.
- Отсутствие встроенного congestion control не разрешает агрессивную отправку; ответственный протокол его добавляет.
- Packet truncation и receive buffer overflow нужно наблюдать.

### Дополнительное техническое объяснение

UDP предоставляет connectionless best-effort datagram transport с checksum и ports. Reliability, ordering, retransmission, pacing, congestion control и session security являются responsibility application protocol.

## Если забыл / Простыми словами

UDP сохраняет границы сообщений, но почти ничего не обещает о доставке.

### Аналогия и объяснение

Это отправка открытки без уведомления: она может прийти, потеряться или прийти позже другой. Зато не нужно заранее созваниваться и можно самому выбрать, что делать при пропаже.
