# Почему инварианты нужно закреплять constraints в БД?

Чем PRIMARY KEY, UNIQUE, FOREIGN KEY, CHECK и NOT NULL отличаются и почему проверки только в Go недостаточно?

===

@input

---

## Краткий ответ

Constraints атомарно защищают данные для всех writers. PK идентифицирует строку, UNIQUE запрещает дубликаты, FK поддерживает ссылочную целостность, CHECK проверяет выражение строки, NOT NULL запрещает null. Проверка «сначала SELECT, потом INSERT» имеет race.

---

## Развёрнутый ответ мидла

- Unique constraint/индекс решает concurrent duplicate, приложение обрабатывает conflict.
- FK action (`RESTRICT`, `CASCADE`, `SET NULL`) выбирают по lifecycle.
- CHECK не предназначен для произвольного запроса других строк; cross-row invariant требует иной модели.
- NULL в UNIQUE имеет определённую PostgreSQL семантику и настраиваемые варианты в новых версиях.

---

## Развёрнутый ответ сеньора: все тонкости

- Constraint можно сделать deferrable для проверки к commit, но это усложняет диагностику.
- Добавление constraint на большую таблицу может блокировать/сканировать; используют staged `NOT VALID`/validate где применимо.
- Cascade способен массово заблокировать/удалить данные.
- Domain/application validation остаётся для понятных ошибок, БД — последняя защита.

### Дополнительное техническое объяснение

Declarative constraints enforce relational invariants transactionally under concurrency. Unique enforcement participates in index/locking protocol; FK validates referenced keys and applies referential actions independent of application code path.

---

## Если забыл / Простыми словами

Приложение объясняет ошибку, constraint не позволяет нарушить правило при гонке или другом writer.

### Аналогия и объяснение

Проверка в приложении — просьба соблюдать правило, constraint — замок на двери склада. Даже если два сотрудника одновременно решили положить одинаковый номер, замок пропустит только одного.
