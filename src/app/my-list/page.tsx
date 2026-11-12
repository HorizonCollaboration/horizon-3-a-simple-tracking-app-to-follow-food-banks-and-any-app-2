import Link from "next/link";
import ActionButton from "@/components/ActionButton";
import AppShell from "@/components/AppShell";
import { buttonClass, textLinkClass } from "@/components/buttonStyles";
import NeedBadge, { levelBadge } from "@/components/NeedBadge";
import ScreenHeading from "@/components/ScreenHeading";
import SummaryTiles from "@/components/SummaryTiles";
import { db } from "@/db";
import { formatDate } from "@/lib/dates";
import { listMyItems } from "@/lib/data/donationList";
import { ensureSampleData } from "@/lib/data/sampleData";
import { requireUser } from "@/lib/session";
import { markGivenAction, removeListItemAction } from "./actions";

/** My list: what this person plans to give, by food bank, and what they've given. Signed-in people only. */
export default async function MyListPage() {
  const user = await requireUser();
  await ensureSampleData(db);
  const items = await listMyItems(db, user.id);

  const toTake = items.filter((entry) => !entry.givenAt);
  const given = items
    .filter((entry) => entry.givenAt)
    .sort((a, b) => (b.givenAt?.getTime() ?? 0) - (a.givenAt?.getTime() ?? 0));
  const banks = [...new Map(toTake.map((entry) => [entry.foodBank.id, entry.foodBank])).values()];

  return (
    <AppShell current="list" user={user}>
      <div className="space-y-6">
        <ScreenHeading intro="What you plan to give, sorted by food bank, with drop-off times.">My donation list</ScreenHeading>

        <SummaryTiles
          tiles={[
            { label: "To take", value: toTake.length },
            { label: "Places to go", value: banks.length },
            { label: "Given", value: given.length },
          ]}
        />

        {toTake.length === 0 ? (
          <section className="space-y-3 rounded-card bg-surface p-6 text-center shadow-card">
            <h2 className="font-display text-lg font-semibold text-ink">Nothing to take yet</h2>
            <p className="text-base text-ink-muted">Add items from What&apos;s needed and they&apos;ll appear here.</p>
            <Link href="/" className={buttonClass("primary")}>
              See what&apos;s needed
            </Link>
          </section>
        ) : (
          banks.map((bank) => (
            <section key={bank.id} aria-labelledby={`take-${bank.id}`} className="rounded-card bg-surface shadow-card">
              <div className="border-b border-line p-4">
                <h2 id={`take-${bank.id}`} className="font-display text-lg font-semibold text-ink">
                  Take to {bank.name}
                </h2>
                <p className="mt-1 text-base text-ink-muted">
                  {bank.dropOffPlace}. {bank.dropOffTimes}.
                </p>
                <Link href={`/food-banks/${bank.id}`} className={`mt-1 inline-flex min-h-11 items-center ${textLinkClass}`}>
                  See everything they need<span className="sr-only"> at {bank.name}</span>
                </Link>
              </div>
              <ul className="divide-y divide-line">
                {toTake
                  .filter((entry) => entry.foodBank.id === bank.id)
                  .map((entry) => (
                    <li key={entry.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-base font-semibold text-ink">{entry.need.item}</span>
                          <NeedBadge kind={entry.need.noLongerNeededAt ? "gone" : levelBadge(entry.need.level)} />
                        </div>
                        {entry.need.note && <p className="text-base text-ink">{entry.need.note}</p>}
                        <p className="text-base text-ink-muted">Added {formatDate(entry.addedAt)}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 sm:flex">
                        <ActionButton action={markGivenAction} id={entry.id}>
                          Mark as given<span className="sr-only">: {entry.need.item}</span>
                        </ActionButton>
                        <ActionButton action={removeListItemAction} id={entry.id} variant="outline">
                          Remove<span className="sr-only">: {entry.need.item}</span>
                        </ActionButton>
                      </div>
                    </li>
                  ))}
              </ul>
            </section>
          ))
        )}

        <section aria-labelledby="given-title" className="rounded-card bg-surface shadow-card">
          <h2 id="given-title" className="border-b border-line p-4 font-display text-lg font-semibold text-ink">
            Already given
          </h2>
          {given.length === 0 ? (
            <p className="p-4 text-base text-ink-muted">
              Nothing yet. When you drop something off, choose Mark as given and it will show here.
            </p>
          ) : (
            <table className="w-full text-left text-base">
              <thead className="bg-sunken text-ink-muted">
                <tr>
                  <th scope="col" className="px-4 py-2 font-semibold">
                    Item
                  </th>
                  <th scope="col" className="hidden px-4 py-2 font-semibold sm:table-cell">
                    Food bank
                  </th>
                  <th scope="col" className="px-4 py-2 text-right font-semibold">
                    Given on
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {given.map((entry) => (
                  <tr key={entry.id} className="align-top">
                    <td className="px-4 py-3">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-ink">{entry.need.item}</span>
                        <NeedBadge kind="given" />
                      </span>
                      <span className="block text-ink-muted sm:hidden">{entry.foodBank.name}</span>
                    </td>
                    <td className="hidden px-4 py-3 text-ink sm:table-cell">{entry.foodBank.name}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-ink">
                      {entry.givenAt ? formatDate(entry.givenAt) : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </AppShell>
  );
}
