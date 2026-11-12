"use client";

import Link from "next/link";
import { useState } from "react";
import { buttonClass, inputClass, textLinkClass } from "@/components/buttonStyles";
import ListButton from "@/components/ListButton";
import NeedBadge, { levelBadge } from "@/components/NeedBadge";
import SummaryTiles from "@/components/SummaryTiles";
import { categories } from "@/lib/needs";

export type NeedRow = {
  id: string;
  item: string;
  category: string;
  level: string;
  note: string | null;
  foodBankId: string;
  foodBankName: string;
  /** "today", "yesterday" or "3 days ago" */
  updated: string;
};

type Props = {
  needs: NeedRow[];
  followedIds: string[];
  plannedIds: string[];
  signedIn: boolean;
};

const scopes = [
  { id: "following", label: "Food banks I follow" },
  { id: "all", label: "All" },
] as const;

type Scope = (typeof scopes)[number]["id"];

/** The combined list of needs, with a choice of food banks and type of item. */
export default function NeedsFinder({ needs, followedIds, plannedIds, signedIn }: Props) {
  const [chosenScope, setScope] = useState<Scope>("following");
  const [type, setType] = useState("all");

  // Following needs sign-in, so signed-out visitors always see everything.
  const scope: Scope = signedIn ? chosenScope : "all";
  const inScope = needs.filter((need) => scope === "all" || followedIds.includes(need.foodBankId));
  const shown = inScope.filter((need) => type === "all" || need.category === type);
  const urgentCount = inScope.filter((need) => need.level === "urgent").length;
  const bankCount = new Set(inScope.map((need) => need.foodBankId)).size;
  const noneFollowed = scope === "following" && followedIds.length === 0;

  function action(need: NeedRow, className: string) {
    return (
      <ListButton
        needId={need.id}
        item={need.item}
        planned={plannedIds.includes(need.id)}
        signedIn={signedIn}
        className={className}
      />
    );
  }

  return (
    <>
      <SummaryTiles
        tiles={[
          { label: "Urgent", value: urgentCount },
          { label: "Running low", value: inScope.length - urgentCount },
          { label: "Food banks", value: bankCount },
        ]}
      />

      <section aria-labelledby="filter-title" className="rounded-card bg-surface p-4 shadow-card">
        <h2 id="filter-title" className="font-display text-lg font-semibold text-ink">
          Choose what to see
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <p id="scope-label" className="text-base font-medium text-ink">
              Food banks
            </p>
            {signedIn ? (
              <div role="group" aria-labelledby="scope-label" className="mt-1 grid grid-cols-2 gap-2">
                {scopes.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={scope === option.id}
                    onClick={() => setScope(option.id)}
                    className={`min-h-11 rounded-control border px-3 text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                      scope === option.id
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-line bg-surface text-ink hover:bg-sunken"
                    }`}
                  >
                    {scope === option.id && <span aria-hidden="true">✓ </span>}
                    {option.label}
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-1 text-base text-ink-muted">
                Showing all.{" "}
                <Link href="/sign-in" className={`inline-flex min-h-11 items-center ${textLinkClass}`}>
                  Sign in
                </Link>{" "}
                to follow food banks and see just theirs.
              </p>
            )}
          </div>
          <div>
            <label htmlFor="type-filter" className="text-base font-medium text-ink">
              Type of item
            </label>
            <select id="type-filter" value={type} onChange={(event) => setType(event.target.value)} className={inputClass}>
              <option value="all">All types</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section aria-labelledby="needs-title" className="rounded-card bg-surface shadow-card">
        <div className="flex items-baseline justify-between gap-2 border-b border-line p-4">
          <h2 id="needs-title" className="font-display text-lg font-semibold text-ink">
            Short right now
          </h2>
          <p className="text-base text-ink-muted">
            {shown.length} {shown.length === 1 ? "item" : "items"}
          </p>
        </div>

        {noneFollowed ? (
          <div className="space-y-3 p-6 text-center">
            <p className="text-base text-ink">You&apos;re not following any food banks yet.</p>
            <p className="text-base text-ink-muted">Follow the ones near you to see what they need here.</p>
            <Link href="/food-banks" className={buttonClass("primary")}>
              Choose food banks to follow
            </Link>
          </div>
        ) : shown.length === 0 && type !== "all" ? (
          <div className="space-y-3 p-6 text-center">
            <p className="text-base text-ink">Nothing of this type is short right now.</p>
            <button type="button" onClick={() => setType("all")} className={buttonClass("outline")}>
              Show all types
            </button>
          </div>
        ) : shown.length === 0 ? (
          <div className="space-y-3 p-6 text-center">
            <p className="text-base text-ink">Nothing is short right now. Check back soon.</p>
            {scope === "following" && (
              <button type="button" onClick={() => setScope("all")} className={buttonClass("outline")}>
                Show all food banks
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Phone: one card per item */}
            <ul className="divide-y divide-line md:hidden">
              {shown.map((need) => (
                <li key={need.id} className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-base font-semibold text-ink">{need.item}</p>
                    <NeedBadge kind={levelBadge(need.level)} />
                  </div>
                  <div className="text-base text-ink-muted">
                    <Link href={`/food-banks/${need.foodBankId}`} className={`inline-flex min-h-11 items-center ${textLinkClass}`}>
                      {need.foodBankName}
                    </Link>
                    <p>
                      {need.category} · Updated {need.updated}
                    </p>
                  </div>
                  {need.note && <p className="text-base text-ink">{need.note}</p>}
                  {action(need, "w-full")}
                </li>
              ))}
            </ul>

            {/* Computer: a table */}
            <table className="hidden w-full text-left text-base md:table">
              <thead className="bg-sunken text-ink-muted">
                <tr>
                  <th scope="col" className="px-4 py-2 font-semibold">
                    Item
                  </th>
                  <th scope="col" className="px-4 py-2 font-semibold">
                    Food bank
                  </th>
                  <th scope="col" className="px-4 py-2 font-semibold">
                    How short
                  </th>
                  <th scope="col" className="px-4 py-2 font-semibold">
                    Updated
                  </th>
                  <th scope="col" className="px-4 py-2 text-right font-semibold">
                    <span className="sr-only">Your list</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {shown.map((need) => (
                  <tr key={need.id} className="align-top">
                    <td className="px-4 py-3">
                      <span className="block font-semibold text-ink">{need.item}</span>
                      <span className="block text-ink-muted">{need.category}</span>
                      {need.note && <span className="mt-1 block text-ink">{need.note}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/food-banks/${need.foodBankId}`} className={textLinkClass}>
                        {need.foodBankName}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <NeedBadge kind={levelBadge(need.level)} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink-muted first-letter:uppercase">{need.updated}</td>
                    <td className="px-4 py-3 text-right">{action(need, "")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </section>
    </>
  );
}
