---
tags:
  - go
  - interview
  - middle
  - algorithms
  - tree
  - flashcards/Алгоритмы
deck: "Алгоритмы"
topic: "B-tree"
---

# Почему базы используют B-tree, а не обычное бинарное дерево?

## Вопрос

Как высокая ветвистость уменьшает I/O и чем B+tree удобен для range scan?

## Краткий ответ

B-tree node хранит много ключей/children и подбирается под страницу storage, поэтому высота очень мала и требуется меньше random I/O. В B+tree значения/строки обычно связаны с листьями, а листья соединены для последовательного range scan.

## Развёрнутый ответ мидла

- Все листья остаются примерно на одной глубине.
- При переполнении node разделяется, при удалении возможны merge/redistribution.
- Поиск внутри page выполняется в памяти, дорогая часть — число pages.
- Range query находит первый leaf и идёт по соседним листьям.

## Развёрнутый ответ сеньора: все тонкости

- Реальные DB indexes учитывают MVCC, page split, WAL, fill factor и concurrent latches.
- Sequential key создаёт hotspot на правом краю, random UUID ухудшает locality/splits другим способом.
- Prefix compression и covering index уменьшают I/O.
- Big O одинаковое log n скрывает огромную разницу fanout/page access.

### Дополнительное техническое объяснение

Multiway balanced search tree имеет high branching factor B, height O(log_B n) и page-oriented nodes. B+tree leaf linkage обеспечивает ordered scans, а splits/merges поддерживают occupancy invariant.

## Если забыл / Простыми словами

B-tree делает каждый узел размером со страницу и уменьшает число дорогих переходов к storage.

### Аналогия и объяснение

Бинарный указатель на каждой странице заставил бы открывать много страниц. Большой указатель-оглавление на каждой странице сразу выбирает один из сотен путей, поэтому до нужной записи всего несколько шагов.
