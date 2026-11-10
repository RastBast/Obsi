---
tags:
  - go
  - interview
  - middle
  - runtime
  - netpoll
  - flashcards/Рантайм
deck: "Рантайм"
topic: "Network poller"
---

# Как Go обслуживает много сетевых соединений без потока на каждое ожидание?

## Вопрос

Что делает runtime network poller и почему блокирующий вызов `Read` не обязательно блокирует OS thread?

## Краткий ответ

Для поддерживаемых неблокирующих сетевых descriptor runtime регистрирует интерес в OS poller и паркует goroutine. Когда fd готов, poller делает goroutine runnable. API остаётся синхронным, а thread может исполнять другую работу.

## Развёрнутый ответ мидла

- На Linux основой служит epoll, на других ОС — соответствующие механизмы readiness/completion.
- Goroutine ожидает данные, но M/P не обязаны ждать вместе с ней.
- Deadlines интегрируются с runtime timers и пробуждают ожидающую операцию с ошибкой.
- Не каждый файл или syscall поддерживает netpoll одинаково; обычный blocking syscall обрабатывается другим путём scheduler.

## Развёрнутый ответ сеньора: все тонкости

- Poller сообщает готовность, а не гарантирует полный application message; TCP остаётся потоком.
- Масштаб ограничивают не только goroutine, но и fd limits, buffers, TLS state и память очередей.
- Cgo networking может обходить интеграцию runtime и удерживать threads.
- Высокая готовность fd не заменяет backpressure в application layer.

### Дополнительное техническое объяснение

Runtime переводит network fd в non-blocking mode, регистрирует readiness в platform poller и связывает descriptor с parked G. Event delivery помещает G в run queue; P продолжает scheduling без удержания M на blocking read.

## Если забыл / Простыми словами

Go показывает простой blocking API, но runtime паркует только goroutine и ждёт события ОС.

### Аналогия и объяснение

Вместо сотрудника у каждой двери есть один диспетчер: он следит, у какой двери появился сигнал, и будит только нужную задачу. Поэтому тысячи ожидающих соединений не требуют тысячи активно занятых потоков.
