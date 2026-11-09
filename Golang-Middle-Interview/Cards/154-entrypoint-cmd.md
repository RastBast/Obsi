---
tags: [go, interview, middle, docker, flashcards/Docker]
topic: ENTRYPOINT и CMD
---

Чем ENTRYPOINT отличается от CMD?::ENTRYPOINT задаёт основной executable container, CMD — аргументы по умолчанию или команду, если ENTRYPOINT отсутствует. Exec form запускает процесс напрямую; shell form добавляет `/bin/sh -c` и меняет обработку сигналов и переменных.

# Чем ENTRYPOINT отличается от CMD?

## Вопрос

Как комбинируются ENTRYPOINT и CMD и почему для Go-сервиса предпочтительна exec form?

## Краткий ответ

ENTRYPOINT задаёт основной executable container, CMD — аргументы по умолчанию или команду, если ENTRYPOINT отсутствует. Exec form запускает процесс напрямую; shell form добавляет `/bin/sh -c` и меняет обработку сигналов и переменных.

## Развёрнутый ответ мидла

```dockerfile
ENTRYPOINT ["/app"]
CMD ["serve", "--port=8080"]
```

Аргументы `docker run image other` заменят CMD, сохраняя ENTRYPOINT. `--entrypoint` меняет entrypoint явно.

## Развёрнутый ответ сеньора: все тонкости

- Shell form может сделать shell PID 1, и signal не всегда корректно дойдёт до приложения.
- JSON exec form не выполняет shell expansion `$VAR`; конфигурацию читает приложение или wrapper с `exec`.
- Wrapper должен завершиться через `exec "$@"`, иначе появляются signal/zombie проблемы.
- API image должен иметь предсказуемый override contract для orchestrator.

## Если забыл: что это, зачем и где нужно

ENTRYPOINT — программа, CMD — её стандартные аргументы.

## Подробное объяснение простыми словами

ENTRYPOINT выбирает приложение, CMD предлагает стандартный режим запуска. Пользователь может заменить режим, не меняя само приложение.

## Подробное объяснение техническими терминами

OCI config хранит Entrypoint и Cmd arrays, которые runtime объединяет. Exec form сохраняет direct process and signal semantics; shell form вводит interpreter process и shell parsing.
