import {
  App,
  Modal,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  TAbstractFile,
  WorkspaceLeaf,
  setIcon,
} from 'obsidian';
import type { Grade } from 'ts-fsrs';
import { CardsMaxView } from './view';
import { loadCards, type CardNote } from './cards';
import {
  createEmptyProgress,
  gradeCard,
  RATING_AGAIN,
} from './scheduler';
import { isDue, isMastered, isPassed } from './status';
import {
  DEFAULT_CARDS_PATH,
  DECK_ORDER,
  HISTORY_LIMIT,
  PLUGIN_ID,
  VIEW_TYPE,
  deckRank,
  emptyProgress,
  normalizeData,
  type CardProgress,
  type DailyStat,
  type DeckStats,
  type FilterKey,
  type GradeRequest,
  type OverallStats,
  type PluginData,
  type PluginSettings,
  type ReviewHistoryEntry,
  type StreakState,
} from './types';
import { cardsWord, dateKey, dayOffsetKey, reviewsWord } from './format';

void PLUGIN_ID;

function setIconWithFallback(el: HTMLElement, icon: string, fallback: string): void {
  setIcon(el, icon);
  if (!el.querySelector('svg')) el.textContent = fallback;
}

interface ObsidianSettingsHost {
  setting?: {
    open?: () => void;
    openTabById?: (id: string) => void;
  };
}

class ConfirmModal extends Modal {
  constructor(
    app: App,
    private readonly heading: string,
    private readonly message: string,
    private readonly onConfirm: () => void,
  ) {
    super(app);
  }

  onOpen(): void {
    this.contentEl.createEl('h3', { cls: 'icm-modal-title', text: this.heading });
    this.contentEl.createEl('p', { cls: 'icm-modal-text', text: this.message });
    const row = this.contentEl.createDiv({ cls: 'icm-modal-actions' });
    const cancel = row.createEl('button', { text: 'Отмена', attr: { type: 'button' } });
    cancel.addEventListener('click', () => this.close());
    const ok = row.createEl('button', {
      text: 'Сбросить',
      cls: 'mod-warning',
      attr: { type: 'button' },
    });
    ok.addEventListener('click', () => {
      this.onConfirm();
      this.close();
    });
  }
}

export class CardsMaxPlugin extends Plugin {
  data: PluginData = normalizeData(null);
  settings: PluginSettings = this.data.settings;
  cards: CardNote[] = [];

  private refreshTimer: number | null = null;
  private statusItem: HTMLElement | null = null;
  private statusText: HTMLElement | null = null;

  async onload(): Promise<void> {
    const raw = await this.loadData();
    this.data = normalizeData(raw);
    this.settings = this.data.settings;

    await this.refreshCards(false);

    this.registerView(VIEW_TYPE, (leaf: WorkspaceLeaf) => new CardsMaxView(leaf, this));

    const ribbon = this.addRibbonIcon('flame', 'Открыть «Карточки MAX»', () => void this.activateView());
    ribbon.classList.add('icm-ribbon');

    this.addCommand({
      id: 'open-cards-max-panel',
      name: 'Открыть панель «Карточки MAX»',
      callback: () => void this.activateView(),
    });
    this.addCommand({
      id: 'start-cards-max-review',
      name: 'Начать повторение «Карточки MAX»',
      callback: () => void this.startReviewFromCommand(),
    });

    this.addSettingTab(new CardsMaxSettingTab(this.app, this));
    this.setupStatusBar();
    this.registerVaultEvents();
    this.register(() => {
      if (this.refreshTimer !== null) window.clearTimeout(this.refreshTimer);
    });
  }

