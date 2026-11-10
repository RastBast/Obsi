---
tags:
  - go
  - interview
  - middle
  - kubernetes
  - storage
  - flashcards/Kubernetes
deck: "Kubernetes"
topic: "PV, PVC и StorageClass"
---

# Чем PV отличается от PVC и StorageClass?

## Вопрос

Как access modes, reclaim policy и topology влияют на persistent workload?

## Краткий ответ

PVC — запрос workload на storage, PV — конкретный cluster storage resource, StorageClass описывает provisioner и параметры динамического создания. Binding связывает PVC с подходящим PV, а Pod монтирует claim.

## Развёрнутый ответ мидла

- Access modes RWO/ROX/RWX описывают возможности provider, не универсальную блокировку приложения.
- Reclaim Retain/Delete определяет судьбу volume после claim.
- StatefulSet обычно создаёт отдельный claim на replica.
- Snapshot/backup зависит от CSI/provider и application consistency.

## Развёрнутый ответ сеньора: все тонкости

- Zone-bound volume ограничивает nodes; WaitForFirstConsumer учитывает scheduling topology.
- Filesystem resize и volume expansion требуют поддержки driver/class/filesystem.
- RWO может означать один node, а не один Pod.
- DB crash consistency не равна transaction-consistent backup без quiesce/protocol.

### Дополнительное техническое объяснение

Kubernetes storage API decouples claim from CSI-backed persistent volume. Binding/provisioning honors capacity, access mode, class and topology; reclaim and snapshot semantics define data lifecycle.

## Если забыл / Простыми словами

PVC просит хранилище, PV представляет его, StorageClass умеет создавать подходящее.

### Аналогия и объяснение

Заявка говорит «нужен склад такого размера», склад — реальное помещение, а класс — каталог поставщиков и условий. После удаления арендатора склад можно удалить или сохранить по политике.
