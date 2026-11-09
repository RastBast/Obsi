# Когда использовать JSONB и GIN индекс в PostgreSQL?

Чем JSONB отличается от JSON и какие издержки у GIN?

===

@input

---

## Краткий ответ

JSONB подходит для полуструктурированных attributes, которые всё равно нужно транзакционно хранить рядом. GIN ускоряет containment/existence по элементам документа. Часто фильтруемые и constrained поля лучше оставить обычными columns.

---

## Развёрнутый ответ мидла

JSONB хранит разобранное бинарное представление, нормализует object key order/duplicates по своей семантике. Expression index полезен для конкретного path, generated column — для типизированного часто используемого значения.

---

## Развёрнутый ответ сеньора: все тонкости

- GIN велик и дороже на write; pending list требует обслуживания.
- `jsonb_ops` и `jsonb_path_ops` поддерживают разные operators/размер.
- Частичное update логически может переписать tuple и создать WAL/bloat.
- Schema validation и migration не исчезают, а переходят в приложение/constraints.

### Дополнительное техническое объяснение

JSONB is decomposed binary document type with containment operators. GIN inverted index maps tokens/paths to tuples; operator class, write amplification and selectivity determine benefit.

---

## Если забыл / Простыми словами

JSONB даёт гибкость, GIN — поиск внутри, но основные инварианты лучше моделировать columns.

### Аналогия и объяснение

В ячейке можно хранить папку произвольных полей, а отдельный каталог помогает искать внутри папок. Но номер клиента и сумма лучше лежат в подписанных обязательных колонках.
