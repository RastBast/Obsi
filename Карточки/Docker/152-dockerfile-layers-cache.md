---
tags:
  - go
  - interview
  - middle
  - docker
  - flashcards/Docker
deck: "Docker"
topic: "Dockerfile layers и cache"
---

# Как Dockerfile формирует слои и build cache?

## Вопрос

Почему порядок инструкций влияет на скорость сборки и размер image?

## Краткий ответ

Инструкции Dockerfile создают build steps и обычно filesystem layers. Cache переиспользует результат, пока инструкция и её входы не изменились. Стабильные дорогие шаги размещают раньше, часто меняющиеся COPY — позже.

## Развёрнутый ответ мидла

```dockerfile
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o /app ./cmd/app
```

Изменение исходника не инвалидирует download dependencies. Связанные `apt update && apt install` выполняют в одном RUN и очищают package cache внутри того же слоя.

## Развёрнутый ответ сеньора: все тонкости

- Удаление файла в следующем слое не убирает bytes из предыдущего.
- BuildKit cache mounts ускоряют compiler/package caches без включения их в final layer.
- Cache key учитывает build args, mounts и metadata по правилам builder.
- Минимальный размер не должен ухудшать patchability, debugging и supply-chain policy.

### Дополнительное техническое объяснение

Layered build использует content-addressed cache graph. Cache invalidation распространяется на downstream vertices; instruction ordering и scoped build context максимизируют hit rate и уменьшают duplicated bytes.

## Если забыл / Простыми словами

Сначала копируй редко меняющиеся dependency manifests, затем исходники.

### Аналогия и объяснение

Сборка похожа на лестницу сохранений: изменение ступени заставляет перестроить её и всё выше. Поэтому тяжёлые стабильные шаги ставят внизу, а часто меняющийся код — наверху.
