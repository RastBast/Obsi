---
tags:
  - go
  - interview
  - middle
  - types
  - flashcards/Go
deck: "Go"
topic: "Type alias и defined type"
---

# Чем type alias отличается от нового defined type?

## Вопрос

Когда использовать `type A = B`, а когда `type A B`?

## Краткий ответ

Alias `type A = B` даёт другое имя тому же типу: identity и method set остаются B. `type A B` создаёт новый defined type с тем же underlying type, отдельным method set и необходимостью явных conversions.

## Развёрнутый ответ мидла

Alias полезен для migration/совместимости между packages. Defined type выражает доменный смысл: `type UserID string`, запрещая случайно смешать его с обычной строкой без conversion.

## Развёрнутый ответ сеньора: все тонкости

- Defined type не наследует методы underlying named type.
- Assignability для нетипизированных constants и named values различается.
- Alias публичного типа сохраняет identity, но может раскрыть dependency как часть API.
- Generics constraint `~string` допускает defined types с underlying string.

### Дополнительное техническое объяснение

Type alias preserves type identity. Type definition introduces distinct named type with underlying representation B, separate method set and explicit conversion rules, enabling compile-time domain separation.

## Если забыл / Простыми словами

Знак `=` означает то же самое имя; без `=` появляется новый тип.

### Аналогия и объяснение

Alias — прозвище одного человека. Defined type — новый человек в такой же одежде: внешне похож, но документы и методы у него свои.
