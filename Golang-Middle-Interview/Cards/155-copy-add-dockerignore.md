# Чем COPY отличается от ADD и зачем .dockerignore?

Почему `COPY . .` без фильтра опасен для cache, размера и безопасности?

===

@input

---

## Краткий ответ

COPY переносит локальные файлы из build context. ADD имеет дополнительные возможности вроде распаковки локального tar и получения URL, поэтому без необходимости предпочитают предсказуемый COPY. `.dockerignore` исключает лишние и секретные файлы из context.

---

## Развёрнутый ответ мидла

Исключают `.git`, build outputs, editor cache, test artifacts, `.env` и credentials. Чем меньше context, тем быстрее передача builder и точнее cache invalidation.

---

## Развёрнутый ответ сеньора: все тонкости

- Файл, попавший в ранний layer, нельзя надёжно удалить последующим RUN: bytes остаются в history.
- Secrets передают BuildKit secret mount, а не COPY/ARG.
- Remote ADD скрывает fetch/checksum semantics; явный downloader с checksum понятнее.
- Context boundary не позволяет COPY произвольный путь вне context.

### Дополнительное техническое объяснение

Build context является input graph для cache checksum. `.dockerignore` сокращает transmitted content и invalidation scope. Secret mounts предоставляют ephemeral credentials без сохранения в OCI layers/history.

---

## Если забыл / Простыми словами

Используй COPY и минимальный context; секреты вообще не должны входить в слои.

### Аналогия и объяснение

Перед сборкой на завод отправляется коробка со всеми разрешёнными файлами. `.dockerignore` не даёт случайно положить туда пароль, историю Git и гигабайт мусора.
