---
tags: [go, interview, middle, postgresql, wal, flashcards/БД]
topic: WAL, replication и backup
---

Чем physical replication отличается от logical, что такое replication slot и почему replica не является backup?::WAL описывает изменения страниц/транзакций для crash recovery. Physical replica воспроизводит WAL кластера, logical декодирует изменения таблиц для выбранных публикаций. Slot удерживает WAL до consumer. Backup плюс архив WAL позволяет PITR. Реплика повторит ошибочное удаление, поэтому не заменяет независимый backup.

# Как WAL связан с replication и point-in-time recovery?

## Вопрос

Чем physical replication отличается от logical, что такое replication slot и почему replica не является backup?

## Краткий ответ

WAL описывает изменения страниц/транзакций для crash recovery. Physical replica воспроизводит WAL кластера, logical декодирует изменения таблиц для выбранных публикаций. Slot удерживает WAL до consumer. Backup плюс архив WAL позволяет PITR. Реплика повторит ошибочное удаление, поэтому не заменяет независимый backup.

## Развёрнутый ответ мидла

- Synchronous replication может ждать подтверждение replica и повышает durability ценой latency/availability.
- Async replica имеет lag и может потерять последние commits при failover.
- Slot без живого consumer способен заполнить disk удержанным WAL.
- Restore регулярно тестируют; наличие файлов backup не доказывает восстановимость.

## Развёрнутый ответ сеньора: все тонкости

- Failover требует fencing старого primary, иначе split brain.
- Read replica возвращает stale data; read-after-write маршрутизируют осознанно.
- Logical replication не переносит автоматически все DDL/sequences/large objects одинаково.
- RPO определяет допустимую потерю, RTO — время восстановления; архитектура следует этим целям.

## Если забыл: что это, зачем и где нужно

WAL — журнал для повтора, replica — живая копия, backup — независимая точка восстановления.

## Подробное объяснение простыми словами

Копировщик в реальном времени повторит и полезную запись, и случайное удаление. Архивный снимок и журнал позволяют вернуться к моменту перед ошибкой. Но это работает только после настоящей проверки восстановления.

## Подробное объяснение техническими терминами

WAL обеспечивает write-ahead durability и redo. Streaming physical replication replays records, logical decoding emits relation changes. PITR combines base backup with continuous WAL archive under defined RPO/RTO.
