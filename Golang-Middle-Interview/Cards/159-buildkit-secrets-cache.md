# Как передавать секреты в Docker build безопасно?

Почему build args не подходят для credentials и чем secret mount отличается от cache mount?

===

@input

---

## Краткий ответ

Не используют COPY или ARG для токенов: они могут остаться в layers/history. BuildKit secret/SSH mounts доступны только конкретному RUN и не попадают в итоговый image. Cache mount отдельно сохраняет dependency cache без включения в layer.

---

## Развёрнутый ответ мидла

```dockerfile
RUN --mount=type=secret,id=token \
    TOKEN=$(cat /run/secrets/token) ./fetch-private
RUN --mount=type=cache,target=/go/pkg/mod go mod download
```

CI передаёт secret через builder API, а не файл в context.

---

## Развёрнутый ответ сеньора: все тонкости

- Команда не должна скопировать secret в output или напечатать в log.
- Cache scope/sharing mode важны при параллельных builds.
- Remote builder имеет собственную trust boundary.
- Supply-chain policy фиксирует provenance, base digest и доступ generator к сети.

### Дополнительное техническое объяснение

BuildKit LLB mounts separate ephemeral secret/SSH inputs and persistent cache directories from committed rootfs diff. Это предотвращает credential persistence при корректном step behavior.

---

## Если забыл / Простыми словами

Secret mount — временный секрет для шага, cache mount — повторно используемый ускоритель.

### Аналогия и объяснение

Ключ дают мастеру только на время одной операции и забирают до упаковки товара. Ящик с инструментами можно оставить для следующей сборки, но в товар он не попадает.
