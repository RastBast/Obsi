# Как согласовывать Redis cache с БД?

Какие окна рассогласования есть у cache-aside, delete-on-write и write-through?

===

@input

---

## Краткий ответ

В cache-aside read miss загружает БД и пишет cache; write обычно commit-ит БД и удаляет cache. Между шагами и при гонках возможны stale values. Write-through обновляет cache и БД, но создаёт dual-write failure. Абсолютной атомарности без общего протокола нет.

---

## Развёрнутый ответ мидла

- Сначала DB commit, потом delete обычно безопаснее обратного порядка, но delete может упасть.
- TTL ограничивает срок stale data, не устраняет окно.
- CDC/outbox может надёжно доставлять invalidation после commit.
- Cache key включает version/tenant и все факторы результата.

---

## Развёрнутый ответ сеньора: все тонкости

- Гонка: старый slow read после нового write снова кладёт stale value. Помогают version/check, delayed double delete или event ordering.
- Read-your-writes может обходить cache/использовать version token.
- Cache outage не должен автоматически уронить source через stampede.
- Consistency SLA формулируют явно: максимальная stale duration и критичные операции.

### Дополнительное техническое объяснение

Dual-system update lacks atomic commit. Cache-aside uses invalidation and bounded TTL; race control применяет versioned values, ordered CDC events и idempotent consumers under explicit consistency model.

---

## Если забыл / Простыми словами

БД — источник истины, cache — ускоренная копия с известным окном устаревания.

### Аналогия и объяснение

Есть оригинал документа и копия на стойке. После правки нужно убрать или заменить копию, но между двумя действиями кто-то может прочитать старое. Система должна решить, сколько это допустимо.
