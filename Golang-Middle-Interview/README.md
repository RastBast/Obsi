# 50 карточек для собеседования Go Middle

Набор рассчитан на подготовку к собеседованию backend-разработчика на Go. В каждой карточке есть:

1. вопрос;
2. краткий ответ на 20–40 секунд;
3. развёрнутый ответ уровня middle;
4. углубление уровня senior с важными тонкостями;
5. простая памятка: что это и зачем нужно.

## Как учить

- Сначала ответь вслух, не открывая карточку.
- Затем сверься с **кратким ответом** и уложись в 30 секунд.
- После этого расскажи middle-версию за 2–3 минуты с примером.
- Senior-раздел используй для уточняющих вопросов интервьюера, а не вываливай целиком в первый ответ.
- Отмечай карточку галочкой только после двух правильных ответов в разные дни.

## 1. Язык, типы и ошибки

- [ ] [01. Массивы и срезы](Cards/01-array-vs-slice.md)
- [ ] [02. append, capacity и aliasing](Cards/02-append-capacity-aliasing.md)
- [ ] [03. Копирование срезов и удержание памяти](Cards/03-copy-slices-and-memory-leaks.md)
- [ ] [04. Устройство map](Cards/04-map-internals.md)
- [ ] [05. nil map, comma-ok и set](Cards/05-nil-map-comma-ok-and-sets.md)
- [ ] [06. string, byte, rune и UTF-8](Cards/06-string-byte-rune-utf8.md)
- [ ] [07. Семантика значений, указатели и receiver](Cards/07-value-semantics-pointers-receivers.md)
- [ ] [08. Interface и ловушка typed nil](Cards/08-interface-nil-trap.md)
- [ ] [09. Method set и embedding](Cards/09-method-set-embedding.md)
- [ ] [10. Type assertion и type switch](Cards/10-type-assertion-and-type-switch.md)
- [ ] [11. defer и именованные результаты](Cards/11-defer-order-and-named-results.md)
- [ ] [12. panic и recover](Cards/12-panic-recover.md)
- [ ] [13. Ошибки, wrapping, errors.Is и errors.As](Cards/13-errors-wrapping-is-as.md)
- [ ] [14. Generics и constraints](Cards/14-generics-constraints.md)
- [ ] [15. Инициализация пакетов и zero value](Cards/15-package-init-and-zero-value.md)
- [ ] [16. context.Context и отмена](Cards/16-context-cancellation.md)

## 2. Concurrency

- [ ] [17. Goroutine и базовая модель scheduler](Cards/17-goroutines-and-scheduler-basics.md)
- [ ] [18. Буферизированные и небуферизированные каналы](Cards/18-buffered-and-unbuffered-channels.md)
- [ ] [19. Закрытие каналов и range](Cards/19-closing-and-ranging-channels.md)
- [ ] [20. select, nil-channel и timeout](Cards/20-select-nil-channel-and-timeouts.md)
- [ ] [21. Mutex и RWMutex](Cards/21-mutex-vs-rwmutex.md)
- [ ] [22. WaitGroup, Once и Cond](Cards/22-waitgroup-once-cond.md)
- [ ] [23. Atomics и memory model](Cards/23-atomics-and-memory-model.md)
- [ ] [24. Data race и race detector](Cards/24-data-races-and-race-detector.md)
- [ ] [25. Утечки goroutine и cancellation](Cards/25-goroutine-leaks-and-cancellation.md)
- [ ] [26. Worker pool и bounded concurrency](Cards/26-worker-pool-bounded-concurrency.md)
- [ ] [27. Pipeline, fan-in и fan-out](Cards/27-pipelines-fan-in-fan-out.md)
- [ ] [28. errgroup и semaphore](Cards/28-errgroup-and-semaphore.md)

## 3. Runtime, память и производительность

- [ ] [29. Stack, heap и escape analysis](Cards/29-stack-heap-escape-analysis.md)
- [ ] [30. Garbage collector](Cards/30-garbage-collector.md)
- [ ] [31. Планировщик G-M-P](Cards/31-gmp-scheduler.md)
- [ ] [32. sync.Pool](Cards/32-sync-pool.md)
- [ ] [33. Layout, alignment и false sharing](Cards/33-memory-layout-and-false-sharing.md)
- [ ] [34. Reflection и unsafe](Cards/34-reflection-and-unsafe.md)
- [ ] [35. Modules, internal, vendor и workspaces](Cards/35-modules-internal-vendor-workspaces.md)

## 4. Тестирование и диагностика

- [ ] [36. Table-driven tests и subtests](Cards/36-table-driven-tests-and-subtests.md)
- [ ] [37. Mocks, stubs, fakes и тестируемость](Cards/37-mocks-fakes-and-testability.md)
- [ ] [38. Benchmarks](Cards/38-benchmarks.md)
- [ ] [39. pprof и runtime trace](Cards/39-pprof-and-trace.md)
- [ ] [40. Fuzzing, vet и статический анализ](Cards/40-fuzz-vet-static-analysis.md)

## 5. Backend и архитектура

- [ ] [41. HTTP server, timeouts и graceful shutdown](Cards/41-http-server-timeouts-shutdown.md)
- [ ] [42. HTTP client и переиспользование Transport](Cards/42-http-client-transport-reuse.md)
- [ ] [43. JSON encoding и API-контракты](Cards/43-json-encoding.md)
- [ ] [44. database/sql и пул соединений](Cards/44-database-sql-pool.md)
- [ ] [45. SQL-транзакции и isolation](Cards/45-sql-transactions-isolation.md)
- [ ] [46. Идемпотентность и retries](Cards/46-idempotency-retries.md)
- [ ] [47. Логи, метрики и traces](Cards/47-observability-logs-metrics-traces.md)
- [ ] [48. Архитектура пакетов](Cards/48-package-architecture.md)
- [ ] [49. Cache, TTL и stampede](Cards/49-cache-ttl-stampede.md)
- [ ] [50. Rate limiting и защита от перегрузки](Cards/50-rate-limiting-and-overload.md)

## Быстрый план на 10 дней

| День | Карточки | Тема |
|---:|:---:|---|
| 1 | 01–05 | Срезы и map |
| 2 | 06–10 | Строки, указатели, интерфейсы |
| 3 | 11–16 | defer, ошибки, generics, context |
| 4 | 17–22 | Goroutine, каналы, sync |
| 5 | 23–28 | Memory model и concurrency patterns |
| 6 | 29–35 | Runtime и память |
| 7 | 36–40 | Тесты и профилирование |
| 8 | 41–43 | HTTP и JSON |
| 9 | 44–46 | БД, транзакции, retries |
| 10 | 47–50 | Observability и архитектура |
