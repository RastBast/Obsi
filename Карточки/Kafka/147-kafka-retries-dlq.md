---
tags:
  - go
  - interview
  - middle
  - kafka
  - retry
  - flashcards/Kafka
deck: "Kafka"
topic: "Retry и DLQ Kafka"
---

# Как обрабатывать ошибки consumer: retry topic или DLQ?

## Вопрос

Чем transient error отличается от poison message и как не заблокировать partition навсегда?

## Краткий ответ

Transient error повторяют с bounded attempts/backoff. Poison message после лимита отправляют в DLQ/parking topic с исходным payload и диагностикой. Немедленный retry в tight loop блокирует partition и перегружает dependency. Выбор retry topic влияет на порядок.

## Развёрнутый ответ мидла

- Ошибки классифицируют, а не повторяют все.
- DLQ должен иметь owner, alert и процесс replay, иначе это кладбище.
- Payload/headers сохраняют event ID, topic/partition/offset, attempt и безопасную error category.
- Handler идемпотентен, потому что redelivery возможна.

## Развёрнутый ответ сеньора: все тонкости

- Retry topic освобождает source partition, но нарушает per-key order.
- Pause partition сохраняет order, но блокирует последующие события.
- Delayed retry обычно строят несколькими topics/scheduler; нельзя держать consumer sleeping дольше poll contract.
- Replay DLQ контролирует rate, schema compatibility и повторные side effects.

### Дополнительное техническое объяснение

Failure handling combines error taxonomy, bounded exponential backoff, delivery-attempt metadata и dead-letter routing. Ordering, consumer liveness и idempotency определяют pause versus retry-topic architecture.

## Если забыл / Простыми словами

Временное повторяем ограниченно, неисправимое паркуем и расследуем; политика порядка выбирается явно.

### Аналогия и объяснение

Если дверь временно закрыта, письмо пробуют доставить позже. Если адрес испорчен, бесконечно стучать бессмысленно — письмо откладывают с объяснением, чтобы человек исправил и запустил повторно.
