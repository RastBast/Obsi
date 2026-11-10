---
tags:
  - go
  - interview
  - middle
  - flashcards/БД
deck: "БД"
topic: "Чем optimistic locking отличается от pessimistic locking?"
---

# Чем optimistic locking отличается от pessimistic locking?

## Вопрос

Когда использовать version compare-and-swap, а когда `SELECT ... FOR UPDATE`, и какие конфликты/ожидания создаёт каждый подход?

## Краткий ответ

Optimistic locking не держит lock во время пользовательской работы: UPDATE включает `WHERE id=? AND version=?`, увеличивает version и проверяет affected rows; конфликт приводит к retry/409. Pessimistic locking заранее блокирует строку (`FOR UPDATE`) до конца короткой transaction, заставляя конкурентов ждать или ошибаться.

## Развёрнутый ответ мидла

Optimistic подход хорош при редких конфликтах и долгом времени между read/write, например редактировании API-ресурса. Version/ETag должен участвовать в каждом update. Ноль updated rows означает stale version или отсутствие — различают по контракту.

Pessimistic lock полезен для короткого read-modify-write с высокой ценой конфликта. Transaction держат короткой, без HTTP-вызовов. `NOWAIT` сразу ошибается, `SKIP LOCKED` подходит очередям, но меняет semantics.

## Развёрнутый ответ сеньора: все тонкости

Optimistic retry повторяет чистую операцию с новым state и ограничением; нельзя молча перетереть пользовательское решение. Pessimistic locks создают deadlocks, lock queues и tail latency; нужен единый порядок и timeouts.

MVCC snapshot сам по себе не предотвращает lost update во всех шаблонах. Atomic `UPDATE balance=balance-? WHERE balance>=?` часто проще обоих вариантов.

### Дополнительное техническое объяснение

Optimistic concurrency control validates read version at write/commit and aborts on conflict. Pessimistic control acquires incompatible lock before mutation. Choice depends on contention probability, transaction duration, retry cost and invariant expressibility.

## Если забыл / Простыми словами

Optimistic: оба редактора работают свободно, второй при сохранении узнаёт, что документ уже изменился. Pessimistic: первый забирает ключ от документа, второй ждёт.

### Аналогия и объяснение

Если конфликты редки, держать дверь запертой долго дорого. Если десятки касс одновременно меняют один остаток, заранее согласованный короткий lock или одна атомарная SQL-команда надёжнее.
