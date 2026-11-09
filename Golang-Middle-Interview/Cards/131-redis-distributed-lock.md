# Как реализовать lock в Redis и зачем fencing token?

Почему `SET key token NX PX ttl` и проверяемое удаление лучше SETNX+DEL, и какие проблемы остаются?

===

@input

---

## Краткий ответ

Lock создают атомарным SET с уникальным owner token и TTL. Освобождают Lua-операцией «удали, только если token мой», чтобы старый owner не удалил новый lock. Но истёкший owner может продолжать работу; fencing token на защищаемом ресурсе отвергает устаревшие операции.

---

## Развёрнутый ответ мидла

- TTL предотвращает вечный lock после crash, но должен учитывать длительность работы.
- Renewal требует проверки ownership и прекращения работы при потере lease.
- Retry acquisition использует jitter/deadline.
- Lock не заменяет unique constraint/transaction, если ресурс умеет атомарность сам.

---

## Развёрнутый ответ сеньора: все тонкости

- GC pause/network partition может пережить TTL, создавая двух «владельцев» во времени.
- Fencing token — монотонный номер, который storage сравнивает с последним принятым.
- Failover/replication semantics влияют на гарантию lock; Redlock имеет спорные assumptions.
- Для correctness-critical coordination используют систему с формализованным consensus/lease contract.

### Дополнительное техническое объяснение

Redis lease uses conditional write, owner identity и expiration. Mutual exclusion under pauses/partitions недостаточно для linearizable resource access; monotonically increasing fencing tokens enforce stale-writer rejection downstream.

---

## Если забыл / Простыми словами

Уникальный token защищает release, TTL — crash, fencing — ресурс от запоздавшего старого владельца.

### Аналогия и объяснение

Аренда ключа истекла, но старый работник мог проснуться и продолжить. Новый номер талона позволяет складу отвергнуть команду со старым номером, даже если работник считает себя владельцем.
