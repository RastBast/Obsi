import { State } from 'ts-fsrs';

export const PLUGIN_ID = 'interview-cards-max';
export const VIEW_TYPE = 'interview-cards-max-view';
/** Активная папка с карточками в корне vault. Сюда пользователь кладёт свои заметки. */
export const DEFAULT_CARDS_PATH = 'Карточки';
/** Старая папка: оставлена как fallback, чтобы карточки не пропали у существующих vault. */
export const LEGACY_CARDS_PATH = 'Golang-Middle-Interview/Cards';
/** Дополнительные корни: объединяются с активной папкой, дубли по тексту вопроса убираются. */
export const CANDIDATE_CARD_ROOTS = [DEFAULT_CARDS_PATH, LEGACY_CARDS_PATH] as const;
export const HISTORY_LIMIT = 240;
export const FEED_IMPRESSION_LIMIT = 6000;
export const DEFAULT_FEED_CYCLE_SIZE = 20;

export const DECK_ORDER = [
  'Go',
  'Docker',
  'Kubernetes',
  'Сети',
  'Алгоритмы',
  'БД',
  'Рантайм',
  'Redis',
  'Kafka',
] as const;

export type DeckName = (typeof DECK_ORDER)[number];

export interface DeckMeta {
  icon: string;
  emoji: string;
  color: string;
}

export const DECK_META: Record<string, DeckMeta> = {
  Go: { icon: 'braces', emoji: '🐹', color: 'var(--color-cyan)' },
  Docker: { icon: 'box', emoji: '🐳', color: 'var(--color-blue)' },
  Kubernetes: { icon: 'hexagon', emoji: '☸️', color: 'var(--color-purple)' },
  Сети: { icon: 'network', emoji: '🌐', color: 'var(--color-green)' },
  Алгоритмы: { icon: 'git-branch', emoji: '🧮', color: 'var(--color-orange)' },
  БД: { icon: 'database', emoji: '🗄️', color: 'var(--color-yellow)' },
  Рантайм: { icon: 'cpu', emoji: '⚙️', color: 'var(--color-red)' },
  Redis: { icon: 'zap', emoji: '⚡', color: 'var(--color-pink)' },
  Kafka: { icon: 'radio', emoji: '📡', color: 'var(--color-blue)' },
};

export type FilterKey = 'due' | 'new' | 'passed' | 'mastered' | 'all';
export type FeedHintKind = 'answer' | 'dont-know' | null;
export type FeedOutcome =
  | 'pending'
  | 'skipped'
  | 'hint-only'
  | 'answered-after-reveal'
  | 'solved';

export interface PluginSettings {
  cardsPath: string;
  newPerDay: number;
  requestRetention: number;
  maximumInterval: number;
  enableFuzz: boolean;
  enableShortTerm: boolean;
  showFullNoteOnDontKnow: boolean;
  countAnswerAfterRevealAsAgain: boolean;
  autoNext: boolean;
  groupByDeck: boolean;
  showStreakInStatusBar: boolean;
  feedCycleSize: number;
  feedShuffle: boolean;
}

export const DEFAULT_SETTINGS: PluginSettings = {
  cardsPath: DEFAULT_CARDS_PATH,
  newPerDay: 20,
  requestRetention: 0.9,
  maximumInterval: 365,
  enableFuzz: true,
  enableShortTerm: true,
  showFullNoteOnDontKnow: true,
  countAnswerAfterRevealAsAgain: true,
  autoNext: true,
  groupByDeck: true,
  showStreakInStatusBar: true,
  feedCycleSize: DEFAULT_FEED_CYCLE_SIZE,
  feedShuffle: true,
};

/** FSRS-состояние карточки + пользовательская история. */
export interface CardProgress {
  due: number;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  state: State;
  last_review: number | null;

  firstReviewed: number | null;
  reviewCount: number;
  lastRating: number | null;
  effectiveRating: number | null;
  lastAnswer: string;
  answeredAfterReveal: boolean;
  dontKnow: boolean;
  typedAfterRevealCount: number;
  dontKnowCount: number;
}

export interface DailyStat {
  reviews: number;
  newCards: number;
  dontKnow: number;
  afterReveal: number;
  feedLikes: number;
  feedComments: number;
  feedSkips: number;
}

export interface StreakState {
  current: number;
  best: number;
  lastDate: string | null;
}

export interface ReviewHistoryEntry {
  cardId: string;
  deck: string;
  title: string;
  at: number;
  rating: number;
  effectiveRating: number;
  answeredAfterReveal: boolean;
  dontKnow: boolean;
  scheduledDays: number;
  state: State;
}

