---
tags:
  - go
  - interview
  - middle
  - kubernetes
  - autoscaling
  - flashcards/Kubernetes
deck: "Kubernetes"
topic: "HPA, VPA и Cluster Autoscaler"
---

# Чем HPA, VPA и Cluster Autoscaler отличаются?

## Вопрос

Почему HPA по CPU зависит от requests и не решает мгновенный burst?

## Краткий ответ

HPA меняет число Pods по метрикам, VPA рекомендует или меняет requests одного Pod, Cluster Autoscaler меняет число nodes при unschedulable/excess capacity. Они действуют на разных уровнях и могут конфликтовать без координации.

## Развёрнутый ответ мидла

- CPU utilization HPA рассчитывается относительно request.
- Новому Pod нужны scheduling, image pull и startup time.
- Custom/external metrics могут отражать queue length или RPS.
- Stabilization/window policy предотвращает частое дрожание replicas.

## Развёрнутый ответ сеньора: все тонкости

- HPA не создаст capacity, если nodes заполнены; Cluster Autoscaler медленнее добавляет node.
- VPA restart/in-place semantics зависят от режима/version и могут конфликтовать с HPA по CPU/memory.
- Метрика должна коррелировать с нагрузкой до saturation.
- Масштабирование downstream и quota также ограничивают throughput.

### Дополнительное техническое объяснение

Autoscaling controllers reconcile replicas, resource recommendations и node groups from delayed metrics. Control-loop stability, provisioning latency и resource requests determine effective response.

## Если забыл / Простыми словами

HPA добавляет Pods, VPA меняет их размер, Cluster Autoscaler добавляет машины.

### Аналогия и объяснение

Можно нанять больше кассиров, дать каждому больший стол или построить новый зал. Новый зал строится долго, поэтому очередь и запас мощности всё равно нужны.
