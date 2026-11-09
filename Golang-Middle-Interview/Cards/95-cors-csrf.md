---
tags: [go, interview, middle, network, security, flashcards/Сети]
topic: CORS и CSRF
---

# Чем CORS отличается от CSRF?

## Вопрос

Что ограничивает browser same-origin policy, зачем preflight и почему CORS не защищает сервер от CSRF?

## Краткий ответ

CORS разрешает browser JavaScript читать cross-origin response по явной политике сервера. CSRF заставляет browser отправить аутентифицированный запрос на чужой сайт, обычно с cookies. Защита CSRF — SameSite cookies, token и Origin/Referer validation; CORS решает другую задачу.

## Развёрнутый ответ мидла

- Origin состоит из scheme, host и port.
- Preflight OPTIONS проверяет нестандартный method/headers до основного запроса.
- При credentials нельзя использовать wildcard origin; разрешённый origin валидируют по allowlist.
- Non-browser clients CORS не ограничивает вообще.

## Развёрнутый ответ сеньора: все тонкости

- Простые запросы могут быть отправлены без preflight, даже если JS не получит response; side effect уже возможен.
- XSS обходит многие CSRF-защиты, поэтому это отдельный класс риска.
- Cookie Domain/Path/Secure/HttpOnly/SameSite составляют единый security contract.
- Нельзя отражать произвольный Origin вместе с credentials.

## Если забыл: что это, зачем и где нужно

CORS контролирует чтение ответа браузерным JS, CSRF — нежелательную отправку запроса с чужой сессией.

## Подробное объяснение простыми словами

CORS решает, кому браузер покажет ответ. CSRF — ситуация, когда злоумышленник подсовывает уже вошедшему пользователю кнопку, отправляющую действие от его имени. Скрыть ответ недостаточно: перевод уже мог выполниться.

## Подробное объяснение техническими терминами

Same-origin policy ограничивает script access, а CORS headers делегируют cross-origin read capability. CSRF использует ambient credentials; mitigation связывает request с trusted origin/session через SameSite, anti-CSRF token и origin validation.
