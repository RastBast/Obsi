# Что даёт HTTP/2 multiplexing?

Как streams, frames и HPACK меняют работу по сравнению с HTTP/1.1 и где остаётся head-of-line blocking?

===

@input

---

## Краткий ответ

HTTP/2 делит одно соединение на независимые logical streams из frames, сжимает headers и позволяет multiplexing. Это убирает application HOL между HTTP-запросами, но потеря TCP packet задерживает весь byte stream на transport layer.

---

## Развёрнутый ответ мидла

- Stream имеет ID и lifecycle; frames разных streams чередуются.
- Flow control существует на stream и connection level.
- Один connection экономит handshakes, но становится общей точкой congestion/failure.
- Server push оказался мало полезен и часто отключён; не считать его главным преимуществом.

---

## Развёрнутый ответ сеньора: все тонкости

- Неправильные flow-control windows могут ограничить throughput или память.
- HPACK dynamic table создаёт state и security/complexity tradeoffs.
- GOAWAY позволяет graceful migration, но client должен решить, какие streams безопасно повторить.
- Многие долгие streams на одном connection требуют fairness и limits.

### Дополнительное техническое объяснение

HTTP/2 binary framing multiplexes streams with per-stream/connection flow control and HPACK header compression. TCP reliability preserves in-order bytes, поэтому packet loss вызывает transport HOL across multiplexed streams.

---

## Если забыл / Простыми словами

HTTP/2 смешивает кадры нескольких запросов в одном TCP-соединении, но всё ещё зависит от порядка TCP.

### Аналогия и объяснение

Одна дорога разделена на пронумерованные грузы: части разных заказов могут ехать вперемешку. Но если сама дорога перекрыта из-за потерянной машины, ждут все заказы.
