---
tags: [go, interview, middle, algorithms, strings, flashcards/Алгоритмы]
topic: Trie
---

Что такое trie и когда оно лучше hash map?::Trie хранит строки по символам/байтам на путях от корня. Поиск prefix занимает O(L), где L — длина ключа, и естественно поддерживает autocomplete. Цена — много nodes/pointers и память; hash map проще для точного lookup.

# Что такое trie и когда оно лучше hash map?

## Вопрос

Каковы сложности поиска/вставки и какие варианты уменьшают память?

## Краткий ответ

Trie хранит строки по символам/байтам на путях от корня. Поиск prefix занимает O(L), где L — длина ключа, и естественно поддерживает autocomplete. Цена — много nodes/pointers и память; hash map проще для точного lookup.

## Развёрнутый ответ мидла

Каждый node хранит children и признак terminal. Поиск всех слов prefix сначала находит node prefix, затем обходит subtree. Radix tree сжимает цепочки с одним child в строковые edges.

## Развёрнутый ответ сеньора: все тонкости

- Нужно выбрать bytes/runes/graphemes и нормализацию Unicode.
- Fixed alphabet array быстрее, но тратит память; map sparse.
- Для immutable dictionary используют compact automata/FST.
- Concurrent mutation требует locks/copy-on-write.

## Если забыл: что это, зачем и где нужно

Общий prefix хранится один раз, поэтому prefix search естественен.

## Подробное объяснение простыми словами

Слова идут по общим коридорам букв: «кот» и «котик» делят начало пути. Дойдя до «ко», можно показать все продолжения.

## Подробное объяснение техническими терминами

Prefix tree indexes sequences by symbols with O(L) traversal independent of key count. Radix compression reduces unary nodes; memory layout and alphabet encoding dominate practical cost.
