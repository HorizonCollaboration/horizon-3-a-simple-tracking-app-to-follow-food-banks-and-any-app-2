import type { Database } from "@/db";
import { follows, foodBanks, listItems, needs, user } from "@/db/schema";
import { sampleData } from "@/sampleData";

function daysAgo(days: number, now: Date): Date {
  return new Date(now.getTime() - days * 86_400_000);
}

/**
 * Puts the made-up food banks and needs in place the first time the app
 * runs, so there's something to try. Does nothing once any food bank exists.
 * Safe to run twice at once: every sample row has a fixed id.
 */
export async function ensureSampleData(db: Database, now = new Date()): Promise<void> {
  const [existing] = await db.select({ id: foodBanks.id }).from(foodBanks).limit(1);

  if (existing) {
    return;
  }

  const { person } = sampleData;

  await db
    .insert(foodBanks)
    .values(
      sampleData.foodBanks.map(({ plenty, updatedDaysAgo, ...bank }) => ({
        ...bank,
        plenty: plenty.join("\n"),
        needsUpdatedAt: daysAgo(updatedDaysAgo, now),
      })),
    )
    .onConflictDoNothing();

  await db
    .insert(needs)
    .values(
      sampleData.needs.map(({ updatedDaysAgo, note, ...need }) => ({
        ...need,
        note: note ?? null,
        updatedAt: daysAgo(updatedDaysAgo, now),
      })),
    )
    .onConflictDoNothing();

  await db.insert(user).values(person).onConflictDoNothing();

  await db
    .insert(follows)
    .values(sampleData.follows.map((foodBankId) => ({ id: `${person.id}-${foodBankId}`, userId: person.id, foodBankId })))
    .onConflictDoNothing();

  await db
    .insert(listItems)
    .values(
      sampleData.donationList.map((entry) => ({
        id: entry.id,
        userId: person.id,
        needId: entry.needId,
        createdAt: daysAgo(entry.addedDaysAgo, now),
        givenAt: entry.givenDaysAgo === null ? null : daysAgo(entry.givenDaysAgo, now),
      })),
    )
    .onConflictDoNothing();
}
