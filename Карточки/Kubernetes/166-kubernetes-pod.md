---
tags:
  - go
  - interview
  - middle
  - kubernetes
  - flashcards/Kubernetes
deck: "Kubernetes"
topic: "Pod"
---

# Что такое Pod в Kubernetes?

## Вопрос

Что разделяют containers внутри Pod и почему Pod не равен отдельной VM?

## Краткий ответ

Pod — минимальная scheduling unit: один или несколько containers с общими network namespace/IP/ports и подключёнными volumes. Containers в Pod общаются через localhost. Pod считается заменяемым и обычно создаётся controller, а не вручную.

## Развёрнутый ответ мидла

- Main container и sidecar совместно планируются на один node.
- Init containers выполняются последовательно до обычных containers.
- Restart containers происходит внутри Pod по policy, но новый Pod получает новый UID/IP.
- Данные вне ephemeral lifecycle хранят в persistent/external storage.

## Развёрнутый ответ сеньора: все тонкости

- Sidecar должен иметь согласованный startup/shutdown lifecycle и resource requests.
- Один Pod — failure/scaling boundary; несвязанные сервисы не объединяют.
- Pod status — агрегат phases/conditions/container states и не является простым health boolean.
- Static Pods и mirror Pods — специальные control-plane сценарии.

### Дополнительное техническое объяснение

Kubelet реализует Pod sandbox с shared network namespace и volume mounts. Scheduler назначает Pod целиком node; controller восстанавливает desired replicas созданием новых Pod identities.

## Если забыл / Простыми словами

Pod — группа тесно связанных containers, которые всегда живут и масштабируются вместе.

### Аналогия и объяснение

Pod похож на одну квартиру: жильцы делят адрес и кладовую и переезжают вместе. Если сервисы не обязаны всегда жить рядом, им нужны разные квартиры.
