# Как выполнять атомарную логику в Redis?

Чем MULTI/EXEC, WATCH и server-side Lua/function отличаются и дают ли они rollback?

===

@input

---

## Краткий ответ

MULTI ставит команды в очередь и EXEC выполняет их последовательно без вклинивания других clients, но rollback как в SQL нет. WATCH реализует optimistic check: EXEC отменяется, если watched key изменился. Lua script выполняется атомарно относительно других команд и подходит read-modify-write.

---

## Развёрнутый ответ мидла

- Ошибка одной команды во время EXEC не откатывает уже выполненные команды.
- WATCH требует retry loop с deadline/backoff.
- Script должен быть коротким: пока он работает, другие команды ждут.
- Keys передают явно для cluster routing и анализа.

---

## Развёрнутый ответ сеньора: все тонкости

- Долгий script блокирует event loop и влияет на весь instance.
- Script cache/function deployment и failover требуют versioning.
- Cluster atomicity ограничена keys одного hash slot.
- Внешние side effects нельзя включить в Redis atomic block.

### Дополнительное техническое объяснение

Redis command execution is serialized. MULTI/EXEC guarantees isolation from interleaving, WATCH adds optimistic concurrency control, Lua/functions provide atomic server-side execution. ACID rollback и cross-system transaction отсутствуют.

---

## Если забыл / Простыми словами

MULTI группирует команды без interleaving, WATCH проверяет версию, Lua делает одну атомарную server-side операцию.

### Аналогия и объяснение

Можно отдать пачку команд, поставить пломбу «выполняй, только если никто не менял запись» или попросить сервер выполнить короткую инструкцию целиком. Но отмены уже выполненной инструкции как в SQL нет.
