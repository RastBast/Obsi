---
tags:
  - go
  - interview
  - middle
  - postgresql
  - joins
  - flashcards/БД
deck: "БД"
topic: "Алгоритмы JOIN"
---

# Чем nested loop, hash join и merge join отличаются?

## Вопрос

Когда planner выбирает каждый алгоритм и как indexes/work_mem влияют на стоимость?

## Краткий ответ

Nested loop берёт строки outer и ищет inner, хорош для маленького outer и index lookup. Hash join строит hash table одной стороны для equality и эффективен на больших неотсортированных наборах. Merge join идёт по двум отсортированным входам и полезен при готовом порядке/range-like merge conditions.

## Развёрнутый ответ мидла

- Nested loop без index на большом inner может стать O(n×m).
- Hash join требует equality и памяти; при нехватке разбивается на batches/disk.
- Merge join требует sort или ordered index scans.
- Join order сильно зависит от cardinality estimates.

## Развёрнутый ответ сеньора: все тонкости

- `work_mem` применяется к каждому sort/hash node и worker, поэтому большое значение опасно глобально.
- Parallel hash/joins имеют coordination overhead.
- Outer joins ограничивают допустимые reorder transformations.
- Forced enable/disable planner methods годится для диагностики, не как постоянная замена статистике/schema.

### Дополнительное техническое объяснение

Join method cost model учитывает input cardinality, parameterized index paths, sort cost и hash memory/batching. Planner выбирает physical operator после logical join-order optimization.

## Если забыл / Простыми словами

Малый набор+индекс — loop; equality больших наборов — hash; уже отсортированные потоки — merge.

### Аналогия и объяснение

Можно для каждой карточки искать пару в каталоге, построить словарь пар или одновременно идти по двум отсортированным стопкам. Лучший способ зависит от размера и готового порядка.
