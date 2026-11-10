---
tags:
  - go
  - interview
  - middle
  - docker
  - registry
  - flashcards/Docker
deck: "Docker"
topic: "Registry, tag и digest"
---

# Чем Docker tag отличается от digest?

## Вопрос

Как registry хранит layers/manifests и почему `latest` не является версией?

## Краткий ответ

Tag — изменяемое имя manifest, например `app:1.2`; его можно переназначить. Digest — content-addressed SHA-ссылка на конкретный manifest и неизменяемое содержимое. Для воспроизводимого deploy фиксируют digest, сохраняя удобный tag как metadata.

## Развёрнутый ответ мидла

- Registry дедуплицирует blobs по digest.
- Multi-platform manifest list выбирает image для architecture.
- `latest` — обычный tag без специальной гарантии новизны.
- Pull policy и локальный cache влияют на фактически запущенный image.

## Развёрнутый ответ сеньора: все тонкости

- Подпись связывает identity/provenance с digest, а не изменяемым tag.
- Retention/garbage collection registry не должны удалить используемый manifest.
- Private registry credentials имеют минимальные scopes и ротацию.
- SBOM и attestations дополняют vulnerability scanning.

### Дополнительное техническое объяснение

OCI registry stores content-addressed blobs and manifests. Mutable tag resolves to manifest digest; digest pinning provides deterministic artifact identity for deployment, signature verification and provenance.

## Если забыл / Простыми словами

Tag удобен человеку и двигается; digest точно фиксирует bytes.

### Аналогия и объяснение

Tag — наклейка «текущая версия», которую можно переклеить на другую коробку. Digest — отпечаток содержимого: другая коробка не получит тот же отпечаток.
