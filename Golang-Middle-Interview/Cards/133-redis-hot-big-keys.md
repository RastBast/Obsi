# Чем опасны hot key и big key?

Как один популярный или огромный key влияет на latency, cluster и replication?

===

@input

---

## Краткий ответ

Hot key концентрирует запросы на одном shard/core и создаёт bottleneck. Big key занимает много памяти и делает операции, удаление, replication и migration долгими. Их находят latency/memory tooling и исправляют sharding, local cache, redesign и постепенным unlink/delete.

---

## Развёрнутый ответ мидла

- Размер измеряют не только длиной value, но и числом collection elements.
- `KEYS` на production опасен; используют SCAN и диагностические команды осторожно.
- `UNLINK` освобождает память асинхроннее, уменьшая блокировку event loop.
- Для hot read помогают replicas/client cache, для hot write — шардирование модели.

---

## Развёрнутый ответ сеньора: все тонкости

- Добавление random suffix требует fan-out на read/aggregate и меняет atomicity.
- Big key migration блокирует network/buffers и может задержать failover.
- Local cache вызывает consistency/invalidation вопросы.
- Heavy command complexity на moderate key тоже создаёт latency spike.

### Дополнительное техническое объяснение

Single-threaded shard service time определяется command complexity и key locality. Hotspot limits horizontal scaling; oversized value increases event-loop blocking, copy/replication bandwidth и reshard latency.

---

## Если забыл / Простыми словами

Hot key перегружает частотой, big key — размером и длительностью одной операции.

### Аналогия и объяснение

К одной кассе может стоять вся толпа, даже если остальные свободны. А один гигантский товар надолго перекрывает проход. Нужны распределение нагрузки и ограничение размера единицы.
