import type { ImgHTMLAttributes } from "react";

import { withBasePath } from "@/lib/base-path";

type FieldImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  eager?: boolean;
};

export function FieldImage({
  src,
  alt,
  eager = false,
  ...props
}: FieldImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={withBasePath(src)}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      {...props}
    />
  );
}
