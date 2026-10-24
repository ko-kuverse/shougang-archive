"use client";

import {
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import { FieldImage } from "@/components/ui/field-image";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CloseIcon,
} from "@/components/ui/icons";
import { PlateLabel } from "@/components/ui/panel";
import {
  gallery,
  galleryCategories,
  type GalleryCategory,
} from "@/data/gallery";
import { cn } from "@/lib/utils";

type GalleryFilter = "全部" | GalleryCategory;

export function GalleryGrid() {
  const [category, setCategory] = useState<GalleryFilter>("全部");
  const [activeIndex, setActiveIndex] = useState(-1);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const filtered =
    category === "全部"
      ? gallery
      : gallery.filter((item) => item.category === category);
  const activeItem = filtered[activeIndex];

  function selectCategory(item: GalleryFilter) {
    if (dialogRef.current?.open) dialogRef.current.close();
    setActiveIndex(-1);
    setCategory(item);
  }

  function openAt(index: number) {
    setActiveIndex(index);
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  function move(delta: number) {
    if (filtered.length === 0) return;
    setActiveIndex(
      (current) => (current + delta + filtered.length) % filtered.length,
    );
  }

  function handleDialogKeyDown(event: ReactKeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    }
  }

  return (
    <>
      <div className="gallery-filter" role="group" aria-label="图片分类">
        {galleryCategories.map((item) => {
          const count =
            item === "全部"
              ? gallery.length
              : gallery.filter((entry) => entry.category === item).length;

          return (
            <button
              key={item}
              type="button"
              className={cn(
                "gallery-filter-button",
                category === item && "is-active",
              )}
              onClick={() => selectCategory(item)}
              aria-pressed={category === item}
            >
              <span>{item}</span>
              <small>{String(count).padStart(2, "0")}</small>
            </button>
          );
        })}
      </div>

      <div className="gallery-grid">
        {filtered.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className="gallery-item"
            onClick={() => openAt(index)}
            aria-label={`查看图片：${item.caption}`}
          >
            <span className="gallery-item-image">
              <FieldImage
                src={item.thumb}
                alt={item.caption}
                className="gallery-thumb"
              />
            </span>
            <span className="gallery-item-meta">
              <span>{item.caption}</span>
              <span>{item.category}</span>
            </span>
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="gallery-lightbox"
        aria-label={activeItem?.caption ?? "图片预览"}
        onKeyDown={handleDialogKeyDown}
        onClose={() => setActiveIndex(-1)}
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
      >
        {activeItem ? (
          <div className="gallery-lightbox-inner">
            <div className="gallery-lightbox-head">
              <PlateLabel>
                [ {activeItem.category} /{" "}
                {String(activeIndex + 1).padStart(2, "0")} ]
              </PlateLabel>
              <button
                type="button"
                className="icon-button"
                onClick={close}
                aria-label="关闭图片预览"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            <div className="gallery-lightbox-stage">
              <button
                type="button"
                className="gallery-lightbox-nav"
                onClick={() => move(-1)}
                aria-label="上一张"
              >
                <ArrowLeftIcon size={20} />
              </button>
              <FieldImage
                src={activeItem.src}
                alt={activeItem.caption}
                eager
                className="gallery-lightbox-image"
              />
              <button
                type="button"
                className="gallery-lightbox-nav"
                onClick={() => move(1)}
                aria-label="下一张"
              >
                <ArrowRightIcon size={20} />
              </button>
            </div>

            <div className="gallery-lightbox-caption">
              <span>{activeItem.caption}</span>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
