---
tags: [go, interview, middle, network, tcp, flashcards/Сети]
topic: Flow control и congestion control
---

Какие окна ограничивают отправителя TCP и почему медленный consumer создаёт backpressure?::Flow control защищает receiver: advertised receive window ограничивает непрочитанные байты. Congestion control защищает сеть: congestion window меняется по потерям/RTT/алгоритму. Реально отправитель ограничен минимумом этих окон и доступными данными.

# Чем flow control отличается от congestion control?

## Вопрос

Какие окна ограничивают отправителя TCP и почему медленный consumer создаёт backpressure?

## Краткий ответ

Flow control защищает receiver: advertised receive window ограничивает непрочитанные байты. Congestion control защищает сеть: congestion window меняется по потерям/RTT/алгоритму. Реально отправитель ограничен минимумом этих окон и доступными данными.

## Развёрнутый ответ мидла

- Если приложение медленно читает, receive buffer заполняется и окно уменьшается.
- Send может блокироваться после заполнения локальных buffers.
- Packet loss вызывает retransmission и обычно снижает скорость.
- Bandwidth-delay product объясняет, сколько данных должно быть in-flight для заполнения канала.

## Развёрнутый ответ сеньора: все тонкости

- Head-of-line в одном TCP stream задерживает последующие bytes при потере сегмента.
- Bufferbloat увеличивает latency при больших очередях без явной потери.
- Разные congestion algorithms дают разную реакцию; приложение не должно предполагать фиксированный throughput.
- Application-level queue поверх TCP обязана быть bounded, иначе backpressure превращается в memory growth.

## Если забыл: что это, зачем и где нужно

Flow control спрашивает «успевает ли получатель», congestion control — «справляется ли путь сети».

## Подробное объяснение простыми словами

Скорость грузовика ограничивает и свободное место на складе получателя, и пробка на дороге. Даже быстрый отправитель не может бесконечно складывать коробки в очередь у себя.

## Подробное объяснение техническими терминами

TCP effective flight size ограничен `min(rwnd, cwnd)`. Receiver advertises capacity, sender congestion algorithm оценивает path capacity по ACK/loss/RTT. Application read/write rates связаны с socket buffers и end-to-end backpressure.
