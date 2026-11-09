# Как в общих чертах устроен PostgreSQL?

Что делают client backend processes, shared buffers, WAL writer, checkpointer и autovacuum?

===

@input

---

## Краткий ответ

PostgreSQL обычно создаёт отдельный backend process на connection. Процессы используют shared memory и shared buffers. WAL фиксирует изменения до data pages; checkpointer сбрасывает dirty pages, background writer сглаживает запись, autovacuum очищает/анализирует версии строк.

---

## Развёрнутый ответ мидла

- Connection не равен query; слишком много connections расходуют process memory и scheduler.
- Shared buffers кешируют страницы БД, но OS page cache тоже участвует.
- WAL обеспечивает durability/recovery и основу replication.
- Catalog хранит schema/metadata как системные таблицы.

---

## Развёрнутый ответ сеньора: все тонкости

- Commit обычно ждёт flush WAL по durability policy, а data page может записаться позже.
- Checkpoint spikes зависят от dirty pages, WAL volume и настройки интервала.
- Backend local memory (`work_mem`) умножается на операции и connections, а не выделяется один раз.
- Pooler снижает connection overhead, но transaction pooling ограничивает session state.

### Дополнительное техническое объяснение

PostgreSQL process architecture сочетает per-connection backends, shared buffer pool и WAL-based redo. Checkpoint устанавливает recovery point, а MVCC maintenance выполняется autovacuum workers.

---

## Если забыл / Простыми словами

Connections обслуживают процессы, данные идут через pages/cache, WAL первым сохраняет изменения, vacuum убирает старые версии.

### Аналогия и объяснение

У каждого посетителя есть сотрудник, все сотрудники пользуются общим складом страниц. Перед изменением они пишут запись в надёжный журнал, поэтому после аварии можно восстановить порядок действий.
