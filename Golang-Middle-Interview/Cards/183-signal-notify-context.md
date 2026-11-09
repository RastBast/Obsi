---
tags: [go, interview, middle, lifecycle, flashcards/Go]
topic: os/signal.NotifyContext
---

Как построить lifecycle Go-сервиса через signal.NotifyContext?::`signal.NotifyContext` создаёт context, отменяемый при SIGINT/SIGTERM. Корневой context передают server/workers, по отмене прекращают intake, делают bounded shutdown и ждут goroutines. `stop()` освобождает регистрацию сигналов.

# Как построить lifecycle Go-сервиса через signal.NotifyContext?

## Вопрос

Как связать Unix signal, graceful shutdown и ошибки фоновых goroutine?

## Краткий ответ

`signal.NotifyContext` создаёт context, отменяемый при SIGINT/SIGTERM. Корневой context передают server/workers, по отмене прекращают intake, делают bounded shutdown и ждут goroutines. `stop()` освобождает регистрацию сигналов.

## Развёрнутый ответ мидла

Используют errgroup для взаимной отмены server/workers, отдельный timeout context для drain и возвращают исходную ошибку запуска, а не маскируют её `context.Canceled`.

## Развёрнутый ответ сеньора: все тонкости

- SIGKILL обработать нельзя.
- Второй сигнал иногда должен форсировать exit, но диагностику сохраняют.
- Shutdown context не наследуют от уже отменённого root, иначе deadline сработает сразу.
- Signal behavior отличается на Windows/Unix и внутри orchestrator PID1.

## Если забыл: что это, зачем и где нужно

Один root context распространяет команду завершения, а отдельный deadline ограничивает drain.

## Подробное объяснение простыми словами

Сигнал нажимает общую кнопку «закрываемся». Каждый отдел перестаёт брать новую работу, заканчивает текущую и сообщает, что вышел, но всему закрытию дан конечный срок.

## Подробное объяснение техническими терминами

Signal subscription cancels root context and drives structured concurrency. Teardown uses independent timeout context, deterministic close order и join of owned goroutines/resources.
