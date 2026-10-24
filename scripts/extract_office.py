#!/usr/bin/env python3
"""Extract text and media from DOCX/PPTX without executing document content.

Usage:
    python -I scripts/extract_office.py --out refer/extracted \
        "refer/report.docx" "refer/slides.pptx"

Only the OOXML text layer is read. Embedded media is copied to
<out>/media/{docx,ppt}/. No macros, external links, or embedded objects
are executed.
"""

from __future__ import annotations

import argparse
import json
import re
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from xml.etree import ElementTree as ET

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"
A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
P = "{http://schemas.openxmlformats.org/presentationml/2006/main}"
REL = "{http://schemas.openxmlformats.org/package/2006/relationships}"

MAX_XML_BYTES = 25 * 1024 * 1024
MAX_MEDIA_BYTES = 200 * 1024 * 1024
MAX_MEDIA_FILES = 300


def read_xml(archive: zipfile.ZipFile, name: str) -> ET.Element:
    info = archive.getinfo(name)
    if info.file_size > MAX_XML_BYTES:
        raise ValueError(f"{name} is too large ({info.file_size} bytes)")
    return ET.fromstring(archive.read(name))


def read_rels(archive: zipfile.ZipFile, name: str) -> dict[str, str]:
    if name not in archive.namelist():
        return {}
    root = read_xml(archive, name)
    return {
        rel.get("Id", ""): rel.get("Target", "")
        for rel in root.findall(f"{REL}Relationship")
    }


def extract_media(
    archive: zipfile.ZipFile,
    prefix: str,
    output_dir: Path,
) -> list[dict[str, object]]:
    output_dir.mkdir(parents=True, exist_ok=True)
    extracted: list[dict[str, object]] = []
    total_bytes = 0

    for name in archive.namelist():
        if not name.startswith(prefix) or name.endswith("/"):
            continue
        safe_name = Path(name).name
        info = archive.getinfo(name)
        total_bytes += info.file_size
        if (
            total_bytes > MAX_MEDIA_BYTES
            or len(extracted) >= MAX_MEDIA_FILES
        ):
            raise ValueError("Media extraction limit exceeded")
        target = output_dir / safe_name
        target.write_bytes(archive.read(name))
        extracted.append(
            {
                "source": name,
                "output": str(target).replace("\\", "/"),
                "bytes": info.file_size,
            }
        )

    return extracted


def normalize_text(value: str) -> str:
    return re.sub(r"[ \t]+", " ", value.replace(" ", " ")).strip()


def paragraph_text(paragraph: ET.Element) -> str:
    parts: list[str] = []
    for node in paragraph.iter():
        if node.tag == f"{W}t":
            parts.append(node.text or "")
        elif node.tag == f"{W}tab":
            parts.append("\t")
        elif node.tag in (f"{W}br", f"{W}cr"):
            parts.append("\n")
    return normalize_text("".join(parts))


def heading_level(paragraph: ET.Element) -> int:
    style = paragraph.find(f"{W}pPr/{W}pStyle")
    if style is None:
        return 0

    value = (style.get(f"{W}val") or "").strip()
    lowered = value.lower().replace(" ", "")
    if lowered in {"title", "heading1", "1"}:
        return 1
    if lowered in {"heading2", "2"}:
        return 2
    if lowered in {"heading3", "3"}:
        return 3
    if lowered in {"heading4", "4"}:
        return 4
    if lowered in {"heading5", "5"}:
        return 5
    if lowered in {"heading6", "6"}:
        return 6
    return 0


def list_level(paragraph: ET.Element) -> int:
    num_pr = paragraph.find(f"{W}pPr/{W}numPr")
    if num_pr is None:
        style = paragraph.find(f"{W}pPr/{W}pStyle")
        style_value = (style.get(f"{W}val") or "").lower() if style is not None else ""
        return 0 if "list" not in style_value else 1

    level = num_pr.find(f"{W}ilvl")
    if level is None:
        return 1
    try:
        return max(1, int(level.get(f"{W}val", "0")) + 1)
    except ValueError:
        return 1


def table_to_markdown(table: ET.Element) -> str:
    rows: list[list[str]] = []

    for row in table.findall(f"{W}tr"):
        cells: list[str] = []
        for cell in row.findall(f"{W}tc"):
            paragraphs = [
                paragraph_text(p)
                for p in cell.findall(f"{W}p")
                if paragraph_text(p)
            ]
            text = "<br>".join(paragraphs) if paragraphs else ""
            cells.append(text.replace("|", "\\|"))
        if cells:
            rows.append(cells)

    if not rows:
        return ""

    width = max(len(row) for row in rows)
    normalized = [row + [""] * (width - len(row)) for row in rows]
    header = "| " + " | ".join(normalized[0]) + " |"
    separator = "| " + " | ".join(["---"] * width) + " |"
    body = [
        "| " + " | ".join(row) + " |" for row in normalized[1:]
    ]
    return "\n".join([header, separator, *body])


