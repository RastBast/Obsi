---
tags: [go, interview, middle, docker, storage, flashcards/Docker]
topic: Volumes, bind mounts и tmpfs
---

Чем Docker volume отличается от bind mount и tmpfs?::Volume управляется Docker и хранится вне writable layer. Bind mount подключает конкретный host path и тесно связан с host. tmpfs хранит данные в памяти и исчезает после остановки. Выбор зависит от долговечности, переносимости и безопасности.

# Чем Docker volume отличается от bind mount и tmpfs?

## Вопрос

Где хранить данные БД, исходники разработки и временные секреты?

## Краткий ответ

Volume управляется Docker и хранится вне writable layer. Bind mount подключает конкретный host path и тесно связан с host. tmpfs хранит данные в памяти и исчезает после остановки. Выбор зависит от долговечности, переносимости и безопасности.

## Развёрнутый ответ мидла

- БД обычно использует named volume или внешнее storage.
- Bind mount удобен для live source code в development.
- Read-only mount уменьшает случайные изменения.
- Backup должен копировать согласованное состояние, а не только каталог работающей БД.

## Развёрнутый ответ сеньора: все тонкости

- UID/GID и permissions должны совпасть между process и mounted filesystem.
- Mount скрывает файлы image в той же точке.
- Filesystem semantics/performance отличаются на Docker Desktop и network storage.
- Secrets лучше передавать специализированным secret mount, не обычным долговечным volume.

## Если забыл: что это, зачем и где нужно

Volume — управляемое постоянное хранилище, bind — путь host, tmpfs — временная память.

## Подробное объяснение простыми словами

Встроенный слой контейнера — черновик, volume — отдельный склад, bind mount — выбранная папка хозяина, tmpfs — доска, которую сотрут после выключения.

## Подробное объяснение техническими терминами

Mount types подключаются в container mount namespace и обходят overlay writable layer. Lifecycle, backing filesystem, ownership и persistence semantics определяют durability и portability.
