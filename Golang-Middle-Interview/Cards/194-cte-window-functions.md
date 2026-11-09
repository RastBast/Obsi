---
tags: [go, interview, middle, postgresql, sql, flashcards/БД]
topic: CTE и window functions
---

Чем window function отличается от GROUP BY?::GROUP BY сворачивает группу в одну строку. Window function вычисляет значение по partition/order, сохраняя каждую исходную строку: rank, running sum, lag/lead. CTE именует подзапрос; materialization/inlining зависит от запроса и версии PostgreSQL.

# Чем window function отличается от GROUP BY?

## Вопрос

Когда применять `row_number`, `lag` и CTE и как они влияют на план?

## Краткий ответ

GROUP BY сворачивает группу в одну строку. Window function вычисляет значение по partition/order, сохраняя каждую исходную строку: rank, running sum, lag/lead. CTE именует подзапрос; materialization/inlining зависит от запроса и версии PostgreSQL.

## Развёрнутый ответ мидла

```sql
row_number() over (partition by user_id order by created_at desc)
```

Даёт нумерацию событий каждого user. Frame (`ROWS/RANGE`) важен для running aggregates, особенно при равных order values.

## Развёрнутый ответ сеньора: все тонкости

- Window обычно требует sort и может spill по `work_mem`.
- Default frame с `last_value` часто удивляет; задают явно.
- CTE `MATERIALIZED` может быть optimization fence, `NOT MATERIALIZED` разрешает folding по условиям.
- Recursive CTE требует termination и контроля роста.

## Если забыл: что это, зачем и где нужно

Window добавляет групповой расчёт каждой строке, не уничтожая строки; CTE даёт имя этапу запроса.

## Подробное объяснение простыми словами

GROUP BY оставляет один итог на класс. Оконная функция подписывает каждому ученику его место и среднее класса, сохраняя список учеников.

## Подробное объяснение техническими терминами

WindowAgg evaluates functions over partitioned ordered frames after relational input. CTE defines query subexpression whose materialization/folding affects pushdown, reuse and execution cost.
