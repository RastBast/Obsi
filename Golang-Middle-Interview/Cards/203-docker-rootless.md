# Что такое rootless Docker?

Как rootless mode уменьшает риск, какие Linux-механизмы использует и какие ограничения по сети, ports и cgroups нужно учитывать?

===

@input

---

## Краткий ответ

Rootless Docker запускает daemon и containers без root-привилегий host user, используя user namespaces и subordinate UID/GID mappings. Это уменьшает последствия компрометации daemon/container, но не отменяет hardening image и имеет ограничения платформы, privileged ports, networking и resource controllers.

---

## Развёрнутый ответ мидла

Rootless mode отличается от запуска только application process как non-root: во втором случае daemon всё ещё root. Для rootless нужны `newuidmap/newgidmap`, диапазоны `/etc/subuid` и `/etc/subgid`, а storage/network drivers работают через доступные непривилегированные механизмы.

Ports ниже системного порога обычно требуют дополнительной настройки или proxy. Host mounts всё равно подчиняются permissions и UID mapping. Volume ownership проверяют явно.

---

## Развёрнутый ответ сеньора: все тонкости

User namespace отображает container root в непривилегированный host ID, но kernel остаётся общим. Уязвимость kernel или неверно открытый host resource остаётся риском. Некоторые cgroup v2 limits зависят от systemd delegation; network path может использовать user-space forwarding с другой производительностью.

Rootless нельзя считать автоматической совместимостью со всеми Compose/Kubernetes сценариями. Нужны тесты CI, observability и понятный fallback.

### Дополнительное техническое объяснение

Rootless engine создаёт user namespace для daemon/runtime, использует subordinate identifier ranges, rootless networking и storage driver. Security benefit — отсутствие host UID 0 у control plane, а functional envelope определяется kernel, cgroup delegation и filesystem capabilities.

---

## Если забыл / Простыми словами

Обычный Docker-управляющий часто имеет мастер-ключ от host. Rootless запускает его как обычного пользователя: даже если злоумышленник захватит управление, у него меньше дверей. Но окно в общем kernel и специально выданные mounts всё ещё нужно защищать.

### Аналогия и объяснение

Это не отдельный дом, а арендатор без ключа от служебных помещений. Он безопаснее управляющего с мастер-ключом, но всё ещё живёт в том же здании и зависит от его фундамента.
