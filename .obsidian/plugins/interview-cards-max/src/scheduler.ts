import {
  createEmptyCard,
  fsrs,
  generatorParameters,
  type Card as FsrsCard,
  type CardInput as FsrsCardInput,
  type Grade,
  Rating,
  State,
  type FSRS,
  type FSRSParameters,
} from 'ts-fsrs';
import type { CardProgress, PluginSettings } from './types';

export interface GradeResult {
  progress: CardProgress;
  scheduledDays: number;
  elapsedDays: number;
  state: State;
}

function fromFsrsCard(card: FsrsCard, now: number): CardProgress {
  return {
    due: card.due.getTime(),
    stability: card.stability,
    difficulty: card.difficulty,
    elapsed_days: card.elapsed_days,
    scheduled_days: card.scheduled_days,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state,
    last_review: card.last_review ? card.last_review.getTime() : null,
    firstReviewed: null,
    reviewCount: 0,
    lastRating: null,
    effectiveRating: null,
    lastAnswer: '',
    answeredAfterReveal: false,
    dontKnow: false,
    typedAfterRevealCount: 0,
    dontKnowCount: 0,
  };
}

function toFsrsCardInput(progress: CardProgress): FsrsCardInput {
  return {
    due: new Date(progress.due),
    stability: progress.stability,
    difficulty: progress.difficulty,
    elapsed_days: progress.elapsed_days,
    scheduled_days: progress.scheduled_days,
    reps: progress.reps,
    lapses: progress.lapses,
    state: progress.state,
    last_review: progress.last_review ? new Date(progress.last_review) : undefined,
  };
}

export function createEmptyProgress(now: number): CardProgress {
  return fromFsrsCard(createEmptyCard(new Date(now)), now);
}

export function createScheduler(settings: PluginSettings): FSRS {
  const params: Partial<FSRSParameters> = {
    request_retention: settings.requestRetention,
    maximum_interval: settings.maximumInterval,
    enable_fuzz: settings.enableFuzz,
    enable_short_term: settings.enableShortTerm,
  };
  return fsrs(generatorParameters(params));
}

export function gradeCard(
  progress: CardProgress,
  rating: Grade,
  now: number,
  settings: PluginSettings,
): GradeResult {
  const scheduler = createScheduler(settings);
  const input = toFsrsCardInput(progress);
  const result = scheduler.next(input, new Date(now), rating);
  return {
    progress: fromFsrsCard(result.card, now),
    scheduledDays: result.card.scheduled_days,
    elapsedDays: result.card.elapsed_days,
    state: result.card.state,
  };
}

export const RATING_AGAIN: Grade = Rating.Again;
export const RATING_GOOD: Grade = Rating.Good;
export { Rating, State };