  onunload(): void {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE);
  }

  async save(): Promise<void> {
    this.data.settings = this.settings;
    await this.saveData(this.data);
    this.updateStatusBar();
  }

  async setSetting<K extends keyof PluginSettings>(key: K, value: PluginSettings[K]): Promise<void> {
    (this.settings as unknown as Record<string, unknown>)[key] = value;
    await this.save();
    if (key === 'cardsPath') await this.refreshCards(false);
    if (key === 'showStreakInStatusBar') this.updateStatusBar();
    this.refreshAllViews();
  }

  async refreshCards(showNotice = true): Promise<void> {
    this.cards = await loadCards(this.app, this.settings.cardsPath);
    if (!this.cards.length) {
      new Notice(`«Карточки MAX»: по пути ${this.settings.cardsPath} карточки не найдены`);
    } else if (showNotice) {
      new Notice(`«Карточки MAX»: загружено ${cardsWord(this.cards.length)}`);
    }
    this.refreshAllViews();
  }

  private registerVaultEvents(): void {
    const prefix = (): string => `${this.settings.cardsPath.replace(/^\/+|\/+$/g, '')}/`;
    const relevant = (path: string): boolean => path.startsWith(prefix());
    const handler = (file: TAbstractFile): void => {
      if (relevant(file.path)) this.scheduleRefresh();
    };
    this.registerEvent(this.app.vault.on('modify', handler));
    this.registerEvent(this.app.vault.on('create', handler));
    this.registerEvent(this.app.vault.on('delete', handler));
    this.registerEvent(
      this.app.vault.on('rename', (file: TAbstractFile, oldPath: string) => {
        if (relevant(file.path) || relevant(oldPath)) this.scheduleRefresh();
      }),
    );
  }

  private scheduleRefresh(): void {
    if (this.refreshTimer !== null) window.clearTimeout(this.refreshTimer);
    this.refreshTimer = window.setTimeout(() => {
      this.refreshTimer = null;
      void this.refreshCards(false);
    }, 350);
  }

  private setupStatusBar(): void {
    if (this.statusItem) {
      this.updateStatusBar();
      return;
    }
    const item = this.addStatusBarItem();
    item.classList.add('icm-status-bar');
    item.setAttribute('aria-label', 'Открыть панель «Карточки MAX»');
    item.setAttribute('role', 'button');
    const flame = item.createSpan({ cls: 'icm-status-flame' });
    setIconWithFallback(flame, 'flame', '🔥');
    this.statusText = item.createSpan({ cls: 'icm-status-text' });
    item.addEventListener('click', () => void this.activateView());
    this.statusItem = item;
    this.updateStatusBar();
  }

  private updateStatusBar(): void {
    if (!this.statusItem || !this.statusText) return;
    const today = dateKey(new Date());
    const active = this.data.streak.lastDate === today;
    const todayStat = this.data.daily[today]?.reviews ?? 0;
    this.statusItem.style.display = this.settings.showStreakInStatusBar ? '' : 'none';
    this.statusItem.classList.toggle('is-cold', !active);
    this.statusText.textContent = String(this.data.streak.current);
    this.statusItem.setAttribute(
      'title',
      active
        ? `🔥 Серия: ${this.data.streak.current} дн. · сегодня ${reviewsWord(todayStat)} · рекорд ${this.data.streak.best}`
        : `🔥 Серия: ${this.data.streak.current} дн. · сегодня ещё не повторял · рекорд ${this.data.streak.best}`,
    );
  }

  async activateView(): Promise<void> {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE)[0];
    let leaf: WorkspaceLeaf;
    if (existing) {
      leaf = existing;
    } else {
      const right = this.app.workspace.getRightLeaf(false);
      if (!right) {
        new Notice('Не удалось открыть правую боковую панель');
        return;
      }
      leaf = right;
      await leaf.setViewState({ type: VIEW_TYPE, active: true });
    }
    this.app.workspace.revealLeaf(leaf);
  }

  private getView(): CardsMaxView | null {
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE)) {
      if (leaf.view instanceof CardsMaxView) return leaf.view;
    }
    return null;
  }

  private async startReviewFromCommand(): Promise<void> {
    await this.activateView();
    const view = this.getView();
    if (view) view.startReview();
    else window.setTimeout(() => this.getView()?.startReview(), 50);
  }

  refreshAllViews(): void {
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE)) {
      if (leaf.view instanceof CardsMaxView) leaf.view.render();
    }
  }

  openSettings(): void {
    const host = this.app as unknown as ObsidianSettingsHost;
    if (host.setting?.open && host.setting?.openTabById) {
      host.setting.open();
      host.setting.openTabById(this.manifest.id);
    } else {
      new Notice('Открой «Настройки → Сторонние плагины → Карточки собеседования MAX»');
    }
  }

  confirmReset(): void {
    new ConfirmModal(
      this.app,
      'Сбросить весь прогресс?',
      'Удалятся расписание FSRS, серия 🔥, история и пометки «Не знаю». Markdown-заметки останутся без изменений.',
      () => void this.resetProgress(),
    ).open();
  }

  async resetProgress(): Promise<void> {
    this.data.cards = {};
    this.data.streak = { current: 0, best: 0, lastDate: null };
    this.data.daily = {};
    this.data.history = [];
    await this.save();
    this.refreshAllViews();
    new Notice('Прогресс «Карточек MAX» сброшен');
  }

  getSettings(): PluginSettings {
    return this.settings;
  }

  getSelectedDeck(): string | null {
    return this.data.selectedDeck;
  }

  getSelectedFilter(): FilterKey {
    return this.data.selectedFilter;
  }

  async setSelectedDeck(deck: string | null): Promise<void> {
    this.data.selectedDeck = deck && DECK_ORDER.includes(deck as (typeof DECK_ORDER)[number]) ? deck : null;
    await this.save();
    this.refreshAllViews();
  }

  async setSelectedFilter(filter: FilterKey): Promise<void> {
    this.data.selectedFilter = filter;
    await this.save();
    this.refreshAllViews();
  }

  getStreak(): StreakState {
    return this.data.streak;
  }

  getDaily(): Record<string, DailyStat> {
    return this.data.daily;
  }

  getRecentLogs(limit = 5): ReviewHistoryEntry[] {
    return this.data.history.slice(0, limit);
  }

  getCardById(id: string): CardNote | undefined {
    return this.cards.find((card) => card.id === id);
  }

  getProgress(id: string): CardProgress {
    return this.data.cards[id] ?? emptyProgress(Date.now());
  }

  getQueue(deck: string | null, filter: FilterKey): CardNote[] {
    const now = Date.now();
    let pool = this.cards;
    if (deck) pool = pool.filter((card) => card.deck === deck);

    const today = dateKey(new Date(now));
    const introducedToday = this.data.daily[today]?.newCards ?? 0;
    const newLimit =
      this.settings.newPerDay > 0
        ? Math.max(0, this.settings.newPerDay - introducedToday)
        : Number.POSITIVE_INFINITY;

    const fresh = pool.filter((card) => this.getProgress(card.id).reps === 0);
    const due = pool.filter((card) => isDue(this.getProgress(card.id), now));
    const passed = pool.filter((card) => isPassed(this.getProgress(card.id)));
    const mastered = pool.filter((card) => isMastered(this.getProgress(card.id), now));

    let queue: CardNote[];
    switch (filter) {
      case 'new':
        queue = fresh;
        break;
      case 'passed':
        queue = passed;
        break;
      case 'mastered':
        queue = mastered;
        break;
      case 'all':
        queue = [...pool];
        break;
      case 'due':
      default:
        queue = [...due, ...fresh.slice(0, newLimit)];
        break;
    }
    return this.sortQueue(queue, deck, now);
  }

  private sortQueue(queue: CardNote[], deck: string | null, now: number): CardNote[] {
    const rank = (card: CardNote): number => {
      const p = this.getProgress(card.id);
      if (p.reps === 0) return 1;
      if (p.due <= now) return 0;
      return 2;
    };
    return [...queue].sort((a, b) => {
      if (this.settings.groupByDeck && !deck) {
        const dr = deckRank(a.deck) - deckRank(b.deck);
        if (dr !== 0) return dr;
      }
      const ra = rank(a);
      const rb = rank(b);
      if (ra !== rb) return ra - rb;
      const pa = this.getProgress(a.id);
      const pb = this.getProgress(b.id);
      if (pa.reps > 0 && pb.reps > 0 && pa.due !== pb.due) return pa.due - pb.due;
      if (a.order !== b.order) return a.order - b.order;
      return a.path.localeCompare(b.path, 'ru');
    });
  }

  private statsFor(cards: CardNote[], name: string): DeckStats {
    const now = Date.now();
    return {
      name,
      total: cards.length,
      due: cards.filter((card) => isDue(this.getProgress(card.id), now)).length,
      fresh: cards.filter((card) => !isPassed(this.getProgress(card.id))).length,
      passed: cards.filter((card) => isPassed(this.getProgress(card.id))).length,
      mastered: cards.filter((card) => isMastered(this.getProgress(card.id), now)).length,
    };
  }

  getDeckStats(): DeckStats[] {
    return DECK_ORDER.map((name) => this.statsFor(this.cards.filter((card) => card.deck === name), name));
  }

  getOverallStats(): OverallStats {
    const base = this.statsFor(this.cards, 'Все колоды');
    const dontKnow = Object.values(this.data.cards).filter((p) => p.dontKnow).length;
    const afterReveal = Object.values(this.data.cards).filter((p) => p.answeredAfterReveal).length;
    return { ...base, name: 'Все колоды', dontKnow, afterReveal };
  }

  async grade(request: GradeRequest): Promise<CardNote | null> {
    const card = this.getCardById(request.cardId);
    if (!card) return null;

    const now = Date.now();
    const previous = this.data.cards[card.id] ?? createEmptyProgress(now);
    const wasNew = previous.reps === 0;
    const afterRevealPenalty =
      request.typedAfterReveal && this.settings.countAnswerAfterRevealAsAgain;

    const chosenRating = request.rating as Grade;
    const effectiveRating = afterRevealPenalty ? RATING_AGAIN : chosenRating;
    const result = gradeCard(previous, effectiveRating, now, this.settings);

    const next: CardProgress = {
      ...previous,
      ...result.progress,
      firstReviewed: previous.firstReviewed ?? now,
      reviewCount: previous.reviewCount + 1,
      lastRating: chosenRating,
      effectiveRating,
      lastAnswer: request.answer,
      answeredAfterReveal: request.typedAfterReveal,
      dontKnow:
        request.revealKind === 'dont-know' ||
        request.answerAtReveal.trim().length === 0,
      typedAfterRevealCount:
        previous.typedAfterRevealCount + (request.typedAfterReveal ? 1 : 0),
      dontKnowCount: previous.dontKnowCount + (request.revealKind === 'dont-know' ? 1 : 0),
    };

    this.data.cards[card.id] = next;
    this.recordDaily(now, wasNew, request);
    this.updateStreak(now);

    const entry: ReviewHistoryEntry = {
      cardId: card.id,
      deck: card.deck,
      title: card.title,
      at: now,
      rating: chosenRating,
      effectiveRating,
      answeredAfterReveal: request.typedAfterReveal,
      dontKnow: next.dontKnow,
      scheduledDays: result.scheduledDays,
      state: result.state,
    };
    this.data.history.unshift(entry);
    this.data.history = this.data.history.slice(0, HISTORY_LIMIT);

    await this.save();
    this.refreshAllViews();

    if (afterRevealPenalty) {
      new Notice('Ответ после показа сохранён, но для FSRS засчитан как «Снова» (Again)');
    }

    if (!this.settings.autoNext) return null;
    const queue = this.getQueue(this.data.selectedDeck, this.data.selectedFilter);
    return queue.find((candidate) => candidate.id !== card.id) ?? null;
  }

  private recordDaily(now: number, wasNew: boolean, request: GradeRequest): void {
    const key = dateKey(new Date(now));
    const stat: DailyStat = this.data.daily[key] ?? {
      reviews: 0,
      newCards: 0,
      dontKnow: 0,
      afterReveal: 0,
    };
    stat.reviews += 1;
    if (wasNew) stat.newCards += 1;
    if (request.revealKind === 'dont-know' || request.answerAtReveal.trim().length === 0) {
      stat.dontKnow += 1;
    }
    if (request.typedAfterReveal) stat.afterReveal += 1;
    this.data.daily[key] = stat;
  }

  private updateStreak(now: number): void {
    const today = dateKey(new Date(now));
    const streak = this.data.streak;
    if (streak.lastDate === today) return;
    const yesterday = dayOffsetKey(now, -1);
    streak.current = streak.lastDate === yesterday ? streak.current + 1 : 1;
    streak.best = Math.max(streak.best, streak.current);
    streak.lastDate = today;
  }
}

