import { Baby, Cookie, CupSoda, Droplets, ShoppingBasket, Soup, SprayCan, Store, Wheat, type LucideIcon } from "lucide-react";
import type { TileTone } from "@/kit";

/** Each type of item has its own picture, the same on every screen. */
const categoryLooks: Record<string, { icon: LucideIcon; tone: TileTone }> = {
  "Tins and jars": { icon: Soup, tone: "orange" },
  "Dry food": { icon: Wheat, tone: "amber" },
  "Breakfast and snacks": { icon: Cookie, tone: "pink" },
  Drinks: { icon: CupSoda, tone: "sky" },
  Baby: { icon: Baby, tone: "violet" },
  Toiletries: { icon: Droplets, tone: "teal" },
  Household: { icon: SprayCan, tone: "green" },
};

export function categoryLook(category: string): { icon: LucideIcon; tone: TileTone } {
  return categoryLooks[category] ?? { icon: ShoppingBasket, tone: "neutral" };
}

/** A food bank's picture. */
export const foodBankLook = { icon: Store, tone: "indigo" } as const;
