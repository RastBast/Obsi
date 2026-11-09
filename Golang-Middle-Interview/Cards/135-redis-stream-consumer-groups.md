# Как работают consumer groups Redis Streams?

Что означают `>`, PEL, ACK и claim, и как восстановить сообщения умершего consumer?

===

@input

---

## Краткий ответ

Group хранит last-delivered ID и pending entries list. Чтение с `>` получает новые entries и назначает их consumer. После успешной обработки вызывают ACK. Если consumer умер, idle pending entries просматривают/claim-ят другому consumer и обрабатывают повторно.

---

## Развёрнутый ответ мидла

- Group создают с нужной стартовой позиции: начало или только новые.
- ACK выполняют после side effect, иначе возможна потеря.
- До ACK сообщение может доставиться снова; нужна idempotency.
- Trimming не должен бездумно удалить ещё нужные entries.

---

## Развёрнутый ответ сеньора: все тонкости

- Claim timeout больше нормального processing time, иначе два consumer обработают одновременно.
- PEL растёт при ошибках/мертвых consumers; нужны метрики age/count.
- Poison message требует retry limit и DLQ/parking stream.
- Ordering сохраняется в stream ID, но параллельные consumers завершают не по порядку.

### Дополнительное техническое объяснение

Consumer group tracks delivery cursor and per-entry ownership in PEL. ACK removes pending state; auto-claim transfers idle ownership. Semantics are at-least-once, requiring idempotent processing and poison-message policy.

---

## Если забыл / Простыми словами

Новые записи выдаются группе, pending помнит незавершённое, ACK подтверждает, claim передаёт брошенное.

### Аналогия и объяснение

Диспетчер выдаёт письма сотрудникам и записывает, у кого каждое находится. После отчёта письмо вычёркивают. Если сотрудник пропал, письмо после ожидания передают другому.
