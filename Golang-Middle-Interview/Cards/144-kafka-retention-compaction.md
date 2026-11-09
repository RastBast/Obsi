# Чем time/size retention отличается от log compaction?

Когда записи удаляются и как tombstone влияет на compacted topic?

===

@input

---

## Краткий ответ

Delete retention удаляет старые log segments по времени/размеру независимо от keys. Compaction старается сохранить последнее значение каждого key, позволяя восстановить current state, но не обещает немедленно удалить предыдущие версии. Null value с key — tombstone для удаления состояния.

---

## Развёрнутый ответ мидла

- Topic может применять delete, compact или оба policy.
- Compaction требует meaningful non-null key.
- Consumer нельзя считать, что в compacted log всегда ровно одна запись на key прямо сейчас.
- Tombstone хранится delete-retention период, чтобы consumers увидели удаление.

---

## Развёрнутый ответ сеньора: все тонкости

- Segment-level cleanup асинхронен и зависит от dirty ratio/config.
- Медленный/offline consumer после удаления tombstone может восстановить удалённый stale state из своей логики/backup.
- Compaction не заменяет event history, если нужны все переходы.
- Retention capacity рассчитывают по ingress bytes, replication factor и headroom.

### Дополнительное техническое объяснение

Log cleaner rewrites eligible segments retaining latest offset per key plus tombstones within delete retention. Time/size segment deletion is orthogonal; cleanup is eventual and constrained by segment lifecycle.

---

## Если забыл / Простыми словами

Retention хранит окно истории, compaction хранит последнее состояние ключей, tombstone сообщает удаление.

### Аналогия и объяснение

Обычный архив выбрасывает старые страницы по дате. Сжатый справочник оставляет последнюю карточку каждого клиента. Карточка с пометкой «удалён» тоже должна пожить, чтобы опоздавшие читатели её увидели.
