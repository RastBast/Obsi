# Как диагностировать высокую latency Redis?

Чем SLOWLOG, latency monitor, commandstats и OS/network метрики дополняют друг друга?

===

@input

---

## Краткий ответ

SLOWLOG фиксирует время выполнения команды на сервере без network I/O, latency monitor классифицирует внутренние spikes, commandstats показывает агрегаты команд. Их сопоставляют с CPU, memory/fragmentation, fork/AOF/RDB, network, blocked clients, hot/big keys и client pool.

---

## Развёрнутый ответ мидла

Начинают с percentiles client-observed latency и времени проблемы. SLOWLOG показывает дорогие `KEYS`, большие collection operations или Lua scripts, но не объясняет ожидание в client queue/сети. `INFO commandstats` помогает найти рост частоты/стоимости.

Проверяют `SLOWLOG GET`, latency diagnostics, connected/blocked clients, evictions, rejected connections, replication lag и persistence events. `SCAN` используют вместо `KEYS`, big keys ищут осторожными tools.

---

## Развёрнутый ответ сеньора: все тонкости

Redis event loop делает долгую команду причиной head-of-line для остальных. Fork/COW, fsync, transparent huge pages, swapping и noisy neighbor дают spikes без очевидной slow command. Cluster aggregate скрывает один hot shard.

Threshold SLOWLOG выбирают ниже пользовательского SLA, но sampling/storage ограничивают. Диагностические команды сами могут быть дорогими на production.

### Дополнительное техническое объяснение

End-to-end latency decomposes into client queue, connection acquisition, RTT, server event-loop wait, command execution and response transfer. Server observability covers only часть пути; correlation по node/time/workload обязательна.

---

## Если забыл / Простыми словами

SLOWLOG измеряет время кассира за операцией, но клиент мог долго ждать очередь или дорогу до магазина. Нужно измерять весь путь и смотреть, не задержал ли один огромный заказ всех остальных.

### Аналогия и объяснение

Если среднее хорошее, а p99 плохой, ищут редкие блокирующие события: большой key, snapshot, swap, hot shard. Одной общей метрики Redis недостаточно.
