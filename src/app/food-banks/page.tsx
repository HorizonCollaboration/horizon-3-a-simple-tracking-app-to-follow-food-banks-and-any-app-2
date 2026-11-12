import { Clock, Plus, Store } from "lucide-react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import FollowButton from "@/components/FollowButton";
import { foodBankLook } from "@/components/looks";
import NeedBadge from "@/components/NeedBadge";
import { db } from "@/db";
import { Button, EmptyState, List, Row, ScreenHeader, Tile } from "@/kit";
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
      <ScreenHeader
        icon={Store}
        tone="indigo"
        title="Food banks"
        description="Follow the food banks you give to. Their needs will show on What's needed."
        action={
          user && (
            <Button variant="primary" href="/food-banks/new">
              <Plus aria-hidden="true" />
              Add a food bank
            </Button>
          )
        }
      />

      {!user && (
        <p className="-mt-4 text-sm text-muted-foreground">
          <Link href="/sign-in" className="font-medium text-primary underline underline-offset-2">
            Sign in
          </Link>{" "}
          to follow or add a food bank.
        </p>
      )}

      {banks.length === 0 ? (
        <EmptyState icon={Store} title="No food banks yet" description="Sign in and add the first one." />
      ) : (
        <List>
          {banks.map((bank) => {
            const following = followedIds.includes(bank.id);

            return (
              <Row
                key={bank.id}
                href={`/food-banks/${bank.id}`}
                media={<Tile icon={foodBankLook.icon} tone={foodBankLook.tone} />}
                title={bank.name}
                description={`${bank.area} · Needs updated ${whenUpdated(bank.needsUpdatedAt, now)}`}
                actions={user && <FollowButton foodBankId={bank.id} name={bank.name} following={following} signedIn size="sm" />}
              >
                {following && <NeedBadge kind="following" />}
                {bank.urgent + bank.low === 0 && <NeedBadge kind="stocked" />}
                {bank.urgent > 0 && <NeedBadge kind="urgent">{bank.urgent} urgent</NeedBadge>}
                {bank.low > 0 && <NeedBadge kind="low">{bank.low} running low</NeedBadge>}
                <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="size-3.5" aria-hidden="true" />
                  {bank.dropOffTimes}
                </span>
              </Row>
            );
          })}
        </List>
      )}
    </AppShell>
  );
}
