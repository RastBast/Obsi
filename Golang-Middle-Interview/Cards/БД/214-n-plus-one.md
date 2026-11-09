---
tags:
  - go
  - interview
  - middle
  - flashcards/БД
deck: "БД"
topic: "Что такое проблема N+1 запросов?"
---

# Что такое проблема N+1 запросов?

## Вопрос

Почему загрузка списка и отдельный запрос зависимостей для каждой строки плохо масштабируется и как исправить это без огромного Cartesian product?

## Краткий ответ

N+1 — один запрос получает N сущностей, затем код выполняет N дополнительных запросов для связанных данных. Даже быстрые запросы платят network/pool/parse overhead и создают нагрузку. Исправляют JOIN, batch `WHERE id = ANY(...)`, eager preload или DataLoader-подобной агрегацией.

## Развёрнутый ответ мидла

Проблему находят по query count на один HTTP request, traces и SQL logs. Batch загрузка собирает уникальные foreign keys, делает один запрос и группирует результат в map.

JOIN подходит many-to-one и небольшим collections, но несколько one-to-many связей могут размножить строки. Тогда два-три предсказуемых batch queries лучше одного гигантского JOIN. Pagination применяют к основной сущности до размножения.

## Развёрнутый ответ сеньора: все тонкости

ORM preload может скрыто перейти от N+1 к huge IN list или Cartesian explosion. Нужно ограничивать batch size и учитывать parameter limits/plan. Cache маскирует проблему до cold start и не исправляет latency misses.

GraphQL DataLoader группирует keys в рамках request tick и сохраняет порядок результатов, но требует request-scoped cache и правильной обработки missing keys/errors.

### Дополнительное техническое объяснение

N+1 увеличивает round trips O(N) и pool contention, даже если суммарная DB CPU мала. Set-oriented SQL/loader transforms access pattern into O(1) batches relative to entity count, сохраняя bounded result cardinality.

## Если забыл / Простыми словами

Плохо: принести список из ста заказов, а потом сто раз бегать за именем каждого клиента. Хорошо: собрать все нужные ID и одним походом принести клиентов пачкой.

### Аналогия и объяснение

Цель не обязательно «один SQL любой ценой», а небольшое фиксированное число понятных запросов. Иногда два batch-запроса быстрее и безопаснее одного огромного JOIN.
