import type { ReactNode } from "react";
import { Tag, type TagTone } from "@/kit";

const styles: Record<string, { text: string; tone: TagTone }> = {
  urgent: { text: "Urgent", tone: "urgent" },
  low: { text: "Running low", tone: "warning" },
  following: { text: "Following", tone: "primary" },
  given: { text: "Given", tone: "good" },
  stocked: { text: "Nothing short", tone: "good" },
  gone: { text: "No longer needed", tone: "neutral" },
};

export type BadgeKind = "urgent" | "low" | "following" | "given" | "stocked" | "gone";

/** A small label that always says its meaning in words, never by colour alone. */
export default function NeedBadge({ kind, children }: { kind: BadgeKind; children?: ReactNode }) {
  const style = styles[kind];

  return (
    <Tag tone={style.tone} dot>
      {children ?? style.text}
    </Tag>
  );
}

/** The badge for a need's level, "urgent" or "low". */
export function levelBadge(level: string): BadgeKind {
  return level === "urgent" ? "urgent" : "low";
}
