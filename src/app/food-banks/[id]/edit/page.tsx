import { Archive, ArrowDown, ArrowUp, PackageCheck, RotateCcw, Trash2 } from "lucide-react";
import { notFound } from "next/navigation";
import ActionButton from "@/components/ActionButton";
import AppShell from "@/components/AppShell";
import FoodBankForm from "@/components/FoodBankForm";
import { categoryLook, foodBankLook } from "@/components/looks";
import NeedBadge, { levelBadge } from "@/components/NeedBadge";
import { db } from "@/db";
import { Card, EmptyState, List, Row, ScreenHeader, Section, Tile } from "@/kit";
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
    <AppShell current="banks" user={user} flash={done === "added" ? "Food bank added. Now add what they need." : undefined}>
      <ScreenHeader
        back={{ label: `Back to ${bank.name}`, href: `/food-banks/${bank.id}` }}
        icon={foodBankLook.icon}
        tone={foodBankLook.tone}
        title={`Edit ${bank.name}`}
        description="Keep this up to date for everyone. Changes show straight away."
      />

      <Section title="What they need now">
        {needs.length === 0 ? (
          <EmptyState icon={PackageCheck} title="Nothing yet" description="Add what they're short of below." />
        ) : (
          <List>
            {needs.map((need) => {
              const look = categoryLook(need.category);

              return (
                <Row
                  key={need.id}
                  media={<Tile icon={look.icon} tone={look.tone} />}
                  title={need.item}
                  description={`${need.category} · Updated ${whenUpdated(need.updatedAt)}`}
                  actions={
                    <>
                      {need.level === "urgent" ? (
                        <ActionButton action={setNeedLevelAction} id={need.id} value="low" variant="outline" size="sm">
                          <ArrowDown aria-hidden="true" />
                          Running low<span className="sr-only">: change {need.item} to running low</span>
                        </ActionButton>
                      ) : (
                        <ActionButton action={setNeedLevelAction} id={need.id} value="urgent" variant="outline" size="sm">
                          <ArrowUp aria-hidden="true" />
                          Urgent<span className="sr-only">: change {need.item} to urgent</span>
                        </ActionButton>
                      )}
                      <ActionButton action={markNoLongerNeededAction} id={need.id} variant="outline" size="sm">
                        <Archive aria-hidden="true" />
                        Not needed<span className="sr-only">: {need.item}</span>
                      </ActionButton>
                      {need.createdBy === user.id && (
                        <ActionButton action={deleteNeedAction} id={need.id} variant="ghost" size="sm">
                          <Trash2 aria-hidden="true" />
                          Delete<span className="sr-only"> {need.item}</span>
                        </ActionButton>
                      )}
                    </>
                  }
                >
                  <NeedBadge kind={levelBadge(need.level)} />
                  {need.note && <span className="text-sm text-muted-foreground">{need.note}</span>}
                </Row>
              );
            })}
          </List>
        )}
      </Section>

      <Card title="Add a need" description="Something they're short of now.">
        <NeedForm foodBankId={bank.id} />
      </Card>

      {gone.length > 0 && (
        <Section title="No longer needed">
          <List>
            {gone.map((need) => {
              const look = categoryLook(need.category);

              return (
                <Row
                  key={need.id}
                  compact
                  media={<Tile icon={look.icon} tone="neutral" size="sm" />}
                  title={need.item}
                  actions={
                    <>
                      <ActionButton action={markNeededAgainAction} id={need.id} variant="outline" size="sm">
                        <RotateCcw aria-hidden="true" />
                        Needed again<span className="sr-only">: {need.item}</span>
                      </ActionButton>
                      {need.createdBy === user.id && (
                        <ActionButton action={deleteNeedAction} id={need.id} variant="ghost" size="sm">
                          <Trash2 aria-hidden="true" />
                          Delete<span className="sr-only"> {need.item}</span>
                        </ActionButton>
                      )}
                    </>
                  }
                >
                  <NeedBadge kind="gone" />
                </Row>
              );
            })}
          </List>
        </Section>
      )}

      <Card title="Details and drop-off">
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
      </Card>

      {bank.createdBy === user.id && (
        <Card title="Delete this food bank" description="You added it, so you can delete it.">
          <DeleteFoodBank foodBankId={bank.id} name={bank.name} />
        </Card>
      )}
    </AppShell>
  );
}
