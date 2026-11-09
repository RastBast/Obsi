# Как ограничивать ресурсы и собирать логи container?

Что происходит при превышении CPU/memory и почему файлы логов внутри container — плохой default?

===

@input

---

## Краткий ответ

CPU quota/weight, memory и PIDs limits задают через cgroups. Приложение пишет структурированные логи в stdout/stderr, runtime logging driver их собирает. Неограниченный log и отсутствие memory headroom могут заполнить disk или вызвать OOM.

---

## Развёрнутый ответ мидла

- CPU throttling замедляет, memory limit может завершить process через OOM.
- Go настраивает GOMEMLIMIT с запасом относительно cgroup limit.
- Log rotation/size policy обязательна на host.
- Метрики включают throttling, RSS, OOM, restart и disk usage.

---

## Развёрнутый ответ сеньора: все тонкости

- Memory включает heap, stacks, mmap, cgo и page cache по правилам cgroup.
- CPU limit в cores и CPU request/weight — разные модели.
- Blocking log driver способен замедлить application; nonblocking может терять logs.
- Core dump/profile тоже расходуют ephemeral disk и содержат sensitive data.

### Дополнительное техническое объяснение

Cgroup controllers enforce quota/limit and expose pressure/throttling counters. Container logging captures stdio through configured driver with backpressure/drop and rotation semantics.

---

## Если забыл / Простыми словами

Limits защищают host, а stdout/stderr отдаёт ротацию и доставку инфраструктуре.

### Аналогия и объяснение

Контейнеру задают бюджет процессора, памяти и числа работников. Отчёты он сдаёт наружу, где их вращают и хранят; иначе собственный временный шкаф переполнится.
