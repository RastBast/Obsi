---
tags:
  - go
  - interview
  - middle
  - runtime
  - cgo
  - flashcards/Рантайм
deck: "Рантайм"
topic: "cgo"
---

# Какие издержки и риски добавляет cgo?

## Вопрос

Почему вызов C из Go сложнее обычной функции, какие ограничения есть у указателей и как cgo влияет на сборку?

## Краткий ответ

Cgo пересекает runtime/ABI boundary, имеет overhead вызова, усложняет scheduler, GC и обработку panic/signals. C-код не может произвольно хранить Go pointers после вызова. Сборке нужны C toolchain и platform libraries, что ухудшает cross compilation.

## Развёрнутый ответ мидла

- Мелкие частые вызовы лучше batch-ить.
- Память C освобождают C-функцией; GC её автоматически не видит как Go heap.
- Долгий C-вызов может занимать OS thread, хотя runtime продолжает другие goroutine.
- Race detector и profiler имеют ограничения на неинструментированный C-код.

## Развёрнутый ответ сеньора: все тонкости

- Передача pointer регулируется cgo pointer rules; объект с Go pointers особенно ограничен.
- Callback из C в Go требует правил thread/runtime и аккуратного lifecycle handle.
- Crash/undefined behavior C-кода способен повредить весь процесс, recover не спасает.
- Часто отдельный процесс с RPC даёт лучшую изоляцию ценой latency.

### Дополнительное техническое объяснение

Cgo выполняет ABI transition и координацию runtime с foreign call. Pointer passing ограничено, чтобы C не удерживал movable/GC-managed references; external allocation, thread affinity и toolchain dependencies требуют отдельного lifecycle и observability.

## Если забыл / Простыми словами

Cgo открывает доступ к C, но выводит часть программы из обычных гарантий Go и усложняет поставку.

### Аналогия и объяснение

Это переход между двумя странами с разными законами памяти. На границе нужно оформить данные и нельзя оставить временный адрес навсегда. Ошибка на чужой стороне способна уронить весь общий процесс.
