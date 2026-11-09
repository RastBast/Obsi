---
tags: [go, interview, middle, docker, flashcards/Docker]
topic: Docker image и container
---

Чем Docker image отличается от container?::Image — неизменяемый шаблон из слоёв с файловой системой и metadata. Container — запущенный или остановленный экземпляр image с собственным writable layer, namespace и настройками runtime. Удаление container не меняет image.

# Чем Docker image отличается от container?

## Вопрос

Чем Docker image отличается от container и где сохраняются изменения файловой системы процесса?

## Краткий ответ

Image — неизменяемый шаблон из слоёв с файловой системой и metadata. Container — запущенный или остановленный экземпляр image с собственным writable layer, namespace и настройками runtime. Удаление container не меняет image.

## Развёрнутый ответ мидла

- Один image может породить множество containers.
- Запись процесса попадает в writable layer container, если путь не подключён как volume.
- Container не является виртуальной машиной: он разделяет kernel host.
- Долговечные данные не хранят только в writable layer; используют volume или внешнее хранилище.

## Развёрнутый ответ сеньора: все тонкости

- Image адресуется tag или immutable digest; tag может быть переназначен.
- Copy-on-write overlay снижает дублирование, но write-heavy workload может требовать volume.
- Остановленный container сохраняет writable layer до удаления, но это не backup.
- Isolation зависит от namespaces, cgroups, capabilities, seccomp и конфигурации runtime.

## Если забыл: что это, зачем и где нужно

Image — рецепт и заготовка, container — конкретный запущенный экземпляр.

## Подробное объяснение простыми словами

Image похож на форму для печенья: сама форма не меняется, сколько бы экземпляров ни сделали. Container — отдельное печенье с собственными изменениями. Важные данные нужно вынести из временного экземпляра.

## Подробное объяснение техническими терминами

OCI image состоит из content-addressed read-only layers и config. Runtime создаёт container bundle, mount namespace и writable copy-on-write layer, затем запускает process с заданными isolation/resource controls.
