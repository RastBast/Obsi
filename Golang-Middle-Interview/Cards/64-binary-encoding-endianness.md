---
tags: [go, interview, middle, encoding, flashcards/Go]
topic: Binary encoding и endian
---

# Как работать с бинарными форматами и endianness?

## Вопрос

Что такое little-endian и big-endian, почему нельзя отправлять память структуры как wire format и как помогает `encoding/binary`?

## Краткий ответ

Endianness задаёт порядок байтов многобайтового числа. Wire format должен явно определить порядок, размеры и поля. Прямое копирование памяти структуры непереносимо из-за padding, архитектуры, указателей и layout; используют `binary.ByteOrder` или специализированный протокол.

## Развёрнутый ответ мидла

```go
buf := make([]byte, 4)
binary.BigEndian.PutUint32(buf, value)
v := binary.BigEndian.Uint32(buf)
```

- Network byte order традиционно big-endian, но конкретный протокол решает сам.
- Перед чтением проверяют достаточную длину, иначе helpers могут panic.
- Variable-length fields требуют явной длины и лимита.
- `binary.Read/Write` удобны, но ручная упаковка часто яснее и контролирует allocation.

## Развёрнутый ответ сеньора: все тонкости

- Parsers должны защищаться от integer overflow при вычислении offset/length.
- Версионирование требует возможности пропускать неизвестные поля или чёткого framing.
- Checksums не заменяют аутентификацию; для недоверенного трафика нужен защищённый протокол.
- `unsafe` zero-copy нарушает alignment/lifetime и часто экономит меньше, чем стоит риск.

## Если забыл: что это, зачем и где нужно

Байты не знают тип числа. Протокол обязан договориться о порядке, размере и границах каждого значения.

## Подробное объяснение простыми словами

Число из нескольких байтов можно записать начиная со старшего или младшего края. Если отправитель и получатель выбрали разные правила, они увидят разные числа. Поэтому формат записывает правило явно, а не копирует внутренности программы.

## Подробное объяснение техническими терминами

Serialization отделяет platform-dependent in-memory representation от stable wire representation. `encoding/binary.ByteOrder` выполняет deterministic integer encoding; parser валидирует framing, bounds, overflow и version compatibility до доступа к buffer offsets.