def extract_docx(source: Path, out_dir: Path) -> dict[str, object]:
    with zipfile.ZipFile(source) as archive:
        document = read_xml(archive, "word/document.xml")
        body = document.find(f"{W}body")
        if body is None:
            raise ValueError("DOCX has no w:body")

        rels = read_rels(archive, "word/_rels/document.xml.rels")
        media = extract_media(archive, "word/media/", out_dir / "media" / "docx")
        media_by_rel = {
            rel_id: Path(target).name
            for rel_id, target in rels.items()
            if "media/" in target
        }

        blocks: list[str] = []
        stats = {
            "paragraphs": 0,
            "headings": 0,
            "tables": 0,
            "images": 0,
            "characters": 0,
        }

        for child in body:
            if child.tag == f"{W}p":
                text = paragraph_text(child)
                image_names: list[str] = []
                for blip in child.iter(f"{A}blip"):
                    rel_id = blip.get(f"{R}embed") or blip.get(f"{R}link")
                    name = media_by_rel.get(rel_id or "")
                    if name:
                        image_names.append(name)
                image_placeholders = [
                    f"[图片: media/docx/{name}]" for name in image_names
                ]

                stats["images"] += len(image_placeholders)

                if not text and not image_placeholders:
                    continue

                level = heading_level(child)
                bullet = list_level(child)

                if level > 0:
                    stats["headings"] += 1
                    blocks.append(f"{'#' * min(level, 6)} {text}")
                elif bullet > 0 and text:
                    indent = "  " * (bullet - 1)
                    blocks.append(f"{indent}- {text}")
                elif text:
                    blocks.append(text)

                if image_placeholders:
                    blocks.extend(image_placeholders)

                stats["paragraphs"] += 1
                stats["characters"] += len(text)

            elif child.tag == f"{W}tbl":
                markdown = table_to_markdown(child)
                if markdown:
                    stats["tables"] += 1
                    blocks.append(markdown)

        text = "\n\n".join(blocks).strip()
        title = source.stem
        output = out_dir / f"{title}.md"
        header = (
            f"<!-- 提取自 {source.as_posix()}；直接解析 DOCX 文本层；"
            f"图片以 [图片: ...] 标注。 -->\n\n"
        )
        output.write_text(header + text + "\n", encoding="utf-8")

        return {
            "source": source.as_posix(),
            "output": output.as_posix(),
            "title": title,
            "stats": stats,
            "media": media,
        }


def slide_order(archive: zipfile.ZipFile) -> list[str]:
    rels = read_rels(archive, "ppt/_rels/presentation.xml.rels")
    if "ppt/presentation.xml" in archive.namelist():
        presentation = read_xml(archive, "ppt/presentation.xml")
        ordered: list[str] = []
        for slide_id in presentation.iter(f"{P}sldId"):
            target = rels.get(slide_id.get(f"{R}id", ""))
            if target:
                ordered.append(f"ppt/{target.lstrip('/')}")
        if ordered:
            return ordered

    slides = [
        name
        for name in archive.namelist()
        if re.fullmatch(r"ppt/slides/slide\d+\.xml", name)
    ]
    return sorted(slides, key=lambda name: int(re.search(r"(\d+)", name).group(1)))


def shape_text(shape: ET.Element) -> tuple[bool, list[str]]:
    """Return (is_title, paragraphs) for a shape."""
    is_title = False
    placeholder = shape.find(f"{P}nvSpPr/{P}nvPr/{P}ph")
    if placeholder is not None:
        is_title = placeholder.get("type") in {"title", "ctrTitle"}

    paragraphs: list[str] = []
    text_body = shape.find(f"{P}txBody")
    if text_body is None:
        return is_title, paragraphs

    for paragraph in text_body.findall(f"{A}p"):
        parts: list[str] = []
        for node in paragraph.iter():
            if node.tag == f"{A}t":
                parts.append(node.text or "")
            elif node.tag == f"{A}br":
                parts.append("\n")
        text = normalize_text("".join(parts))
        if not text:
            continue

        level = 0
        paragraph_props = paragraph.find(f"{A}pPr")
        if paragraph_props is not None:
            level_node = paragraph_props.find(f"{A}lvl")
            if level_node is not None:
                try:
                    level = max(0, int(level_node.get("val", "0")))
                except ValueError:
                    level = 0
        paragraphs.append("  " * level + text)

    return is_title, paragraphs