/** Один комментарий привязан к одному показу карточки в ленте. */
export interface FeedComment {
  text: string;
  at: number;
  cycle: number;
  outcome: FeedOutcome;
  answered: boolean;
  answeredBeforeReveal: boolean;
  usedHint: boolean;
  hintKind: FeedHintKind;
  rating: number | null;
  effectiveRating: number | null;
  answeredAfterReveal: boolean;
  skipped: boolean;
}

/** Один показ карточки в одном проходе ленты. */
export interface FeedImpression {
  key: string;
  cardId: string;
  deck: string;
  title: string;
  cycle: number;
  at: number;
  liked: boolean;
  comment: FeedComment | null;
  outcome: FeedOutcome;
  answered: boolean;
  answeredBeforeReveal: boolean;
  usedHint: boolean;
  hintKind: FeedHintKind;
  rating: number | null;
  effectiveRating: number | null;
  answeredAfterReveal: boolean;
  skipped: boolean;
}

export interface FeedData {
  cycle: number;
  index: number;
  order: string[];
  deck: string | null;
  impressions: Record<string, FeedImpression>;
}

export interface PluginData {
  version: number;
  settings: PluginSettings;
  cards: Record<string, CardProgress>;
  streak: StreakState;
  daily: Record<string, DailyStat>;
  history: ReviewHistoryEntry[];
  selectedDeck: string | null;
  selectedFilter: FilterKey;
  feed: FeedData;
}

export interface ReviewState {
  cardId: string;
  answer: string;
  revealed: boolean;
  revealKind: FeedHintKind;
  answerAtReveal: string;
  typedAfterReveal: boolean;
  fullNoteOpen: boolean;
  feedCycle?: number;
}

export interface GradeRequest {
  cardId: string;
  answer: string;
  rating: number;
  revealKind: FeedHintKind;
  answerAtReveal: string;
  typedAfterReveal: boolean;
  feed?: { cycle: number };
}

export interface DeckStats {
  name: string;
  total: number;
  due: number;
  fresh: number;
  passed: number;
  mastered: number;
}

export interface OverallStats extends DeckStats {
  name: 'Все колоды';
  dontKnow: number;
  afterReveal: number;
  feedLikes: number;
  feedComments: number;
  feedSkips: number;
  feedCycle: number;
}

