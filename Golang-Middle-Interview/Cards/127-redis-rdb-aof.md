# Чем RDB отличается от AOF?

Какие компромиссы durability, recovery и I/O дают снимки и журнал команд?

===

@input

---

## Краткий ответ

RDB периодически сохраняет компактный snapshot: быстро восстанавливается, но теряет изменения после снимка. AOF записывает mutating commands и в зависимости от fsync policy теряет меньше, но журнал/восстановление дороже; rewrite сжимает историю. Их можно комбинировать.

---

## Развёрнутый ответ мидла

- `appendfsync always/everysec/no` меняет durability и latency.
- RDB fork/copy-on-write может кратковременно увеличить память и I/O.
- AOF rewrite создаёт эквивалентное компактное состояние, а не просто обрезает bytes.
- Репликация не заменяет persistence/backup.

---

## Развёрнутый ответ сеньора: все тонкости

- При memory pressure COW pages во время fork могут привести к OOM.
- Disk latency влияет на event loop косвенно/через fsync policy.
- После corruption нужны проверка/repair инструменты и проверенный restore runbook.
- Выбор следует RPO/RTO; cache может жить без persistence, source-of-truth — редко.

### Дополнительное техническое объяснение

RDB materializes point-in-time dataset via fork/COW. AOF appends command log with configurable fsync and background rewrite. Durability window, recovery throughput и peak memory определяют режим.

---

## Если забыл / Простыми словами

RDB — редкие полные фотографии, AOF — журнал изменений. Цена меньшей потери — больше постоянной записи.

### Аналогия и объяснение

Можно каждый час фотографировать доску или записывать каждое изменение в журнал. Фотография проста, но последние записи потеряются; журнал подробнее, но длиннее и требует уборки.
