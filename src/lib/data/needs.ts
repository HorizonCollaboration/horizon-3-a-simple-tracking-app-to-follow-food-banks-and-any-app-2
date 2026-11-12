import { and, eq, isNull } from "drizzle-orm";
import type { Database } from "@/db";
import { foodBanks, needs } from "@/db/schema";
import { byUrgency, type Category, type Level } from "@/lib/needs";

export type Need = typeof needs.$inferSelect;

export type NewNeed = {
  item: string;
  category: Category;
  level: Level;
  note: string | null;
};

/** Every need that's still current, across all food banks, most urgent first. */
export async function listCurrentNeeds(db: Database) {
  const rows = await db
    .select({ need: needs, foodBankName: foodBanks.name })
    .from(needs)
    .innerJoin(foodBanks, eq(needs.foodBankId, foodBanks.id))
    .where(isNull(needs.noLongerNeededAt));

  return rows.map(({ need, foodBankName }) => ({ ...need, foodBankName })).sort(byUrgency);
}

/** One food bank's needs, most urgent first, including ones no longer needed. */
export async function listNeedsForFoodBank(db: Database, foodBankId: string): Promise<Need[]> {
  const rows = await db.select().from(needs).where(eq(needs.foodBankId, foodBankId));

  return rows.sort(byUrgency);
}

async function touchFoodBank(db: Database, foodBankId: string, now: Date) {
  await db.update(foodBanks).set({ needsUpdatedAt: now }).where(eq(foodBanks.id, foodBankId));
}

/** Adds a need to a food bank. Returns null if there's no such food bank. */
export async function addNeed(db: Database, userId: string, foodBankId: string, input: NewNeed): Promise<Need | null> {
  const [bank] = await db.select({ id: foodBanks.id }).from(foodBanks).where(eq(foodBanks.id, foodBankId));

  if (!bank) {
    return null;
  }

  const now = new Date();
  const [need] = await db
    .insert(needs)
    .values({ ...input, foodBankId, createdBy: userId, updatedAt: now })
    .returning();
  await touchFoodBank(db, foodBankId, now);

  return need;
}

/** Needs are shared: any signed-in person can change one. Returns the need, or null if it's gone. */
async function changeNeed(db: Database, needId: string, change: Partial<Pick<Need, "level" | "noLongerNeededAt">>) {
  const now = new Date();
  const [need] = await db
    .update(needs)
    .set({ ...change, updatedAt: now })
    .where(eq(needs.id, needId))
    .returning();

  if (!need) {
    return null;
  }

  await touchFoodBank(db, need.foodBankId, now);

  return need;
}

export async function setNeedLevel(db: Database, needId: string, level: Level) {
  return changeNeed(db, needId, { level });
}

export async function markNoLongerNeeded(db: Database, needId: string) {
  return changeNeed(db, needId, { noLongerNeededAt: new Date() });
}

export async function markNeededAgain(db: Database, needId: string) {
  return changeNeed(db, needId, { noLongerNeededAt: null });
}

/** Only the person who added a need can delete it. */
export async function deleteNeed(db: Database, userId: string, needId: string): Promise<Need | null> {
  const [need] = await db
    .delete(needs)
    .where(and(eq(needs.id, needId), eq(needs.createdBy, userId)))
    .returning();

  if (!need) {
    return null;
  }

  await touchFoodBank(db, need.foodBankId, new Date());

  return need;
}
