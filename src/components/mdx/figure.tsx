import { withBasePath } from "@/lib/base-path";

type FigureProps = {
  src: string;
  alt?: string;
  caption?: string;
  /** Kept for authoring compatibility; source labels are not rendered. */
  credit?: string;
};

export function Figure({ src, alt = "", caption }: FigureProps) {
  return (
    <figure className="doc-figure">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={withBasePath(src)}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="doc-figure-image"
      />
      {caption ? (
        <figcaption className="doc-figure-caption">
          <span>{caption}</span>
        </figcaption>
      ) : null}
    </figure>
  );
}
