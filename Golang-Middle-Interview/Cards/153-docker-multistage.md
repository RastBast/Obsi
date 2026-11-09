# Зачем нужен multi-stage Docker build?

Как multi-stage сборка помогает Go-сервису и что нужно учесть при выборе финального image?

===

@input

---

## Краткий ответ

Multi-stage build отделяет компиляцию от runtime image. Builder содержит toolchain и исходники, а финальный stage получает только бинарник и необходимые runtime-файлы. Это уменьшает image и attack surface.

---

## Развёрнутый ответ мидла

```dockerfile
FROM golang:1.24 AS build
WORKDIR /src
COPY . .
RUN CGO_ENABLED=0 go build -o /out/app ./cmd/app

FROM gcr.io/distroless/static-debian12
COPY --from=build /out/app /app
ENTRYPOINT ["/app"]
```

Нужны CA certificates, timezone data и другие runtime assets, если приложение их использует.

---

## Развёрнутый ответ сеньора: все тонкости

- `scratch` подходит только действительно self-contained binary; cgo требует compatible libc/libraries.
- Distroless снижает shell/tools, но усложняет exec-debugging.
- Build reproducibility включает pinned base digest, module verification и build metadata.
- Не копируют credentials, module cache и весь builder filesystem в final stage.

### Дополнительное техническое объяснение

Multi-stage OCI build создаёт отдельные stage rootfs и выполняет selective `COPY --from`. Final artifact исключает compiler/toolchain и уменьшает CVE surface, transfer size и runtime privileges.

---

## Если забыл / Простыми словами

Компилируй в большом stage, запускай только результат в маленьком.

### Аналогия и объяснение

Для изготовления продукта нужен цех с инструментами, но покупателю не нужен весь цех. В коробку кладут только готовый бинарник и необходимые сертификаты.
