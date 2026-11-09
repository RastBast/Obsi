---
tags: [go, interview, middle, algorithms, flashcards/Алгоритмы]
topic: Stack, queue и deque
---

Какие свойства LIFO/FIFO нужны и почему очередь на slice может удерживать память?::Stack работает LIFO и легко реализуется append/pop конца slice. Queue работает FIFO; удаление `q=q[1:]` O(1), но backing array и ссылки в хвосте могут удерживаться. Deque поддерживает оба конца, обычно через ring buffer.

# Как реализовать stack, queue и deque?

## Вопрос

Какие свойства LIFO/FIFO нужны и почему очередь на slice может удерживать память?

## Краткий ответ

Stack работает LIFO и легко реализуется append/pop конца slice. Queue работает FIFO; удаление `q=q[1:]` O(1), но backing array и ссылки в хвосте могут удерживаться. Deque поддерживает оба конца, обычно через ring buffer.

## Развёрнутый ответ мидла

- Stack push/pop амортизированно O(1).
- Для queue обнуляют удаляемый pointer element и периодически compact/copy.
- Удаление с начала через `append`-сдвиг каждый раз даёт O(n).
- Ring buffer хранит head/tail modulo capacity и растёт при заполнении.

## Развёрнутый ответ сеньора: все тонкости

- Нужно определить поведение empty pop: bool/error/panic.
- Circular buffer различает full/empty через size или дополнительный slot.
- Concurrent queue требует отдельного протокола; обычный slice не thread-safe.
- Bounded queue задаёт backpressure и часто полезнее бесконечного роста.

## Если забыл: что это, зачем и где нужно

Stack берёт последний, queue — первый, deque — оба края. Для долгой queue следи за удержанием backing array.

## Подробное объяснение простыми словами

Стопка тарелок отдаёт верхнюю последней положенной. Очередь в кассу отдаёт первого пришедшего. Двусторонняя очередь разрешает вход и выход с обоих концов.

## Подробное объяснение техническими терминами

LIFO/FIFO ADT имеют O(1) amortized endpoint operations. Slice-based queue нуждается в reference clearing/compaction; circular buffer использует modular indices и bounded capacity semantics.
