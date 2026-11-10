#!/usr/bin/env bash
# Копирует готовый локальный плагин «Карточки MAX» и 220 заметок в vault,
# который синхронизируется через iCloud и открывается в Obsidian на iPhone.
#
# Запускать на Mac/ПК, где доступна папка iCloud-хранилища:
#   ./install-to-icloud.sh "/путь/к/вашему/vault"
#
# Скрипт НЕ трогает data.json: прогресс, лайки и комментарии не перезаписываются.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_SRC="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"

TARGET="${1:-}"
if [[ -z "$TARGET" ]]; then
  echo "Использование: $0 \"<путь к vault в iCloud>\""
  echo
  echo "Пример для стандартного хранилища Obsidian:"
  echo "  $0 \"\$HOME/Library/Mobile Documents/iCloud~md~obsidian/Documents/Мой vault\""
  echo
  echo "Пример для произвольной папки в iCloud Drive:"
  echo "  $0 \"\$HOME/Library/Mobile Documents/com~apple~CloudDocs/Мой vault\""
  exit 1
fi

if [[ ! -d "$TARGET" ]]; then
  echo "Ошибка: папка не найдена: $TARGET" >&2
  exit 1
fi

for required in manifest.json main.js styles.css; do
  if [[ ! -f "$PLUGIN_SRC/$required" ]]; then
    echo "Ошибка: в $PLUGIN_SRC нет $required. Сначала выполни npm run check." >&2
    exit 1
  fi
done

PLUGIN_DST="$TARGET/.obsidian/plugins/interview-cards-max"
mkdir -p "$PLUGIN_DST"

for file in manifest.json main.js styles.css README.md LICENSE-ts-fsrs.txt; do
  if [[ -f "$PLUGIN_SRC/$file" ]]; then
    cp "$PLUGIN_SRC/$file" "$PLUGIN_DST/$file"
  fi
done

# Плагин читает карточки по пути Golang-Middle-Interview/Cards относительно корня vault.
CARDS_SRC="$REPO_ROOT/Golang-Middle-Interview/Cards"
CARDS_DST="$TARGET/Golang-Middle-Interview/Cards"
if [[ -d "$CARDS_SRC" ]]; then
  if [[ -d "$CARDS_DST" ]]; then
    echo "Карточки уже есть в vault — оставляю как есть: $CARDS_DST"
  else
    mkdir -p "$TARGET/Golang-Middle-Interview"
    cp -R "$CARDS_SRC" "$CARDS_DST"
    echo "Скопировано 220 заметок: $CARDS_DST"
  fi
else
  echo "Внимание: в репозитории не найден $CARDS_SRC" >&2
  echo "Скопируй папку Cards в $CARDS_DST вручную, иначе лента будет пустой." >&2
fi

echo
echo "Готово. Плагин лежит здесь:"
echo "  $PLUGIN_DST"
echo
echo "Дальше:"
echo "  1. Дождись, пока iCloud синхронизирует папку vault."
echo "  2. На iPhone открой тот же vault в Obsidian."
echo "  3. Настройки → Сторонние плагины → включи «Карточки собеседования MAX» один раз."
echo "  4. Нажми 📱 на ленте или команду «Открыть ленту «Карточки MAX»»."
echo
echo "Собирать плагин на iPhone не нужно: main.js уже скомпилирован."
