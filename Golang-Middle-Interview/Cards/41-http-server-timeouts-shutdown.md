---
tags: [golang, interview, middle, http, backend]
topic: HTTP server
---

# Как настроить production HTTP server и graceful shutdown?

## Вопрос

Почему не стоит ограничиваться `http.ListenAndServe`, какие timeouts нужны серверу и как корректно завершить обработку запросов?

## Краткий ответ

Создают `http.Server` с явными timeouts и limits, запускают его, по сигналу перестают принимать новые соединения и вызывают `Shutdown(ctx)`, который ждёт активные обработчики до deadline. Handler должен уважать `r.Context()`.

## Развёрнутый ответ мидла

```go
srv := &http.Server{
    Addr:              ":8080",
    Handler:           mux,
    ReadHeaderTimeout: 5 * time.Second,
    ReadTimeout:       15 * time.Second,
    WriteTimeout:      30 * time.Second,
    IdleTimeout:       60 * time.Second,
}

serveErr := make(chan error, 1)
go func() {
    serveErr <- srv.ListenAndServe()
}()

select {
case <-sig:
    ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
    defer cancel()
    if err := srv.Shutdown(ctx); err != nil { return err }
case err := <-serveErr:
    if !errors.Is(err, http.ErrServerClosed) { return err }
}
```

На request body ставят разумный лимит (`http.MaxBytesReader`), проверяют методы/content type, закрывают ресурсы. Ошибки handler переводят в единый безопасный ответ.

## Развёрнутый ответ сеньора: все тонкости

Timeouts защищают разные фазы и должны соответствовать streaming/API. Слишком жёсткий `WriteTimeout` может ломать долгие stream; защита slowloris обычно начинается с `ReadHeaderTimeout` и ограничения заголовков. За reverse proxy нужно согласовать deadline всех hop, иначе нижний сервис продолжит работу после ухода клиента.

`Shutdown` закрывает listeners и idle connections, затем ждёт активные. Он не ждёт произвольные фоновые goroutine и не всегда автоматически управляет hijacked/WebSocket connections; их регистрируют и закрывают отдельно. После истечения deadline применяют `Close` по принятой политике.

Оркестрация readiness важна: сначала снять instance из балансировки/вернуть not-ready, дать propagation delay при необходимости, затем drain. Liveness не должна падать слишком рано и провоцировать жёсткое убийство до завершения.

Handler не должен запускать неуправляемую работу после ответа. Request context отменяется при disconnect/завершении, поэтому долгоживущая задача должна быть передана надёжной очереди с собственным lifecycle, а не просто detached goroutine.

Recovery middleware логирует stack и возвращает 500, но не раскрывает внутренности. Также нужны TLS/proxy header policy, лимиты, observability и защита административных endpoints.

## Если забыл: что это, зачем и где нужно

Production server — это не только handler: **timeouts, лимиты, signal, readiness, `Shutdown` с deadline и context внутри запросов**. Graceful означает перестать принимать и ограниченно дождаться текущих.
