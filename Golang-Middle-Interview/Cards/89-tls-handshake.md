# Что происходит в TLS handshake?

Как клиент проверяет сервер, откуда берутся session keys и почему шифрование без проверки сертификата опасно?

===

@input

---

## Краткий ответ

Handshake согласует версию/алгоритмы, сервер предъявляет certificate chain и доказывает владение private key, стороны получают общие session keys через key exchange. Клиент проверяет hostname, сроки и доверенную цепочку. Без проверки возможна MITM-атака.

---

## Развёрнутый ответ мидла

- TLS защищает конфиденциальность и целостность канала, но не исправляет уязвимое приложение.
- SNI сообщает нужное hostname до выбора сертификата; ALPN согласует HTTP/2 и другие протоколы.
- Сертификат содержит public key/identity, private key не передаётся.
- mTLS дополнительно аутентифицирует клиента сертификатом.

---

## Развёрнутый ответ сеньора: все тонкости

- TLS 1.3 использует современные AEAD и forward secrecy; legacy versions/ciphers отключают по политике.
- Session resumption снижает latency, но ticket keys и срок имеют security implications.
- Clock skew ломает проверку сроков.
- `InsecureSkipVerify` нельзя использовать как обычное исправление self-signed certificate; настраивают trust roots/verification.

### Дополнительное техническое объяснение

TLS handshake аутентифицирует certificate chain/hostname, выполняет ephemeral key exchange и выводит traffic secrets. Record layer применяет AEAD integrity/confidentiality; ALPN/SNI участвуют в protocol и virtual-host negotiation.

---

## Если забыл / Простыми словами

Шифрование отвечает «никто не читает», сертификат — «я говорю с нужным сервером».

### Аналогия и объяснение

Стороны выбирают секретный язык и проверяют паспорт собеседника. Если паспорт не проверять, можно установить отличный шифр напрямую с мошенником.
