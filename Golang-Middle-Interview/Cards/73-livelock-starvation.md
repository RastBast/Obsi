# Чем livelock и starvation отличаются от deadlock?

Как программа может активно работать, но не продвигаться, и как отсутствие fairness создаёт starvation?

===

@input

---

## Краткий ответ

При deadlock участники заблокированы. При livelock они меняют состояние и повторяют действия, но взаимно мешают прогрессу. Starvation означает, что конкретный участник долго не получает ресурс, хотя система в целом работает.

---

## Развёрнутый ответ мидла

- Одинаковый retry без jitter может синхронно сталкивать workers снова и снова.
- Цикл с `default` в select способен съедать CPU и вытеснять полезную работу.
- Приоритетная очередь без aging может никогда не обслужить низкий приоритет.
- Метрики throughput и per-request latency помогают отличить активность от прогресса.

---

## Развёрнутый ответ сеньора: все тонкости

- Scheduler и sync primitives не дают бизнес-гарантии строгой fairness.
- Randomized backoff/jitter разрывает симметрию, но требует bounded deadline.
- Lock-free algorithm может быть lock-free для системы, но не wait-free для каждой goroutine.
- Решение проверяют adversarial load test, а не только average latency.

### Дополнительное техническое объяснение

Liveness properties включают global progress и per-operation progress. Livelock сохраняет state transitions без completion; starvation нарушает bounded waiting. Backoff, jitter, fair queuing и admission control улучшают progress guarantees.

---

## Если забыл / Простыми словами

Deadlock стоит, livelock суетится без результата, starvation оставляет кого-то без очереди.

### Аналогия и объяснение

Два человека в коридоре могут одновременно шагать в одну сторону, затем одновременно в другую и так не разойтись — это livelock. Если все постоянно проходят перед одним человеком, он голодает, хотя дверь работает.
