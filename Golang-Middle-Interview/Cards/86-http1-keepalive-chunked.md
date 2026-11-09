# Как HTTP/1.1 определяет границы body и переиспользует соединения?

Для чего нужны Content-Length, chunked encoding и keep-alive, и почему непрочитанный body мешает connection reuse?

===

@input

---

## Краткий ответ

HTTP/1.1 держит TCP-соединение открытым по умолчанию. Граница body задаётся Content-Length, chunked transfer coding, правилами метода/status или закрытием соединения. Клиент должен корректно дочитать/закрыть body, чтобы parser мог начать следующий response на том же stream.

---

## Развёрнутый ответ мидла

- Один TCP stream требует однозначного framing каждого сообщения.
- Chunked позволяет передавать body, не зная длину заранее.
- Keep-alive экономит TCP/TLS handshakes.
- Pipelining редко используется из-за ordering и head-of-line; клиенты чаще держат pool соединений.

---

## Развёрнутый ответ сеньора: все тонкости

- Несогласие proxy и backend о Content-Length/Transfer-Encoding ведёт к request smuggling.
- Limits на headers/body и read deadlines защищают parser.
- Trailers доступны только по правилам framing и должны быть объявлены/обработаны корректно.
- Закрытие соединения иногда безопаснее дренирования огромного нежелательного body.

### Дополнительное техническое объяснение

HTTP/1.1 message framing определяется RFC precedence rules для status/method, Transfer-Encoding, Content-Length и connection close. Persistent connection reuse требует полного parser synchronization на response boundary.

---

## Если забыл / Простыми словами

На одном TCP-соединении сообщения идут подряд, поэтому длина каждого должна быть недвусмысленной.

### Аналогия и объяснение

В одной длинной трубе идут несколько посылок. На каждой нужен размер или отметки частей, иначе получатель не поймёт, где заканчивается одна и начинается следующая.