class CardsMaxSettingTab extends PluginSettingTab {
  constructor(app: App, private readonly plugin: CardsMaxPlugin) {
    super(app, plugin);
  }

  display(): void {
    const { containerEl } = this;
    containerEl.replaceChildren();
    containerEl.createEl('h2', { text: 'Карточки собеседования MAX' });
    containerEl.createEl('p', {
      cls: 'setting-item-description',
      text: 'Русскоязычные колоды, FSRS, серия и честная пометка ответов после показа.',
    });

    new Setting(containerEl)
      .setName('Путь к карточкам')
      .setDesc('Папка с Markdown-заметками внутри vault.')
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_CARDS_PATH)
          .setValue(this.plugin.settings.cardsPath)
          .onChange((value) => {
            void this.plugin.setSetting('cardsPath', value.trim() || DEFAULT_CARDS_PATH);
          }),
      );

    new Setting(containerEl)
      .setName('Новых карточек в день')
      .setDesc('0 — без ограничения. Ограничение не скрывает уже назначенные повторения.')
      .addText((text) => {
        text
          .setPlaceholder('20')
          .setValue(String(this.plugin.settings.newPerDay))
          .onChange((value) => {
            const n = Number.parseInt(value, 10);
            if (Number.isFinite(n) && n >= 0) void this.plugin.setSetting('newPerDay', n);
          });
        text.inputEl.type = 'number';
        text.inputEl.min = '0';
      });

    new Setting(containerEl)
      .setName('Желаемая запоминаемость')
      .setDesc('FSRS: 0.90 — стандарт. Выше — карточки появляются чаще.')
      .addSlider((slider) =>
        slider
          .setLimits(0.8, 0.98, 0.01)
          .setValue(this.plugin.settings.requestRetention)
          .setDynamicTooltip()
          .onChange((value) => void this.plugin.setSetting('requestRetention', value)),
      );

    new Setting(containerEl)
      .setName('Максимальный интервал')
      .setDesc('В днях. После этого интервал больше не растёт.')
      .addText((text) => {
        text
          .setPlaceholder('365')
          .setValue(String(this.plugin.settings.maximumInterval))
          .onChange((value) => {
            const n = Number.parseInt(value, 10);
            if (Number.isFinite(n) && n >= 7) void this.plugin.setSetting('maximumInterval', n);
          });
        text.inputEl.type = 'number';
        text.inputEl.min = '7';
      });

    new Setting(containerEl)
      .setName('Разброс интервалов (fuzz)')
      .setDesc('Небольшой случайный разброс, чтобы повторения не скапливались в один день.')
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.enableFuzz).onChange((value) => {
          void this.plugin.setSetting('enableFuzz', value);
        }),
      );

    new Setting(containerEl)
      .setName('Короткие шаги обучения')
      .setDesc('Минутные интервалы для новых карточек и после «Снова».')
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.enableShortTerm).onChange((value) => {
          void this.plugin.setSetting('enableShortTerm', value);
        }),
      );

    new Setting(containerEl)
      .setName('«Не знаю ответ» открывает всю заметку')
      .setDesc('Показывает полный Markdown целиком: вопрос, эталон и все уровни объяснения.')
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.showFullNoteOnDontKnow).onChange((value) => {
          void this.plugin.setSetting('showFullNoteOnDontKnow', value);
        }),
      );

    new Setting(containerEl)
      .setName('Ответ после показа → Again')
      .setDesc(
        'Если после раскрытия ответ изменить, он попадёт в журнал, но FSRS не засчитает его как успешное воспоминание.',
      )
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.countAnswerAfterRevealAsAgain).onChange((value) => {
          void this.plugin.setSetting('countAnswerAfterRevealAsAgain', value);
        }),
      );

    new Setting(containerEl)
      .setName('Автопереход к следующей карточке')
      .setDesc('После оценки сразу открывать следующую карточку текущей очереди.')
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.autoNext).onChange((value) => {
          void this.plugin.setSetting('autoNext', value);
        }),
      );

    new Setting(containerEl)
      .setName('Группировать по колодам')
      .setDesc('В режиме «Все колоды» карточки идут блоками по темам, а не вперемежку.')
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.groupByDeck).onChange((value) => {
          void this.plugin.setSetting('groupByDeck', value);
        }),
      );

    new Setting(containerEl)
      .setName('Огонёк в строке состояния')
      .setDesc('Показывать 🔥 и текущую серию внизу окна Obsidian.')
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.showStreakInStatusBar).onChange((value) => {
          void this.plugin.setSetting('showStreakInStatusBar', value);
        }),
      );

    new Setting(containerEl)
      .setName('Панель')
      .setDesc('Открыть боковую панель с колодами и повторением.')
      .addButton((button) =>
        button.setButtonText('Открыть панель').onClick(() => void this.plugin.activateView()),
      );

    new Setting(containerEl)
      .setName('Прогресс')
      .setDesc('Расписание, серия, история и пометки хранятся в data.json плагина. Заметки не изменяются.')
      .addButton((button) =>
        button
          .setButtonText('Сбросить прогресс…')
          .setWarning()
          .onClick(() => this.plugin.confirmReset()),
      );

    containerEl.createEl('hr');
    containerEl.createEl('p', {
      cls: 'setting-item-description',
      text: `Версия ${this.plugin.manifest.version} · ${cardsWord(this.plugin.cards.length)} · 9 колод · FSRS от ts-fsrs (MIT).`,
    });
  }
}

export default CardsMaxPlugin;
