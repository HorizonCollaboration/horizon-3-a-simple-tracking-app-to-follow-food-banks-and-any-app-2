import { describe, expect, it } from "vitest";
import { deleteFoodBank, getFoodBank, listFoodBanks, updateFoodBank } from "@/lib/data/foodBanks";
import { addNeed, markNoLongerNeeded } from "@/lib/data/needs";
import { setUp } from "./helpers";

describe("food banks", () => {
  it("lists each food bank with how many urgent and running-low needs it has", async () => {
    const { db, bankId } = await setUp();
    await addNeed(db, "sam", bankId, { item: "Coffee", category: "Drinks", level: "urgent", note: null });
    await addNeed(db, "sam", bankId, { item: "Soap", category: "Toiletries", level: "low", note: null });
    const gone = await addNeed(db, "sam", bankId, { item: "Tea", category: "Drinks", level: "urgent", note: null });
    await markNoLongerNeeded(db, gone!.id);

    const [bank] = await listFoodBanks(db);

    expect(bank).toMatchObject({ name: "Westbrook Pantry", urgent: 1, low: 1 });
  });

  it("lets anyone signed in change the details", async () => {
    const { db, bankId } = await setUp();

    const changed = await updateFoodBank(db, bankId, {
      name: "Westbrook Pantry",
      area: "Westbrook",
      dropOffPlace: "Westbrook church hall",
      dropOffTimes: "Sunday, 12:00 to 14:00",
      plenty: "",
    });

    expect(changed).toBe(true);
    expect((await getFoodBank(db, bankId))?.dropOffPlace).toBe("Westbrook church hall");
  });

  it("only lets the person who added a food bank delete it", async () => {
    const { db, bankId } = await setUp();

    expect(await deleteFoodBank(db, "ana", bankId)).toBe(false);
    expect(await getFoodBank(db, bankId)).not.toBeNull();

    expect(await deleteFoodBank(db, "sam", bankId)).toBe(true);
    expect(await getFoodBank(db, bankId)).toBeNull();
  });
});
