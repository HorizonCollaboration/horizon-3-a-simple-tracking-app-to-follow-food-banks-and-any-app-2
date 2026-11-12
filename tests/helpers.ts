import type { Database } from "@/db";
import { user } from "@/db/schema";
import { addFoodBank } from "@/lib/data/foodBanks";
import { testDatabase } from "./db";

/** A fresh database with two people, Sam and Ana, and one food bank Sam added. */
export async function setUp(): Promise<{ db: Database; bankId: string }> {
  const db = await testDatabase();
  await db.insert(user).values([
    { id: "sam", name: "Sam", email: "sam@example.com" },
    { id: "ana", name: "Ana", email: "ana@example.com" },
  ]);
  const bank = await addFoodBank(db, "sam", {
    name: "Westbrook Pantry",
    area: "Westbrook",
    dropOffPlace: "Westbrook scout hut",
    dropOffTimes: "Saturday, 10:00 to 12:00",
    plenty: "Pasta\nRice",
  });

  return { db, bankId: bank.id };
}
