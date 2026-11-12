import Link from "next/link";
import AppShell from "@/components/AppShell";
import { buttonClass, textLinkClass } from "@/components/buttonStyles";
import FollowButton from "@/components/FollowButton";
import NeedBadge from "@/components/NeedBadge";
import ScreenHeading from "@/components/ScreenHeading";
import { db } from "@/db";
import { whenUpdated } from "@/lib/dates";
import { listFollowedIds } from "@/lib/data/follows";
import { listFoodBanks } from "@/lib/data/foodBanks";
import { ensureSampleData } from "@/lib/data/sampleData";
import { currentUser } from "@/lib/session";

/** Food banks: every food bank, with how short they are and when to drop off. Anyone can see it. */
export default async function FoodBanksPage({ searchParams }: PageProps<"/food-banks">) {
  // Reading who's signed in also makes sure the screen is never built ahead of time.
  const user = await currentUser();
  await ensureSampleData(db);
  const banks = await listFoodBanks(db);
  const followedIds = user ? await listFollowedIds(db, user.id) : [];
  const { done } = await searchParams;
  const now = new Date();

  return (
    <AppShell current="banks" user={user} flash={done === "deleted" ? "The food bank was deleted." : undefined}>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <ScreenHeading intro="Follow the food banks you give to. Their needs will show on What's needed.">
            Food banks
          </ScreenHeading>
          {user ? (
            <Link href="/food-banks/new" className={buttonClass("outline", "shrink-0")}>
              <span aria-hidden="true">+</span> Add a food bank
            </Link>
          ) : (
            <p className="text-base text-ink-muted">
              <Link href="/sign-in" className={`inline-flex min-h-11 items-center ${textLinkClass}`}>
                Sign in
              </Link>{" "}
              to follow or add a food bank.
            </p>
          )}
        </div>

        {banks.length === 0 ? (
          <p className="rounded-card bg-surface p-6 text-center text-base text-ink shadow-card">
            No food banks yet. Sign in and add the first one.
          </p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {banks.map((bank) => {
              const following = followedIds.includes(bank.id);

              return (
                <li key={bank.id} className="flex flex-col rounded-card bg-surface p-4 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-display text-lg font-semibold text-ink">{bank.name}</h2>
                    {following && <NeedBadge kind="following" />}
                  </div>
                  <p className="mt-1 text-base text-ink-muted">
                    {bank.area} · Needs updated {whenUpdated(bank.needsUpdatedAt, now)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {bank.urgent + bank.low === 0 && <NeedBadge kind="stocked" />}
                    {bank.urgent > 0 && <NeedBadge kind="urgent">{bank.urgent} urgent</NeedBadge>}
                    {bank.low > 0 && <NeedBadge kind="low">{bank.low} running low</NeedBadge>}
                  </div>
                  <p className="mt-3 text-base text-ink">
                    <span className="text-ink-muted">Drop off: </span>
                    {bank.dropOffTimes}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 pt-1 sm:mt-auto">
                    <Link href={`/food-banks/${bank.id}`} className={buttonClass("outline")}>
                      See what they need<span className="sr-only"> at {bank.name}</span>
                    </Link>
                    {user && <FollowButton foodBankId={bank.id} name={bank.name} following={following} signedIn />}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
