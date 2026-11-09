---
tags: [go, interview, middle, kafka, replication, flashcards/Kafka]
topic: ISR и replication Kafka
---

Как replication factor, ISR и min.insync.replicas влияют на durability и availability?::Leader partition принимает produce/fetch, followers копируют log. ISR — replicas, достаточно синхронные с leader. При `acks=all` запись подтверждается по правилам ISR; `min.insync.replicas` запрещает запись, если надёжных копий слишком мало, жертвуя availability ради durability.

# Что такое leader, follower и ISR?

## Вопрос

Как replication factor, ISR и min.insync.replicas влияют на durability и availability?

## Краткий ответ

Leader partition принимает produce/fetch, followers копируют log. ISR — replicas, достаточно синхронные с leader. При `acks=all` запись подтверждается по правилам ISR; `min.insync.replicas` запрещает запись, если надёжных копий слишком мало, жертвуя availability ради durability.

## Развёрнутый ответ мидла

- Replication factor 3 переживает не любые три сбоя, а ограниченное число при корректном размещении.
- Out-of-sync replica исключается из ISR и догоняет позже.
- Leader election выбирает replica; unclean election может потерять acknowledged data.
- Rack awareness разводит replicas по failure domains.

## Развёрнутый ответ сеньора: все тонкости

- `acks=all` без достаточного min ISR может дать слабее ожидаемую гарантию.
- Disk/network lag сжимает ISR и вызывает produce errors до полного падения broker.
- Preferred leader imbalance создаёт hotspot.
- Recovery time зависит от размера log и bandwidth replication.

## Если забыл: что это, зачем и где нужно

ISR — копии, которые можно считать актуальными; минимальное число определяет, писать дальше или остановиться.

## Подробное объяснение простыми словами

Главный журнал принимают один писарь, несколько помощников копируют. Если рядом остался только один актуальный экземпляр, можно продолжить быстро, но риск потери выше; строгая настройка остановит приём.

## Подробное объяснение техническими терминами

Partition replication tracks follower offsets/liveness and ISR membership. Produce acknowledgment plus min ISR establishes required replica set; leader election/fencing controls continuity under broker failure.
