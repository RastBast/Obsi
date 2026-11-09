# Сравните quicksort, mergesort и heapsort

Какие у них сложности, память, стабильность и worst-case свойства?

===

@input

---

## Краткий ответ

Quicksort обычно быстрый и cache-friendly, average O(n log n), worst O(n²) без защит. Mergesort стабилен и O(n log n), но для массива обычно требует O(n) памяти. Heapsort O(n log n) worst-case и O(1) extra, но хуже locality/константы.

---

## Развёрнутый ответ мидла

- Insertion sort O(n²), но эффективен на маленьких/почти отсортированных блоках.
- Production sort часто гибридный и защищается от плохих входов.
- Comparison sort имеет нижнюю границу Ω(n log n) в общей модели.
- Counting/radix используют структуру ключей и могут быть линейными при дополнительных ограничениях.

---

## Развёрнутый ответ сеньора: все тонкости

- Stable sort нужна для последовательной сортировки по нескольким ключам.
- External merge sort работает, когда данные не помещаются в память.
- Parallel sort ограничен bandwidth/cache и стоимостью merge.
- На интервью важно объяснить partition/merge/heap invariant, а не только таблицу сложностей.

### Дополнительное техническое объяснение

Comparison algorithms различаются recurrence, auxiliary space и stability. Introspective implementations комбинируют quicksort с heapsort/insertion sort, сохраняя практическую locality и worst-case bound.

---

## Если забыл / Простыми словами

Выбор сортировки — компромисс average/worst, память, стабильность и свойства входа.

### Аналогия и объяснение

Quicksort делит вокруг опорного, mergesort сортирует части и сливает, heapsort постоянно забирает главный элемент из кучи. У каждого способа своя цена за дополнительную память и неудачный вход.
