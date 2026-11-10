---
tags:
  - go
  - interview
  - middle
  - flashcards/Рантайм
deck: "Рантайм"
topic: "Что делает sysmon в Go runtime?"
---

# Что делает sysmon в Go runtime?

## Вопрос

Какие фоновые задачи выполняет monitor runtime и почему он работает независимо от обычного выполнения goroutine на P?

## Краткий ответ

Sysmon — фоновый runtime monitor, который участвует в preemption долгих goroutine, network polling, retake P у долгих syscalls, запуске timers и контроле GC/scavenging-related событий. Точные обязанности и интервалы — детали версии runtime, не API языка.

## Развёрнутый ответ мидла

Планировщик должен обеспечивать прогресс, даже если один M ушёл в syscall или goroutine долго выполняет CPU loop. Sysmon обнаруживает такие состояния и помогает вернуть scheduling resources/поставить preemption request.

Он также помогает разбудить работу по timers/netpoll, когда нет обычного активного P, способного сделать это своевременно. Приложение не взаимодействует с sysmon напрямую.

## Развёрнутый ответ сеньора: все тонкости

Не следует объяснять точную latency фиксированным периодом sysmon: алгоритмы, safe points и async preemption менялись. Cgo, `LockOSThread`, syscall и STW взаимодействуют с scheduler по разным путям.

Высокая scheduler latency исследуется runtime trace и `/sched/latencies`, а не предположением «sysmon не успел». Проблема может быть CPU quota, runnable storm, locks или GC assist.

### Дополнительное техническое объяснение

Sysmon runs without a normal P and periodically checks runtime global/per-P state, invokes netpoll, retakes scheduler resources, requests preemption and coordinates time-based maintenance. Implementation is deliberately outside Go language guarantees.

## Если забыл / Простыми словами

Это ночной диспетчер runtime: он проверяет, не застрял ли исполнитель в системном вызове, не пора ли разбудить таймер и не занял ли кто-то процессор слишком надолго.

### Аналогия и объяснение

Обычные менеджеры заняты текущей работой, поэтому нужен независимый наблюдатель, способный заметить отсутствие прогресса. Но точное расписание наблюдателя нельзя использовать как бизнес-таймер.
