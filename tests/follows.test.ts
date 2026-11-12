import { describe, expect, it } from "vitest";
import { followFoodBank, listFollowedIds, unfollowFoodBank } from "@/lib/data/follows";
import { setUp } from "./helpers";

describe("following food banks", () => {
  it("keeps each person's follows to themselves", async () => {
    const { db, bankId } = await setUp();

    expect(await followFoodBank(db, "sam", bankId)).toBe("Westbrook Pantry");
    await followFoodBank(db, "sam", bankId);

    expect(await listFollowedIds(db, "sam")).toEqual([bankId]);
    expect(await listFollowedIds(db, "ana")).toEqual([]);

    await unfollowFoodBank(db, "ana", bankId);
    expect(await listFollowedIds(db, "sam")).toEqual([bankId]);

    await unfollowFoodBank(db, "sam", bankId);
    expect(await listFollowedIds(db, "sam")).toEqual([]);
  });

  it("won't follow a food bank that isn't there", async () => {
    const { db } = await setUp();

    expect(await followFoodBank(db, "sam", "nowhere")).toBeNull();
  });
});
