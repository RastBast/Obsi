---
tags: [go, interview, middle, network, grpc, flashcards/Сети]
topic: gRPC и REST
---

Какие преимущества дают protobuf, HTTP/2 streams и code generation, и где REST проще?::gRPC даёт строгую schema, generated clients, компактный protobuf и unary/streaming RPC поверх HTTP/2. Он удобен для внутренних typed сервисов. HTTP/JSON проще для браузеров, ручной отладки, публичных API и широкого tooling. Выбор зависит от потребителей и контракта.

# Когда выбирать gRPC, а когда HTTP/JSON API?

## Вопрос

Какие преимущества дают protobuf, HTTP/2 streams и code generation, и где REST проще?

## Краткий ответ

gRPC даёт строгую schema, generated clients, компактный protobuf и unary/streaming RPC поверх HTTP/2. Он удобен для внутренних typed сервисов. HTTP/JSON проще для браузеров, ручной отладки, публичных API и широкого tooling. Выбор зависит от потребителей и контракта.

## Развёрнутый ответ мидла

- gRPC имеет status codes и metadata, отличные от обычных HTTP status API.
- Deadline передают через context; сервер обязан прекращать работу после отмены.
- Protobuf field numbers нельзя переиспользовать после удаления.
- REST может иметь OpenAPI/codegen, поэтому типизация не уникальна gRPC.

## Развёрнутый ответ сеньора: все тонкости

- Streaming требует flow control, bounded buffers и lifecycle half-close.
- Browser обычно нуждается в gRPC-Web/proxy.
- Retry policy учитывает idempotency и commit point RPC.
- Schema evolution: добавление optional fields безопаснее смены типа/номера; unknown fields должны переживать промежуточные hops.

## Если забыл: что это, зачем и где нужно

gRPC — строгий RPC-контракт и streaming; REST/JSON — универсальная web-совместимость и понятность.

## Подробное объяснение простыми словами

gRPC похож на заранее напечатанные бланки для обеих сторон: быстро и меньше ошибок формы. JSON похож на универсальное письмо, которое легко прочитать браузером и человеком.

## Подробное объяснение техническими терминами

gRPC maps protobuf service definitions to generated stubs and HTTP/2 streams with deadlines, metadata and canonical status. REST uses HTTP resource semantics and textual representations; interoperability, schema governance и operational infrastructure определяют выбор.
