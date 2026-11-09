# Когда PostgreSQL использует B-tree индекс?

Для каких условий подходит B-tree, почему индекс ускоряет чтение ценой записи и что такое index-only scan?

===

@input

---

## Краткий ответ

B-tree подходит для equality, range, ordering и prefix части совместимого порядка. Индекс хранит ключи и ссылки на heap tuples, увеличивает WAL/запись/место. Index-only scan может вернуть данные из индекса, если нужные columns покрыты и visibility map подтверждает видимость.

---

## Развёрнутый ответ мидла

- Индекс полезен, когда условие достаточно selective или помогает ORDER BY/LIMIT.
- Planner может выбрать seq scan для большой доли таблицы.
- INCLUDE добавляет non-key columns для covering, но увеличивает размер.
- Expression/partial indexes требуют совпадения запроса с выражением/предикатом.

---

## Развёрнутый ответ сеньора: все тонкости

- MVCC означает, что обычный index entry не всегда доказывает видимость tuple.
- Page splits, fillfactor и random insert влияют на bloat/locality.
- Duplicate-heavy indexes могут использовать deduplication версии PostgreSQL.
- Индекс не бесплатен: каждый UPDATE затрагивает его, если меняются indexed columns; HOT update возможен при условиях.

### Дополнительное техническое объяснение

Planner compares index/bitmap/seq scan costs using selectivity, correlation и I/O estimates. B-tree supports ordered operator class; index-only scan still зависит от MVCC visibility map.

---

## Если забыл / Простыми словами

Индекс — отдельная отсортированная структура: быстрее найти немного строк, но её нужно обновлять при записи.

### Аналогия и объяснение

Как алфавитный указатель в книге: нужную страницу найти быстро, но после изменения книги указатель тоже нужно перепечатать. Если читать почти всю книгу, проще идти подряд.
