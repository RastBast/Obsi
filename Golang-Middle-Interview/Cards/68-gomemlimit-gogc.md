---
tags: [go, interview, middle, runtime, gc, flashcards/Рантайм]
topic: GOMEMLIMIT и GOGC
---

Что регулируют `GOGC` и `GOMEMLIMIT`, почему memory limit мягкий и как избежать GC thrashing?::`GOGC` задаёт целевой относительный рост heap между циклами GC. `GOMEMLIMIT` задаёт мягкую цель памяти, управляемой runtime. Слишком низкая цель заставляет GC работать почти непрерывно и снижает throughput; настройки выбирают по live heap, RSS и latency.

# Как настраивать GOMEMLIMIT и GOGC?

## Вопрос

Что регулируют `GOGC` и `GOMEMLIMIT`, почему memory limit мягкий и как избежать GC thrashing?

## Краткий ответ

`GOGC` задаёт целевой относительный рост heap между циклами GC. `GOMEMLIMIT` задаёт мягкую цель памяти, управляемой runtime. Слишком низкая цель заставляет GC работать почти непрерывно и снижает throughput; настройки выбирают по live heap, RSS и latency.

## Развёрнутый ответ мидла

- `GOGC=100` примерно разрешает heap вырасти относительно объёма live data перед следующим циклом.
- Большее значение обычно означает реже GC и больше памяти; меньшее — наоборот.
- Limit оставляет запас ниже container limit для stacks, binary, cgo и внешней памяти.
- Метрики GC CPU, heap goal, allocation rate и OOM важнее одной настройки.

## Развёрнутый ответ сеньора: все тонкости

- Soft limit может быть превышен из-за non-Go memory, минимального прогресса и резкого burst.
- При live heap, близком к limit, runtime не может собрать достижимые данные и начинается thrash.
- Memory limit не заменяет bounded caches/queues и admission control.
- Изменение процента программно влияет на весь процесс и должно иметь одного владельца.

## Если забыл: что это, зачем и где нужно

GOGC балансирует CPU и размер heap, GOMEMLIMIT добавляет абсолютную мягкую границу. Оба не исправят удержание живых объектов.

## Подробное объяснение простыми словами

Сборщик можно вызывать чаще и занимать меньше склада либо реже и держать больше коробок. Если разрешённый склад меньше уже нужных коробок, уборщик будет бегать постоянно, но места не освободит.

## Подробное объяснение техническими терминами

GC pacer вычисляет heap goal из live heap, GOGC и runtime memory limit. Когда reachable set приближается к goal, assist ratio и GC CPU растут. Capacity planning учитывает runtime-managed и external RSS с safety headroom.
