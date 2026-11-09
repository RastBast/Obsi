---
tags: [go, interview, middle, kafka, consumer, flashcards/Kafka]
topic: Consumer groups и rebalance
---

# Как consumer group распределяет partitions?

## Вопрос

Почему один partition назначается одному consumer внутри group и что происходит при rebalance?

## Краткий ответ

Consumers с одинаковым group ID совместно делят partitions; один partition в момент времени принадлежит одному member группы. При входе/выходе, изменении topic или timeout coordinator выполняет rebalance и меняет assignments. Consumers должны остановить старую работу и корректно commit-ить/передать состояние.

## Развёрнутый ответ мидла

- Consumers больше partitions простаивают.
- Heartbeats/session timeout обнаруживают умершего member.
- Долгая обработка без poll может вызвать removal по max poll interval.
- Cooperative rebalance уменьшает полную остановку, постепенно отзывая partitions.

## Развёрнутый ответ сеньора: все тонкости

- Stop-the-world rebalance увеличивает latency и duplicate window.
- Static membership снижает churn при кратких restart.
- Commit offset для отозванной partition требует координации с in-flight jobs.
- Внешнее per-partition state нужно flush/checkpoint до передачи новому owner.

## Если забыл: что это, зачем и где нужно

Group делит partitions между workers; rebalance — смена владельцев, требующая остановить старую обработку.

## Подробное объяснение простыми словами

Начальник раздаёт каждому сотруднику отдельные папки. Когда сотрудник ушёл или пришёл новый, папки перераспределяют. Старый сотрудник должен прекратить писать в отданную папку.

## Подробное объяснение техническими терминами

Group coordinator manages membership generations and partition assignment. Rebalance revokes/assigns ownership; heartbeat/poll liveness и generation-aware offset commits предотвращают stale member progress.
