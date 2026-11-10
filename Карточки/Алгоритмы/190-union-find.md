---
tags:
  - go
  - interview
  - middle
  - algorithms
  - graph
  - flashcards/Алгоритмы
deck: "Алгоритмы"
topic: "Disjoint Set Union"
---

# Как работает Union-Find?

## Вопрос

Какие инварианты поддерживает DSU и где он применяется?

## Краткий ответ

DSU хранит компоненты непересекающихся множеств. `Find` возвращает representative, `Union` соединяет roots. Path compression и union by rank/size дают почти константную амортизированную сложность O(α(n)).

## Развёрнутый ответ мидла

Изначально каждый элемент — собственный parent. Find идёт к root и переподключает путь. Union присоединяет меньшую/низкую tree к большей/высокой. Применения: connectivity, Kruskal MST, объединение аккаунтов.

## Развёрнутый ответ сеньора: все тонкости

- Обычный DSU не поддерживает эффективное удаление/разделение.
- Для rollback не применяют обычное path compression, хранят историю changes.
- Representative не обязан быть минимальным элементом.
- Dynamic connectivity с deletions требует более сложных offline/online алгоритмов.

### Дополнительное техническое объяснение

Disjoint-set forest maintains parent/rank arrays. Path compression flattens find paths, union-by-rank bounds height; aggregate sequence complexity is inverse-Ackermann amortized.

## Если забыл / Простыми словами

У каждой группы есть корень; Find находит его, Union соединяет два корня.

### Аналогия и объяснение

Каждая компания имеет главного представителя. При слиянии один руководитель начинает подчиняться другому, а сотрудники запоминают короткий путь к новому главному.
