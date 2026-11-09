# Что гарантирует PodDisruptionBudget?

Как `minAvailable` и `maxUnavailable` влияют на voluntary disruption и почему PDB не является гарантией общей доступности?

===

@input

---

## Краткий ответ

PDB ограничивает число Pods выбранного workload, которые Kubernetes разрешит одновременно вывести при voluntary disruptions через Eviction API, например drain/upgrade. Он не предотвращает node crash, OOM, прямое удаление Pod и не создаёт дополнительные replicas.

---

## Развёрнутый ответ мидла

PDB выбирает Pods selector-ом и задаёт либо `minAvailable`, либо `maxUnavailable`. Node drain использует eviction и может ждать, пока disruption budget разрешит выселение. Deployment replicas/readiness должны позволять сохранить бюджет.

Слишком строгий PDB, например `minAvailable: 1` для единственного Pod, блокирует обслуживание node. Для quorum systems бюджет согласуют с правилами кворума.

---

## Развёрнутый ответ сеньора: все тонкости

Unhealthy Pod eviction policy и поведение менялись/расширялись версиями Kubernetes. PDB учитывает expected/healthy counts по controller scale, но не гарантирует, что ready Pod действительно обслуживает SLA.

Cluster Autoscaler и upgrades могут остановиться из-за PDB. Direct `kubectl delete pod`, controller rollout и involuntary failures имеют другую семантику. Нужны topology spread и достаточное число replicas.

### Дополнительное техническое объяснение

Disruption controller рассчитывает `disruptionsAllowed` из desired healthy count и observed readiness. Eviction admission декрементирует budget для voluntary operation. PDB — policy gate control plane, не fault-tolerance mechanism.

---

## Если забыл / Простыми словами

PDB говорит ремонтной бригаде: «не закрывайте больше одной кассы одновременно». Но он не остановит пожар и не построит новую кассу. Если касса всего одна, слишком строгий запрет не даст ремонтировать помещение.

### Аналогия и объяснение

Доступность получается из нескольких вещей: достаточных replicas, распределения по nodes/zones, readiness и корректного приложения. PDB защищает только плановые выселения внутри этой системы.
