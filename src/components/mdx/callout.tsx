import type { ReactNode } from "react";

import {
  BoltIcon,
  DangerIcon,
  InfoIcon,
  WarningIcon,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export type CalloutType = "note" | "tip" | "warning" | "danger";

const labels: Record<CalloutType, string> = {
  note: "记录",
  tip: "提示",
  warning: "注意",
  danger: "风险",
};

const icons = {
  note: InfoIcon,
  tip: BoltIcon,
  warning: WarningIcon,
  danger: DangerIcon,
};

type CalloutProps = {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
};

export function Callout({ type = "note", title, children }: CalloutProps) {
  const safeType: CalloutType = labels[type] ? type : "note";
  const Icon = icons[safeType];

  return (
    <aside className={cn("callout", `callout-${safeType}`)} role="note">
      <div className="callout-head">
        <Icon size={16} className="callout-icon" />
        <span className="callout-label">[ {labels[safeType]} ]</span>
        {title ? <span className="callout-title">{title}</span> : null}
      </div>
      <div className="callout-body">{children}</div>
    </aside>
  );
}
