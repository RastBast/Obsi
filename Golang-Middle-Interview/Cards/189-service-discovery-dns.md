# Как DNS-based service discovery переживает смену endpoints?

Почему одно разрешение имени при старте недостаточно для динамического окружения?

===

@input

---

## Краткий ответ

Service name резолвится в один или несколько адресов с TTL. Client должен обновлять resolution, балансировать адреса и убирать failed endpoints. Долгоживущий connection может пережить TTL, поэтому discovery и connection lifecycle координируют.

---

## Развёрнутый ответ мидла

- DNS cache может принадлежать OS, runtime, library или proxy.
- TTL задаёт верхнюю подсказку хранения, но application pool может удерживать connection дольше.
- Resolver errors и empty answer требуют retry/backoff.
- Health-aware load balancing не следует автоматически из DNS.

---

## Развёрнутый ответ сеньора: все тонкости

- Client-side discovery распределяет сложность по SDK; proxy-side централизует её.
- SRV даёт port/priority/weight, но поддержка клиентов различается.
- Stale endpoint во время rollout должен корректно drain/отказывать.
- Discovery outage не должен мгновенно выбрасывать все last-known-good endpoints без политики.

### Дополнительное техническое объяснение

Discovery maps logical authority to dynamic endpoint set. Resolver TTL/cache, load-balancer subchannels and connection aging jointly determine convergence and stale endpoint exposure.

---

## Если забыл / Простыми словами

Имя меняется медленнее endpoints; client обязан периодически обновлять карту и connections.

### Аналогия и объяснение

Справочник обновил адрес магазина, но такси уже едет по старому адресу. Нужно не только перечитать справочник, но и заменить уже открытые маршруты.
