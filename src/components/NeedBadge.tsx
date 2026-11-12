import type { ReactNode } from "react";

const styles = {
  urgent: { text: "Urgent", className: "bg-danger-soft text-danger", mark: "!" },
  low: { text: "Running low", className: "bg-warning-soft text-warning", mark: "•" },
  following: { text: "Following", className: "bg-primary-soft text-primary", mark: "✓" },
  given: { text: "Given", className: "bg-success-soft text-success", mark: "✓" },
  stocked: { text: "Nothing short", className: "bg-success-soft text-success", mark: "✓" },
  gone: { text: "No longer needed", className: "bg-sunken text-ink-muted", mark: "–" },
};

export type BadgeKind = keyof typeof styles;

/** A small label that always says its meaning in words, never by colour alone. */
export default function NeedBadge({ kind, children }: { kind: BadgeKind; children?: ReactNode }) {
  const style = styles[kind];

  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-control px-2 py-0.5 text-sm font-semibold ${style.className}`}
    >
      <span aria-hidden="true">{style.mark}</span>
      {children ?? style.text}
    </span>
  );
}

/** The badge for a need's level, "urgent" or "low". */
export function levelBadge(level: string): BadgeKind {
  return level === "urgent" ? "urgent" : "low";
}
