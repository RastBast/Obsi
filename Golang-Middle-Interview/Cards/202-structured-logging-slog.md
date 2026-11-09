# Как использовать структурное логирование slog в Go?

Чем структурный лог отличается от форматированной строки, как передавать logger и какие поля нельзя использовать без ограничения cardinality и безопасности?

===

@input

---

## Краткий ответ

`slog` записывает message вместе с типизированными key-value attributes. Logger обычно внедряют зависимостью или добавляют request-scoped attrs через `With`; context используют для correlation/handler integration, а не для скрытия обязательной зависимости. Секреты и персональные данные не логируют.

---

## Развёрнутый ответ мидла

```go
logger.InfoContext(ctx, "request completed",
    "method", r.Method,
    "status", status,
    "duration", elapsed,
)
```

Стабильные keys облегчают поиск и dashboards. Ошибку логируют один раз на границе, где известен итог операции; нижние слои возвращают обёрнутую error. Уровни Debug/Info/Warn/Error имеют операционную семантику, а не заменяют метрики.

Handler определяет JSON/text output, filtering и destination. `LogAttrs` и заранее созданные `slog.Attr` могут уменьшить allocation на горячем пути, но сначала измеряют.

---

## Развёрнутый ответ сеньора: все тонкости

Dynamic error text, user ID и trace ID не подходят как labels метрик, но могут быть полями логов с privacy/retention policy. Logger должен быть concurrency-safe по контракту handler. Синхронная запись способна увеличить latency, а асинхронная очередь требует bounded buffer и drop/backpressure policy.

Context-aware handler может извлекать trace correlation, но бизнес-поля лучше передавать явно. Замена глобального default logger в тестах создаёт process-wide состояние; dependency injection надёжнее.

### Дополнительное техническое объяснение

`slog.Record` содержит timestamp, level, message, program counter и attributes, обрабатываемые `slog.Handler`. `WithAttrs` создаёт производный handler/logger; группировка формирует namespace. Производительность зависит от enabled-level check, attribute construction, encoding и output I/O.

---

## Если забыл / Простыми словами

Структурный лог похож на заполненную анкету: отдельные поля «status=500» и «duration=2s» легче искать, чем предложение свободным текстом. Но анкета не должна содержать пароль, а одна и та же авария не должна печататься на каждом этаже системы.

### Аналогия и объяснение

Сначала реши, кто владеет окончательным отчётом о запросе. Он записывает одно событие с понятными полями; внутренние функции только передают ошибку с контекстом. Так логи остаются пригодными для поиска, а не превращаются в повторяющийся шум.
