---
tags: [go, interview, middle, build, flashcards/Go]
topic: Build constraints и cross compilation
---

# Как работают build tags и кросс-компиляция?

## Вопрос

Как ограничить файл платформой или тегом, что задают `GOOS` и `GOARCH` и какие ограничения добавляет cgo?

## Краткий ответ

Build constraints `//go:build` и суффиксы файлов выбирают исходники для конкретной сборки. `GOOS` задаёт ОС, `GOARCH` — архитектуру. Pure Go обычно легко кросс-компилируется; cgo требует подходящий C toolchain и совместимые библиотеки.

## Развёрнутый ответ мидла

```go
//go:build linux && amd64
```

Constraint размещают в начале файла с пустой строкой до package clause. Суффиксы `_linux.go`, `_windows.go`, `_amd64.go` также участвуют в выборе.

```bash
GOOS=linux GOARCH=amd64 go build ./cmd/app
```

Build tags полезны для platform implementation, integration tests и optional features, но скрытые комбинации должны проверяться CI.

## Развёрнутый ответ сеньора: все тонкости

- Пользовательские теги передают `-tags`; их комбинации способны породить отсутствующие или дублирующиеся symbol definitions.
- `CGO_ENABLED=0` меняет доступность реализаций и иногда поведение DNS/user lookup.
- Target architecture может требовать уровни вроде `GOAMD64`; производительность и совместимость CPU учитывают при релизе.
- Build constraints не должны заменять понятный runtime configuration без причины.

## Если забыл: что это, зачем и где нужно

Теги решают, какие файлы компилировать. GOOS/GOARCH решают, для какой платформы строится бинарник.

## Подробное объяснение простыми словами

Один проект может иметь разные детали для Linux и Windows. Перед сборкой Go отбирает только подходящие файлы, как набор деталей для нужной модели. Если вариант никогда не собирается в CI, поломка останется незаметной.

## Подробное объяснение техническими терминами

Build constraints вычисляются toolchain до type checking package. Target tuple GOOS/GOARCH управляет predefined tags и code generation backend. Cgo нарушает простую hermetic cross compilation, поскольку требует target C compiler, headers и ABI-compatible libraries.
