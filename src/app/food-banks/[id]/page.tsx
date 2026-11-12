import { Clock, MapPin, PackageCheck, Pencil } from "lucide-react";
import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import FollowButton from "@/components/FollowButton";
import ListButton from "@/components/ListButton";
import { categoryLook, foodBankLook } from "@/components/looks";
import NeedBadge, { levelBadge } from "@/components/NeedBadge";
import { db } from "@/db";
import { Button, Card, EmptyState, List, Row, ScreenHeader, Section, Tag, Tile } from "@/kit";
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
      <ScreenHeader
        back={{ label: "All food banks", href: "/food-banks" }}
        icon={foodBankLook.icon}
        tone={foodBankLook.tone}
        title={bank.name}
        description={`${bank.area} · Needs updated ${whenUpdated(bank.needsUpdatedAt)}`}
        action={
          <>
            {following && <NeedBadge kind="following" />}
            <FollowButton foodBankId={bank.id} name={bank.name} following={following} signedIn={Boolean(user)} />
            {user && (
              <Button href={`/food-banks/${bank.id}/edit`}>
                <Pencil aria-hidden="true" />
                Edit<span className="sr-only"> {bank.name}</span>
              </Button>
            )}
          </>
        }
      />

      <Section title="Short right now">
        {needs.length === 0 ? (
          <EmptyState icon={PackageCheck} title="Nothing is short here right now" description="Check back soon, or look at another food bank." />
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
                  actions={<ListButton needId={need.id} item={need.item} planned={plannedIds.includes(need.id)} signedIn={Boolean(user)} />}
                >
                  <NeedBadge kind={levelBadge(need.level)} />
                  {need.note && <span className="text-sm text-muted-foreground">{need.note}</span>}
                </Row>
              );
            })}
          </List>
        )}
      </Section>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Where and when to drop off">
          <dl className="flex flex-col gap-3 text-sm">
            <div className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <div>
                <dt className="sr-only">Where</dt>
                <dd>{bank.dropOffPlace}</dd>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <div>
                <dt className="sr-only">When</dt>
                <dd>{bank.dropOffTimes}</dd>
              </div>
            </div>
          </dl>
        </Card>

        <Card
          title="They have plenty of"
          description={plenty.length === 0 ? "They haven't said yet." : "Please give something else for now."}
        >
          {plenty.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {plenty.map((item, index) => (
                <li key={index}>
                  <Tag tone="good">{item}</Tag>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
