import type { ReactNode } from "react";

/** Each screen's one h1, with a line saying what the screen is for. */
export default function ScreenHeading({ children, intro }: { children: ReactNode; intro?: ReactNode }) {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">{children}</h1>
      {intro && <p className="mt-1 text-base text-ink-muted">{intro}</p>}
    </div>
  );
}
