---
tags: [go, interview, middle, algorithms, hash, flashcards/Алгоритмы]
topic: Хеш-таблица и коллизии
---

# Как хеш-таблица обрабатывает коллизии?

## Вопрос

Почему разные ключи могут иметь один hash, что такое load factor и как separate chaining отличается от open addressing?

## Краткий ответ

Hash сжимает большое пространство ключей в конечное число позиций, поэтому коллизии неизбежны. Таблица хранит и проверяет сам ключ. Chaining размещает конфликтующие entries в связанных buckets; open addressing ищет другой slot по probe sequence. Рост снижает load factor.

## Развёрнутый ответ мидла

- Хороший hash равномерно распределяет реальные ключи и быстро вычисляется.
- Expected lookup близок к O(1), worst case O(n).
- Load factor влияет на число collisions/probes и память.
- Resize обычно O(n), но амортизируется или выполняется постепенно.

## Развёрнутый ответ сеньора: все тонкости

- Security-sensitive map нуждается в randomized hashing против collision attacks.
- Open addressing улучшает locality, но deletion требует tombstones/специального алгоритма.
- Hash equality не означает key equality; ключи сравнивают после hash match.
- Конкретная реализация Go map меняется и не является контрактом.

## Если забыл: что это, зачем и где нужно

Hash выбирает место, равенство подтверждает ключ, стратегия коллизий хранит несколько претендентов.

## Подробное объяснение простыми словами

Хеш — номер ящика, но двум людям может выпасть один номер. Поэтому на ящике всё равно проверяют имя, а при переполнении добавляют место или перестраивают шкаф.

## Подробное объяснение техническими терминами

Hash table maps key hash to bucket/probe sequence and resolves collision через chaining или open addressing. Expected complexity зависит от distribution и load factor; resize amortizes rehash cost.
