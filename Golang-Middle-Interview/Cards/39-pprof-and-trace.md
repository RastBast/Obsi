---
tags: [go, interview, middle, pprof, trace, flashcards/Go]
topic: Профилирование
---

# Как искать CPU, memory и concurrency bottleneck?

## Вопрос

Чем отличаются CPU, heap, allocs, goroutine, mutex и block profiles, и когда нужен runtime trace?

## Краткий ответ

CPU profile показывает, где тратится процессорное время; heap — живую память; allocs — накопленные аллокации; goroutine — стеки; mutex/block — ожидание синхронизации. Trace показывает временную картину scheduler, GC и событий. Сначала воспроизводят проблему, затем выбирают профиль под симптом.

## Развёрнутый ответ мидла

Для тестов:

```bash
go test -bench . -cpuprofile cpu.out -memprofile mem.out ./pkg
go tool pprof -http=:0 cpu.out
```

В сервисе часто подключают `net/http/pprof` на защищённом служебном endpoint. Профиль снимают под репрезентативной нагрузкой.

В pprof смотрят `top`, `list`, call graph, различают flat (сама функция) и cumulative (включая вызовы). Heap можно анализировать по `inuse_space` или `alloc_space` — они отвечают на разные вопросы.

## Развёрнутый ответ сеньора: все тонкости

Симптом определяет инструмент: высокий CPU → CPU profile; растущий RSS → heap + runtime/system memory + GC metrics; высокая latency при низком CPU → block/mutex/goroutine/trace; scheduler/GC pauses → trace и runtime metrics.

Heap profile семплируется и не равен RSS. RSS включает stacks, runtime metadata, mapped memory, cgo и память, ещё не возвращённую OS. «В heap profile мало, RSS много» не противоречие.

Mutex/block profiling имеет overhead и sampling rates; их включают осознанно. Trace гораздо объёмнее и дороже, поэтому берут короткое окно, сфокусированное на проблеме.

Продакшен pprof раскрывает stack, URL, имена и потенциально чувствительные данные, а CPU profile создаёт нагрузку. Endpoint закрывают аутентификацией/сетью и ограничивают длительность.

Профиль показывает корреляцию затрат, но оптимизацию проверяют повторным профилем и benchmark. Inlining, labels и symbolization влияют на чтение. Для мультиарендного сервиса `pprof.Labels` помогает разделить работу по компоненту, не включая high-cardinality секреты.

## Если забыл: что это, зачем и где нужно

Подбирай профиль по вопросу: **CPU — где считаем; heap — что живёт; allocs — что создаём; block/mutex — где ждём; goroutine — кто висит; trace — когда всё происходило**.

## Подробное объяснение простыми словами

Подбирай профиль по вопросу: **CPU — где считаем; heap — что живёт; allocs — что создаём; block/mutex — где ждём; goroutine — кто висит; trace — когда всё происходило**.

Представь, что это одно из правил языка и стандартной библиотеки: оно задаёт, как программа хранит данные или выполняет действие. Понимание правила помогает не угадывать поведение кода, а заранее предсказывать результат, находить ошибки и выбирать более простой API.

## Подробное объяснение техническими терминами

CPU profile показывает, где тратится процессорное время; heap — живую память; allocs — накопленные аллокации; goroutine — стеки; mutex/block — ожидание синхронизации. Trace показывает временную картину scheduler, GC и событий. Сначала воспроизводят проблему, затем выбирают профиль под симптом.

Симптом определяет инструмент: высокий CPU → CPU profile; растущий RSS → heap + runtime/system memory + GC metrics; высокая latency при низком CPU → block/mutex/goroutine/trace; scheduler/GC pauses → trace и runtime metrics.

Heap profile семплируется и не равен RSS. RSS включает stacks, runtime metadata, mapped memory, cgo и память, ещё не возвращённую OS. «В heap profile мало, RSS много» не противоречие.
