---
tags: [go, interview, middle, redis, algorithms, flashcards/Redis]
topic: Bloom filter и cache penetration
---

Как Bloom filter защищает БД от запросов несуществующих ключей?::Bloom filter битовым массивом и несколькими hash проверяет membership. `definitely not` позволяет не идти в БД, `possibly yes` требует проверку. False positives возможны, false negatives отсутствуют только при корректном добавлении и без неподдерживаемого удаления.

# Как Bloom filter защищает БД от запросов несуществующих ключей?

## Вопрос

Что такое cache penetration и какие ограничения у Bloom filter?

## Краткий ответ

Bloom filter битовым массивом и несколькими hash проверяет membership. `definitely not` позволяет не идти в БД, `possibly yes` требует проверку. False positives возможны, false negatives отсутствуют только при корректном добавлении и без неподдерживаемого удаления.

## Развёрнутый ответ мидла

Cache penetration — повторные запросы отсутствующих IDs, которые каждый раз доходят до source. Дополнительно используют negative cache, validation и rate limit.

## Развёрнутый ответ сеньора: все тонкости

- Размер bits и число hashes выбирают по ожидаемому n и false-positive rate.
- Обычный Bloom не удаляет; counting Bloom платит counters/memory.
- Filter должен обновляться при insert до/в согласованном порядке, иначе false negative.
- Переполнение capacity ухудшает false-positive rate и требует rebuild/version swap.

## Если забыл: что это, зачем и где нужно

Фильтр быстро доказывает отсутствие, но положительный ответ только «возможно есть».

## Подробное объяснение простыми словами

Охранник по быстрым отметкам точно говорит, кого нет в списке. Если отметки совпали, он отправляет к настоящему списку, потому что совпадение иногда случайно.

## Подробное объяснение техническими терминами

Probabilistic set maps item through k hashes into m bits. Membership query has no false negatives under append-only correct state and tunable false-positive probability; source remains authority.
