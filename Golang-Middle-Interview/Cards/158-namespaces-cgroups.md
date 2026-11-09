# Как namespaces и cgroups создают container?

Какие задачи решают namespaces и cgroups и почему container всё равно разделяет kernel?

===

@input

---

## Краткий ответ

Linux namespaces изолируют видимость процессов, сети, mounts, hostname, IPC и users. Cgroups учитывают и ограничивают CPU, memory, PIDs и другие ресурсы. Container runtime комбинирует их с filesystem и security policy.

---

## Развёрнутый ответ мидла

- PID namespace даёт отдельное дерево процессов.
- Network namespace — interfaces/routes/ports.
- Mount namespace — своё дерево mounts.
- Cgroup memory limit приводит к OOM policy, CPU quota — к throttling.

---

## Развёрнутый ответ сеньора: все тонкости

- Namespace isolation не является security boundary уровня отдельной VM; kernel vulnerability затрагивает host.
- User namespace сопоставляет container IDs с непривилегированными host IDs.
- Cgroup v2 имеет unified hierarchy и отличается интерфейсами от v1.
- Приложение должно учитывать quota при GOMAXPROCS, pool sizes и memory limit.

### Дополнительное техническое объяснение

Runtime creates namespaced process tree and attaches it to cgroup controllers. Isolation is kernel-mediated, while resource accounting/enforcement uses quota, weight, limits и OOM behavior.

---

## Если забыл / Простыми словами

Namespaces отвечают «что видно», cgroups — «сколько ресурсов можно использовать».

### Аналогия и объяснение

Одному жильцу показывают только его комнаты, а счётчики ограничивают электричество и воду. Но фундамент и ядро дома остаются общими.
