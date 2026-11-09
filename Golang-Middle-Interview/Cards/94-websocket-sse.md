---
tags: [go, interview, middle, network, websocket, flashcards/Сети]
topic: WebSocket, SSE и long polling
---

# Чем WebSocket отличается от SSE и long polling?

## Вопрос

Как выбрать транспорт для server push и какие lifecycle-проблемы появляются у долгих соединений?

## Краткий ответ

WebSocket даёт двунаправленные message frames после HTTP upgrade. SSE — однонаправленный текстовый stream server→browser с автоматическим reconnect. Long polling использует обычные запросы, которые сервер держит до события. Выбор зависит от направления, частоты и инфраструктуры.

## Развёрнутый ответ мидла

- WebSocket требует ping/pong, read/write deadlines и одного протокола сообщений поверх frames.
- SSE проще проходит proxy, но только текст/одно направление.
- Long polling дороже handshakes/headers, зато совместим почти везде.
- На каждое соединение ставят limits очереди; медленный клиент не должен съесть память.

## Развёрнутый ответ сеньора: все тонкости

- Load balancer idle timeout должен быть больше heartbeat interval.
- Горизонтальный scale требует broker/fanout и иногда session routing.
- Reconnect создаёт thundering herd; нужен jitter и resume cursor/event ID.
- Authentication истекает во время долгой сессии и требует политики reauth/close.

## Если забыл: что это, зачем и где нужно

WebSocket — двусторонний канал, SSE — поток от сервера, long polling — серия долгих HTTP-запросов.

## Подробное объяснение простыми словами

WebSocket — постоянный телефон, SSE — радио от сервера, long polling — повторные звонки с вопросом «есть новости?». У каждого слушателя должна быть ограниченная очередь, иначе медленный слушатель затормозит систему.

## Подробное объяснение техническими терминами

Persistent transports требуют connection lifecycle, heartbeat, backpressure, replay cursor и distributed fanout. WebSocket сохраняет message framing over upgraded connection; SSE использует HTTP event stream semantics и `Last-Event-ID`.
