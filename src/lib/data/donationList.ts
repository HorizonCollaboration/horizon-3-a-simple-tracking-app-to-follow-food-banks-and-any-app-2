import { and, asc, eq, isNull } from "drizzle-orm";
import type { Database } from "@/db";
import { foodBanks, listItems, needs } from "@/db/schema";

/** Everything on this person's donation list, with the need and its food bank. */
export async function listMyItems(db: Database, userId: string) {
  return db
    .select({
      id: listItems.id,
      addedAt: listItems.createdAt,
      givenAt: listItems.givenAt,
      need: needs,
      foodBank: foodBanks,
    })
    .from(listItems)
    .innerJoin(needs, eq(listItems.needId, needs.id))
    .innerJoin(foodBanks, eq(needs.foodBankId, foodBanks.id))
    .where(eq(listItems.userId, userId))
    .orderBy(asc(listItems.createdAt));
}

/** The needs this person still plans to take. */
export async function listPlannedNeedIds(db: Database, userId: string): Promise<string[]> {
  const rows = await db
    .select({ needId: listItems.needId })
    .from(listItems)
    .where(and(eq(listItems.userId, userId), isNull(listItems.givenAt)));

  return rows.map((row) => row.needId);
}

/**
 * Puts a need on this person's list, unless it's already there to take.
 * Returns the item's name, or null if the need is gone or no longer needed.
 */
export async function addToList(db: Database, userId: string, needId: string): Promise<string | null> {
  const [need] = await db
    .select({ item: needs.item })
    .from(needs)
    .where(and(eq(needs.id, needId), isNull(needs.noLongerNeededAt)));

  if (!need) {
    return null;
  }

  const planned = await listPlannedNeedIds(db, userId);

  if (!planned.includes(needId)) {
    await db.insert(listItems).values({ userId, needId });
  }

  return need.item;
}

/** Takes a need off this person's list of things still to take. Returns its name, or null if it wasn't there. */
export async function removeNeedFromList(db: Database, userId: string, needId: string): Promise<string | null> {
  const removed = await db
    .delete(listItems)
    .where(and(eq(listItems.userId, userId), eq(listItems.needId, needId), isNull(listItems.givenAt)))
    .returning({ id: listItems.id });

  return removed.length > 0 ? needName(db, needId) : null;
}

/** Returns the name of what was removed, or null if it wasn't on this person's list. */
export async function removeListItem(db: Database, userId: string, itemId: string): Promise<string | null> {
  const [removed] = await db
    .delete(listItems)
    .where(and(eq(listItems.id, itemId), eq(listItems.userId, userId)))
    .returning({ needId: listItems.needId });

  return removed ? needName(db, removed.needId) : null;
}

/** Records today as the day it was given. Returns its name, or null if it wasn't on this person's list. */
export async function markGiven(db: Database, userId: string, itemId: string): Promise<string | null> {
  const [given] = await db
    .update(listItems)
    .set({ givenAt: new Date() })
    .where(and(eq(listItems.id, itemId), eq(listItems.userId, userId), isNull(listItems.givenAt)))
    .returning({ needId: listItems.needId });

  return given ? needName(db, given.needId) : null;
}

async function needName(db: Database, needId: string): Promise<string> {
  const [need] = await db.select({ item: needs.item }).from(needs).where(eq(needs.id, needId));

  return need?.item ?? "It";
}
