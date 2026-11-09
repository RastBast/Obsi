---
tags: [go, interview, middle, docker, flashcards/Docker]
topic: COPY, ADD и .dockerignore
---

Чем COPY отличается от ADD и зачем .dockerignore?::COPY переносит локальные файлы из build context. ADD имеет дополнительные возможности вроде распаковки локального tar и получения URL, поэтому без необходимости предпочитают предсказуемый COPY. `.dockerignore` исключает лишние и секретные файлы из context.

# Чем COPY отличается от ADD и зачем .dockerignore?

## Вопрос

Почему `COPY . .` без фильтра опасен для cache, размера и безопасности?

## Краткий ответ

COPY переносит локальные файлы из build context. ADD имеет дополнительные возможности вроде распаковки локального tar и получения URL, поэтому без необходимости предпочитают предсказуемый COPY. `.dockerignore` исключает лишние и секретные файлы из context.

## Развёрнутый ответ мидла

Исключают `.git`, build outputs, editor cache, test artifacts, `.env` и credentials. Чем меньше context, тем быстрее передача builder и точнее cache invalidation.

## Развёрнутый ответ сеньора: все тонкости

- Файл, попавший в ранний layer, нельзя надёжно удалить последующим RUN: bytes остаются в history.
- Secrets передают BuildKit secret mount, а не COPY/ARG.
- Remote ADD скрывает fetch/checksum semantics; явный downloader с checksum понятнее.
- Context boundary не позволяет COPY произвольный путь вне context.

## Если забыл: что это, зачем и где нужно

Используй COPY и минимальный context; секреты вообще не должны входить в слои.

## Подробное объяснение простыми словами

Перед сборкой на завод отправляется коробка со всеми разрешёнными файлами. `.dockerignore` не даёт случайно положить туда пароль, историю Git и гигабайт мусора.

## Подробное объяснение техническими терминами

Build context является input graph для cache checksum. `.dockerignore` сокращает transmitted content и invalidation scope. Secret mounts предоставляют ephemeral credentials без сохранения в OCI layers/history.
