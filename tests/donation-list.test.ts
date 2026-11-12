import { describe, expect, it } from "vitest";
import {
  addToList,
  listMyItems,
  listPlannedNeedIds,
  markGiven,
  removeListItem,
  removeNeedFromList,
} from "@/lib/data/donationList";
import { addNeed, markNoLongerNeeded } from "@/lib/data/needs";
import { setUp } from "./helpers";

async function withNeed() {
  const { db, bankId } = await setUp();
  const need = await addNeed(db, "sam", bankId, { item: "Coffee", category: "Drinks", level: "urgent", note: null });

  return { db, needId: need!.id };
}

describe("donation list", () => {
  it("adds a need once, and marks it as given with the date", async () => {
    const { db, needId } = await withNeed();

    expect(await addToList(db, "sam", needId)).toBe("Coffee");
    await addToList(db, "sam", needId);
    const [entry] = await listMyItems(db, "sam");

    expect(await listMyItems(db, "sam")).toHaveLength(1);
    expect(await markGiven(db, "sam", entry.id)).toBe("Coffee");

    const [given] = await listMyItems(db, "sam");
    expect(given.givenAt).toBeInstanceOf(Date);
    expect(given.foodBank.name).toBe("Westbrook Pantry");
    expect(await listPlannedNeedIds(db, "sam")).toEqual([]);
  });

  it("keeps each person's list private", async () => {
    const { db, needId } = await withNeed();
    await addToList(db, "sam", needId);
    const [entry] = await listMyItems(db, "sam");

    expect(await listMyItems(db, "ana")).toEqual([]);
    expect(await markGiven(db, "ana", entry.id)).toBeNull();
    expect(await removeListItem(db, "ana", entry.id)).toBeNull();
    expect(await removeNeedFromList(db, "ana", needId)).toBeNull();

    const [still] = await listMyItems(db, "sam");
    expect(still.givenAt).toBeNull();
  });

  it("removes things still to take, but keeps what was given", async () => {
    const { db, needId } = await withNeed();
    await addToList(db, "sam", needId);
    const [entry] = await listMyItems(db, "sam");
    await markGiven(db, "sam", entry.id);
    await addToList(db, "sam", needId);

    expect(await removeNeedFromList(db, "sam", needId)).toBe("Coffee");

    const left = await listMyItems(db, "sam");
    expect(left).toHaveLength(1);
    expect(left[0].givenAt).not.toBeNull();
  });

  it("won't add something that's no longer needed", async () => {
    const { db, needId } = await withNeed();
    await markNoLongerNeeded(db, needId);

    expect(await addToList(db, "sam", needId)).toBeNull();
    expect(await listMyItems(db, "sam")).toEqual([]);
  });
});
