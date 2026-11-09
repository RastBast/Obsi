# Что такое KRaft в Kafka?

Как metadata quorum на Raft заменяет ZooKeeper и какие роли выполняют controller и broker?

===

@input

---

## Краткий ответ

KRaft хранит metadata Kafka в replicated Raft log, управляемом controller quorum, без ZooKeeper. Brokers обслуживают data partitions и регистрируются у controllers. Active controller применяет metadata records; quorum обеспечивает leader election и согласованность control plane.

---

## Развёрнутый ответ мидла

Controller voters имеют стабильные IDs/endpoints и требуют majority для progress. В production controller role часто отделяют от broker на крупных clusters, хотя combined mode удобен для development.

Metadata включает topics, partitions, replicas, configs и registrations. Broker failure/partition leader election проходят через KRaft control plane. Data records по-прежнему хранятся в partition logs brokers — KRaft не реплицирует пользовательские сообщения вместо обычной replication.

---

## Развёрнутый ответ сеньора: все тонкости

Quorum из трёх controllers переживает один отказ, из пяти — два; слишком много voters повышает coordination cost. Нужны независимые failure domains, backups/config и мониторинг election/metadata lag.

Migration с ZooKeeper зависит от версии и официального procedure; нельзя смешивать режимы произвольно. Controller listener/security и broker listener имеют отдельную конфигурацию.

### Дополнительное техническое объяснение

KRaft uses Raft-based metadata log with leader controller and committed records replicated to voter majority. Brokers maintain metadata image from log/snapshots. Control-plane quorum semantics separate from ISR replication of data partitions.

---

## Если забыл / Простыми словами

Раньше правила и список разделов Kafka хранил отдельный ZooKeeper. Теперь несколько controllers ведут собственный согласованный журнал и выбирают одного главного редактора.

### Аналогия и объяснение

KRaft — журнал управления складом, а partition logs — сами товары. Надёжность журнала управления и копирование товаров связаны, но это разные механизмы и разные кворумы.
