/*
 * Words and choices for needs, shared by the screens and the server.
 * Nothing here touches the database, so screens in the browser can use it.
 */

export const categories = [
  "Tins and jars",
  "Dry food",
  "Breakfast and snacks",
  "Drinks",
  "Baby",
  "Toiletries",
  "Household",
] as const;

export type Category = (typeof categories)[number];

/** "urgent": almost none left. "low": running low. */
export const levels = ["urgent", "low"] as const;

export type Level = (typeof levels)[number];

export const levelNames: Record<Level, string> = {
  urgent: "Urgent",
  low: "Running low",
};

/** Urgent first, then the most recently updated, then by name. */
export function byUrgency<T extends { level: string; updatedAt: Date; item: string }>(a: T, b: T) {
  return (
    (a.level === "urgent" ? 0 : 1) - (b.level === "urgent" ? 0 : 1) ||
    b.updatedAt.getTime() - a.updatedAt.getTime() ||
    a.item.localeCompare(b.item)
  );
}

/** "What they have plenty of" is kept one item per line. */
export function plentyList(plenty: string): string[] {
  return plenty
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
