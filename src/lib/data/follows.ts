import { and, eq } from "drizzle-orm";
import type { Database } from "@/db";
import { follows, foodBanks } from "@/db/schema";

/** The ids of the food banks this person follows. */
export async function listFollowedIds(db: Database, userId: string): Promise<string[]> {
  const rows = await db.select({ foodBankId: follows.foodBankId }).from(follows).where(eq(follows.userId, userId));

  return rows.map((row) => row.foodBankId);
}

/** Starts following a food bank. Returns its name, or null if there's no such food bank. */
export async function followFoodBank(db: Database, userId: string, foodBankId: string): Promise<string | null> {
  const [bank] = await db.select({ name: foodBanks.name }).from(foodBanks).where(eq(foodBanks.id, foodBankId));

  if (!bank) {
    return null;
  }

  await db.insert(follows).values({ userId, foodBankId }).onConflictDoNothing();

  return bank.name;
}

export async function unfollowFoodBank(db: Database, userId: string, foodBankId: string): Promise<void> {
  await db.delete(follows).where(and(eq(follows.userId, userId), eq(follows.foodBankId, foodBankId)));
}
