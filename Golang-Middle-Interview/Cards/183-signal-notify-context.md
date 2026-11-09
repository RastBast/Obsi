# Как построить lifecycle Go-сервиса через signal.NotifyContext?

Как связать Unix signal, graceful shutdown и ошибки фоновых goroutine?

===

@input

---

## Краткий ответ

`signal.NotifyContext` создаёт context, отменяемый при SIGINT/SIGTERM. Корневой context передают server/workers, по отмене прекращают intake, делают bounded shutdown и ждут goroutines. `stop()` освобождает регистрацию сигналов.

---

## Развёрнутый ответ мидла

Используют errgroup для взаимной отмены server/workers, отдельный timeout context для drain и возвращают исходную ошибку запуска, а не маскируют её `context.Canceled`.

---

## Развёрнутый ответ сеньора: все тонкости

- SIGKILL обработать нельзя.
- Второй сигнал иногда должен форсировать exit, но диагностику сохраняют.
- Shutdown context не наследуют от уже отменённого root, иначе deadline сработает сразу.
- Signal behavior отличается на Windows/Unix и внутри orchestrator PID1.

### Дополнительное техническое объяснение

Signal subscription cancels root context and drives structured concurrency. Teardown uses independent timeout context, deterministic close order и join of owned goroutines/resources.

---

## Если забыл / Простыми словами

Один root context распространяет команду завершения, а отдельный deadline ограничивает drain.

### Аналогия и объяснение

Сигнал нажимает общую кнопку «закрываемся». Каждый отдел перестаёт брать новую работу, заканчивает текущую и сообщает, что вышел, но всему закрытию дан конечный срок.
