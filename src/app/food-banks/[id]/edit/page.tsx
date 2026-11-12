import Link from "next/link";
import { notFound } from "next/navigation";
import ActionButton from "@/components/ActionButton";
import AppShell from "@/components/AppShell";
import { buttonClass } from "@/components/buttonStyles";
import FoodBankForm from "@/components/FoodBankForm";
import NeedBadge, { levelBadge } from "@/components/NeedBadge";
import ScreenHeading from "@/components/ScreenHeading";
import { db } from "@/db";
import { whenUpdated } from "@/lib/dates";
import { getFoodBank } from "@/lib/data/foodBanks";
import { listNeedsForFoodBank } from "@/lib/data/needs";
import { requireUser } from "@/lib/session";
import {
  deleteNeedAction,
  markNeededAgainAction,
  markNoLongerNeededAction,
  saveFoodBankAction,
  setNeedLevelAction,
} from "../../actions";
import DeleteFoodBank from "./DeleteFoodBank";
import NeedForm from "./NeedForm";

/** Edit a food bank: its needs, its details and drop-off information. Signed-in people only. */
export default async function EditFoodBankPage({ params, searchParams }: PageProps<"/food-banks/[id]/edit">) {
  const user = await requireUser();
  const { id } = await params;
  const { done } = await searchParams;
  const bank = await getFoodBank(db, id);

  if (!bank) {
    notFound();
  }

  const allNeeds = await listNeedsForFoodBank(db, bank.id);
  const needs = allNeeds.filter((need) => !need.noLongerNeededAt);
  const gone = allNeeds.filter((need) => need.noLongerNeededAt);

  return (
    <AppShell
      current="banks"
      user={user}
      flash={done === "added" ? "Food bank added. Now add what they need." : undefined}
    >
      <div className="mx-auto max-w-3xl space-y-6">
        <Link href={`/food-banks/${bank.id}`} className={buttonClass("outline")}>
          <span aria-hidden="true">←</span> Back to {bank.name}
        </Link>
        <ScreenHeading intro="Keep this up to date for everyone. Changes show straight away.">Edit {bank.name}</ScreenHeading>

        <section aria-labelledby="needs-title" className="rounded-card bg-surface shadow-card">
          <h2 id="needs-title" className="border-b border-line p-4 font-display text-lg font-semibold text-ink">
            What they need now
          </h2>
          {needs.length === 0 ? (
            <p className="p-4 text-base text-ink-muted">Nothing yet. Add what they&apos;re short of below.</p>
          ) : (
            <ul className="divide-y divide-line">
              {needs.map((need) => (
                <li key={need.id} className="space-y-3 p-4">
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
                  <div className="flex flex-wrap gap-2">
                    {need.level === "urgent" ? (
                      <ActionButton action={setNeedLevelAction} id={need.id} value="low" variant="outline">
                        Change to running low<span className="sr-only">: {need.item}</span>
                      </ActionButton>
                    ) : (
                      <ActionButton action={setNeedLevelAction} id={need.id} value="urgent" variant="outline">
                        Change to urgent<span className="sr-only">: {need.item}</span>
                      </ActionButton>
                    )}
                    <ActionButton action={markNoLongerNeededAction} id={need.id} variant="outline">
                      No longer needed<span className="sr-only">: {need.item}</span>
                    </ActionButton>
                    {need.createdBy === user.id && (
                      <ActionButton action={deleteNeedAction} id={need.id} variant="danger">
                        Delete<span className="sr-only"> {need.item}</span>
                      </ActionButton>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="add-need-title" className="rounded-card bg-surface p-4 shadow-card">
          <h2 id="add-need-title" className="mb-3 font-display text-lg font-semibold text-ink">
            Add a need
          </h2>
          <NeedForm foodBankId={bank.id} />
        </section>

        {gone.length > 0 && (
          <section aria-labelledby="gone-title" className="rounded-card bg-surface shadow-card">
            <h2 id="gone-title" className="border-b border-line p-4 font-display text-lg font-semibold text-ink">
              No longer needed
            </h2>
            <ul className="divide-y divide-line">
              {gone.map((need) => (
                <li key={need.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-semibold text-ink">{need.item}</span>
                    <NeedBadge kind="gone" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <ActionButton action={markNeededAgainAction} id={need.id} variant="outline">
                      Needed again<span className="sr-only">: {need.item}</span>
                    </ActionButton>
                    {need.createdBy === user.id && (
                      <ActionButton action={deleteNeedAction} id={need.id} variant="danger">
                        Delete<span className="sr-only"> {need.item}</span>
                      </ActionButton>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="details-title" className="rounded-card bg-surface p-4 shadow-card">
          <h2 id="details-title" className="mb-3 font-display text-lg font-semibold text-ink">
            Details and drop-off
          </h2>
          <FoodBankForm
            action={saveFoodBankAction}
            foodBankId={bank.id}
            initial={{
              name: bank.name,
              area: bank.area,
              dropOffPlace: bank.dropOffPlace,
              dropOffTimes: bank.dropOffTimes,
              plenty: bank.plenty,
            }}
            submitLabel="Save details"
          />
        </section>

        {bank.createdBy === user.id && (
          <section aria-labelledby="delete-title" className="rounded-card bg-surface p-4 shadow-card">
            <h2 id="delete-title" className="font-display text-lg font-semibold text-ink">
              Delete this food bank
            </h2>
            <p className="mb-3 mt-1 text-base text-ink-muted">You added it, so you can delete it.</p>
            <DeleteFoodBank foodBankId={bank.id} name={bank.name} />
          </section>
        )}
      </div>
    </AppShell>
  );
}
