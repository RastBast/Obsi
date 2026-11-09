---
tags:
  - go
  - interview
  - middle
  - flashcards/Docker
deck: "Docker"
topic: "Что такое OCI image и container runtime?"
---

# Что такое OCI image и container runtime?

## Вопрос

Какие роли выполняют image specification, runtime specification, containerd и низкоуровневый runtime вроде runc?

## Краткий ответ

OCI стандартизирует image format/distribution и runtime bundle/config. Высокоуровневый runtime вроде containerd управляет images, snapshots, lifecycle и CRI-интеграцией; низкоуровневый `runc` создаёт namespaces/cgroups и запускает process по OCI Runtime Spec. Docker добавляет build, API и UX поверх этих уровней.

## Развёрнутый ответ мидла

Image состоит из manifest, config и content-addressed layers. После pull runtime распаковывает snapshot, формирует OCI bundle с `config.json` и root filesystem, затем shim/low-level runtime создаёт container process.

Разделение объясняет, почему Kubernetes может использовать containerd/CRI-O без Docker Engine и всё равно запускать OCI images. Registry хранит manifests/blobs, а digest фиксирует конкретный artifact.

## Развёрнутый ответ сеньора: все тонкости

CRI — Kubernetes gRPC-интерфейс к runtime, OCI — спецификации artifact/process; это разные уровни. Shim позволяет daemon перезапускаться без немедленного уничтожения containers и управляет stdio/exit. Snapshotters определяют overlay/lazy-pull behavior.

RuntimeClass может выбрать другой handler, например sandboxed runtime. Совместимость OCI не означает одинаковую security/performance семантику всех implementations.

### Дополнительное техническое объяснение

OCI Image Spec описывает descriptor graph и rootfs diff layers; Distribution Spec — registry API; Runtime Spec — process, mounts, namespaces, hooks и resources. Container manager materializes bundle и делегирует create/start/kill/delete low-level runtime.

## Если забыл / Простыми словами

OCI — общий стандарт чертежа и инструкции запуска. Registry — склад деталей, containerd — заведующий складом и жизненным циклом, runc — мастер, который реально собирает изоляцию и включает процесс.

### Аналогия и объяснение

Если Docker исчезнет, стандартный контейнерный образ всё равно можно запустить другим совместимым инструментом. Именно разделение стандартов и runtime-слоёв делает экосистему взаимозаменяемой.
