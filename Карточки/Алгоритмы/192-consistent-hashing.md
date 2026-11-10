---
tags:
  - go
  - interview
  - middle
  - algorithms
  - distributed-systems
  - flashcards/Алгоритмы
deck: "Алгоритмы"
topic: "Consistent hashing"
---

# Зачем нужен consistent hashing?

## Вопрос

Как ring, virtual nodes и replication используются для шардирования cache?

## Краткий ответ

Consistent hashing распределяет keys по кольцу hash space и при добавлении/удалении node перемещает только часть keys, а не почти все как `hash % N`. Virtual nodes улучшают равномерность и учитывают capacity.

## Развёрнутый ответ мидла

Key назначают следующему node по часовой стрелке. Replica keys идут к следующим различным physical nodes. Virtual points одного server распределены по ring и уменьшают skew.

## Развёрнутый ответ сеньора: все тонкости

- Hot key остаётся hot независимо от равномерного hash.
- Membership должен быть согласован между clients, иначе inconsistent routing.
- Rendezvous hashing часто проще и хорошо поддерживает weighted nodes.
- Rebalancing требует bandwidth, throttling и ownership handoff.

### Дополнительное техническое объяснение

Hash ring partitions keyspace by successor ownership. Virtual nodes approximate balanced weighted distribution; membership consistency, replica placement and migration protocol определяют system behavior.

## Если забыл / Простыми словами

Изменение состава кластера перемещает соседний диапазон keys, а не всю таблицу.

### Аналогия и объяснение

Адреса раскладывают по кругу, и каждый склад отвечает за участок до своей метки. Новый склад забирает только соседний кусок, а не заставляет переписать все адреса.
