---
tags: [go, interview, middle, runtime, memory, flashcards/Рантайм]
topic: Heap, RSS и fragmentation
---

Почему RSS процесса может быть больше Go heap?::RSS включает heap pages, goroutine stacks, runtime metadata, binary, mmap, cgo и page cache/accounting ОС. Heap profile показывает Go allocations, а не всю resident memory. Освобождённые spans могут не сразу вернуться ОС из-за scavenging и fragmentation.

# Почему RSS процесса может быть больше Go heap?

## Вопрос

Как расследовать «утечку», если heap profile маленький, а container memory растёт?

## Краткий ответ

RSS включает heap pages, goroutine stacks, runtime metadata, binary, mmap, cgo и page cache/accounting ОС. Heap profile показывает Go allocations, а не всю resident memory. Освобождённые spans могут не сразу вернуться ОС из-за scavenging и fragmentation.

## Развёрнутый ответ мидла

Сравнивают runtime memory classes, heap in-use/idle/released, goroutine count/stacks, cgo/external allocators и OS mappings. Один snapshot не показывает тренд ownership.

## Развёрнутый ответ сеньора: все тонкости

- Container working set и host RSS рассчитываются не идентично.
- High-water workload оставляет size-class spans частично занятыми.
- `debug.FreeOSMemory` не является регулярным лечением.
- Memory limit оставляет headroom под non-heap и kernel-accounted buffers.

## Если забыл: что это, зачем и где нужно

Heap — часть памяти процесса; RSS — страницы, реально находящиеся в RAM по учёту ОС.

## Подробное объяснение простыми словами

Отчёт склада считает товары Go, а аренда здания включает коридоры, полки, сотрудников и чужое оборудование C. Пустая полка не всегда сразу возвращается арендодателю.

## Подробное объяснение техническими терминами

Go heap profiles sample managed allocations; RSS aggregates resident VMAs/pages. Allocator fragmentation, retained spans, stacks, runtime metadata and foreign allocations explain divergence and require multi-layer telemetry.
