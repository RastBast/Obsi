#!/usr/bin/env python3
"""Build a Mochi import archive from the multi-side Markdown cards."""

from __future__ import annotations

import argparse
import json
import re
import sys
import zipfile
from collections import OrderedDict
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CARDS_DIR = ROOT / "Cards"
INDEX_PATH = ROOT / "README.md"
DEFAULT_OUTPUT = ROOT / "Go-Middle-220.mochi"
DECKS = ("Go", "Docker", "Kubernetes", "Сети", "Алгоритмы", "БД", "Рантайм", "Redis", "Kafka")
CARD_LINK = re.compile(r"^- \[ \] \[(\d{3})\. .+?\]\(Cards/([^)]+\.md)\)$")
REQUIRED_MARKERS = (
    "\n===\n",
    "\n@input\n",
    "## Краткий ответ",
    "## Развёрнутый ответ мидла",
    "## Развёрнутый ответ сеньора: все тонкости",
    "## Если забыл / Простыми словами",
)


def parse_decks() -> OrderedDict[str, list[Path]]:
    result: OrderedDict[str, list[Path]] = OrderedDict((deck, []) for deck in DECKS)
    current: str | None = None
    for line in INDEX_PATH.read_text(encoding="utf-8").splitlines():
        if line.startswith("## "):
            heading = line[3:].strip()
            current = heading if heading in result else None
            continue
        match = CARD_LINK.match(line)
        if match and current:
            path = CARDS_DIR / match.group(2)
            if not path.is_file():
                raise ValueError(f"В индексе указана отсутствующая карточка: {path}")
            result[current].append(path)
    indexed = [path.name for paths in result.values() for path in paths]
    actual = sorted(path.name for path in CARDS_DIR.glob("*.md"))
    if sorted(indexed) != actual:
        missing = sorted(set(actual) - set(indexed))
        extra = sorted(set(indexed) - set(actual))
        raise ValueError(f"Индекс и каталог карточек расходятся; missing={missing}, extra={extra}")
    return result


def validate_card(path: Path) -> tuple[str, str]:
    content = path.read_text(encoding="utf-8").strip() + "\n"
    lines = content.splitlines()
    if not lines or not lines[0].startswith("# "):
        raise ValueError(f"{path.name}: карточка должна начинаться с заголовка '# '")
    title = lines[0][2:].strip()
    for marker in REQUIRED_MARKERS:
        if marker not in content:
            raise ValueError(f"{path.name}: отсутствует маркер {marker!r}")
    if sum(1 for line in lines if line == "===") != 1:
        raise ValueError(f"{path.name}: ожидался один разделитель '=== '")
    if sum(1 for line in lines if line == "@input") != 1:
        raise ValueError(f"{path.name}: ожидалось одно поле '@input'")
    if sum(1 for line in lines if line == "---") != 4:
        raise ValueError(f"{path.name}: ожидалось четыре стороны '---'")
    return title, content


def edn_string(value: str) -> str:
    # JSON string escaping is accepted for the string subset used by EDN here.
    return json.dumps(value, ensure_ascii=False)


def build_edn(decks: OrderedDict[str, list[Path]]) -> str:
    deck_values: list[str] = []
    for deck_name, paths in decks.items():
        cards: list[str] = []
        for path in paths:
            title, content = validate_card(path)
            cards.append(
                "{:name " + edn_string(title) + ", :content " + edn_string(content) + "}"
            )
        deck_values.append(
            "{:name " + edn_string(deck_name) + ", :cards (" + "".join(cards) + ")}"
        )
    return "{:decks [" + "".join(deck_values) + "], :version 2}"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--check", action="store_true", help="validate without creating an archive")
    args = parser.parse_args()

    try:
        decks = parse_decks()
        edn = build_edn(decks)
    except ValueError as error:
        print(f"Ошибка: {error}", file=sys.stderr)
        return 1

    count = sum(len(paths) for paths in decks.values())
    if args.check:
        print(f"OK: проверено {count} карточек в {len(decks)} колодах")
        return 0

    output = args.output.expanduser().resolve()
    output.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(output, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        archive.writestr("data.edn", edn.encode("utf-8"))
    print(f"Создано: {output} ({count} карточек, {len(decks)} колод)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
