# 150 карточек для собеседования Go Middle

Коллекция состоит из **7 колод**. Каждая карточка содержит краткий ответ, ответ уровня middle, senior-тонкости и два финальных объяснения: простыми словами и техническими терминами.

Во всех карточках используется тег `#go` и один тег колоды вида `#flashcards/Название`.

## Колоды

- [`#flashcards/Go`](#go) — 38 карточек
- [`#flashcards/Сети`](#сети) — 21 карточка
- [`#flashcards/Алгоритмы`](#алгоритмы) — 15 карточек
- [`#flashcards/БД`](#бд) — 17 карточек
- [`#flashcards/Рантайм`](#рантайм) — 33 карточки
- [`#flashcards/Redis`](#redis) — 13 карточек
- [`#flashcards/Kafka`](#kafka) — 13 карточек

## Как учить

- Сначала ответь вслух, не открывая карточку.
- Сверься с кратким ответом и уложись в 30–40 секунд.
- Расскажи middle-версию за 2–3 минуты с примером.
- Senior-раздел оставь для уточняющих вопросов.
- В конце прочитай простое объяснение, затем повтори ту же мысль техническими терминами.
- Ставь галочку после двух правильных ответов в разные дни.

## Go

Тег колоды: `#flashcards/Go`

- [ ] [001. Чем массив отличается от среза?](Cards/01-array-vs-slice.md)
- [ ] [002. Как работает append и когда меняется исходный срез?](Cards/02-append-capacity-aliasing.md)
- [ ] [003. Как правильно копировать срезы и не удерживать лишнюю память?](Cards/03-copy-slices-and-memory-leaks.md)
- [ ] [004. Как устроена map в Go?](Cards/04-map-internals.md)
- [ ] [005. Чем nil map отличается от пустой map?](Cards/05-nil-map-comma-ok-and-sets.md)
- [ ] [006. Чем string, []byte и []rune отличаются в Go?](Cards/06-string-byte-rune-utf8.md)
- [ ] [007. Когда выбирать pointer receiver, а когда value receiver?](Cards/07-value-semantics-pointers-receivers.md)
- [ ] [008. Почему interface с nil-указателем не равен nil?](Cards/08-interface-nil-trap.md)
- [ ] [009. Как method set и embedding влияют на реализацию интерфейсов?](Cards/09-method-set-embedding.md)
- [ ] [010. Как работают type assertion и type switch?](Cards/10-type-assertion-and-type-switch.md)
- [ ] [011. Как работает defer?](Cards/11-defer-order-and-named-results.md)
- [ ] [012. Когда использовать panic и как работает recover?](Cards/12-panic-recover.md)
- [ ] [013. Как проектировать и оборачивать ошибки в Go?](Cards/13-errors-wrapping-is-as.md)
- [ ] [014. Как работают generics и constraints в Go?](Cards/14-generics-constraints.md)
- [ ] [015. В каком порядке инициализируются пакеты и зачем полезен zero value?](Cards/15-package-init-and-zero-value.md)
- [ ] [016. Как правильно использовать context.Context?](Cards/16-context-cancellation.md)
- [ ] [035. Как Go управляет модулями и зависимостями?](Cards/35-modules-internal-vendor-workspaces.md)
- [ ] [036. Как писать table-driven tests и subtests?](Cards/36-table-driven-tests-and-subtests.md)
- [ ] [037. Как тестировать зависимости: mock, stub или fake?](Cards/37-mocks-fakes-and-testability.md)
- [ ] [038. Как писать корректные benchmark в Go?](Cards/38-benchmarks.md)
- [ ] [039. Как искать CPU, memory и concurrency bottleneck?](Cards/39-pprof-and-trace.md)
- [ ] [040. Что дают fuzzing, go vet и статический анализ?](Cards/40-fuzz-vet-static-analysis.md)
- [ ] [048. Как разделять Go-сервис на пакеты?](Cards/48-package-architecture.md)
- [ ] [051. Какие типы в Go можно сравнивать?](Cards/51-struct-comparability.md)
- [ ] [052. Как использовать iota и типизированные константы?](Cards/52-iota-enums.md)
- [ ] [053. Чем make отличается от new?](Cards/53-make-vs-new.md)
- [ ] [054. Как замыкания захватывают переменные?](Cards/54-closures-capture.md)
- [ ] [055. Как работают variadic-параметры?](Cards/55-variadic-functions.md)
- [ ] [056. Когда применять паттерн functional options?](Cards/56-functional-options.md)
- [ ] [057. Почему io.Reader и io.Writer считаются сильными интерфейсами Go?](Cards/57-io-reader-writer.md)
- [ ] [058. Когда использовать bufio.Scanner, а когда bufio.Reader?](Cards/58-bufio-scanner-reader.md)
- [ ] [059. Как корректно работать со временем и Duration?](Cards/59-time-duration-monotonic.md)
- [ ] [060. Как эффективно и безопасно использовать regexp в Go?](Cards/60-regexp-compilation.md)
- [ ] [061. Как сортировать данные в Go?](Cards/61-sort-and-slices.md)
- [ ] [062. Как работают build tags и кросс-компиляция?](Cards/62-build-tags-cross-compilation.md)
- [ ] [063. Для чего нужен go generate?](Cards/63-go-generate-codegen.md)
- [ ] [064. Как работать с бинарными форматами и endianness?](Cards/64-binary-encoding-endianness.md)
- [ ] [065. Какие изменения Go-пакета ломают совместимость?](Cards/65-api-compatibility.md)

## Сети

Тег колоды: `#flashcards/Сети`

- [ ] [041. Как настроить production HTTP server и graceful shutdown?](Cards/41-http-server-timeouts-shutdown.md)
- [ ] [042. Как правильно использовать http.Client?](Cards/42-http-client-transport-reuse.md)
- [ ] [043. Какие ловушки есть у encoding/json?](Cards/43-json-encoding.md)
- [ ] [046. Как безопасно делать retries и идемпотентные операции?](Cards/46-idempotency-retries.md)
- [ ] [047. Чем отличаются logs, metrics и traces?](Cards/47-observability-logs-metrics-traces.md)
- [ ] [050. Как реализовать rate limiting и защиту от перегрузки?](Cards/50-rate-limiting-and-overload.md)
- [ ] [081. Зачем нужны модели OSI и TCP/IP?](Cards/81-osi-tcp-ip.md)
- [ ] [082. Как устанавливается и закрывается TCP-соединение?](Cards/82-tcp-handshake-close.md)
- [ ] [083. Чем flow control отличается от congestion control?](Cards/83-tcp-flow-congestion.md)
- [ ] [084. Чем UDP отличается от TCP?](Cards/84-udp.md)
- [ ] [085. Как работает DNS resolution и caching?](Cards/85-dns-resolution.md)
- [ ] [086. Как HTTP/1.1 определяет границы body и переиспользует соединения?](Cards/86-http1-keepalive-chunked.md)
- [ ] [087. Что даёт HTTP/2 multiplexing?](Cards/87-http2.md)
- [ ] [088. Чем HTTP/3 поверх QUIC отличается от HTTP/2 поверх TCP?](Cards/88-http3-quic.md)
- [ ] [089. Что происходит в TLS handshake?](Cards/89-tls-handshake.md)
- [ ] [090. Что такое subnet, CIDR и NAT?](Cards/90-ip-subnet-nat.md)
- [ ] [091. Чем L4 load balancer отличается от L7 reverse proxy?](Cards/91-load-balancer-reverse-proxy.md)
- [ ] [092. Как проектировать ресурсы и коды ответа REST API?](Cards/92-rest-resource-design.md)
- [ ] [093. Когда выбирать gRPC, а когда HTTP/JSON API?](Cards/93-grpc-vs-rest.md)
- [ ] [094. Чем WebSocket отличается от SSE и long polling?](Cards/94-websocket-sse.md)
- [ ] [095. Чем CORS отличается от CSRF?](Cards/95-cors-csrf.md)

## Алгоритмы

Тег колоды: `#flashcards/Алгоритмы`

- [ ] [096. Что означают O, Ω и Θ?](Cards/96-big-o.md)
- [ ] [097. Когда массив лучше связного списка?](Cards/97-array-linked-list.md)
- [ ] [098. Как реализовать stack, queue и deque?](Cards/98-stack-queue-deque.md)
- [ ] [099. Как хеш-таблица обрабатывает коллизии?](Cards/99-hash-table-collisions.md)
- [ ] [100. Как правильно реализовать бинарный поиск?](Cards/100-binary-search.md)
- [ ] [101. Сравните quicksort, mergesort и heapsort](Cards/101-sorting-algorithms.md)
- [ ] [102. Как работает бинарная куча?](Cards/102-heap-priority-queue.md)
- [ ] [103. Какие свойства у binary search tree?](Cards/103-binary-search-tree.md)
- [ ] [104. Почему базы используют B-tree, а не обычное бинарное дерево?](Cards/104-btree-database-index.md)
- [ ] [105. Чем BFS отличается от DFS?](Cards/105-bfs-dfs.md)
- [ ] [106. Как работает алгоритм Дейкстры?](Cards/106-dijkstra.md)
- [ ] [107. Как получить топологический порядок и обнаружить цикл?](Cards/107-topological-sort.md)
- [ ] [108. Как распознать задачу на динамическое программирование?](Cards/108-dynamic-programming.md)
- [ ] [109. Когда применять two pointers и sliding window?](Cards/109-two-pointers-sliding-window.md)
- [ ] [110. Как реализовать LRU cache за O(1)?](Cards/110-lru-cache.md)

## БД

Тег колоды: `#flashcards/БД`

- [ ] [044. Как работает пул соединений database/sql?](Cards/44-database-sql-pool.md)
- [ ] [045. Как правильно работать с SQL-транзакциями?](Cards/45-sql-transactions-isolation.md)
- [ ] [111. Как в общих чертах устроен PostgreSQL?](Cards/111-postgresql-architecture.md)
- [ ] [112. Когда PostgreSQL использует B-tree индекс?](Cards/112-postgresql-btree-index.md)
- [ ] [113. Как выбирать порядок полей составного индекса?](Cards/113-composite-index.md)
- [ ] [114. Как читать EXPLAIN ANALYZE?](Cards/114-explain-analyze.md)
- [ ] [115. Зачем PostgreSQL нужны VACUUM и autovacuum?](Cards/115-mvcc-vacuum.md)
- [ ] [116. Как PostgreSQL реализует isolation levels?](Cards/116-postgresql-isolation.md)
- [ ] [117. Какие блокировки есть в PostgreSQL и как возникают deadlocks?](Cards/117-postgresql-locks-deadlocks.md)
- [ ] [118. Для чего нужны SAVEPOINT и ROLLBACK TO?](Cards/118-savepoints.md)
- [ ] [119. Чем nested loop, hash join и merge join отличаются?](Cards/119-join-algorithms.md)
- [ ] [120. Зачем нормализовать схему БД?](Cards/120-normalization.md)
- [ ] [121. Почему инварианты нужно закреплять constraints в БД?](Cards/121-database-constraints.md)
- [ ] [122. Чем keyset pagination лучше OFFSET?](Cards/122-keyset-pagination.md)
- [ ] [123. Чем session, transaction и statement pooling отличаются?](Cards/123-pgbouncer-pooling.md)
- [ ] [124. Когда таблицу стоит партиционировать?](Cards/124-postgresql-partitioning.md)
- [ ] [125. Как WAL связан с replication и point-in-time recovery?](Cards/125-wal-replication-backup.md)

## Рантайм

Тег колоды: `#flashcards/Рантайм`

- [ ] [017. Чем goroutine отличается от системного потока?](Cards/17-goroutines-and-scheduler-basics.md)
- [ ] [018. Чем буферизированный канал отличается от небуферизированного?](Cards/18-buffered-and-unbuffered-channels.md)
- [ ] [019. Кто и когда должен закрывать канал?](Cards/19-closing-and-ranging-channels.md)
- [ ] [020. Как работает select и зачем nil-channel?](Cards/20-select-nil-channel-and-timeouts.md)
- [ ] [021. Когда использовать Mutex, а когда RWMutex?](Cards/21-mutex-vs-rwmutex.md)
- [ ] [022. Для чего нужны WaitGroup, Once и Cond?](Cards/22-waitgroup-once-cond.md)
- [ ] [023. Когда использовать atomic и что такое happens-before?](Cards/23-atomics-and-memory-model.md)
- [ ] [024. Что такое data race и как её искать?](Cards/24-data-races-and-race-detector.md)
- [ ] [025. Как возникают утечки goroutine и как их предотвращать?](Cards/25-goroutine-leaks-and-cancellation.md)
- [ ] [026. Как спроектировать worker pool с ограниченной конкуренцией?](Cards/26-worker-pool-bounded-concurrency.md)
- [ ] [027. Что такое pipeline, fan-out и fan-in?](Cards/27-pipelines-fan-in-fan-out.md)
- [ ] [028. Когда использовать errgroup и semaphore?](Cards/28-errgroup-and-semaphore.md)
- [ ] [029. Что размещается на стеке, а что в куче?](Cards/29-stack-heap-escape-analysis.md)
- [ ] [030. Как в общих чертах работает GC в Go?](Cards/30-garbage-collector.md)
- [ ] [031. Как устроен планировщик G-M-P?](Cards/31-gmp-scheduler.md)
- [ ] [032. Когда полезен sync.Pool и почему это не cache?](Cards/32-sync-pool.md)
- [ ] [033. Как layout структуры влияет на память и производительность?](Cards/33-memory-layout-and-false-sharing.md)
- [ ] [034. Когда оправданы reflect и unsafe?](Cards/34-reflection-and-unsafe.md)
- [ ] [066. Как Go обслуживает много сетевых соединений без потока на каждое ожидание?](Cards/66-network-poller.md)
- [ ] [067. Как растёт стек goroutine?](Cards/67-goroutine-stack-growth.md)
- [ ] [068. Как настраивать GOMEMLIMIT и GOGC?](Cards/68-gomemlimit-gogc.md)
- [ ] [069. Как в общих чертах устроен аллокатор Go?](Cards/69-runtime-allocator.md)
- [ ] [070. Зачем GC нужен write barrier?](Cards/70-gc-write-barrier.md)
- [ ] [071. Как найти lock contention и блокировки goroutine?](Cards/71-contention-profiling.md)
- [ ] [072. Как диагностировать deadlock в Go?](Cards/72-deadlock-diagnostics.md)
- [ ] [073. Чем livelock и starvation отличаются от deadlock?](Cards/73-livelock-starvation.md)
- [ ] [074. Когда использовать sync.Map?](Cards/74-sync-map.md)
- [ ] [075. Как публиковать immutable snapshot через atomic.Value?](Cards/75-atomic-value-snapshots.md)
- [ ] [076. Когда использовать context.WithCancelCause?](Cards/76-cancel-cause.md)
- [ ] [077. Как управлять Timer и Ticker без утечек и гонок?](Cards/77-timer-ticker-lifecycle.md)
- [ ] [078. Какие издержки и риски добавляет cgo?](Cards/78-cgo-costs.md)
- [ ] [079. Почему нельзя полагаться на finalizer для закрытия ресурсов?](Cards/79-finalizers-cleanup.md)
- [ ] [080. Как наблюдать и диагностировать runtime Go?](Cards/80-runtime-metrics-godebug.md)

## Redis

Тег колоды: `#flashcards/Redis`

- [ ] [049. Как спроектировать cache и защититься от stampede?](Cards/49-cache-ttl-stampede.md)
- [ ] [126. Какие структуры данных есть в Redis?](Cards/126-redis-data-types.md)
- [ ] [127. Чем RDB отличается от AOF?](Cards/127-redis-rdb-aof.md)
- [ ] [128. Чем expiration отличается от eviction?](Cards/128-redis-ttl-eviction.md)
- [ ] [129. Как выполнять атомарную логику в Redis?](Cards/129-redis-transactions-lua.md)
- [ ] [130. Чем pipeline отличается от transaction?](Cards/130-redis-pipelining.md)
- [ ] [131. Как реализовать lock в Redis и зачем fencing token?](Cards/131-redis-distributed-lock.md)
- [ ] [132. Как согласовывать Redis cache с БД?](Cards/132-redis-cache-consistency.md)
- [ ] [133. Чем опасны hot key и big key?](Cards/133-redis-hot-big-keys.md)
- [ ] [134. Чем Redis Pub/Sub отличается от Streams?](Cards/134-redis-pubsub-vs-streams.md)
- [ ] [135. Как работают consumer groups Redis Streams?](Cards/135-redis-stream-consumer-groups.md)
- [ ] [136. Как Redis Cluster распределяет keys?](Cards/136-redis-cluster-hash-slots.md)
- [ ] [137. Как Redis replication и Sentinel обеспечивают failover?](Cards/137-redis-sentinel-replication.md)

## Kafka

Тег колоды: `#flashcards/Kafka`

- [ ] [138. Что такое topic, partition, broker и record в Kafka?](Cards/138-kafka-broker-partition.md)
- [ ] [139. Как acks и idempotent producer влияют на надёжность?](Cards/139-kafka-producer-acks-idempotence.md)
- [ ] [140. Как key влияет на partition и порядок сообщений?](Cards/140-kafka-key-ordering.md)
- [ ] [141. Как consumer group распределяет partitions?](Cards/141-kafka-consumer-groups-rebalance.md)
- [ ] [142. Чем at-most-once, at-least-once и exactly-once отличаются?](Cards/142-kafka-offset-delivery.md)
- [ ] [143. Как работают Kafka transactions и read_committed?](Cards/143-kafka-transactions.md)
- [ ] [144. Чем time/size retention отличается от log compaction?](Cards/144-kafka-retention-compaction.md)
- [ ] [145. Что такое leader, follower и ISR?](Cards/145-kafka-isr-leader.md)
- [ ] [146. Как безопасно менять schema Kafka-событий?](Cards/146-kafka-schema-evolution.md)
- [ ] [147. Как обрабатывать ошибки consumer: retry topic или DLQ?](Cards/147-kafka-retries-dlq.md)
- [ ] [148. Как batching и compression влияют на Kafka throughput?](Cards/148-kafka-batching-backpressure.md)
- [ ] [149. Когда выбирать Kafka, RabbitMQ или Redis Streams?](Cards/149-kafka-vs-rabbitmq-redis-streams.md)
- [ ] [150. Как мониторить Kafka consumer lag и здоровье pipeline?](Cards/150-kafka-lag-observability.md)

## Режим повторения

1. **Новые карточки:** 5 в день.
2. **Первое повторение:** на следующий день.
3. **Второе повторение:** через 3 дня.
4. **Третье повторение:** через 7 дней.
5. **Контроль:** случайно выбери по 2 карточки из каждой колоды и ответь без подсказки.
