#!/usr/bin/env python3
"""Turn the extracted report into a structured Markdown manuscript.

The DOCX uses direct formatting rather than Word heading styles, so the
raw extraction is plain paragraphs. This script restores heading levels
from the document's Chinese numbering scheme and normalizes bullets,
tables, and references.
"""

from __future__ import annotations

import re
from pathlib import Path

RAW = Path("refer/extracted/首钢园两山理念社会实践调研报告.md")
CLEAN = Path("refer/extracted/首钢园两山理念社会实践调研报告.定稿.md")
BACKUP = Path("refer/extracted/首钢园两山理念社会实践调研报告.raw.md")

CHAPTER_RE = re.compile(r"^([一二三四五六七八九十]+)　(.+)$")
SECTION_RE = re.compile(r"^（([一二三四五六七八九十]+)）　(.+)$")
APPENDIX_RE = re.compile(r"^附录([A-E])　(.+)$")
BULLET_RE = re.compile(r"^•\s*(.+)$")
REFERENCE_RE = re.compile(r"^\[(\d+)\]\s*(.+)$")


def main() -> None:
    raw_text = RAW.read_text(encoding="utf-8")
    lines = raw_text.splitlines()

    body_start = next(
        index
        for index, line in enumerate(lines)
        if CHAPTER_RE.match(line) and line.startswith("一　")
    )
    front = lines[:body_start]
    body = lines[body_start:]

    note = next((line for line in front if line.startswith("说明：")), "")

    blocks: list[str] = [
        "<!--",
        "  来源：refer/首钢园两山理念社会实践调研报告.docx",
        "  方法：直接解析 OOXML 文本层，未执行宏；未做 OCR。",
        "  结构：按原文中文编号重建标题层级。",
        "-->",
        "",
        "# 从十里钢城到生态秀场",
        "",
        "## ——首钢园“两山”理念社会实践调研报告",
        "",
        "> **专业视角：** 旅游地学 · 地球化学的实践观察",
        ">",
        "> **调研形式：** 实地观测 · 案例采集 · 对比调研 · 访谈 · 文献与网络资料",
        ">",
        "> **调研团队：** XX大学 XXX学院“两山”实践调研队",
        ">",
        "> **指导教师：** XXX（可替换）",
        ">",
        "> **时间：** 2026年10月",
    ]
    if note:
        blocks.extend(["", f"> **{note.rstrip('。')}。**"])

    converted: list[str] = []
    headings: list[str] = []

    for line in body:
        stripped = line.strip()
        if not stripped:
            converted.append("")
            continue

        chapter = CHAPTER_RE.match(stripped)
        section = SECTION_RE.match(stripped)
        appendix = APPENDIX_RE.match(stripped)
        bullet = BULLET_RE.match(stripped)
        reference = REFERENCE_RE.match(stripped)

        if chapter:
            heading = f"{chapter.group(1)}、{chapter.group(2)}"
            headings.append(heading)
            converted.append(f"## {heading}")
        elif section:
            converted.append(f"### （{section.group(1)}）{section.group(2)}")
        elif appendix:
            heading = f"附录{appendix.group(1)}　{appendix.group(2)}"
            headings.append(heading)
            converted.append(f"## {heading}")
        elif bullet:
            converted.append(f"- {bullet.group(1)}")
        elif reference:
            converted.append(f"- [{reference.group(1)}] {reference.group(2)}")
        elif stripped.startswith("转化") and "｜" in stripped:
            converted.append(f"**{stripped}**")
        elif stripped in {
            "调研总问题：",
            "调研总故事线（“三次转身”）：",
        }:
            converted.append(f"**{stripped}**")
        else:
            converted.append(stripped)

    # Collapse runs of blank lines.
    normalized: list[str] = []
    for line in converted:
        if line == "" and normalized and normalized[-1] == "":
            continue
        normalized.append(line)

    blocks.extend(["", "## 目录", ""])
    blocks.extend(f"- {heading}" for heading in headings)
    blocks.extend(["", "---", "", *normalized])

    output = "\n".join(blocks).strip() + "\n"
    CLEAN.write_text(output, encoding="utf-8")
    BACKUP.write_text(raw_text, encoding="utf-8")

    print(f"Clean manuscript: {CLEAN}")
    print(f"Raw backup: {BACKUP}")
    print(f"Chapters/appendices: {len(headings)}")
    print(f"Characters: {len(output)}")


if __name__ == "__main__":
    main()
