---
tags: [go, interview, middle, postgresql, mvcc, flashcards/БД]
topic: MVCC и VACUUM
---

# Зачем PostgreSQL нужны VACUUM и autovacuum?

## Вопрос

Почему UPDATE создаёт новую версию строки, что такое dead tuples и transaction ID wraparound?

## Краткий ответ

MVCC хранит версии tuples с метаданными видимости. UPDATE обычно создаёт новую версию, DELETE помечает старую недоступной будущим snapshots. VACUUM освобождает место для повторного использования, обновляет visibility map и предотвращает опасный wraparound transaction IDs.

## Развёрнутый ответ мидла

- Долгая transaction удерживает старый snapshot и мешает очистке версий.
- VACUUM обычно не уменьшает файл ОС; освобождает pages внутри relation.
- ANALYZE обновляет статистику planner, это другая задача, хотя autovacuum запускает обе.
- Bloat увеличивает I/O и размер indexes/table.

## Развёрнутый ответ сеньора: все тонкости

- HOT update избегает новых index entries при неизменных indexed columns и наличии места на page.
- Freeze делает старые tuples безопасными относительно wraparound.
- Autovacuum thresholds масштабируются от размера, но hot tables часто требуют per-table tuning.
- `VACUUM FULL` переписывает relation и берёт сильную lock; это не обычное лечение.

## Если забыл: что это, зачем и где нужно

MVCC оставляет старые версии для читателей, vacuum убирает больше никому не нужные следы.

## Подробное объяснение простыми словами

Редактор не стирает старую страницу, пока кто-то читает старое издание. Уборщик удаляет страницы, когда старых читателей не осталось. Если читатель держит книгу неделями, склад мусора растёт.

## Подробное объяснение техническими терминами

Tuple visibility определяется xmin/xmax и snapshot. VACUUM prunes dead tuples, maintains FSM/visibility map и freezes XIDs. Global xmin ограничивается long-lived transactions/replication slots.
