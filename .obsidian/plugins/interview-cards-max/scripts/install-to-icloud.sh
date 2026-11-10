#!/usr/bin/env bash
# Копирует готовый локальный плагин «Карточки MAX» и папку «Карточки»
# (220 заметок, 9 тем) в vault, который синхронизируется через iCloud
# и открывается в Obsidian на iPhone.
#
# Установка:
#   ./install-to-icloud.sh "/путь/к/вашему/vault"
#
# Только проверка (ничего не копирует):
#   ./install-to-icloud.sh --check "/путь/к/вашему/vault"
#
# Скрипт НЕ трогает data.json: прогресс, лайки и комментарии не перезаписываются.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_SRC="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
DECKS=(Go Docker Kubernetes Сети Алгоритмы БД Рантайм Redis Kafka)

usage() {
  echo "Использование: $0 \"<путь к vault в iCloud>\""
  echo "           или: $0 --check \"<путь к vault в iCloud>\""
  echo
  echo "Пример для стандартного хранилища Obsidian:"
  echo "  $0 \"\$HOME/Library/Mobile Documents/iCloud~md~obsidian/Documents/Мой vault\""
  echo
  echo "Пример для произвольной папки в iCloud Drive:"
  echo "  $0 \"\$HOME/Library/Mobile Documents/com~apple~CloudDocs/Мой vault\""
}

MODE="install"
TARGET=""
if [[ "${1:-}" == "--check" || "${1:-}" == "--verify" ]]; then
  MODE="check"
  TARGET="${2:-}"
elif [[ -n "${1:-}" ]]; then
  TARGET="$1"
else
  usage
  exit 1
fi

if [[ -z "$TARGET" ]]; then
  usage
  exit 1
fi

if [[ ! -d "$TARGET" ]]; then
  echo "Ошибка: папка не найдена: $TARGET" >&2
  exit 1
fi

PLUGIN_DST="$TARGET/.obsidian/plugins/interview-cards-max"
CARDS_DST="$TARGET/Карточки"

version_of() {
  grep -o '"version"[[:space:]]*:[[:space:]]*"[^"]*"' "$1" 2>/dev/null \
    | head -1 | grep -o '[0-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*' || true
}

ERRORS=0
ok() { printf '  ✓ %s\n' "$1"; }
bad() { printf '  ✗ %s\n' "$1" >&2; ERRORS=$((ERRORS + 1)); }

