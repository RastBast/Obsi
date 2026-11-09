# Чем TCP keepalive отличается от application heartbeat?

Какие сбои обнаруживает каждый механизм и почему одного keepalive часто недостаточно для контроля здоровья соединения?

===

@input

---

## Краткий ответ

TCP keepalive — kernel probes для обнаружения давно не отвечающего peer/path у idle connection; интервалы часто велики и platform-specific. Application heartbeat — сообщение протокола с выбранным SLA, способное подтвердить, что event loop и бизнес-протокол отвечают. Оба требуют timeout и реакции.

---

## Развёрнутый ответ мидла

TCP соединение может выглядеть established после исчезновения peer, пока не будет I/O или keepalive timeout. Application ping/pong быстрее обнаруживает broken/зависший канал и поддерживает NAT/load balancer mapping.

Heartbeat interval должен быть меньше инфраструктурного idle timeout, но не создавать лишнюю нагрузку. Несколько пропусков обычно надёжнее одного для сетевого jitter.

---

## Развёрнутый ответ сеньора: все тонкости

Успешный TCP ACK подтверждает получение bytes kernel, а не обработку application. Application heartbeat может зависнуть за длинной очередью и дать сигнал saturation. Одновременные heartbeats миллионов clients создают синхронный burst — используют jitter.

Mobile/NAT paths расходуют battery/state; interval выбирают по требованиям. Detection без reconnect/backoff/fencing protocol неполна.

### Дополнительное техническое объяснение

SO_KEEPALIVE использует TCP probes после idle с OS-configured idle/interval/count. Application heartbeat находится внутри protocol framing и измеряет end-to-end liveness до нужного processing layer. Failure detector остаётся probabilistic в asynchronous network.

---

## Если забыл / Простыми словами

TCP keepalive спрашивает: «телефонная линия ещё существует?». Application heartbeat спрашивает: «приложение на другом конце слышит и отвечает?». Живая линия не гарантирует, что оператор не завис.

### Аналогия и объяснение

Проверка должна соответствовать уровню обещания. Если нужно лишь убрать мёртвые sockets — хватит transport. Если нужен живой подписчик с задержкой до 10 секунд — нужен heartbeat протокола с таким бюджетом.
