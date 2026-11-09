---
tags:
  - go
  - interview
  - middle
  - docker
  - security
  - flashcards/Docker
deck: "Docker"
topic: "Безопасность container"
---

# Как уменьшить привилегии Docker container?

## Вопрос

Какие hardening-настройки важнее простого «маленького image»?

## Краткий ответ

Запускают non-root user, удаляют лишние Linux capabilities, включают read-only root filesystem, seccomp/AppArmor/SELinux, не монтируют Docker socket и host paths без необходимости. Image минимизируют, сканируют и фиксируют digest.

## Развёрнутый ответ мидла

- `USER` задают в image или runtime.
- Writable directories подключают отдельно с минимальными permissions.
- Secrets не кладут в ENV/image; используют secret store/mount.
- Регулярно обновляют base image и пересобирают binary.

## Развёрнутый ответ сеньора: все тонкости

- Root внутри container с user namespace и без него имеет разный риск, но принцип least privilege остаётся.
- `--privileged`, host PID/network и Docker socket почти снимают isolation.
- CVE scanner даёт сигнал, а exploitability и patch SLA требуют процесса.
- Подпись/provenance подтверждают происхождение, но не отсутствие уязвимости.

### Дополнительное техническое объяснение

Defense in depth сочетает UID isolation, capability bounding, syscall MAC/filtering, immutable rootfs и controlled mounts. Supply-chain controls дополняют runtime least privilege.

## Если забыл / Простыми словами

Container по умолчанию не security magic; убирай каждую ненужную возможность и доступ host.

### Аналогия и объяснение

Даже если приложение взломали, у него должны быть ключи только от своей маленькой комнаты, а не от всего здания. Чем меньше инструментов и дверей, тем меньше ущерб.
