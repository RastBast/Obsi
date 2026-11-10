---
tags:
  - go
  - interview
  - middle
  - redis
  - cache
  - flashcards/Redis
deck: "Redis"
topic: "TTL и eviction Redis"
---

# Чем expiration отличается от eviction?

## Вопрос

Как Redis удаляет просроченные keys и что происходит при достижении maxmemory?

## Краткий ответ

Expiration удаляет key после заданного TTL логически через lazy check и active sampling. Eviction срабатывает при maxmemory и выбирает key по политике: noeviction, LRU/LFU/random/TTL среди всех или volatile keys. Это разные механизмы.

## Развёрнутый ответ мидла

- TTL проверяют командами `TTL/PTTL`; `-1` означает без срока, `-2` — key отсутствует.
- Обновление key не всегда сохраняет TTL; семантика зависит от команды/options.
- `noeviction` возвращает ошибку на новые writes, а не освобождает произвольное.
- Approximate LRU/LFU не является идеальным глобальным алгоритмом.

## Развёрнутый ответ сеньора: все тонкости

- Одинаковые TTL создают expiry storm; добавляют jitter.
- `volatile-*` не помогает, если мало keys с TTL.
- Memory accounting включает allocator fragmentation/replication buffers не одинаково для политики.
- Evicted cache miss может вызвать stampede на БД.

### Дополнительное техническое объяснение

Redis expiration combines passive lookup deletion and active sampling. Maxmemory eviction applies approximate policy during allocation pressure. Operational design связывает TTL distribution, memory headroom, miss amplification и backpressure.

## Если забыл / Простыми словами

TTL говорит, когда запись устарела; eviction решает, что выбросить при нехватке памяти.

### Аналогия и объяснение

На продукте есть срок годности — это TTL. Когда холодильник переполнен, приходится выбрать, что выбросить раньше срока — это eviction. Правила выбора и защита источника данных нужны заранее.
