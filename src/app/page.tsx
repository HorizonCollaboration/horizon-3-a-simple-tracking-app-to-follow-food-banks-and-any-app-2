import { HandHeart } from "lucide-react";
import AppShell from "@/components/AppShell";
import { db } from "@/db";
import { ScreenHeader } from "@/kit";
import { whenUpdated } from "@/lib/dates";
import { listPlannedNeedIds } from "@/lib/data/donationList";
import { listFollowedIds } from "@/lib/data/follows";
import { listCurrentNeeds } from "@/lib/data/needs";
import { ensureSampleData } from "@/lib/data/sampleData";
import { currentUser } from "@/lib/session";
import NeedsFinder from "./NeedsFinder";

/** What's needed: every food bank's needs in one list. Anyone can see it. */
export default async function WhatsNeededPage() {
  // Reading who's signed in also makes sure the screen is never built ahead of time.
  const user = await currentUser();
  await ensureSampleData(db);
  const needs = await listCurrentNeeds(db);
  const followedIds = user ? await listFollowedIds(db, user.id) : [];
  const plannedIds = user ? await listPlannedNeedIds(db, user.id) : [];
  const now = new Date();

  return (
    <AppShell current="needs" user={user}>
      <ScreenHeader
        icon={HandHeart}
        tone="orange"
        title="What's needed"
        description="What food banks are short of right now, most urgent first. Add items to your list before you shop."
      />
      <NeedsFinder
        signedIn={Boolean(user)}
        followedIds={followedIds}
        plannedIds={plannedIds}
        needs={needs.map((need) => ({
          id: need.id,
          item: need.item,
          category: need.category,
          level: need.level,
          note: need.note,
          foodBankId: need.foodBankId,
          foodBankName: need.foodBankName,
          updated: whenUpdated(need.updatedAt, now),
        }))}
      />
    </AppShell>
  );
}
