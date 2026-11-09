---
tags: [go, interview, middle, runtime, metrics, flashcards/Рантайм]
topic: runtime/metrics и GODEBUG
---

Что предоставляет `runtime/metrics`, когда использовать `GODEBUG` и почему внутренние имена/форматы нужно привязывать к версии?::`runtime/metrics` даёт документированные process-wide метрики scheduler, GC, heap и memory classes. `GODEBUG` включает диагностические или совместимые режимы runtime. Флаги и детали меняются между версиями, поэтому их применяют временно и проверяют по документации toolchain.

# Как наблюдать и диагностировать runtime Go?

## Вопрос

Что предоставляет `runtime/metrics`, когда использовать `GODEBUG` и почему внутренние имена/форматы нужно привязывать к версии?

## Краткий ответ

`runtime/metrics` даёт документированные process-wide метрики scheduler, GC, heap и memory classes. `GODEBUG` включает диагностические или совместимые режимы runtime. Флаги и детали меняются между версиями, поэтому их применяют временно и проверяют по документации toolchain.

## Развёрнутый ответ мидла

- Сначала выбирают метрику под симптом, а не экспортируют всё.
- Полезны goroutines, GC CPU, heap objects/bytes, allocation rate и scheduler latencies.
- `gctrace` помогает локально увидеть циклы GC, но шумен для постоянного production log.
- Runtime metrics дополняют pprof/trace, а не заменяют их.

## Развёрнутый ответ сеньора: все тонкости

- Histogram boundaries и metric names versioned; dashboard должен учитывать обновление runtime.
- Process-wide данные нельзя напрямую приписать одному tenant/request.
- Слишком частый scrape и преобразование больших histograms имеют overhead.
- Debug flag способен менять семантику/производительность и должен быть частью controlled rollout.

## Если забыл: что это, зачем и где нужно

Metrics показывают состояние во времени, pprof — распределение затрат, trace — последовательность событий, GODEBUG — точечную диагностику.

## Подробное объяснение простыми словами

Панель приборов показывает температуру и обороты, снимок мастера показывает изношенные детали, а видеозапись — порядок событий. Диагностический переключатель включают только понимая, что он меняет.

## Подробное объяснение техническими терминами

`runtime/metrics` экспонирует stable-by-version samples и histograms глобального runtime state. Pprof sampling и execution trace дают complementary attribution. GODEBUG toggles являются toolchain-specific operational controls и требуют version-aware rollout.
