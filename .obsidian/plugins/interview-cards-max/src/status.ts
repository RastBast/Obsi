import type { CardProgress } from './types';
import { formatDue } from './format';

export interface CardStatus {
  key: 'new' | 'due' | 'mastered' | 'passed';
  label: string;
  cls: string;
  dueLabel: string;
  flags: string[];
}

export function isPassed(progress: CardProgress): boolean {
  return progress.reps > 0;
}

export function isDue(progress: CardProgress, now: number): boolean {
  return progress.reps > 0 && progress.due <= now;
}

export function isMastered(progress: CardProgress, now: number): boolean {
  const grade = progress.effectiveRating ?? progress.lastRating ?? 0;
  return progress.reps >= 2 && grade >= 3 && progress.stability >= 7 && progress.due > now;
}

export function statusFor(progress: CardProgress, now: number): CardStatus {
  const flags: string[] = [];
  if (progress.answeredAfterReveal) flags.push('Ответ после показа');
  if (progress.dontKnow) flags.push('Не знаю');
  if (progress.lapses > 0) flags.push(`Провалов: ${progress.lapses}`);

  if (!isPassed(progress)) {
    return { key: 'new', label: 'Не пройдена', cls: 'is-new', dueLabel: 'Новая', flags };
  }
  if (isDue(progress, now)) {
    return { key: 'due', label: 'К повторению', cls: 'is-due', dueLabel: 'Сейчас', flags };
  }
  if (isMastered(progress, now)) {
    return {
      key: 'mastered',
      label: 'Освоена',
      cls: 'is-mastered',
      dueLabel: formatDue(progress.due, now),
      flags,
    };
  }
  return {
    key: 'passed',
    label: 'Пройдена',
    cls: 'is-passed',
    dueLabel: formatDue(progress.due, now),
    flags,
  };
}
