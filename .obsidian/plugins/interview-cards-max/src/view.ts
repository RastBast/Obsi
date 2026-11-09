import {
  ItemView,
  MarkdownRenderer,
  Menu,
  Notice,
  TFile,
  WorkspaceLeaf,
  setIcon,
} from 'obsidian';
import type { CardsMaxPlugin } from './main';
import { buildExplanationMarkdown, type CardNote } from './cards';
import { statusFor } from './status';
import {
  DECK_META,
  VIEW_TYPE,
  type DeckStats,
  type OverallStats,
  type ReviewHistoryEntry,
  type ReviewState,
} from './types';
import {
  FILTERS,
  RATINGS,
  cardsWord,
  dateKey,
  dayOffsetKey,
  daysWord,
  formatDateTime,
  percent,
  ratingLabel,
  reviewsWord,
  truncate,
} from './format';

function setIconWithFallback(el: HTMLElement, icon: string, fallback: string): void {
  setIcon(el, icon);
  if (!el.querySelector('svg')) el.textContent = fallback;
}

export class CardsMaxView extends ItemView {
  private readonly plugin: CardsMaxPlugin;
  private mode: 'dashboard' | 'review' = 'dashboard';
  private review: ReviewState | null = null;
  private answerBadge: HTMLElement | null = null;
  private schedulerWarning: HTMLElement | null = null;
  private answerTextarea: HTMLTextAreaElement | null = null;

