# Как CPU quota container влияет на GOMAXPROCS?

Почему видимые host CPUs и реально доступные cores могут различаться?

===

@input

---

## Краткий ответ

GOMAXPROCS задаёт число P для одновременного Go-кода. Если оно сильно выше доступной CPU quota, runtime создаёт лишнюю конкуренцию и попадает в throttling, повышая tail latency. Современный Go учитывает container limits, но версию и метрики нужно проверять.

---

## Развёрнутый ответ мидла

CPU request/weight и hard quota — разные настройки. Наблюдают cgroup throttled time, utilization относительно quota, runnable goroutines и latency, а не только host CPU percent.

---

## Развёрнутый ответ сеньора: все тонкости

- Fractional quota приводит к периодическому throttling, не к «половине постоянного ядра».
- CPU-bound и I/O-bound workloads реагируют по-разному.
- Автонастройка менялась между версиями Go/Kubernetes environment.
- Пулы workers согласуют с downstream, а не равняют механически GOMAXPROCS.

### Дополнительное техническое объяснение

GOMAXPROCS controls P count; cgroup CPU quota/period enforces runtime budget. Oversubscription increases runnable queues, context switching and quota throttling; tuning is version- and workload-dependent.

---

## Если забыл / Простыми словами

Параллелизм runtime должен соответствовать CPU-бюджету container, а не размеру host.

### Аналогия и объяснение

В здании видно 64 стола, но арендовано только два. Если посадить 64 работников, они будут постоянно делить два места и терять время на пересадки.
