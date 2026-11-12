/* Dates as people in the UK read them. */

const timeZone = "Europe/London";

const dayKey = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" });
const shortDate = new Intl.DateTimeFormat("en-GB", { timeZone, day: "2-digit", month: "2-digit", year: "numeric" });

/** Whole days between the two dates, counted by calendar day in the UK. */
export function daysBetween(earlier: Date, later: Date): number {
  return Math.round((Date.parse(dayKey.format(later)) - Date.parse(dayKey.format(earlier))) / 86_400_000);
}

/** "today", "yesterday" or "3 days ago". */
export function whenUpdated(date: Date, now = new Date()): string {
  const days = daysBetween(date, now);

  if (days <= 0) return "today";
  if (days === 1) return "yesterday";

  return `${days} days ago`;
}

/** 24/05/2025 */
export function formatDate(date: Date): string {
  return shortDate.format(date);
}
