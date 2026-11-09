# Как правильно использовать http.Client?

Почему `http.Client` нужно переиспользовать, какие timeouts задавать и зачем читать/закрывать response body?

===

@input

---

## Краткий ответ

`Client` и особенно `Transport` предназначены для переиспользования: они держат connection pool. У запроса должен быть deadline/context. `resp.Body` всегда закрывают; для повторного использования соединения body обычно дочитывают до EOF, если это разумно и ограничено.

---

## Развёрнутый ответ мидла

```go
client := &http.Client{
    Timeout: 10 * time.Second,
    Transport: &http.Transport{
        MaxIdleConns:        100,
        MaxIdleConnsPerHost: 20,
        IdleConnTimeout:     90 * time.Second,
    },
}

req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
resp, err := client.Do(req)
if err != nil { return err }
defer resp.Body.Close()
```

HTTP status 500 не возвращается как `Do` error — transport выполнил запрос успешно, статус проверяет приложение. Body читают через limit, чтобы недоверенный сервер не исчерпал память.

Не создают новый Transport на каждый запрос: это теряет keep-alive и может исчерпать sockets.

---

## Развёрнутый ответ сеньора: все тонкости

`Client.Timeout` ограничивает общий цикл, включая redirects и чтение body. Более точные границы задают context и Transport: dial timeout, TLS handshake, response header timeout, expect-continue. Нужен целостный time budget, а не независимые таймеры, сумма которых превышает SLA.

При раннем отказе от большого body полное дренирование может быть дорого или опасно; закрытие пожертвует reuse конкретного соединения. Нельзя безлимитно копировать в `io.Discard`. Политика зависит от размера/доверия и версии HTTP.

Retry допустим только для подходящих transient errors и идемпотентной операции либо с idempotency key. Body запроса должен быть воспроизводим (`GetBody`/буфер/файл), попытки — ограничены общим deadline, backoff и jitter. Бездумный retry создаёт retry storm.

Transport безопасен для concurrent use. Настройки pool согласуют с concurrency и лимитами upstream. `MaxIdleConnsPerHost` не является общим лимитом активных соединений; при необходимости задают `MaxConnsPerHost`.

Redirect policy может передавать заголовки и credentials между hosts по правилам клиента; для чувствительных API задают `CheckRedirect`. Наблюдаемость можно добавлять через обёртку `RoundTripper`, не мутируя shared request небезопасно.

### Дополнительное техническое объяснение

`Client` и особенно `Transport` предназначены для переиспользования: они держат connection pool. У запроса должен быть deadline/context. `resp.Body` всегда закрывают; для повторного использования соединения body обычно дочитывают до EOF, если это разумно и ограничено.

`Client.Timeout` ограничивает общий цикл, включая redirects и чтение body. Более точные границы задают context и Transport: dial timeout, TLS handshake, response header timeout, expect-continue. Нужен целостный time budget, а не независимые таймеры, сумма которых превышает SLA.

При раннем отказе от большого body полное дренирование может быть дорого или опасно; закрытие пожертвует reuse конкретного соединения. Нельзя безлимитно копировать в `io.Discard`. Политика зависит от размера/доверия и версии HTTP.

---

## Если забыл / Простыми словами

Шпаргалка клиента: **переиспользуй Client/Transport, ставь deadline, проверяй status, ограничивай body, закрывай Body, retry только безопасно**.

### Аналогия и объяснение

Шпаргалка клиента: **переиспользуй Client/Transport, ставь deadline, проверяй status, ограничивай body, закрывай Body, retry только безопасно**.

Представь запрос как посылку, проходящую через несколько узлов. На каждом участке она может задержаться, потеряться или быть обработана повторно. Поэтому сетевой код обязан ограничивать ожидание, проверять результат и безопасно переживать частичные сбои.
