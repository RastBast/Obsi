---
tags: [go, interview, middle, postgresql, performance, flashcards/БД]
topic: EXPLAIN ANALYZE
---

# Как читать EXPLAIN ANALYZE?

## Вопрос

Чем estimated cost/rows отличаются от actual time/rows и какие признаки у плохого плана?

## Краткий ответ

`EXPLAIN` показывает оценённый план, `EXPLAIN ANALYZE` реально выполняет запрос и добавляет actual metrics. Сравнивают estimated vs actual rows, loops, node time, buffers, sort spill и выбранные join/scan. Большая ошибка cardinality часто приводит к неверному плану.

## Развёрнутый ответ мидла

- Читают из нижних узлов к родителю, учитывая `loops`.
- Actual time обычно first..total на одну итерацию; общий вклад учитывает loops.
- `BUFFERS` показывает cache hits/reads/dirtied, а не только wall time.
- ANALYZE для UPDATE/DELETE меняет данные; оборачивают в transaction+rollback только понимая side effects.

## Развёрнутый ответ сеньора: все тонкости

- Cost units не миллисекунды и сравнимы внутри модели planner.
- Correlated columns требуют extended statistics; обычная независимость даёт плохую оценку.
- `Rows Removed by Filter`, heap fetches, temp read/write и WAL объясняют скрытую работу.
- Холодный и тёплый cache дают разные результаты; один запуск не benchmark.

## Если забыл: что это, зачем и где нужно

Сначала найди узел с неожиданным количеством строк или повторов, потом выясняй, почему оценка ошиблась.

## Подробное объяснение простыми словами

План — прогноз маршрута, ANALYZE — поездка с секундомером. Если план ожидал одного пассажира, а пришёл миллион, выбранный маленький автобус окажется неправильным.

## Подробное объяснение техническими терминами

Planner оптимизирует estimated cardinalities/cost. EXPLAIN ANALYZE instrumentирует executor nodes; estimate error propagates into join order/method, memory sizing и scan selection. Buffers и spills дают I/O attribution.
