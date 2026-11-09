# Почему большой connection pool может ухудшить latency?

Как согласовать HTTP/SQL pool с capacity downstream и overload policy?

===

@input

---

## Краткий ответ

Pool ограничивает дорогие connections и переиспользует их, но слишком большой pool перегружает downstream, а слишком маленький создаёт ожидание. Неограниченная очередь скрывает saturation и увеличивает tail latency. Нужны лимит, timeout и метрики ожидания.

---

## Развёрнутый ответ мидла

Измеряют active/idle/waiters, wait duration, request deadline и downstream saturation. Общий budget делят между всеми replicas, а не выделяют каждой весь лимит сервера.

---

## Развёрнутый ответ сеньора: все тонкости

- Несколько уровней pool/queue создают скрытое суммарное ожидание.
- HTTP/2 multiplexing меняет связь connection↔concurrency.
- Pool warmup/stale connection validation влияют на spikes.
- Load shedding до дорогой очереди лучше timeout после долгого ожидания.

### Дополнительное техническое объяснение

Connection pool bounds concurrent sessions, while queueing delay follows utilization and service-time distribution. Capacity planning allocates global downstream budget and enforces bounded wait/deadline.

---

## Если забыл / Простыми словами

Pool — admission limit, а не способ бесконечно принять работу.

### Аналогия и объяснение

Больше касс у входа не поможет, если склад обрабатывает десять заказов. Лишние клиенты просто образуют длинную очередь и дождутся просроченного ответа.
