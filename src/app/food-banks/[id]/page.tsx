import Link from "next/link";
import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import { buttonClass } from "@/components/buttonStyles";
import FollowButton from "@/components/FollowButton";
import ListButton from "@/components/ListButton";
import NeedBadge, { levelBadge } from "@/components/NeedBadge";
import ScreenHeading from "@/components/ScreenHeading";
import { db } from "@/db";
import { whenUpdated } from "@/lib/dates";
import { listPlannedNeedIds } from "@/lib/data/donationList";
import { listFollowedIds } from "@/lib/data/follows";
import { getFoodBank } from "@/lib/data/foodBanks";
import { listNeedsForFoodBank } from "@/lib/data/needs";
import { ensureSampleData } from "@/lib/data/sampleData";
import { plentyList } from "@/lib/needs";
import { currentUser } from "@/lib/session";

/** One food bank: what they need, what they have plenty of, and where and when to drop off. */
export default async function FoodBankPage({ params }: PageProps<"/food-banks/[id]">) {
  // Reading who's signed in also makes sure the screen is never built ahead of time.
  const user = await currentUser();
  await ensureSampleData(db);
  const { id } = await params;
  const bank = await getFoodBank(db, id);

  if (!bank) {
    notFound();
  }

  const allNeeds = await listNeedsForFoodBank(db, bank.id);
  const followedIds = user ? await listFollowedIds(db, user.id) : [];
  const plannedIds = user ? await listPlannedNeedIds(db, user.id) : [];
  const needs = allNeeds.filter((need) => !need.noLongerNeededAt);
  const plenty = plentyList(bank.plenty);
  const following = followedIds.includes(bank.id);

  return (
    <AppShell current="banks" user={user}>
      <div className="space-y-6">
        <Link href="/food-banks" className={buttonClass("outline")}>
          <span aria-hidden="true">←</span> Back to all food banks
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <ScreenHeading intro={`${bank.area} · Needs updated ${whenUpdated(bank.needsUpdatedAt)}`}>{bank.name}</ScreenHeading>
          <div className="flex flex-wrap items-center gap-2">
            {following && <NeedBadge kind="following" />}
            <FollowButton foodBankId={bank.id} name={bank.name} following={following} signedIn={Boolean(user)} />
            {user && (
              <Link href={`/food-banks/${bank.id}/edit`} className={buttonClass("outline")}>
                Edit<span className="sr-only"> {bank.name}</span>
              </Link>
            )}
          </div>
        </div>

        <section aria-labelledby="short-title" className="rounded-card bg-surface shadow-card">
          <h2 id="short-title" className="border-b border-line p-4 font-display text-lg font-semibold text-ink">
            Short right now
          </h2>
          {needs.length === 0 ? (
            <p className="p-6 text-center text-base text-ink">
              Nothing is short here right now. Check back soon, or look at another food bank.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {needs.map((need) => (
                <li key={need.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-semibold text-ink">{need.item}</span>
                      <NeedBadge kind={levelBadge(need.level)} />
                    </div>
                    <p className="text-base text-ink-muted">
                      {need.category} · Updated {whenUpdated(need.updatedAt)}
                    </p>
                    {need.note && <p className="text-base text-ink">{need.note}</p>}
                  </div>
                  <ListButton
                    needId={need.id}
                    item={need.item}
                    planned={plannedIds.includes(need.id)}
                    signedIn={Boolean(user)}
                    className="w-full sm:w-auto"
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <section aria-labelledby="plenty-title" className="rounded-card bg-surface p-4 shadow-card">
            <h2 id="plenty-title" className="font-display text-lg font-semibold text-ink">
              They have plenty of
            </h2>
            {plenty.length === 0 ? (
              <p className="mt-1 text-base text-ink-muted">They haven&apos;t said yet.</p>
            ) : (
              <>
                <p className="mt-1 text-base text-ink-muted">Please give something else for now.</p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-base text-ink">
                  {plenty.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </>
            )}
          </section>

          <section aria-labelledby="dropoff-title" className="rounded-card bg-surface p-4 shadow-card">
            <h2 id="dropoff-title" className="font-display text-lg font-semibold text-ink">
              Where and when to drop off
            </h2>
            <dl className="mt-3 space-y-3 text-base">
              <div>
                <dt className="text-ink-muted">Where</dt>
                <dd className="text-ink">{bank.dropOffPlace}</dd>
              </div>
              <div>
                <dt className="text-ink-muted">When</dt>
                <dd className="text-ink">{bank.dropOffTimes}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