  constructor(leaf: WorkspaceLeaf, plugin: CardsMaxPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string {
    return VIEW_TYPE;
  }

  getDisplayText(): string {
    return 'Карточки MAX';
  }

  getIcon(): string {
    return 'flame';
  }

  async onOpen(): Promise<void> {
    await super.onOpen();
    this.contentEl.classList.add('icm-root');
    this.contentEl.style.padding = '14px';
    this.addAction('refresh-cw', 'Обновить карточки', () => void this.plugin.refreshCards());
    this.addAction('settings', 'Настройки плагина', () => this.plugin.openSettings());
    this.addAction('more-horizontal', 'Меню панели', (evt) => this.showMenu(evt));
    this.registerDomEvent(this.contentEl, 'keydown', (evt) => this.onKeyDown(evt));
    this.render();
  }

  async onClose(): Promise<void> {
    await super.onClose();
  }

  render(): void {
    this.contentEl.replaceChildren();
    this.answerBadge = null;
    this.schedulerWarning = null;
    this.answerTextarea = null;
    if (this.mode === 'review' && this.review && this.plugin.getCardById(this.review.cardId)) {
      this.renderReview();
    } else {
      this.mode = 'dashboard';
      this.review = null;
      this.renderDashboard();
    }
  }

  startReview(cardId?: string): void {
    const deck = this.plugin.getSelectedDeck();
    const filter = this.plugin.getSelectedFilter();
    const queue = this.plugin.getQueue(deck, filter);
    const card = cardId ? this.plugin.getCardById(cardId) : queue[0];
    if (!card) {
      new Notice('В выбранной очереди пока нет карточек');
      return;
    }
    this.review = this.makeState(card.id);
    this.mode = 'review';
    this.render();
  }

  private makeState(cardId: string): ReviewState {
    return {
      cardId,
      answer: '',
      revealed: false,
      revealKind: null,
      answerAtReveal: '',
      typedAfterReveal: false,
      fullNoteOpen: false,
    };
  }

  private reveal(kind: 'answer' | 'dont-know'): void {
    if (!this.review) return;
    this.review.answerAtReveal = this.review.answer;
    this.review.revealed = true;
    this.review.revealKind = kind;
    if (kind === 'dont-know' && this.plugin.settings.showFullNoteOnDontKnow) {
      this.review.fullNoteOpen = true;
    }
    this.render();
  }

  private async grade(rating: number): Promise<void> {
    const rs = this.review;
    if (!rs || !rs.revealed) return;
    const next = await this.plugin.grade({
      cardId: rs.cardId,
      answer: rs.answer,
      rating,
      revealKind: rs.revealKind,
      answerAtReveal: rs.answerAtReveal,
      typedAfterReveal: rs.typedAfterReveal,
    });
    if (next && this.plugin.settings.autoNext) {
      this.review = this.makeState(next.id);
      this.render();
    } else {
      this.mode = 'dashboard';
      this.review = null;
      this.render();
      new Notice('Очередь завершена · серия обновлена 🔥');
    }
  }

  private onKeyDown(evt: KeyboardEvent): void {
    const rs = this.review;
    if (!rs) return;
    const target = evt.target as HTMLElement | null;
    const inTextarea = target?.tagName === 'TEXTAREA';
    if (evt.key === 'Enter' && (evt.ctrlKey || evt.metaKey)) {
      evt.preventDefault();
      if (!rs.revealed) this.reveal('answer');
      else void this.grade(3);
      return;
    }
    if (
      rs.revealed &&
      !inTextarea &&
      !evt.ctrlKey &&
      !evt.metaKey &&
      !evt.altKey &&
      /^[1-4]$/.test(evt.key)
    ) {
      evt.preventDefault();
      void this.grade(Number(evt.key));
    }
  }

  private showMenu(evt: MouseEvent): void {
    const menu = new Menu();
    menu.addItem((item) =>
      item.setTitle('Начать повторение').setIcon('play').onClick(() => this.startReview()),
    );
    menu.addItem((item) =>
      item.setTitle('Обновить карточки').setIcon('refresh-cw').onClick(() => void this.plugin.refreshCards()),
    );
    menu.addSeparator();
    menu.addItem((item) =>
      item.setTitle('Показать все колоды').setIcon('layers').onClick(() => void this.plugin.setSelectedDeck(null)),
    );
    menu.addItem((item) =>
      item.setTitle('Настройки плагина').setIcon('settings').onClick(() => this.plugin.openSettings()),
    );
    menu.addItem((item) =>
      item.setTitle('Сбросить прогресс…').setIcon('trash-2').onClick(() => this.plugin.confirmReset()),
    );
    menu.addSeparator();
    menu.addItem((item) =>
      item
        .setTitle('О плагине')
        .setIcon('info')
        .onClick(() =>
          new Notice(`Карточки MAX · ${cardsWord(this.plugin.cards.length)} · 9 колод · FSRS · русский интерфейс`),
        ),
    );
    menu.showAtMouseEvent(evt);
  }

  private updateReviewBadges(): void {
    const rs = this.review;
    if (!rs || !this.answerBadge) return;
    const badge = this.answerBadge;
    badge.className = 'icm-answer-badge';
    if (!rs.revealed) {
      badge.textContent = 'Отвечай по памяти';
      badge.classList.add('is-muted');
    } else if (rs.typedAfterReveal) {
      badge.textContent = '⚠ Ответ дан после просмотра ответа';
      badge.classList.add('is-warn');
    } else if (rs.revealKind === 'dont-know') {
      badge.textContent = 'Отмечено: «Не знаю ответ»';
      badge.classList.add('is-warn');
    } else {
      badge.textContent = 'Ответ зафиксирован до показа';
      badge.classList.add('is-ok');
    }

    if (this.schedulerWarning) {
      if (rs.revealed && rs.typedAfterReveal) {
        this.schedulerWarning.textContent = this.plugin.settings.countAnswerAfterRevealAsAgain
          ? 'Такой ответ сохранится в журнале, но FSRS получит оценку «Снова» (Again).'
          : 'Такой ответ помечен как «после просмотра», но выбранная оценка останется в силе.';
        this.schedulerWarning.classList.remove('is-hidden');
      } else {
        this.schedulerWarning.classList.add('is-hidden');
      }
    }
  }

  private renderDashboard(): void {
    const root = this.contentEl.createDiv({ cls: 'icm-dashboard' });
    const overall = this.plugin.getOverallStats();
    const streak = this.plugin.getStreak();
    const daily = this.plugin.getDaily();
    const now = Date.now();
    const today = dateKey(new Date(now));
    const studiedToday = (daily[today]?.reviews ?? 0) > 0;

    this.renderHero(root, overall, streak, studiedToday, daily, now, today);
    this.renderStats(root, overall);
    this.renderProgress(root, overall);
    this.renderDecks(root);
    this.renderFiltersAndCards(root);
    this.renderRecent(root);
  }

  private renderHero(
    parent: HTMLElement,
    overall: OverallStats,
    streak: { current: number; best: number },
    studiedToday: boolean,
    daily: Record<string, { reviews: number }>,
    now: number,
    today: string,
  ): void {
    const hero = parent.createDiv({ cls: 'icm-hero' });
    const top = hero.createDiv({ cls: 'icm-hero-top' });
    const text = top.createDiv({ cls: 'icm-hero-text' });
    text.createDiv({ cls: 'icm-eyebrow', text: 'OBSIDIAN · FSRS · RU' });
    text.createEl('h1', { cls: 'icm-hero-title', text: 'Карточки MAX' });
    text.createDiv({
      cls: 'icm-hero-subtitle',
      text: `${cardsWord(overall.total)} · 9 колод · всё внутри Obsidian`,
    });

    const flame = top.createDiv({ cls: `icm-flame-box${studiedToday ? ' is-hot' : ' is-cold'}` });
    const icon = flame.createDiv({ cls: 'icm-flame-icon' });
    setIconWithFallback(icon, 'flame', '🔥');
    flame.createDiv({ cls: 'icm-flame-count', text: String(streak.current) });
    flame.createDiv({ cls: 'icm-flame-label', text: daysWord(streak.current) });

    const streakRow = hero.createDiv({ cls: 'icm-streak-row' });
    streakRow.createSpan({
      cls: studiedToday ? 'is-active' : 'is-muted',
      text: studiedToday
        ? `Сегодня: ${reviewsWord(daily[today]?.reviews ?? 0)} · серия активна`
        : 'Сегодня ещё нет повторений',
    });
    streakRow.createSpan({ cls: 'icm-streak-best', text: `Рекорд: ${streak.best}` });

    const dots = hero.createDiv({ cls: 'icm-dots' });
    for (let i = 6; i >= 0; i -= 1) {
      const key = dayOffsetKey(now, -i);
      const count = daily[key]?.reviews ?? 0;
      const dot = dots.createSpan({
        cls: `icm-dot${count > 0 ? ' is-on' : ''}${key === today ? ' is-today' : ''}`,
        text: count > 0 ? String(Math.min(count, 9)) : '',
      });
      dot.setAttribute('title', `${key}: ${reviewsWord(count)}`);
    }
    dots.createSpan({ cls: 'icm-dots-caption', text: '7 дней' });
  }

  private renderStats(parent: HTMLElement, overall: OverallStats): void {
    const grid = parent.createDiv({ cls: 'icm-stat-grid' });
    const items: Array<{ label: string; value: number; cls: string; hint: string }> = [
      { label: 'К повторению', value: overall.due, cls: 'is-due', hint: 'Уже в очереди' },
      { label: 'Не пройдено', value: overall.fresh, cls: 'is-new', hint: 'Ещё не оценены' },
      { label: 'Пройдено', value: overall.passed, cls: 'is-passed', hint: 'Есть оценки' },
      { label: 'Освоено', value: overall.mastered, cls: 'is-mastered', hint: 'Уверенный интервал' },
    ];
    for (const item of items) {
      const card = grid.createDiv({ cls: `icm-stat-card ${item.cls}` });
      card.createDiv({ cls: 'icm-stat-value', text: String(item.value) });
      card.createDiv({ cls: 'icm-stat-label', text: item.label });
      card.createDiv({ cls: 'icm-stat-hint', text: item.hint });
    }
  }

  private renderProgress(parent: HTMLElement, overall: OverallStats): void {
    const section = parent.createDiv({ cls: 'icm-progress-section' });
    const head = section.createDiv({ cls: 'icm-section-head' });
    head.createSpan({ cls: 'icm-section-title', text: 'Общий прогресс' });
    head.createSpan({ cls: 'icm-section-meta', text: `${overall.passed} / ${overall.total}` });
    const track = section.createDiv({ cls: 'icm-progress-track' });
    const fill = track.createDiv({ cls: 'icm-progress-fill' });
    fill.style.width = `${percent(overall.passed, overall.total)}%`;
    section.createDiv({
      cls: 'icm-progress-caption',
      text: `Пройдено ${percent(overall.passed, overall.total)}% · «Не знаю» ${overall.dontKnow} · после показа ${overall.afterReveal}`,
    });
  }

  private renderDecks(parent: HTMLElement): void {
    const section = parent.createDiv({ cls: 'icm-section' });
    const head = section.createDiv({ cls: 'icm-section-head' });
    head.createSpan({ cls: 'icm-section-title', text: 'Колоды' });
    head.createSpan({ cls: 'icm-section-meta', text: 'Выбери тему — очередь перестанет перемешиваться' });

    const grid = section.createDiv({ cls: 'icm-deck-grid' });
    const selected = this.plugin.getSelectedDeck();
    const overall = this.plugin.getOverallStats();
    this.createDeckButton(
      grid,
      'Все колоды',
      {
        name: overall.name,
        total: overall.total,
        due: overall.due,
        fresh: overall.fresh,
        passed: overall.passed,
        mastered: overall.mastered,
      },
      selected === null,
      { icon: 'layers', emoji: '🗂️', color: 'var(--interactive-accent)' },
      null,
    );
    for (const stats of this.plugin.getDeckStats()) {
      this.createDeckButton(grid, stats.name, stats, selected === stats.name, DECK_META[stats.name], stats.name);
    }
  }

  private createDeckButton(
    parent: HTMLElement,
    label: string,
    stats: DeckStats,
    selected: boolean,
    meta: { icon: string; emoji: string; color: string } | undefined,
    deckValue: string | null,
  ): void {
    const btn = parent.createEl('button', {
      cls: `icm-deck-btn${selected ? ' is-selected' : ''}`,
      attr: { type: 'button' },
    });
    btn.style.setProperty('--icm-deck-color', meta?.color ?? 'var(--interactive-accent)');
    const icon = btn.createDiv({ cls: 'icm-deck-icon' });
    setIconWithFallback(icon, meta?.icon ?? 'layers', meta?.emoji ?? '🗂️');
    const body = btn.createDiv({ cls: 'icm-deck-body' });
    body.createDiv({ cls: 'icm-deck-name', text: label });
    body.createDiv({
      cls: 'icm-deck-meta',
      text: `${cardsWord(stats.total)} · к повторению ${stats.due}`,
    });
    const mini = btn.createDiv({ cls: 'icm-deck-mini' });
    mini.createSpan({ cls: 'icm-mini is-new', text: `новых ${stats.fresh}`, title: 'Не пройденные' });
    mini.createSpan({ cls: 'icm-mini is-passed', text: `пройдено ${stats.passed}`, title: 'Пройденные' });
    btn.addEventListener('click', () => void this.plugin.setSelectedDeck(deckValue));
  }

  private renderFiltersAndCards(parent: HTMLElement): void {
    const section = parent.createDiv({ cls: 'icm-section' });
    const deck = this.plugin.getSelectedDeck();
    const filter = this.plugin.getSelectedFilter();
    const head = section.createDiv({ cls: 'icm-section-head' });
    head.createSpan({ cls: 'icm-section-title', text: 'Карточки' });
    head.createSpan({ cls: 'icm-section-meta', text: deck ?? 'Все колоды' });

    const filterRow = section.createDiv({ cls: 'icm-filter-row' });
    for (const item of FILTERS) {
      const count = this.plugin.getQueue(deck, item.key).length;
      const btn = filterRow.createEl('button', {
        cls: `icm-filter-btn${filter === item.key ? ' is-active' : ''}`,
        attr: { type: 'button', title: item.hint },
      });
      btn.createSpan({ text: item.label });
      btn.createSpan({ cls: 'icm-filter-count', text: String(count) });
      btn.addEventListener('click', () => void this.plugin.setSelectedFilter(item.key));
    }

    const queue = this.plugin.getQueue(deck, filter);
    const actions = section.createDiv({ cls: 'icm-actions' });
    const start = actions.createEl('button', {
      cls: 'icm-primary-btn',
      text: '▶ Начать повторение',
      attr: { type: 'button' },
    });
    if (!queue.length) start.disabled = true;
    start.addEventListener('click', () => this.startReview());
    actions.createSpan({
      cls: 'icm-actions-hint',
      text: `В очереди: ${cardsWord(queue.length)}`,
    });

    const list = section.createDiv({ cls: 'icm-card-list' });
    if (!queue.length) {
      list.createDiv({
        cls: 'icm-empty',
        text: 'Здесь пока пусто. Выбери другую колоду или фильтр — карточки никуда не делись.',
      });
      return;
    }
    const now = Date.now();
    for (const card of queue) this.renderCardRow(list, card, now);
  }

  private renderCardRow(parent: HTMLElement, card: CardNote, now: number): void {
    const progress = this.plugin.getProgress(card.id);
    const status = statusFor(progress, now);
    const row = parent.createEl('button', {
      cls: 'icm-card-row',
      attr: { type: 'button' },
    });
    const top = row.createDiv({ cls: 'icm-card-row-top' });
    top.createSpan({ cls: 'icm-card-row-title', text: truncate(card.title, 86) });
    top.createSpan({
      cls: 'icm-card-row-num',
      text: card.order < 999_999 ? String(card.order).padStart(3, '0') : '',
    });
    const meta = row.createDiv({ cls: 'icm-card-row-meta' });
    meta.createSpan({ cls: 'icm-deck-tag', text: card.deck });
    meta.createSpan({ cls: `icm-status-badge ${status.cls}`, text: status.label });
    meta.createSpan({ cls: 'icm-due', text: status.dueLabel });
    if (card.tags.includes('go')) meta.createSpan({ cls: 'icm-tag', text: '#go' });
    if (status.flags.length) {
      const flags = row.createDiv({ cls: 'icm-card-row-flags' });
      for (const flag of status.flags.slice(0, 2)) {
        flags.createSpan({ cls: 'icm-flag', text: flag });
      }
    }
    row.addEventListener('click', () => this.startReview(card.id));
  }

  private renderRecent(parent: HTMLElement): void {
    const logs = this.plugin.getRecentLogs(4);
    if (!logs.length) return;
    const section = parent.createDiv({ cls: 'icm-section icm-recent' });
    section.createDiv({ cls: 'icm-section-title', text: 'Последние повторения' });
    for (const log of logs) this.renderHistoryRow(section, log);
  }

  private renderHistoryRow(parent: HTMLElement, log: ReviewHistoryEntry): void {
    const row = parent.createDiv({ cls: 'icm-history-row' });
    const left = row.createDiv({ cls: 'icm-history-left' });
    left.createDiv({ cls: 'icm-history-title', text: truncate(log.title, 70) });
    left.createDiv({
      cls: 'icm-history-meta',
      text: `${log.deck} · ${formatDateTime(log.at)} · через ${log.scheduledDays} дн.`,
    });
    const right = row.createDiv({ cls: 'icm-history-right' });
    right.createSpan({ cls: 'icm-history-rating', text: ratingLabel(log.rating) });
    if (log.answeredAfterReveal) right.createSpan({ cls: 'icm-flag is-warn', text: 'После показа' });
    if (log.dontKnow) right.createSpan({ cls: 'icm-flag', text: 'Не знаю' });
  }

  private renderReview(): void {
    const rs = this.review;
    const card = rs ? this.plugin.getCardById(rs.cardId) : undefined;
    if (!rs || !card) return;

    const root = this.contentEl.createDiv({ cls: 'icm-review' });
    const queue = this.plugin.getQueue(this.plugin.getSelectedDeck(), this.plugin.getSelectedFilter());
    const index = queue.findIndex((item: CardNote) => item.id === card.id);

    const top = root.createDiv({ cls: 'icm-review-top' });
    const back = top.createEl('button', {
      cls: 'icm-ghost-btn',
      text: '← К колодам',
      attr: { type: 'button' },
    });
    back.addEventListener('click', () => {
      this.mode = 'dashboard';
      this.review = null;
      this.render();
    });
    top.createSpan({ cls: 'icm-deck-pill', text: card.deck });
    top.createSpan({
      cls: 'icm-counter',
      text: index >= 0 ? `${index + 1} / ${queue.length}` : 'Вне очереди',
    });

    const qCard = root.createDiv({ cls: 'icm-question-card' });
    qCard.createDiv({ cls: 'icm-eyebrow', text: `КОЛОДА · ${card.deck.toUpperCase()}` });
    qCard.createEl('h2', { cls: 'icm-question-title', text: card.title });
    if (card.topic) qCard.createDiv({ cls: 'icm-topic', text: card.topic });
    const qText = qCard.createDiv({ cls: 'icm-markdown icm-question-text' });
    this.renderMarkdownInto(qText, card.question, card.path);

    const answerBox = root.createDiv({ cls: 'icm-answer-box' });
    const labelRow = answerBox.createDiv({ cls: 'icm-label-row' });
    labelRow.createSpan({ cls: 'icm-label', text: 'Твой ответ' });
    this.answerBadge = labelRow.createSpan({ cls: 'icm-answer-badge' });
    const textarea = answerBox.createEl('textarea', {
      cls: 'icm-textarea',
      attr: {
        rows: '7',
        placeholder: 'Напиши ответ своими словами…',
        spellcheck: 'false',
      },
    }) as HTMLTextAreaElement;
    textarea.value = rs.answer;
    this.answerTextarea = textarea;
    textarea.addEventListener('input', () => {
      rs.answer = textarea.value;
      if (rs.revealed) rs.typedAfterReveal = true;
      this.updateReviewBadges();
    });
    if (!rs.revealed) window.setTimeout(() => textarea.focus(), 0);

    this.schedulerWarning = root.createDiv({ cls: 'icm-scheduler-warning is-hidden' });

    if (!rs.revealed) {
      const actions = root.createDiv({ cls: 'icm-review-actions' });
      const show = actions.createEl('button', {
        cls: 'icm-primary-btn',
        text: 'Показать ответ',
        attr: { type: 'button' },
      });
      show.addEventListener('click', () => this.reveal('answer'));
      const dont = actions.createEl('button', {
        cls: 'icm-dontknow-btn',
        text: '🤷 Не знаю ответ',
        attr: { type: 'button' },
      });
      dont.addEventListener('click', () => this.reveal('dont-know'));
      root.createDiv({
        cls: 'icm-hint',
        text: 'Ctrl/⌘ + Enter — показать ответ. Не знаешь — жми «Не знаю ответ»: откроется вся заметка, но ответ после показа будет помечен отдельно.',
      });
    } else {
      this.renderRevealed(root, card, rs);
    }
    this.updateReviewBadges();
  }

  private renderRevealed(parent: HTMLElement, card: CardNote, rs: ReviewState): void {
    const reveal = parent.createDiv({ cls: 'icm-reveal' });
    const head = reveal.createDiv({ cls: 'icm-reveal-head' });
    head.createEl('h3', {
      text: rs.revealKind === 'dont-know' ? 'Заметка полностью открыта' : 'Эталон и объяснение',
    });
    head.createSpan({
      cls: `icm-reveal-badge ${rs.revealKind === 'dont-know' ? 'is-warn' : 'is-ok'}`,
      text: rs.revealKind === 'dont-know' ? 'Не знаю ответ' : 'Показать ответ',
    });

    const user = reveal.createDiv({ cls: 'icm-answer-block' });
    user.createDiv({ cls: 'icm-label', text: 'Твой ответ' });
    user.createDiv({
      cls: `icm-user-answer${rs.answer.trim() ? '' : ' is-empty'}`,
      text: rs.answer.trim() || '— ответ не введён —',
    });
    if (rs.typedAfterReveal) {
      user.createDiv({
        cls: 'icm-inline-warning',
        text: 'Этот текст введён или изменён уже после показа эталона.',
      });
    }

    const reference = reveal.createDiv({ cls: 'icm-markdown icm-reference' });
    this.renderMarkdownInto(reference, buildExplanationMarkdown(card), card.path);

    const full = reveal.createDiv({ cls: 'icm-full-note-section' });
    const toggle = full.createEl('button', {
      cls: 'icm-ghost-btn',
      text: rs.fullNoteOpen ? 'Скрыть полную заметку' : 'Открыть заметку полностью',
      attr: { type: 'button' },
    });
    toggle.addEventListener('click', () => {
      rs.fullNoteOpen = !rs.fullNoteOpen;
      this.render();
    });
    const fullContainer = full.createDiv({ cls: 'icm-markdown icm-full-note' });
    if (rs.fullNoteOpen) {
      this.renderMarkdownInto(fullContainer, card.fullMarkdown, card.path);
    } else {
      fullContainer.createDiv({
        cls: 'icm-full-note-placeholder',
        text: 'Здесь появится исходная Markdown-заметка целиком.',
      });
    }

    const open = reveal.createEl('button', {
      cls: 'icm-ghost-btn icm-open-note',
      text: 'Открыть заметку в Obsidian',
      attr: { type: 'button' },
    });
    open.addEventListener('click', () => this.openNote(card));

    const rating = reveal.createDiv({ cls: 'icm-rating' });
    rating.createDiv({ cls: 'icm-label', text: 'Насколько легко вспомнил?' });
    rating.createDiv({
      cls: 'icm-rating-hint',
      text: 'Клавиши 1–4 · выбранная оценка сохранится в журнале',
    });
    const row = rating.createDiv({ cls: 'icm-rating-row' });
    for (const item of RATINGS) {
      const btn = row.createEl('button', {
        cls: `icm-rating-btn is-${item.cls}`,
        attr: { type: 'button' },
      });
      btn.createDiv({ cls: 'icm-rating-title', text: `${item.ru} / ${item.en}` });
      btn.createDiv({ cls: 'icm-rating-desc', text: item.desc });
      btn.createDiv({ cls: 'icm-rating-key', text: item.key });
      btn.addEventListener('click', () => void this.grade(item.value));
    }
  }

  private openNote(card: CardNote): void {
    const file = this.app.vault.getAbstractFileByPath(card.path);
    if (file instanceof TFile) {
      void this.app.workspace.getLeaf().openFile(file);
    } else {
      new Notice('Исходная заметка не найдена');
    }
  }

  private renderMarkdownInto(container: HTMLElement, markdown: string, sourcePath: string): void {
    container.replaceChildren();
    const renderer = MarkdownRenderer as unknown as {
      render?: (...args: unknown[]) => Promise<void>;
      renderMarkdown?: (...args: unknown[]) => Promise<void>;
    };
    void (async () => {
      try {
        if (typeof renderer.render === 'function') {
          await renderer.render(this.app, markdown, container, sourcePath, this);
        } else if (typeof renderer.renderMarkdown === 'function') {
          await renderer.renderMarkdown(markdown, container, sourcePath, this);
        } else {
          container.textContent = markdown;
        }
      } catch (error) {
        console.error('[Карточки MAX] Ошибка рендера Markdown', error);
        container.textContent = markdown;
      }
    })();
  }
}
