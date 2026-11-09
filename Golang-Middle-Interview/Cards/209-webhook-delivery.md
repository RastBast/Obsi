# Как надёжно доставлять webhooks?

Какие timeout, retry, подпись, idempotency и ordering нужны, чтобы webhook переживал сетевые и частичные сбои?

===

@input

---

## Краткий ответ

Webhook delivery является at-least-once: событие сохраняют в durable queue/outbox, отправляют с коротким timeout, повторяют transient failures с exponential backoff/jitter и ограничением. Запрос подписывают, включают event ID; receiver проверяет подпись, timestamp и дедуплицирует side effect.

---

## Развёрнутый ответ мидла

2xx означает принятие по контракту. 429/5xx/network errors обычно retryable, большинство 4xx — permanent до изменения endpoint/config. Payload имеет schema version, event type, ID и occurred time.

HMAC подписывает raw body плюс timestamp; сравнение constant-time, допустимое окно защищает replay. Secret ротируют с периодом поддержки двух ключей. DLQ и dashboard позволяют переотправить исправленный endpoint.

---

## Развёрнутый ответ сеньора: все тонкости

Timeout не говорит, выполнил ли receiver side effect: ответ мог потеряться. Поэтому idempotency обязательна. Глобальный порядок трудно сохранить при retries; обычно гарантируют per-aggregate sequence и позволяют receiver обнаружить gap/out-of-order.

SSRF-защита валидирует destination, блокирует private/metadata ranges и повторно проверяет DNS redirects. Один медленный tenant не должен занимать весь worker pool; очереди и limits шардируют.

### Дополнительное техническое объяснение

Delivery worker реализует durable state machine pending→attempting→delivered/dead with attempt metadata. Cryptographic authenticity, replay window, deduplication store и bounded retry budget формируют end-to-end protocol.

---

## Если забыл / Простыми словами

Webhook — курьер, который не знает, дошла ли квитанция. Он может принести письмо повторно, поэтому у письма есть уникальный номер, а получатель отмечает уже выполненные поручения.

### Аналогия и объяснение

Подпись доказывает отправителя, timestamp ограничивает повтор старого письма, retry переживает временно закрытую дверь, а DLQ сохраняет письма с неправильным адресом для ручного решения.
