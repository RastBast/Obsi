---
tags:
  - go
  - interview
  - middle
  - docker
  - operations
  - flashcards/Docker
deck: "Docker"
topic: "HEALTHCHECK и restart policy"
---

# Чем Docker HEALTHCHECK отличается от restart policy?

## Вопрос

Почему живой PID ещё не означает готовность приложения и кто должен реагировать на unhealthy?

## Краткий ответ

HEALTHCHECK периодически помечает container healthy/unhealthy по команде, но сам Docker не обязательно перезапускает unhealthy container. Restart policy реагирует на завершение процесса/exit code. Оркестратор может использовать health отдельно.

## Развёрнутый ответ мидла

- Health command должна быть быстрой, локальной и иметь timeout.
- Start period учитывает прогрев.
- Restart `always/on-failure/unless-stopped` имеет разную семантику.
- Приложение при unrecoverable state лучше корректно завершает process, если supervisor должен рестартовать.

## Развёрнутый ответ сеньора: все тонкости

- Проверка всех downstream может создать cascade: краткий сбой БД перезапустит весь fleet.
- Liveness, readiness и startup — разные сигналы; Docker health объединяет их грубее Kubernetes.
- Restart loop требует backoff/лимитов и сохранения diagnostics.
- Health endpoint не раскрывает секреты и не выполняет дорогую работу.

### Дополнительное техническое объяснение

Container state machine tracks main process exit and optional health status independently. Supervisor restart policy consumes exit state; higher-level orchestrator может маршрутизировать/recreate based on health.

## Если забыл / Простыми словами

Health сообщает состояние, restart policy реагирует на остановку процесса.

### Аналогия и объяснение

Сотрудник может сидеть на месте, но не принимать клиентов. Проверка сообщает проблему, а правило перезапуска обычно срабатывает, когда сотрудник ушёл, а не просто получил плохую оценку.
