---
tags:
  - go
  - interview
  - middle
  - runtime
  - gc
  - flashcards/Рантайм
deck: "Рантайм"
topic: "GC assist"
---

# Что такое GC assist?

## Вопрос

Почему goroutine приложения может тратить CPU на GC и как это увидеть?

## Краткий ответ

Когда приложение быстро выделяет память во время concurrent mark, runtime заставляет allocating goroutine выполнить часть mark work. GC assist связывает allocation rate со скоростью сборки и помогает не превысить heap goal, но может увеличить request latency.

## Развёрнутый ответ мидла

Высокий allocation churn и большой live heap повышают GC work. Ищут allocations profile, GC CPU/runtime metrics и trace, затем уменьшают реальные hot allocations или удержание.

## Развёрнутый ответ сеньора: все тонкости

- Assist debt зависит от pacer и объёма allocation, точная формула version-specific.
- Pool может снизить churn, но увеличить live memory.
- Низкий GOMEMLIMIT усиливает assist/thrashing.
- Tail latency связывают с trace, а не объявляют любую паузу GC.

### Дополнительное техническое объяснение

GC pacer assigns mark-assist debt proportional to allocation during concurrent cycle. Mutator performs tracing work to maintain heap goal; assist time appears in runtime trace/metrics and affects latency.

## Если забыл / Простыми словами

Кто быстро создаёт мусор, помогает сборщику его отмечать.

### Аналогия и объяснение

Если сотрудники слишком быстро приносят коробки, склад заставляет каждого немного помочь с уборкой перед выдачей нового места. Это удерживает склад в границах, но задерживает сотрудника.
