---
tags:
  - go
  - interview
  - middle
  - docker
  - signals
  - flashcards/Docker
deck: "Docker"
topic: "PID 1 и graceful shutdown"
---

# Почему PID 1 в container требует особого внимания?

## Вопрос

Как Docker останавливает container и зачем init process или `exec` в entrypoint script?

## Краткий ответ

Главный процесс container имеет PID 1 в namespace, получает stop signal и должен reap-ить дочерние процессы. Shell wrapper без exec может не передать SIGTERM. Go-сервис должен обработать сигнал, прекратить приём, завершить работу до stop timeout и выйти.

## Развёрнутый ответ мидла

Docker посылает configured stop signal, ждёт timeout, затем SIGKILL. Exec-form ENTRYPOINT делает приложение PID 1. Если нужны child processes, используют маленький init (`--init`) или корректный supervisor.

## Развёрнутый ответ сеньора: все тонкости

- SIGKILL нельзя обработать; deadline shutdown короче orchestrator grace period.
- `os/signal.NotifyContext` связывает сигнал с cancellation tree.
- Zombie reaping важен только при дочерних процессах, но wrapper часто создаёт их неожиданно.
- Сигнал и HTTP shutdown не гарантируют завершение detached goroutines без WaitGroup/errgroup.

### Дополнительное техническое объяснение

Runtime stop protocol сигнализирует namespace PID 1, затем применяет forced kill после grace timeout. Direct exec preserves signal delivery; init handles orphan adoption/SIGCHLD reaping.

## Если забыл / Простыми словами

Запускай binary напрямую и обрабатывай SIGTERM; wrapper завершай через exec.

### Аналогия и объяснение

Главный процесс — руководитель контейнера. Команда «закрываемся» приходит ему, и он должен остановить новых клиентов, дождаться текущих и вывести сотрудников. Если перед ним стоит глухой секретарь-shell, команда потеряется.
