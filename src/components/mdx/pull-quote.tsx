import type { ReactNode } from "react";

export function PullQuote({
  children,
  source,
}: {
  children: ReactNode;
  source?: string;
}) {
  return (
    <blockquote className="pull-quote">
      <p>{children}</p>
      {source ? <cite>{source}</cite> : null}
    </blockquote>
  );
}
