import Link from "next/link";
import type { ReactNode } from "react";
import { signOut } from "@/app/sign-in/actions";
import { db } from "@/db";
import { listPlannedNeedIds } from "@/lib/data/donationList";
import type { SignedInUser } from "@/lib/session";
import { FlashProvider } from "./Flash";

function NeedsIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 5h10M9 12h10M9 19h10" strokeLinecap="round" />
      <circle cx="4.5" cy="5" r="1.5" />
      <circle cx="4.5" cy="12" r="1.5" />
      <circle cx="4.5" cy="19" r="1.5" />
    </svg>
  );
}

function BanksIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 10 12 4l9 6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v9h14v-9M10 19v-5h4v5" strokeLinejoin="round" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 8h16l-1.5 11h-13L4 8Z" strokeLinejoin="round" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </svg>
  );
}

const tabs = [
  { id: "needs", href: "/", label: "What's needed", Icon: NeedsIcon },
  { id: "banks", href: "/food-banks", label: "Food banks", Icon: BanksIcon },
  { id: "list", href: "/my-list", label: "My list", Icon: ListIcon },
] as const;

export type Tab = (typeof tabs)[number]["id"];

type Props = {
  current: Tab;
  user: SignedInUser | null;
  /** A message to show straight away, such as after adding a food bank. */
  flash?: string;
  children: ReactNode;
};

/** The frame around every screen: the app's name, sign in or out, and the tabs. */
export default async function AppShell({ current, user, flash, children }: Props) {
  const toTake = user ? (await listPlannedNeedIds(db, user.id)).length : 0;

  function count(id: Tab, className: string) {
    if (id !== "list" || toTake === 0) return null;

    return (
      <span className={className}>
        {toTake}
        <span className="sr-only"> to take</span>
      </span>
    );
  }

  return (
    <FlashProvider initial={flash}>
      <div className="flex flex-1 flex-col bg-canvas text-ink">
        <header className="border-b border-line bg-surface">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4">
            <p className="py-4 font-display text-xl font-bold text-ink">Food bank needs</p>
            <nav aria-label="Screens" className="hidden md:block">
              <ul className="flex gap-1">
                {tabs.map(({ id, href, label, Icon }) => (
                  <li key={id}>
                    <Link
                      href={href}
                      aria-current={current === id ? "page" : undefined}
                      className={`flex min-h-16 items-center gap-2 border-b-2 px-4 text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        current === id ? "border-primary text-primary" : "border-transparent text-ink-muted hover:text-ink"
                      }`}
                    >
                      <Icon />
                      {label}
                      {count(id, "rounded-control bg-primary-soft px-2 text-sm text-primary")}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            {user ? (
              <form action={signOut}>
                <button
                  type="submit"
                  className="min-h-11 rounded-control border border-line px-3 text-base font-semibold text-ink hover:bg-sunken focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Sign out
                </button>
              </form>
            ) : (
              <Link
                href="/sign-in"
                className="inline-flex min-h-11 items-center rounded-control bg-primary px-3 text-base font-semibold text-on-primary hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Sign in
              </Link>
            )}
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-36 pt-6 md:pb-24">{children}</main>

        <nav aria-label="Screens" className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-surface md:hidden">
          <ul className="grid grid-cols-3">
            {tabs.map(({ id, href, label, Icon }) => (
              <li key={id}>
                <Link
                  href={href}
                  aria-current={current === id ? "page" : undefined}
                  className={`flex min-h-16 w-full flex-col items-center justify-center gap-1 px-1 py-2 text-center text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary ${
                    current === id ? "bg-primary-soft text-primary" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  <Icon />
                  <span>
                    {label}
                    {count(id, "ml-1 rounded-control bg-primary px-1.5 text-on-primary")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </FlashProvider>
  );
}
