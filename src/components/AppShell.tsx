import { HandHeart, ListChecks, LogIn, LogOut, Store } from "lucide-react";
import type { ReactNode } from "react";
import { signOut } from "@/app/sign-in/actions";
import { db } from "@/db";
import { AppShell as KitShell, Button } from "@/kit";
import { listPlannedNeedIds } from "@/lib/data/donationList";
import type { SignedInUser } from "@/lib/session";
import { FlashProvider } from "./Flash";

export type Tab = "needs" | "banks" | "list";

type Props = {
  current: Tab;
  user: SignedInUser | null;
  /** A message to show straight away, such as after adding a food bank. */
  flash?: string;
  children: ReactNode;
};

/** The frame around every screen: the app's name, its tabs, and signing in or out. */
export default async function AppShell({ current, user, flash, children }: Props) {
  const toTake = user ? (await listPlannedNeedIds(db, user.id)).length : 0;

  return (
    <FlashProvider initial={flash}>
      <KitShell
        name="Food bank needs"
        icon={HandHeart}
        tone="orange"
        current={current}
        tabs={[
          { id: "needs", label: "What's needed", href: "/", icon: HandHeart },
          { id: "banks", label: "Food banks", href: "/food-banks", icon: Store },
          { id: "list", label: "My list", href: "/my-list", icon: ListChecks, count: toTake },
        ]}
        account={
          user ? (
            <form action={signOut}>
              <Button type="submit" variant="ghost" size="sm" className="md:w-full md:justify-start">
                <LogOut aria-hidden="true" />
                Sign out
              </Button>
            </form>
          ) : (
            <Button href="/sign-in" variant="primary" size="sm" className="md:w-full">
              <LogIn aria-hidden="true" />
              Sign in
            </Button>
          )
        }
      >
        {children}
      </KitShell>
    </FlashProvider>
  );
}
