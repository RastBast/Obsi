import { build } from 'esbuild';
import { copyFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const entry = resolve(here, 'src/main.ts');
const outfile = resolve(here, 'main.js');
const cssFrom = resolve(here, 'src/styles.css');
const cssTo = resolve(here, 'styles.css');

await build({
  entryPoints: [entry],
  outfile,
  bundle: true,
  platform: 'browser',
  format: 'cjs',
  target: 'es2020',
  external: ['obsidian', 'electron', '@codemirror/*', '@lezer/*'],
  sourcemap: false,
  minify: false,
  legalComments: 'none',
  banner: {
    js: '/* Карточки собеседования MAX — локальный плагин Obsidian. FSRS: ts-fsrs (MIT). */',
  },
  logLevel: 'info',
});

copyFileSync(cssFrom, cssTo);
console.log('Собрано: main.js и styles.css');