export function emptyProgress(now: number): CardProgress {
  return {
    due: now,
    stability: 0,
    difficulty: 0,
    elapsed_days: 0,
    scheduled_days: 0,
    reps: 0,
    lapses: 0,
    state: State.New,
    last_review: null,
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

export function defaultFeed(): FeedData {
  return { cycle: 1, index: 0, order: [], deck: null, impressions: {} };
}

export function defaultData(): PluginData {
  return {
    version: 2,
    settings: { ...DEFAULT_SETTINGS },
    cards: {},
    streak: { current: 0, best: 0, lastDate: null },
    daily: {},
    history: [],
    selectedDeck: null,
    selectedFilter: 'due',
    feed: defaultFeed(),
  };
}

function clampNumber(value: unknown, fallback: number, min: number, max: number): number {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function normalizeProgress(raw: unknown, now: number): CardProgress {
  const base = emptyProgress(now);
  if (!raw || typeof raw !== 'object') return base;
  const p = raw as Partial<CardProgress>;
  const due = typeof p.due === 'number' && Number.isFinite(p.due) ? p.due : now;
  return {
    ...base,
    ...p,
    due,
    stability: clampNumber(p.stability, 0, 0, 36500),
    difficulty: clampNumber(p.difficulty, 0, 0, 10),
    elapsed_days: clampNumber(p.elapsed_days, 0, 0, 36500),
    scheduled_days: clampNumber(p.scheduled_days, 0, 0, 36500),
    reps: clampNumber(p.reps, 0, 0, 1_000_000),
    lapses: clampNumber(p.lapses, 0, 0, 1_000_000),
    state: typeof p.state === 'number' ? (p.state as State) : State.New,
    last_review: typeof p.last_review === 'number' ? p.last_review : null,
    firstReviewed: typeof p.firstReviewed === 'number' ? p.firstReviewed : null,
    reviewCount: clampNumber(p.reviewCount, 0, 0, 1_000_000),
    lastRating: typeof p.lastRating === 'number' ? p.lastRating : null,
    effectiveRating: typeof p.effectiveRating === 'number' ? p.effectiveRating : null,
    lastAnswer: typeof p.lastAnswer === 'string' ? p.lastAnswer : '',
    answeredAfterReveal: Boolean(p.answeredAfterReveal),
    dontKnow: Boolean(p.dontKnow),
    typedAfterRevealCount: clampNumber(p.typedAfterRevealCount, 0, 0, 1_000_000),
    dontKnowCount: clampNumber(p.dontKnowCount, 0, 0, 1_000_000),
  };
}

function normalizeDaily(raw: unknown): DailyStat {
  const base: DailyStat = {
    reviews: 0,
    newCards: 0,
    dontKnow: 0,
    afterReveal: 0,
    feedLikes: 0,
    feedComments: 0,
    feedSkips: 0,
  };
  if (!raw || typeof raw !== 'object') return base;
  const d = raw as Partial<DailyStat>;
  return {
    reviews: clampNumber(d.reviews, 0, 0, 1_000_000),
    newCards: clampNumber(d.newCards, 0, 0, 1_000_000),
    dontKnow: clampNumber(d.dontKnow, 0, 0, 1_000_000),
    afterReveal: clampNumber(d.afterReveal, 0, 0, 1_000_000),
    feedLikes: clampNumber(d.feedLikes, 0, 0, 1_000_000),
    feedComments: clampNumber(d.feedComments, 0, 0, 1_000_000),
    feedSkips: clampNumber(d.feedSkips, 0, 0, 1_000_000),
  };
}

function normalizeFeedHintKind(raw: unknown): FeedHintKind {
  return raw === 'answer' || raw === 'dont-know' ? raw : null;
}

function normalizeFeedOutcome(raw: unknown): FeedOutcome {
  return raw === 'skipped' ||
    raw === 'hint-only' ||
    raw === 'answered-after-reveal' ||
    raw === 'solved'
    ? raw
    : 'pending';
}

function normalizeFeedComment(raw: unknown): FeedComment | null {
  if (!raw || typeof raw !== 'object') return null;
  const c = raw as Partial<FeedComment>;
  const text = typeof c.text === 'string' ? c.text.trim() : '';
  if (!text) return null;
  return {
    text,
    at: clampNumber(c.at, Date.now(), 0, Number.MAX_SAFE_INTEGER),
    cycle: clampNumber(c.cycle, 1, 1, 1_000_000),
    outcome: normalizeFeedOutcome(c.outcome),
    answered: Boolean(c.answered),
    answeredBeforeReveal: Boolean(c.answeredBeforeReveal),
    usedHint: Boolean(c.usedHint),
    hintKind: normalizeFeedHintKind(c.hintKind),
    rating: typeof c.rating === 'number' ? c.rating : null,
    effectiveRating: typeof c.effectiveRating === 'number' ? c.effectiveRating : null,
    answeredAfterReveal: Boolean(c.answeredAfterReveal),
    skipped: Boolean(c.skipped),
  };
}

function normalizeFeedImpression(raw: unknown): FeedImpression | null {
  if (!raw || typeof raw !== 'object') return null;
  const p = raw as Partial<FeedImpression>;
  const cardId = typeof p.cardId === 'string' ? p.cardId : '';
  if (!cardId) return null;
  const cycle = clampNumber(p.cycle, 1, 1, 1_000_000);
  // Ключ показа всегда вычисляется из цикла и карточки: в data.json нельзя
  // создать два разных impression для одного и того же вопроса в одном проходе.
  const key = `${cycle}:${cardId}`;
  return {
    key,
    cardId,
    deck: typeof p.deck === 'string' ? p.deck : '',
    title: typeof p.title === 'string' ? p.title : cardId,
    cycle,
    at: clampNumber(p.at, Date.now(), 0, Number.MAX_SAFE_INTEGER),
    liked: Boolean(p.liked),
    comment: normalizeFeedComment(p.comment),
    outcome: normalizeFeedOutcome(p.outcome),
    answered: Boolean(p.answered),
    answeredBeforeReveal: Boolean(p.answeredBeforeReveal),
    usedHint: Boolean(p.usedHint),
    hintKind: normalizeFeedHintKind(p.hintKind),
    rating: typeof p.rating === 'number' ? p.rating : null,
    effectiveRating: typeof p.effectiveRating === 'number' ? p.effectiveRating : null,
    answeredAfterReveal: Boolean(p.answeredAfterReveal),
    skipped: Boolean(p.skipped),
  };
}

function normalizeFeed(raw: unknown): FeedData {
  const base = defaultFeed();
  if (!raw || typeof raw !== 'object') return base;
  const f = raw as Partial<FeedData>;
  const order = Array.isArray(f.order)
    ? f.order.filter((x): x is string => typeof x === 'string')
    : [];
  const impressions: Record<string, FeedImpression> = {};
  if (f.impressions && typeof f.impressions === 'object') {
    for (const value of Object.values(f.impressions)) {
      const normalized = normalizeFeedImpression(value);
      if (normalized) impressions[normalized.key] = normalized;
    }
    const keys = Object.keys(impressions);
    if (keys.length > FEED_IMPRESSION_LIMIT) {
      keys
        .sort((a, b) => impressions[b].at - impressions[a].at)
        .slice(FEED_IMPRESSION_LIMIT)
        .forEach((key) => delete impressions[key]);
    }
  }
  return {
    cycle: clampNumber(f.cycle, 1, 1, 1_000_000),
    index: clampNumber(f.index, 0, 0, Math.max(0, order.length - 1)),
    order,
    deck: typeof f.deck === 'string' ? f.deck : null,
    impressions,
  };
}

export function normalizeData(raw: unknown): PluginData {
  const base = defaultData();
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Partial<PluginData>;
  const now = Date.now();
  const s = (r.settings ?? {}) as Partial<PluginSettings>;

  const settings: PluginSettings = {
    ...base.settings,
    ...s,
    cardsPath: typeof s.cardsPath === 'string' && s.cardsPath.trim() ? s.cardsPath.trim() : DEFAULT_CARDS_PATH,
    newPerDay: clampNumber(s.newPerDay, base.settings.newPerDay, 0, 1000),
    requestRetention: clampNumber(s.requestRetention, base.settings.requestRetention, 0.7, 0.99),
    maximumInterval: clampNumber(s.maximumInterval, base.settings.maximumInterval, 7, 36500),
    enableFuzz: typeof s.enableFuzz === 'boolean' ? s.enableFuzz : base.settings.enableFuzz,
    enableShortTerm: typeof s.enableShortTerm === 'boolean' ? s.enableShortTerm : base.settings.enableShortTerm,
    showFullNoteOnDontKnow:
      typeof s.showFullNoteOnDontKnow === 'boolean' ? s.showFullNoteOnDontKnow : base.settings.showFullNoteOnDontKnow,
    countAnswerAfterRevealAsAgain:
      typeof s.countAnswerAfterRevealAsAgain === 'boolean'
        ? s.countAnswerAfterRevealAsAgain
        : base.settings.countAnswerAfterRevealAsAgain,
    autoNext: typeof s.autoNext === 'boolean' ? s.autoNext : base.settings.autoNext,
    groupByDeck: typeof s.groupByDeck === 'boolean' ? s.groupByDeck : base.settings.groupByDeck,
    showStreakInStatusBar:
      typeof s.showStreakInStatusBar === 'boolean' ? s.showStreakInStatusBar : base.settings.showStreakInStatusBar,
    feedCycleSize: clampNumber(s.feedCycleSize, base.settings.feedCycleSize, 0, 1000),
    feedShuffle: typeof s.feedShuffle === 'boolean' ? s.feedShuffle : base.settings.feedShuffle,
  };

  const cards: Record<string, CardProgress> = {};
  if (r.cards && typeof r.cards === 'object') {
    for (const [id, p] of Object.entries(r.cards)) {
      cards[id] = normalizeProgress(p, now);
    }
  }

  const daily: Record<string, DailyStat> = {};
  if (r.daily && typeof r.daily === 'object') {
    for (const [date, d] of Object.entries(r.daily)) daily[date] = normalizeDaily(d);
  }

  const streakRaw = (r.streak ?? {}) as Partial<StreakState>;
  const streak: StreakState = {
    current: clampNumber(streakRaw.current, 0, 0, 100000),
    best: clampNumber(streakRaw.best, 0, 0, 100000),
    lastDate: typeof streakRaw.lastDate === 'string' ? streakRaw.lastDate : null,
  };

  const history: ReviewHistoryEntry[] = Array.isArray(r.history)
    ? r.history
        .filter((x): x is ReviewHistoryEntry => Boolean(x) && typeof x === 'object')
        .slice(0, HISTORY_LIMIT)
    : [];

  const selectedFilter: FilterKey =
    r.selectedFilter === 'due' ||
    r.selectedFilter === 'new' ||
    r.selectedFilter === 'passed' ||
    r.selectedFilter === 'mastered' ||
    r.selectedFilter === 'all'
      ? r.selectedFilter
      : 'due';

  return {
    version: 2,
    settings,
    cards,
    streak,
    daily,
    history,
    // Разрешаем произвольные темы-папки, а не только 9 встроенных.
    selectedDeck: typeof r.selectedDeck === 'string' && r.selectedDeck.trim() ? r.selectedDeck : null,
    selectedFilter,
    feed: normalizeFeed(r.feed),
  };
}

export function deckRank(deck: string): number {
  const i = DECK_ORDER.indexOf(deck as DeckName);
  return i === -1 ? DECK_ORDER.length + 1 : i;
}
