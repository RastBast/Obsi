import type { App, TFile } from 'obsidian';
import { deckRank } from './types';

export interface CardNote {
  id: string;
  path: string;
  file: TFile;
  title: string;
  question: string;
  questionKey: string;
  shortAnswer: string;
  middle: string;
  senior: string;
  simple: string;
  fullMarkdown: string;
  deck: string;
  tags: string[];
  topic: string;
  order: number;
}

function stripFrontmatter(raw: string): string {
  return raw
    .replace(/^\uFEFF/, '')
    .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
    .trim();
}

function normalizeTags(raw: unknown): string[] {
  const clean = (value: unknown): string =>
    String(value).trim().replace(/^\[|\]$/g, '').trim();
  if (Array.isArray(raw)) return raw.map(clean).filter(Boolean);
  if (typeof raw === 'string') return raw.split(/[,\s]+/).map(clean).filter(Boolean);
  return [];
}

function questionKeyOf(question: string): string {
  return question.replace(/\s+/g, ' ').trim().toLocaleLowerCase('ru');
}

/**
 * Заметка со служебным флагом остаётся обычной заметкой Obsidian,
 * но не превращается в карточку (например, README папки).
 */
function isIgnored(fm: Record<string, unknown>): boolean {
  const flag = fm.icmIgnore ?? fm['icm-ignore'];
  if (flag === true || (typeof flag === 'string' && flag.trim().toLowerCase() === 'true')) return true;
  const cardFlag = fm.card;
  if (cardFlag === false || (typeof cardFlag === 'string' && cardFlag.trim().toLowerCase() === 'false')) {
    return true;
  }
  return normalizeTags(fm.tags).includes('icm-ignore');
}

/** Тема = имя подпапки внутри родительской папки карточек. */
function deckFromPath(file: TFile, rootPath: string): string {
  const prefix = `${rootPath.replace(/^\/+|\/+$/g, '')}/`;
  const rel = file.path.startsWith(prefix) ? file.path.slice(prefix.length) : file.path;
  const parts = rel.split('/');
  const folder = parts.length > 1 ? parts[0] : '';
  return folder || 'Без темы';
}

function orderFromFile(file: TFile): number {
  const m = file.basename.match(/^(\d+)/);
  return m ? Number(m[1]) : 999_999;
}

interface ParsedSections {
  title: string;
  sections: Record<string, string>;
}

function parseSections(body: string): ParsedSections {
  const lines = body.split(/\r?\n/);
  let title = '';
  let current: string | null = null;
  let inFence = false;
  const buckets: Record<string, string[]> = {};

  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      if (current) buckets[current].push(line);
      continue;
    }
    if (!inFence && !title && line.startsWith('# ')) {
      title = line.slice(2).trim();
      continue;
    }
    if (!inFence) {
      const m = line.match(/^##\s+(.+?)\s*$/);
      if (m) {
        current = m[1].trim();
        buckets[current] = [];
        continue;
      }
    }
    if (current) buckets[current].push(line);
  }

  const sections: Record<string, string> = {};
  for (const [name, lines] of Object.entries(buckets)) {
    sections[name] = lines.join('\n').trim();
  }
  return { title, sections };
}

function pickSection(sections: Record<string, string>, exact: string, prefix = ''): string {
  if (sections[exact] !== undefined) return sections[exact];
  if (prefix) {
    const found = Object.entries(sections).find(([name]) => name.startsWith(prefix));
    if (found) return found[1];
  }
  return '';
}

function firstParagraph(body: string): string {
  const parts = body.split(/\n\s*\n/);
  return (parts.find((part) => part.trim()) ?? '').trim();
}

export function buildExplanationMarkdown(card: CardNote): string {
  const parts: string[] = [];
  const add = (heading: string, body: string): void => {
    if (body.trim()) parts.push(`## ${heading}\n\n${body.trim()}`);
  };
  add('Краткий ответ', card.shortAnswer);
  add('Развёрнутый ответ мидла', card.middle);
  add('Развёрнутый ответ сеньора: все тонкости', card.senior);
  add('Если забыл / Простыми словами', card.simple);
  if (!parts.length) parts.push(card.fullMarkdown);
  return parts.join('\n\n---\n\n');
}

async function parseCard(app: App, file: TFile, rootPath: string): Promise<CardNote | null> {
  const raw = await app.vault.cachedRead(file);
  const fullMarkdown = stripFrontmatter(raw);
  const cache = app.metadataCache.getFileCache(file);
  const fm = (cache?.frontmatter ?? {}) as Record<string, unknown>;
  if (isIgnored(fm)) return null;

  const parsed = parseSections(fullMarkdown);
  const body = fullMarkdown.trim();
  const title = parsed.title || file.basename;
  const hasSections = Object.keys(parsed.sections).length > 0;

  // Структурированные 220 карточек читаем как раньше.
  // Любая другая заметка тоже становится карточкой: вопрос = первый абзац/заголовок,
  // ответ = всё содержимое заметки. Так можно просто «закинуть» свои заметки в папку.
  const question = pickSection(parsed.sections, 'Вопрос') || firstParagraph(body) || title;
  const shortAnswer =
    pickSection(parsed.sections, 'Краткий ответ') || (hasSections ? '' : body);
  const middle = pickSection(parsed.sections, 'Развёрнутый ответ мидла');
  const senior = pickSection(
    parsed.sections,
    'Развёрнутый ответ сеньора: все тонкости',
    'Развёрнутый ответ сеньора',
  );
  const simple = pickSection(parsed.sections, 'Если забыл / Простыми словами');

  const declaredDeck = typeof fm.deck === 'string' ? fm.deck.trim() : '';
  const deck = declaredDeck || deckFromPath(file, rootPath);
  const tags = normalizeTags(fm.tags);
  const topic = typeof fm.topic === 'string' ? fm.topic.trim() : '';

  return {
    id: file.path,
    path: file.path,
    file,
    title,
    question,
    questionKey: questionKeyOf(question),
    shortAnswer,
    middle,
    senior,
    simple,
    fullMarkdown,
    deck,
    tags,
    topic,
    order: orderFromFile(file),
  };
}

export async function loadCards(app: App, rootPath: string): Promise<CardNote[]> {
  const prefix = `${rootPath.replace(/^\/+|\/+$/g, '')}/`;
  const files = app.vault.getMarkdownFiles().filter((file) => file.path.startsWith(prefix));
  const cards: CardNote[] = [];
  for (const file of files) {
    try {
      const card = await parseCard(app, file, rootPath);
      if (card) cards.push(card);
    } catch (error) {
      console.error(`[Карточки MAX] Не удалось разобрать ${file.path}`, error);
    }
  }
  cards.sort((a, b) => {
    const dr = deckRank(a.deck) - deckRank(b.deck);
    if (dr !== 0) return dr;
    if (a.order !== b.order) return a.order - b.order;
    return a.path.localeCompare(b.path, 'ru');
  });
  return cards;
}
