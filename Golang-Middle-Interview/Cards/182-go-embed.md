# Как работает go:embed?

Какие типы поддерживаются и какие данные нельзя бездумно встраивать?

===

@input

---

## Краткий ответ

Директива embed включает выбранные файлы в binary на этапе сборки и инициализирует string, `[]byte` или `embed.FS`. Pattern вычисляется относительно package directory. Это удобно для templates/static assets, но увеличивает binary и требует пересборки при изменении.

---

## Развёрнутый ответ мидла

```go
//go:embed templates/*.html
var templates embed.FS
```

Package импортирует `embed`, path не выходит через `..`, hidden files и pattern rules учитывают документацию.

---

## Развёрнутый ответ сеньора: все тонкости

- Секрет нельзя встраивать: он окажется в artifact и истории release.
- Большие assets повышают distribution/startup memory tradeoffs.
- `embed.FS` read-only и реализует `fs.FS`; subdirectory получают через `fs.Sub`.
- Reproducibility требует детерминированного содержимого generated assets до build.

### Дополнительное техническое объяснение

Compiler/build tool resolves embed patterns and emits file bytes into program data, exposing immutable `fs.FS` view. Artifact size, confidentiality and release coupling становятся частью контракта.

---

## Если забыл / Простыми словами

Embed пакует файлы внутрь бинарника как read-only ресурсы.

### Аналогия и объяснение

Шаблоны кладут прямо в чемодан приложения, поэтому рядом не нужна отдельная папка. Но заменить шаблон без нового чемодана уже нельзя.