verify() {
  ERRORS=0

  echo "Проверка vault: $TARGET"
  echo

  if [[ -d "$PLUGIN_DST" ]]; then ok "папка плагина есть"; else bad "нет папки $PLUGIN_DST"; fi

  for file in manifest.json main.js styles.css; do
    if [[ -s "$PLUGIN_DST/$file" ]]; then ok "$file на месте"; else bad "нет/пустой $PLUGIN_DST/$file"; fi
  done

  if [[ -f "$PLUGIN_DST/manifest.json" ]]; then
    local expected actual
    expected="$(version_of "$PLUGIN_SRC/manifest.json")"
    actual="$(version_of "$PLUGIN_DST/manifest.json")"
    if [[ -n "$actual" && "$actual" == "$expected" ]]; then
      ok "версия плагина $actual (как в репозитории)"
    else
      bad "версия в vault: ${actual:-?}, ожидается $expected — перезапусти установку"
    fi
    if grep -Eq '"isDesktopOnly"[[:space:]]*:[[:space:]]*false' "$PLUGIN_DST/manifest.json"; then
      ok "isDesktopOnly: false (мобильная версия разрешена)"
    else
      bad "в manifest.json нет isDesktopOnly: false"
    fi
  fi

  if grep -q 'white-space: normal' "$PLUGIN_DST/styles.css" 2>/dev/null &&
     grep -q 'flex-shrink: 0' "$PLUGIN_DST/styles.css" 2>/dev/null &&
     grep -q -- '-webkit-overflow-scrolling: touch' "$PLUGIN_DST/styles.css" 2>/dev/null; then
    ok "CSS 1.2.1: текст не вылетает, секции не сжимаются, iOS-прокрутка работает"
  else
    bad "styles.css старый (нет маркеров 1.2.1) — перезапусти установку"
  fi

  if [[ -d "$CARDS_DST" ]]; then
    ok "папка «Карточки» есть"
    for deck in "${DECKS[@]}"; do
      if [[ -d "$CARDS_DST/$deck" ]]; then ok "тема $deck"; else bad "нет папки темы «$deck»"; fi
    done
    local count
    count="$(find "$CARDS_DST" -mindepth 2 -type f -name '*.md' 2>/dev/null | wc -l | tr -d ' ')"
    if [[ "$count" == "220" ]]; then ok "220 заметок-карточек"; else bad "заметок: $count, ожидается 220"; fi
    if grep -q 'icm-ignore: true' "$CARDS_DST/README.md" 2>/dev/null; then
      ok "README помечен icm-ignore (не станет карточкой)"
    else
      bad "нет служебного README с icm-ignore: true"
    fi
  else
    bad "нет папки $CARDS_DST — лента будет пустой"
  fi

  if [[ -f "$PLUGIN_DST/data.json" ]]; then
    ok "data.json есть (прогресс/лайки/комментарии сохранены)"
  else
    echo "  · data.json пока нет — создастся при первом лайке/свайпе/повторении"
  fi

  echo
  if [[ "$ERRORS" -eq 0 ]]; then
    echo "OK: всё на месте. Открой этот vault в Obsidian и перезапусти плагин."
    return 0
  fi
  echo "Найдено проблем: $ERRORS. Запусти установку без --check, затем проверь снова." >&2
  return 1
}

if [[ "$MODE" == "check" ]]; then
  verify
  exit $?
fi

for required in manifest.json main.js styles.css; do
  if [[ ! -f "$PLUGIN_SRC/$required" ]]; then
    echo "Ошибка: в $PLUGIN_SRC нет $required. Сначала выполни npm run check." >&2
    exit 1
  fi
done

mkdir -p "$PLUGIN_DST"

for file in manifest.json main.js styles.css README.md LICENSE-ts-fsrs.txt; do
  if [[ -f "$PLUGIN_SRC/$file" ]]; then
    cp "$PLUGIN_SRC/$file" "$PLUGIN_DST/$file"
  fi
done

# Активная папка карточек лежит в корне vault: «Карточки/<Тема>/*.md».
CARDS_SRC="$REPO_ROOT/Карточки"
if [[ -d "$CARDS_SRC" ]]; then
  if [[ -d "$CARDS_DST" ]]; then
    echo "Папка «Карточки» уже есть — обновляю только служебный README, заметки не трогаю."
    cp "$CARDS_SRC/README.md" "$CARDS_DST/README.md" 2>/dev/null || true
  else
    cp -R "$CARDS_SRC" "$CARDS_DST"
    echo "Скопирована папка «Карточки» с 220 заметками и 9 темами: $CARDS_DST"
  fi
else
  echo "Внимание: в репозитории не найден $CARDS_SRC" >&2
  echo "Скопируй папку «Карточки» в корень vault вручную, иначе лента будет пустой." >&2
fi

echo
echo "Готово. Плагин лежит здесь:"
echo "  $PLUGIN_DST"
echo
echo "Проверить без копирования:"
echo "  $0 --check \"$TARGET\""
echo
echo "Дальше:"
echo "  1. Дождись, пока iCloud синхронизирует папку vault."
echo "  2. На Mac или iPhone открой тот же vault в Obsidian."
echo "  3. Настройки → Сторонние плагины → выключи/включи «Карточки собеседования MAX» (или перезапусти Obsidian)."
echo "  4. Нажми 📱 на ленте или команду «Открыть ленту «Карточки MAX»»."
echo
echo "Собирать плагин на iPhone не нужно: main.js уже скомпилирован."