def extract_pptx(source: Path, out_dir: Path) -> dict[str, object]:
    with zipfile.ZipFile(source) as archive:
        media = extract_media(archive, "ppt/media/", out_dir / "media" / "ppt")
        slides = slide_order(archive)
        blocks: list[str] = []
        stats = {
            "slides": 0,
            "titles": 0,
            "text_paragraphs": 0,
            "images": 0,
            "notes": 0,
            "characters": 0,
        }

        for index, slide_name in enumerate(slides, start=1):
            slide = read_xml(archive, slide_name)
            slide_rels_name = (
                f"ppt/slides/_rels/{Path(slide_name).name}.rels"
            )
            slide_rels = read_rels(archive, slide_rels_name)

            title = ""
            body: list[str] = []
            image_names: list[str] = []

            for shape in slide.iter(f"{P}sp"):
                is_title, paragraphs = shape_text(shape)
                if is_title and paragraphs:
                    title = paragraphs[0]
                    stats["titles"] += 1
                    body.extend(paragraphs[1:])
                else:
                    body.extend(paragraphs)

            for graphic_frame in slide.iter(f"{P}graphicFrame"):
                for table in graphic_frame.iter(f"{A}tbl"):
                    rows: list[list[str]] = []
                    for row in table.findall(f"{A}tr"):
                        cells: list[str] = []
                        for cell in row.findall(f"{A}tc"):
                            texts = [
                                normalize_text(node.text or "")
                                for node in cell.iter(f"{A}t")
                                if normalize_text(node.text or "")
                            ]
                            cells.append(" ".join(texts))
                        if cells:
                            rows.append(cells)
                    if rows:
                        width = max(len(row) for row in rows)
                        normalized = [
                            row + [""] * (width - len(row)) for row in rows
                        ]
                        body.append(
                            "| " + " | ".join(normalized[0]) + " |"
                        )
                        body.append(
                            "| " + " | ".join(["---"] * width) + " |"
                        )
                        for row in normalized[1:]:
                            body.append("| " + " | ".join(row) + " |")

            for picture in slide.iter(f"{P}pic"):
                for blip in picture.iter(f"{A}blip"):
                    rel_id = blip.get(f"{R}embed") or blip.get(f"{R}link")
                    target = slide_rels.get(rel_id or "")
                    if target and "media/" in target:
                        image_names.append(Path(target).name)

            stats["images"] += len(image_names)
            stats["text_paragraphs"] += len(body)
            stats["characters"] += len(title) + sum(len(p) for p in body)

            heading = f"## 第 {index} 页"
            if title:
                heading += f"：{title}"
            blocks.append(heading)

            for paragraph in body:
                if paragraph.startswith("| "):
                    blocks.append(paragraph)
                elif paragraph.startswith("  "):
                    blocks.append(f"  - {paragraph.strip()}")
                else:
                    blocks.append(f"- {paragraph}")

            for image_name in dict.fromkeys(image_names):
                blocks.append(f"[图片: media/ppt/{image_name}]")

            notes_name = slide_rels.get(
                next(
                    (
                        rel_id
                        for rel_id, target in slide_rels.items()
                        if "notesSlide" in target
                    ),
                    "",
                ),
                "",
            )
            if notes_name:
                notes_path = (
                    f"ppt/{notes_name.lstrip('/')}"
                    if not notes_name.startswith("ppt/")
                    else notes_name
                )
                if notes_path in archive.namelist():
                    notes = read_xml(archive, notes_path)
                    note_texts = [
                        normalize_text(node.text or "")
                        for node in notes.iter(f"{A}t")
                        if normalize_text(node.text or "")
                    ]
                    if note_texts:
                        stats["notes"] += 1
                        blocks.append("> 备注：" + " / ".join(note_texts))

            stats["slides"] += 1

        text = "\n\n".join(blocks).strip()
        title = source.stem
        output = out_dir / f"{title}.md"
        header = (
            f"<!-- 提取自 {source.as_posix()}；直接解析 PPTX 文本层；"
            f"图片以 [图片: ...] 标注。 -->\n\n"
        )
        output.write_text(header + text + "\n", encoding="utf-8")

        return {
            "source": source.as_posix(),
            "output": output.as_posix(),
            "title": title,
            "stats": stats,
            "media": media,
        }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("files", nargs="+")
    parser.add_argument("--out", default="refer/extracted")
    args = parser.parse_args()

    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    results: list[dict[str, object]] = []
    for raw_path in args.files:
        source = Path(raw_path)
        if not source.is_file():
            raise FileNotFoundError(source)

        suffix = source.suffix.lower()
        if suffix == ".docx":
            results.append(extract_docx(source, out_dir))
        elif suffix == ".pptx":
            results.append(extract_pptx(source, out_dir))
        else:
            raise ValueError(f"Unsupported file type: {source}")

    report = {
        "extracted_at": datetime.now(timezone.utc).isoformat(),
        "method": "OOXML text layer (no macros executed)",
        "results": results,
    }
    report_path = out_dir / "extraction-report.json"
    report_path.write_text(
        json.dumps(report, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    for result in results:
        print(
            f"{result['source']} -> {result['output']} "
            f"({result['stats']})"
        )
    print(f"Report: {report_path}")


if __name__ == "__main__":
    main()
