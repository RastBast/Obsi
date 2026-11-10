---
tags:
  - go
  - interview
  - middle
  - flashcards/Kafka
deck: "Kafka"
topic: "Как спланировать восстановление большого Kafka consumer lag?"
---

# Как спланировать восстановление большого Kafka consumer lag?

## Вопрос

Как оценить время догоняния и почему простое добавление consumers помогает только до числа partitions и capacity downstream?

## Краткий ответ

Consumer догоняет, только если processing rate μ стабильно выше incoming rate λ; приблизительное время — backlog/(μ−λ). Параллелизм ограничен partitions, а БД/API downstream могут стать bottleneck. Нужны headroom, временное снижение входа/стоимости обработки и контроль retention horizon.

## Развёрнутый ответ мидла

Смотрят lag и oldest-event age по partition, consume/produce rate, errors/retries, rebalance и processing latency. Находят hot partition или poison event. Масштабируют group до полезного числа partitions и workers, не нарушая ordering.

Batching и временное отключение необязательных side effects могут повысить μ по согласованной процедуре. Retention должна быть длиннее worst recovery, иначе непрочитанные segments удалятся.

## Развёрнутый ответ сеньора: все тонкости

Суммарный lag скрывает skew. Добавление partitions не перераспределяет старые records и меняет key mapping. Если downstream уже saturated, новые consumers только увеличат timeout/retry storm.

Recovery план учитывает autoscaling delay, quota, replica/network/disk и commit semantics. Replay большого окна может повторно вызвать устаревшие side effects; schema и business validity проверяют.

### Дополнительное техническое объяснение

Backlog dynamics: dL/dt=λ−μ. Stable drain требует μ>λ; service-rate variance и retries определяют tail. Capacity model строят per partition/shard and downstream constraint, сохраняя retention/RPO semantics.

## Если забыл / Простыми словами

Если каждую минуту приходит 100 писем, а команда разбирает 120, очередь уменьшается только на 20. Миллион писем нельзя догнать быстро, просто добавив людей, если папок мало или единственная касса БД уже перегружена.

### Аналогия и объяснение

Сначала останови причины замедления, затем добейся скорости выше входящего потока и посчитай реальное время. Отдельно проверь, что архив не уничтожит старые письма до их чтения.
