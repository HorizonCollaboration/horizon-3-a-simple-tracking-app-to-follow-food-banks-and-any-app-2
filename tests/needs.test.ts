import { describe, expect, it } from "vitest";
import { getFoodBank } from "@/lib/data/foodBanks";
import {
  addNeed,
  deleteNeed,
  listCurrentNeeds,
  markNeededAgain,
  markNoLongerNeeded,
  setNeedLevel,
} from "@/lib/data/needs";
import { setUp } from "./helpers";

describe("needs", () => {
  it("lists current needs most urgent first, with their food bank", async () => {
    const { db, bankId } = await setUp();
    await addNeed(db, "sam", bankId, { item: "Soap", category: "Toiletries", level: "low", note: null });
    await addNeed(db, "ana", bankId, { item: "UHT milk", category: "Drinks", level: "urgent", note: "Cartons only" });

    const needs = await listCurrentNeeds(db);

    expect(needs.map((need) => need.item)).toEqual(["UHT milk", "Soap"]);
    expect(needs[0]).toMatchObject({ foodBankName: "Westbrook Pantry", note: "Cartons only" });
  });

  it("won't add a need to a food bank that isn't there", async () => {
    const { db } = await setUp();

    expect(await addNeed(db, "sam", "nowhere", { item: "Rice", category: "Dry food", level: "low", note: null })).toBeNull();
  });

  it("records when a food bank's needs last changed", async () => {
    const { db, bankId } = await setUp();
    const before = (await getFoodBank(db, bankId))!.needsUpdatedAt;
    const need = await addNeed(db, "sam", bankId, { item: "Soap", category: "Toiletries", level: "low", note: null });

    await setNeedLevel(db, need!.id, "urgent");

    const bank = await getFoodBank(db, bankId);
    expect(bank!.needsUpdatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect((await listCurrentNeeds(db))[0].level).toBe("urgent");
  });

  it("hides needs marked as no longer needed, and can bring them back", async () => {
    const { db, bankId } = await setUp();
    const need = await addNeed(db, "sam", bankId, { item: "Soap", category: "Toiletries", level: "low", note: null });

    await markNoLongerNeeded(db, need!.id);
    expect(await listCurrentNeeds(db)).toHaveLength(0);

    await markNeededAgain(db, need!.id);
    expect(await listCurrentNeeds(db)).toHaveLength(1);
  });

  it("only lets the person who added a need delete it", async () => {
    const { db, bankId } = await setUp();
    const need = await addNeed(db, "sam", bankId, { item: "Soap", category: "Toiletries", level: "low", note: null });

    expect(await deleteNeed(db, "ana", need!.id)).toBeNull();
    expect(await listCurrentNeeds(db)).toHaveLength(1);

    expect(await deleteNeed(db, "sam", need!.id)).not.toBeNull();
    expect(await listCurrentNeeds(db)).toHaveLength(0);
  });
});
