---
tags: [go, interview, middle, redis, persistence, flashcards/Redis]
topic: RDB и AOF
---

Какие компромиссы durability, recovery и I/O дают снимки и журнал команд?::RDB периодически сохраняет компактный snapshot: быстро восстанавливается, но теряет изменения после снимка. AOF записывает mutating commands и в зависимости от fsync policy теряет меньше, но журнал/восстановление дороже; rewrite сжимает историю. Их можно комбинировать.

# Чем RDB отличается от AOF?

## Вопрос

Какие компромиссы durability, recovery и I/O дают снимки и журнал команд?

## Краткий ответ

RDB периодически сохраняет компактный snapshot: быстро восстанавливается, но теряет изменения после снимка. AOF записывает mutating commands и в зависимости от fsync policy теряет меньше, но журнал/восстановление дороже; rewrite сжимает историю. Их можно комбинировать.

## Развёрнутый ответ мидла

- `appendfsync always/everysec/no` меняет durability и latency.
- RDB fork/copy-on-write может кратковременно увеличить память и I/O.
- AOF rewrite создаёт эквивалентное компактное состояние, а не просто обрезает bytes.
- Репликация не заменяет persistence/backup.

## Развёрнутый ответ сеньора: все тонкости

- При memory pressure COW pages во время fork могут привести к OOM.
- Disk latency влияет на event loop косвенно/через fsync policy.
- После corruption нужны проверка/repair инструменты и проверенный restore runbook.
- Выбор следует RPO/RTO; cache может жить без persistence, source-of-truth — редко.

## Если забыл: что это, зачем и где нужно

RDB — редкие полные фотографии, AOF — журнал изменений. Цена меньшей потери — больше постоянной записи.

## Подробное объяснение простыми словами

Можно каждый час фотографировать доску или записывать каждое изменение в журнал. Фотография проста, но последние записи потеряются; журнал подробнее, но длиннее и требует уборки.

## Подробное объяснение техническими терминами

RDB materializes point-in-time dataset via fork/COW. AOF appends command log with configurable fsync and background rewrite. Durability window, recovery throughput и peak memory определяют режим.
