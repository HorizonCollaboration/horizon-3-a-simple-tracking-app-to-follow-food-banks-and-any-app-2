/*
 * The app's own tables. Each person is a row in `user` (from the sign-in
 * tables): refer to it with `.references(() => user.id, { onDelete: "cascade" })`.
 * Only ever add tables and columns; never rename or remove one, so a new
 * version never loses what people have entered.
 */
import { pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export { user };

/** Shared: anyone can see them, any signed-in person can add or edit one. */
export const foodBanks = pgTable("food_banks", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  area: text("area").notNull(),
  dropOffPlace: text("drop_off_place").notNull(),
  dropOffTimes: text("drop_off_times").notNull(),
  /** What they have plenty of, one item per line. */
  plenty: text("plenty").notNull().default(""),
  /** When their list of needs last changed. */
  needsUpdatedAt: timestamp("needs_updated_at").notNull().defaultNow(),
  /** Who added it, so only they can delete it. Empty for the sample food banks. */
  createdBy: text("created_by").references(() => user.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/** Shared: what a food bank is short of. */
export const needs = pgTable("needs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  foodBankId: text("food_bank_id")
    .notNull()
    .references(() => foodBanks.id, { onDelete: "cascade" }),
  item: text("item").notNull(),
  category: text("category").notNull(),
  /** "urgent" or "low" (running low). */
  level: text("level").notNull(),
  note: text("note"),
  /** Set when someone marks it as no longer needed. */
  noLongerNeededAt: timestamp("no_longer_needed_at"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  /** Who added it, so only they can delete it. Empty for the sample needs. */
  createdBy: text("created_by").references(() => user.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/** Private: which food banks someone follows. */
export const follows = pgTable(
  "follows",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    foodBankId: text("food_bank_id")
      .notNull()
      .references(() => foodBanks.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [unique().on(table.userId, table.foodBankId)],
);

/** Private: the needs someone plans to give, and when they gave them. */
export const listItems = pgTable("list_items", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  needId: text("need_id")
    .notNull()
    .references(() => needs.id, { onDelete: "cascade" }),
  givenAt: timestamp("given_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
