---
tags: [go, interview, middle, postgresql, partitioning, flashcards/БД]
topic: Partitioning
---

# Когда таблицу стоит партиционировать?

## Вопрос

Чем range/list/hash partitioning помогают и почему partitioning не является автоматическим ускорителем?

## Краткий ответ

Partitioning делит logical table на physical partitions по ключу. Оно упрощает удаление/архивирование диапазонов, pruning и обслуживание очень больших таблиц. Плохой ключ или слишком много partitions увеличивают planning, indexes и operational complexity.

## Развёрнутый ответ мидла

- Range по времени удобен для retention: старую partition detach/drop быстро.
- List делит категории/tenant groups, hash равномерно распределяет.
- Query должен содержать условие по partition key для pruning.
- Indexes обычно создаются/поддерживаются на partitions через partitioned index model.

## Развёрнутый ответ сеньора: все тонкости

- Global uniqueness ограничена: unique/PK обычно должен включать partition key.
- Skew создаёт oversized/hot partition.
- Создание будущих partitions и routing ошибок автоматизируют.
- Partitionwise join/aggregate и pruning зависят от версии/плана; измеряют EXPLAIN.

## Если забыл: что это, зачем и где нужно

Партиция — физический кусок одной логической таблицы, полезный для pruning и lifecycle данных.

## Подробное объяснение простыми словами

Архив делят по месяцам. Чтобы удалить старый год, выбрасывают коробки целиком, а запрос за сегодня открывает одну коробку. Но поиск без даты вынужден смотреть многие коробки.

## Подробное объяснение техническими терминами

Declarative partitioning routes tuples by partition bound. Planner/executor pruning исключает irrelevant relations; DDL retention становится metadata operation. Constraint/plan overhead растёт с partition count.
