import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function LinkPlate({
  href,
  children,
  variant = "solid",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "ghost";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("link-plate", `link-plate-${variant}`, className)}
    >
      {children}
    </Link>
  );
}
