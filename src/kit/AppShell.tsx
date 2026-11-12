// Fixed by Horizon: don't change this file. Horizon's own components, built on shadcn/ui for now.
import { cn } from "cn";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Tile } from "./basics";
import type { TileTone } from "./tones";

export type ShellTab = {
  id: string;
  label: string;
  href: string;
  icon?: LucideIcon;
  /** A small number beside the tab, such as how many things are waiting. */
  count?: number;
  /** "urgent" for things needing attention. */
  countTone?: "urgent";
};

type AppShellProps = {
  name: string;
  icon?: LucideIcon;
  tone?: TileTone;
  tabs?: ShellTab[];
  /** The id of the tab this screen belongs to. */
  current?: string;
  /** Signing in or out, at the foot of the sidebar on a computer and the top on a phone. */
  account?: ReactNode;
  children: ReactNode;
};

/**
 * The frame of the whole app: on a computer a quiet sidebar with the app's
 * name and its screens, on a phone a top bar and a tab bar at the bottom.
 * Each tab is its own page (href). The screen goes inside as children.
 */
export function AppShell({ name, icon, tone = "orange", tabs = [], current, account, children }: AppShellProps) {
  // An app that does one job has no tabs: just its name, and no tab bar.
  const hasTabs = tabs.length > 1;

  return (
    <div className="flex flex-1">
      <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col gap-1 border-r bg-muted/40 px-3 py-5 md:flex">
        <Link href={tabs[0]?.href ?? "/"} className="flex items-center gap-2.5 rounded-md px-2 pb-5">
          <Tile icon={icon} tone={tone} size="sm" />
          <span className="font-semibold tracking-tight">{name}</span>
        </Link>
        {hasTabs && (
          <nav aria-label="Screens" className="flex flex-col gap-0.5">
            {tabs.map(({ id, label, href, icon: Icon, count = 0, countTone }) => (
              <Link
                key={id}
                href={href}
                aria-current={current === id ? "page" : undefined}
                className={cn(
                  "flex h-9 items-center gap-2.5 rounded-md px-2.5 text-sm font-medium transition-colors",
                  current === id
                    ? "bg-background text-foreground shadow-xs ring-1 ring-border"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {Icon && <Icon className="size-4" aria-hidden="true" />}
                {label}
                {count > 0 && (
                  <span
                    className={cn(
                      "ml-auto rounded-full px-1.5 text-xs font-semibold tabular-nums",
                      countTone === "urgent" ? "bg-red-50 text-red-700" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {count}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        )}
        {account && <div className="mt-4 flex flex-col gap-2 border-t px-1 pt-4">{account}</div>}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b px-5 py-3 md:hidden">
          <Link href={tabs[0]?.href ?? "/"} className="flex min-w-0 items-center gap-2.5">
            <Tile icon={icon} tone={tone} size="sm" />
            <span className="truncate font-semibold tracking-tight">{name}</span>
          </Link>
          {account}
        </header>

        <main className={cn("flex-1 px-5 pt-8 md:px-10 md:pt-12 md:pb-12", hasTabs ? "pb-28" : "pb-12")}>
          <div className="mx-auto flex max-w-3xl flex-col gap-8">{children}</div>
        </main>
      </div>

      {hasTabs && (
        <nav aria-label="Screens" className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
          <ul className="grid" style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}>
            {tabs.map(({ id, label, href, icon: Icon, count = 0 }) => (
              <li key={id}>
                <Link
                  href={href}
                  aria-current={current === id ? "page" : undefined}
                  className={cn(
                    "relative flex min-h-16 w-full flex-col items-center justify-center gap-1 px-1 text-xs font-medium",
                    current === id ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {Icon && <Icon className="size-5" strokeWidth={current === id ? 2.25 : 1.75} aria-hidden="true" />}
                  {label}
                  {count > 0 && (
                    <span className="absolute top-2 left-[calc(50%+6px)] min-w-4 rounded-full bg-primary px-1 text-[10px] leading-4 font-semibold text-primary-foreground tabular-nums">
                      {count}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
