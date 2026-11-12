import { Check, CircleCheck, Clock, ListChecks, MapPin, PackageCheck, ShoppingBasket, Store, X } from "lucide-react";
import Link from "next/link";
import ActionButton from "@/components/ActionButton";
import AppShell from "@/components/AppShell";
import { categoryLook, foodBankLook } from "@/components/looks";
import NeedBadge, { levelBadge } from "@/components/NeedBadge";
import { db } from "@/db";
import { Button, EmptyState, List, Row, ScreenHeader, Section, Stat, Tile } from "@/kit";
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
      <ScreenHeader
        icon={ListChecks}
        tone="green"
        title="My donation list"
        description="What you plan to give, sorted by food bank, with drop-off times."
      />

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Stat label="To take" value={toTake.length} icon={ShoppingBasket} tone="orange" />
        <Stat label="Places to go" value={banks.length} icon={Store} tone="indigo" />
        <Stat label="Given" value={given.length} icon={CircleCheck} tone="green" />
      </div>

      {toTake.length === 0 ? (
        <EmptyState
          icon={ShoppingBasket}
          title="Nothing to take yet"
          description="Add items from What's needed and they'll appear here."
          action={
            <Button variant="primary" href="/">
              See what&apos;s needed
            </Button>
          }
        />
      ) : (
        banks.map((bank) => (
          <Section
            key={bank.id}
            title={`Take to ${bank.name}`}
            description={
              <span className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  {bank.dropOffPlace}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3.5" aria-hidden="true" />
                  {bank.dropOffTimes}
                </span>
              </span>
            }
            action={
              <Link href={`/food-banks/${bank.id}`} className="text-sm font-medium underline underline-offset-4 hover:text-muted-foreground">
                See everything they need<span className="sr-only"> at {bank.name}</span>
              </Link>
            }
          >
            <List>
              {toTake
                .filter((entry) => entry.foodBank.id === bank.id)
                .map((entry) => {
                  const look = categoryLook(entry.need.category);

                  return (
                    <Row
                      key={entry.id}
                      media={<Tile icon={look.icon} tone={look.tone} />}
                      title={entry.need.item}
                      description={`Added ${formatDate(entry.addedAt)}`}
                      actions={
                        <>
                          <ActionButton action={markGivenAction} id={entry.id} variant="outline" size="sm">
                            <Check aria-hidden="true" />
                            Given<span className="sr-only">: mark {entry.need.item} as given</span>
                          </ActionButton>
                          <ActionButton action={removeListItemAction} id={entry.id} variant="ghost" size="sm">
                            <X aria-hidden="true" />
                            Remove<span className="sr-only">: {entry.need.item}</span>
                          </ActionButton>
                        </>
                      }
                    >
                      <NeedBadge kind={entry.need.noLongerNeededAt ? "gone" : levelBadge(entry.need.level)} />
                      {entry.need.note && <span className="text-sm text-muted-foreground">{entry.need.note}</span>}
                    </Row>
                  );
                })}
            </List>
          </Section>
        ))
      )}

      <Section title="Already given">
        {given.length === 0 ? (
          <EmptyState
            icon={PackageCheck}
            title="Nothing given yet"
            description="When you drop something off, choose Given and it will show here."
          />
        ) : (
          <List>
            {given.map((entry) => (
              <Row
                key={entry.id}
                compact
                media={<Tile icon={foodBankLook.icon} tone="green" size="sm" />}
                title={entry.need.item}
                description={`${entry.foodBank.name} · ${entry.givenAt ? formatDate(entry.givenAt) : ""}`}
              >
                <NeedBadge kind="given" />
              </Row>
            ))}
          </List>
        )}
      </Section>
    </AppShell>
  );
}
