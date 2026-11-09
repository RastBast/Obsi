# Как спроектировать cache и защититься от stampede?

Что такое cache-aside, какие проблемы создают TTL и eviction, и как предотвратить одновременную загрузку одного отсутствующего ключа?

===

@input

---

## Краткий ответ

В cache-aside код сначала читает cache, при miss загружает источник и записывает результат. Stampede — много параллельных miss одного ключа; его уменьшают singleflight/request coalescing, jitter TTL, stale-while-revalidate и ограничением concurrency.

---

## Развёрнутый ответ мидла

Cache должен иметь:

- ограничение памяти/числа записей и eviction policy;
- TTL и понятную допустимую устарелость;
- thread-safe доступ;
- метрики hit/miss, latency, evictions и load errors;
- правила invalidation.

Для одного процесса `singleflight.Group` объединяет одновременные загрузки ключа, но результат разделяется только между текущими callers и не является долговременным cache.

Negative caching коротко сохраняет «не найдено», чтобы не бить БД, но может скрыть только что созданный объект. TTL выбирают из бизнес-допуска.

---

## Развёрнутый ответ сеньора: все тонкости

«Cache invalidation» зависит от модели согласованности. Delete-on-write оставляет окно между DB commit и удалением cache; write-through тоже имеет частичный отказ. CDC/event invalidation уменьшает окно, но события могут задержаться/дублироваться. Версия записи или monotonic timestamp помогает не применить старое событие после нового.

Одинаковый TTL у большого числа ключей создаёт synchronized expiry; добавляют jitter. Stale-while-revalidate отдаёт старое значение в допустимом окне и обновляет в фоне, но background refresh должен иметь lifecycle, limit и защиту от вечной устарелости.

Singleflight внутри instance не защищает распределённый fleet. Варианты: внешний lock/lease, распределённый cache с атомарным протоколом, probabilistic early refresh. Distributed lock сам требует fencing/expiry и может быть сложнее допустимой дополнительной нагрузки.

Ключ cache должен включать все факторы результата: tenant, locale, permissions, версию schema. Ошибка ключа может стать утечкой данных. Не кешируют секреты без политики шифрования/доступа.

Hit ratio сам по себе недостаточен: маленький процент miss по горячим ключам может перегрузить БД, а cache увеличивает tail latency при сетевом сбое. Нужны timeout, fallback и circuit/load shedding.

### Дополнительное техническое объяснение

В cache-aside код сначала читает cache, при miss загружает источник и записывает результат. Stampede — много параллельных miss одного ключа; его уменьшают singleflight/request coalescing, jitter TTL, stale-while-revalidate и ограничением concurrency.

«Cache invalidation» зависит от модели согласованности. Delete-on-write оставляет окно между DB commit и удалением cache; write-through тоже имеет частичный отказ. CDC/event invalidation уменьшает окно, но события могут задержаться/дублироваться. Версия записи или monotonic timestamp помогает не применить старое событие после нового.

Одинаковый TTL у большого числа ключей создаёт synchronized expiry; добавляют jitter. Stale-while-revalidate отдаёт старое значение в допустимом окне и обновляет в фоне, но background refresh должен иметь lifecycle, limit и защиту от вечной устарелости.

---

## Если забыл / Простыми словами

Cache — обмен свежести и сложности на latency/load. На собеседовании назови **TTL + eviction + invalidation + stampede + observability**. Для stampede: singleflight, jitter и bounded refresh.

### Аналогия и объяснение

Cache — обмен свежести и сложности на latency/load. На собеседовании назови **TTL + eviction + invalidation + stampede + observability**. Для stampede: singleflight, jitter и bounded refresh.

Представь Redis как очень быстрый общий блокнот в памяти. Он ускоряет доступ, но записи могут устаревать, исчезать или одновременно обновляться несколькими процессами. Поэтому важны срок жизни, ограничение памяти и точный источник истины.
