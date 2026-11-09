# Как реализовать LRU cache за O(1)?

Какие структуры нужны для Get/Put O(1), что происходит при eviction и какие проблемы появляются в concurrent cache?

===

@input

---

## Краткий ответ

LRU сочетает hash map key→node и doubly linked list по давности. Get на hit переносит node в начало, Put добавляет/обновляет, при переполнении удаляется хвост из списка и map. Все операции ожидаемо O(1).

---

## Развёрнутый ответ мидла

- List нужен для O(1) удаления известного node.
- Map без list не знает самый старый key без O(n) поиска.
- Capacity zero и update существующего key обрабатывают явно.
- Eviction callback лучше вызывать вне lock, если он внешний.

---

## Развёрнутый ответ сеньора: все тонкости

- Каждый Get становится записью и создаёт lock contention.
- LRU плохо справляется со scan pollution; LFU/2Q/TinyLFU могут быть лучше.
- Weight-based capacity реалистичнее count при объектах разного размера.
- TTL и LRU — разные политики; expired item удаляют по lazy/background strategy.

### Дополнительное техническое объяснение

Hash index обеспечивает expected O(1) lookup, intrusive doubly linked recency list — O(1) splice/eviction. Concurrent implementation сериализует recency mutation или применяет approximate/sharded policy с иными guarantees.

---

## Если забыл / Простыми словами

Map быстро находит узел, двусвязный список быстро меняет порядок и удаляет хвост.

### Аналогия и объяснение

Есть каталог книг и очередь по последнему использованию. Каталог сразу находит книгу, а очередь показывает, какую давно не брали и можно убрать при нехватке места.
