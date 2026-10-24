import type { ImgHTMLAttributes } from "react";

import { withBasePath } from "@/lib/base-path";

export function MdxImage({
  src,
  alt = "",
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  const resolved =
    typeof src === "string" && src.startsWith("/") ? withBasePath(src) : src;

  return (
    // Static export uses unoptimized images; next/image adds no value here.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolved}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="doc-image"
      {...props}
    />
  );
}
