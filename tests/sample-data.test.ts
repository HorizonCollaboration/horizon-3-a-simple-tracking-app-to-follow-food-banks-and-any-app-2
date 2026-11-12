import { describe, expect, it } from "vitest";
import { listMyItems } from "@/lib/data/donationList";
import { listFollowedIds } from "@/lib/data/follows";
import { listFoodBanks } from "@/lib/data/foodBanks";
import { listCurrentNeeds } from "@/lib/data/needs";
import { ensureSampleData } from "@/lib/data/sampleData";
import { testDatabase } from "./db";

describe("sample data", () => {
  it("starts the app with made-up food banks, needs and one person's list, once", async () => {
    const db = await testDatabase();

    await ensureSampleData(db);
    await ensureSampleData(db);

    expect(await listFoodBanks(db)).toHaveLength(6);
    expect(await listCurrentNeeds(db)).toHaveLength(19);
    expect(await listFollowedIds(db, "sample-dave")).toHaveLength(3);

    const list = await listMyItems(db, "sample-dave");
    expect(list.filter((entry) => !entry.givenAt)).toHaveLength(1);
    expect(list.filter((entry) => entry.givenAt)).toHaveLength(2);
  });
});
