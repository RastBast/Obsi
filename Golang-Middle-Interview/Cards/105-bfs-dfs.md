# Чем BFS отличается от DFS?

Какие структуры данных используют обходы, какова сложность и когда BFS находит кратчайший путь?

===

@input

---

## Краткий ответ

BFS идёт слоями через queue и находит кратчайшее число рёбер в невзвешенном графе. DFS идёт в глубину через recursion/stack и удобен для components, cycles и topological algorithms. Оба работают за O(V+E) при adjacency list.

---

## Развёрнутый ответ мидла

- `visited` отмечают при добавлении в queue/stack, чтобы не размножать вершины.
- Для восстановления пути хранят parent.
- В disconnected graph запускают обход из каждой непосещённой вершины.
- Recursive DFS может переполнить stack; iterative вариант контролируемее.

---

## Развёрнутый ответ сеньора: все тонкости

- BFS memory O(V) может быть узким местом на широком графе.
- DFS cycle detection в directed graph различает состояния visiting/visited.
- Bidirectional BFS резко сокращает frontier при известной цели и обратимых рёбрах.
- Для implicit graph соседи генерируются, но сложность зависит от branching factor/depth.

### Дополнительное техническое объяснение

Graph traversal marks each reachable vertex and examines each edge once. FIFO frontier обеспечивает nondecreasing hop distance; LIFO/recursion формирует depth-first forest и discovery/finish structure.

---

## Если забыл / Простыми словами

BFS использует очередь и идёт по расстоянию, DFS — стек и углубляется.

### Аналогия и объяснение

BFS сначала проверяет всех соседей, потом соседей соседей. DFS выбирает один коридор до конца и возвращается. Поэтому BFS первым найдёт путь с минимальным числом дверей.
