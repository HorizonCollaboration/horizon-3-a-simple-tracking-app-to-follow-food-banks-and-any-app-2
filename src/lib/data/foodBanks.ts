import { and, asc, eq, isNull } from "drizzle-orm";
import type { Database } from "@/db";
import { foodBanks, needs } from "@/db/schema";

export type FoodBank = typeof foodBanks.$inferSelect;

export type FoodBankDetails = {
  name: string;
  area: string;
  dropOffPlace: string;
  dropOffTimes: string;
  plenty: string;
};

/** Every food bank, by name, with how many urgent and running-low needs each has. */
export async function listFoodBanks(db: Database) {
  const banks = await db.select().from(foodBanks).orderBy(asc(foodBanks.name));
  const current = await db
    .select({ foodBankId: needs.foodBankId, level: needs.level })
    .from(needs)
    .where(isNull(needs.noLongerNeededAt));

  return banks.map((bank) => {
    const theirs = current.filter((need) => need.foodBankId === bank.id);
    const urgent = theirs.filter((need) => need.level === "urgent").length;

    return { ...bank, urgent, low: theirs.length - urgent };
  });
}

export async function getFoodBank(db: Database, id: string): Promise<FoodBank | null> {
  const [bank] = await db.select().from(foodBanks).where(eq(foodBanks.id, id));

  return bank ?? null;
}

export async function addFoodBank(db: Database, userId: string, details: FoodBankDetails): Promise<FoodBank> {
  const [bank] = await db
    .insert(foodBanks)
    .values({ ...details, createdBy: userId })
    .returning();

  return bank;
}

/** Food banks are shared: any signed-in person can keep their details up to date. */
export async function updateFoodBank(db: Database, id: string, details: FoodBankDetails): Promise<boolean> {
  const updated = await db.update(foodBanks).set(details).where(eq(foodBanks.id, id)).returning({ id: foodBanks.id });

  return updated.length > 0;
}

/** Only the person who added a food bank can delete it. */
export async function deleteFoodBank(db: Database, userId: string, id: string): Promise<boolean> {
  const deleted = await db
    .delete(foodBanks)
    .where(and(eq(foodBanks.id, id), eq(foodBanks.createdBy, userId)))
    .returning({ id: foodBanks.id });

  return deleted.length > 0;
}
