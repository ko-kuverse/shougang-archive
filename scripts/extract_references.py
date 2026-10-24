#!/usr/bin/env python3
"""Extract numbered references from the structured report into JSON."""

from __future__ import annotations

import json
import re
from pathlib import Path

SOURCE = Path("refer/extracted/首钢园两山理念社会实践调研报告.定稿.md")
TARGET = Path("src/data/references.json")


def main() -> None:
    text = SOURCE.read_text(encoding="utf-8")
    references: list[dict[str, object]] = []

    for line in text.splitlines():
        match = re.match(r"^- \[(\d+)\]\s+(.+)$", line.strip())
        if not match:
            continue

        number = int(match.group(1))
        body = match.group(2).strip()
        url = ""
        url_match = re.search(r"(https?://\S+)\s*$", body)
        if url_match:
            url = url_match.group(1)
            body = body[: url_match.start()].strip()

        references.append(
            {
                "id": number,
                "text": body,
                "url": url,
            }
        )

    TARGET.parent.mkdir(parents=True, exist_ok=True)
    TARGET.write_text(
        json.dumps(references, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"Wrote {len(references)} references to {TARGET}")


if __name__ == "__main__":
    main()
