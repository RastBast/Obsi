---
tags: [go, interview, middle, postgresql, pagination, flashcards/БД]
topic: Keyset pagination
---

Почему большой OFFSET медленный и нестабилен при изменениях, как построить cursor для `(created_at,id)`?::OFFSET заставляет БД найти и отбросить предыдущие строки, а concurrent inserts/deletes сдвигают страницы. Keyset продолжает после последнего sort key: `WHERE (created_at,id) < ($1,$2) ORDER BY ... LIMIT n`, используя composite index.

# Чем keyset pagination лучше OFFSET?

## Вопрос

Почему большой OFFSET медленный и нестабилен при изменениях, как построить cursor для `(created_at,id)`?

## Краткий ответ

OFFSET заставляет БД найти и отбросить предыдущие строки, а concurrent inserts/deletes сдвигают страницы. Keyset продолжает после последнего sort key: `WHERE (created_at,id) < ($1,$2) ORDER BY ... LIMIT n`, используя composite index.

## Развёрнутый ответ мидла

- Order должен быть total и стабильным; неуникальный timestamp дополняют ID.
- Cursor кодирует оба значения и направление, клиент не должен менять его поля.
- Composite index соответствует WHERE/ORDER BY.
- Keyset хорошо листает вперёд/назад, но не прыгает дешёво на страницу 500.

## Развёрнутый ответ сеньора: все тонкости

- NULL ordering и collation должны совпадать в query/cursor.
- Изменение sort key между запросами может переместить запись; snapshot pagination требует отдельного контракта.
- Cursor подписывают/валидируют, если нельзя доверять клиенту.
- Filters входят в index design и identity cursor query.

## Если забыл: что это, зачем и где нужно

OFFSET считает от начала каждый раз, keyset говорит «продолжи после этой последней записи».

## Подробное объяснение простыми словами

Вместо команды «пропусти миллион людей» показываем билет последнего увиденного человека и просим продолжить за ним. Очередь должна иметь однозначный порядок даже при одинаковом времени.

## Подробное объяснение техническими терминами

Seek pagination использует lexicographic range predicate over unique ordered key и index scan starting position. Она даёт O(page size) traversal after seek и уменьшает drift относительно offset under concurrent mutations.
