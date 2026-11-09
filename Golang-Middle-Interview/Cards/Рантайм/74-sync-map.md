---
tags:
  - go
  - interview
  - middle
  - runtime
  - sync
  - flashcards/Рантайм
deck: "Рантайм"
topic: "sync.Map"
---

# Когда использовать sync.Map?

## Вопрос

Чем `sync.Map` отличается от map под mutex и для каких workload он оптимизирован?

## Краткий ответ

`sync.Map` — специализированная конкурентная map для ключей/значений `any`. Она полезна, когда ключ записывается один раз и много читается или когда goroutine работают по непересекающимся ключам. Для обычного typed state map+mutex часто яснее и поддерживает составные инварианты.

## Развёрнутый ответ мидла

- `Load`, `Store`, `LoadOrStore`, `LoadAndDelete`, `CompareAndSwap` выражают атомарные операции над entry.
- Range не является согласованным snapshot.
- Значения требуют type assertion или typed wrapper.
- Нельзя копировать `sync.Map` после начала использования.

## Развёрнутый ответ сеньора: все тонкости

- Внутренняя read/dirty модель — implementation detail; решение принимают benchmark workload.
- Атомарность одной entry не защищает связь между двумя ключами.
- `Clear` и новые операции зависят от версии Go; библиотека должна учитывать minimum toolchain.
- Удаление entry не освобождает объект, если его удерживают другие ссылки/readers.

### Дополнительное техническое объяснение

`sync.Map` предоставляет entry-level synchronization и memory-model guarantees для observed writes. Она не обеспечивает multi-key transaction или consistent Range snapshot; workload suitability определяется read/write distribution и contention benchmark.

## Если забыл / Простыми словами

sync.Map — не «быстрая map всегда», а инструмент для специальных конкурентных паттернов.

### Аналогия и объяснение

Это общая таблица с готовыми безопасными операциями. Она хороша, когда большинство записей создаётся один раз и потом читается. Если нужно согласованно менять несколько записей, обычный замок проще.
