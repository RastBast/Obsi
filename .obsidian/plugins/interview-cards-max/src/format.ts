import { State } from 'ts-fsrs';
import type { CardProgress, FilterKey, FeedComment, FeedHintKind, FeedOutcome } from './types';

export interface RatingMeta {
  value: number;
  ru: string;
  en: string;
  desc: string;
  cls: string;
  key: string;
}

export const RATINGS: RatingMeta[] = [
  { value: 1, ru: 'Снова', en: 'Again', desc: 'Не вспомнил', cls: 'again', key: '1' },
  { value: 2, ru: 'Трудно', en: 'Hard', desc: 'С большим трудом', cls: 'hard', key: '2' },
  { value: 3, ru: 'Хорошо', en: 'Good', desc: 'Вспомнил', cls: 'good', key: '3' },
  { value: 4, ru: 'Легко', en: 'Easy', desc: 'Без усилий', cls: 'easy', key: '4' },
];

export interface FilterMeta {
  key: FilterKey;
  label: string;
  hint: string;
}

export const FILTERS: FilterMeta[] = [
  { key: 'due', label: 'К повторению', hint: 'Due + новые по лимиту' },
  { key: 'new', label: 'Не пройденные', hint: 'Ещё ни разу не оценены' },
  { key: 'passed', label: 'Пройденные', hint: 'Есть хотя бы одна оценка' },
  { key: 'mastered', label: 'Освоенные', hint: 'Уверенный интервал' },
  { key: 'all', label: 'Все', hint: 'Все 220 карточек' },
];

const dateFmt = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' });
const timeFmt = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' });
const dateTimeFmt = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

export function plural(n: number, one: string, few: string, many: string): string {
  const abs = Math.abs(n) % 100;
  const last = abs % 10;
  if (abs >= 11 && abs <= 14) return many;
  if (last === 1) return one;
  if (last >= 2 && last <= 4) return few;
  return many;
}

export function cardsWord(n: number): string {
  return `${n} ${plural(n, 'карточка', 'карточки', 'карточек')}`;
}

export function daysWord(n: number): string {
  return `${n} ${plural(n, 'день', 'дня', 'дней')}`;
}

export function reviewsWord(n: number): string {
  return `${n} ${plural(n, 'повторение', 'повторения', 'повторений')}`;
}

export function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function dayOffsetKey(now: number, offset: number): string {
  const d = new Date(now);
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return dateKey(d);
}

export function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function formatDateTime(ts: number): string {
  return dateTimeFmt.format(new Date(ts));
}

export function formatDue(due: number, now: number): string {
  if (!Number.isFinite(due) || due <= now) return 'Сейчас';
  const d = new Date(due);
  const n = new Date(now);
  const dayDiff = Math.round((startOfDay(due) - startOfDay(now)) / 86_400_000);
  if (dayDiff === 0) return `Сегодня, ${timeFmt.format(d)}`;
  if (dayDiff === 1) return `Завтра, ${timeFmt.format(d)}`;
  if (dayDiff > 1 && dayDiff < 7) return `Через ${daysWord(dayDiff)}`;
  return dateFmt.format(d);
}

export function formatShortDate(ts: number): string {
  return dateFmt.format(new Date(ts));
}

export function ratingLabel(value: number): string {
  const r = RATINGS.find((x) => x.value === value);
  return r ? `${r.ru} / ${r.en}` : `Оценка ${value}`;
}

export function stateLabel(state: State): string {
  switch (state) {
    case State.New:
      return 'Новая';
    case State.Learning:
      return 'Изучается';
    case State.Review:
      return 'Повторение';
    case State.Relearning:
      return 'Переучивание';
    default:
      return '—';
  }
}

export function percent(part: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((part / total) * 100);
}

export function truncate(text: string, max = 90): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1)}…`;
}

export function feedHintLabel(kind: FeedHintKind): string {
  if (kind === 'dont-know') return 'Не знаю ответ';
  if (kind === 'answer') return 'Показать ответ';
  return 'Без подсказки';
}

export function feedOutcomeLabel(outcome: FeedOutcome): string {
  switch (outcome) {
    case 'skipped':
      return 'Свайпнут';
    case 'hint-only':
      return 'Только подсказка';
    case 'answered-after-reveal':
      return 'Ответ после показа';
    case 'solved':
      return 'Решена';
    case 'pending':
    default:
      return 'Ещё не решал';
  }
}

export function feedAttemptBadges(comment: FeedComment): string[] {
  const badges: string[] = [`Проход ${comment.cycle}`, feedOutcomeLabel(comment.outcome)];
  if (comment.answeredBeforeReveal) badges.push('Ответил сам');
  else if (comment.answered) badges.push('Ответ введён после показа');
  else badges.push('Без ответа');
  if (comment.usedHint) badges.push('Только подсказка');
  if (comment.hintKind) badges.push(`Подсказка: ${feedHintLabel(comment.hintKind)}`);
  if (comment.rating !== null) badges.push(`Оценка: ${ratingLabel(comment.rating)}`);
  if (comment.effectiveRating !== null && comment.effectiveRating !== comment.rating) {
    badges.push(`FSRS: ${ratingLabel(comment.effectiveRating)}`);
  }
  if (comment.answeredAfterReveal) badges.push('Ответ изменён после показа');
  if (comment.skipped) badges.push('Не решал / свайп');
  return badges;
}
