/*
 * Made-up data the app can start with, so there's something to try.
 * Realistic for the problem and clearly made up: no real people, contact
 * details, addresses or record numbers. Every food bank, place and item
 * here is invented. Dates are counted back from the day the app first starts.
 */
import type { Category, Level } from "@/lib/needs";

type SampleFoodBank = {
  id: string;
  name: string;
  area: string;
  dropOffPlace: string;
  dropOffTimes: string;
  plenty: string[];
  updatedDaysAgo: number;
};

type SampleNeed = {
  id: string;
  foodBankId: string;
  item: string;
  category: Category;
  level: Level;
  updatedDaysAgo: number;
  note?: string;
};

const foodBanks: SampleFoodBank[] = [
  {
    id: "sample-riverside",
    name: "Riverside Community Pantry",
    area: "Riverside",
    dropOffPlace: "Side entrance of Riverside Community Centre",
    dropOffTimes: "Monday, Wednesday and Friday, 10:00 to 14:00",
    plenty: ["Pasta", "Baked beans", "Tinned soup"],
    updatedDaysAgo: 0,
  },
  {
    id: "sample-northgate",
    name: "Northgate Food Bank",
    area: "Northgate",
    dropOffPlace: "Hall behind Northgate Library",
    dropOffTimes: "Tuesday and Thursday, 09:30 to 12:30",
    plenty: ["Rice", "Tea bags"],
    updatedDaysAgo: 1,
  },
  {
    id: "sample-aldric",
    name: "St Aldric's Church Larder",
    area: "Elm Park",
    dropOffPlace: "St Aldric's church hall, Elm Park",
    dropOffTimes: "Saturday, 09:00 to 12:00",
    plenty: ["Breakfast cereal", "Tinned tomatoes", "Biscuits"],
    updatedDaysAgo: 3,
  },
  {
    id: "sample-hillcrest",
    name: "Hillcrest Family Food Hub and Community Kitchen",
    area: "Hillcrest",
    dropOffPlace: "Hillcrest Family Centre reception",
    dropOffTimes: "Monday to Friday, 08:30 to 16:00",
    plenty: ["Pasta sauce"],
    updatedDaysAgo: 2,
  },
  {
    id: "sample-brookside",
    name: "Brookside Student Pantry",
    area: "Brookside",
    dropOffPlace: "Students' union front desk, Brookside campus",
    dropOffTimes: "Weekdays, 11:00 to 15:00",
    plenty: ["Instant noodles", "Porridge oats"],
    updatedDaysAgo: 6,
  },
  {
    id: "sample-oakfield",
    name: "Oakfield Food Bank",
    area: "Oakfield",
    dropOffPlace: "Oakfield Methodist hall",
    dropOffTimes: "Wednesday, 13:00 to 17:00",
    plenty: ["Most things: thank you to everyone who gave last month"],
    updatedDaysAgo: 4,
  },
];

const needs: SampleNeed[] = [
  { id: "sample-need-01", foodBankId: "sample-riverside", item: "UHT milk", category: "Drinks", level: "urgent", updatedDaysAgo: 0, note: "Long-life cartons only, please." },
  { id: "sample-need-02", foodBankId: "sample-riverside", item: "Tinned meat", category: "Tins and jars", level: "urgent", updatedDaysAgo: 0 },
  { id: "sample-need-03", foodBankId: "sample-riverside", item: "Toilet roll", category: "Toiletries", level: "low", updatedDaysAgo: 0 },
  { id: "sample-need-04", foodBankId: "sample-riverside", item: "Sugar (500g bags)", category: "Dry food", level: "low", updatedDaysAgo: 2 },
  { id: "sample-need-05", foodBankId: "sample-northgate", item: "Nappies (size 5 and 6)", category: "Baby", level: "urgent", updatedDaysAgo: 1 },
  { id: "sample-need-06", foodBankId: "sample-northgate", item: "Tinned fruit", category: "Tins and jars", level: "urgent", updatedDaysAgo: 1 },
  { id: "sample-need-07", foodBankId: "sample-northgate", item: "Coffee", category: "Drinks", level: "low", updatedDaysAgo: 1 },
  { id: "sample-need-08", foodBankId: "sample-northgate", item: "Shampoo", category: "Toiletries", level: "low", updatedDaysAgo: 3 },
  { id: "sample-need-09", foodBankId: "sample-northgate", item: "Washing-up liquid", category: "Household", level: "low", updatedDaysAgo: 3 },
  { id: "sample-need-10", foodBankId: "sample-aldric", item: "Tinned potatoes", category: "Tins and jars", level: "urgent", updatedDaysAgo: 3 },
  { id: "sample-need-11", foodBankId: "sample-aldric", item: "Long-life fruit juice", category: "Drinks", level: "low", updatedDaysAgo: 3 },
  { id: "sample-need-12", foodBankId: "sample-aldric", item: "Deodorant", category: "Toiletries", level: "low", updatedDaysAgo: 5 },
  { id: "sample-need-13", foodBankId: "sample-hillcrest", item: "Baby wipes", category: "Baby", level: "urgent", updatedDaysAgo: 2 },
  { id: "sample-need-14", foodBankId: "sample-hillcrest", item: "Lunchbox snacks (cereal bars, raisins)", category: "Breakfast and snacks", level: "urgent", updatedDaysAgo: 2, note: "For school holidays. No nuts, please." },
  { id: "sample-need-15", foodBankId: "sample-hillcrest", item: "Sanitary towels", category: "Toiletries", level: "urgent", updatedDaysAgo: 2 },
  { id: "sample-need-16", foodBankId: "sample-hillcrest", item: "Laundry pods", category: "Household", level: "low", updatedDaysAgo: 4 },
  { id: "sample-need-17", foodBankId: "sample-brookside", item: "Cooking oil", category: "Dry food", level: "urgent", updatedDaysAgo: 6 },
  { id: "sample-need-18", foodBankId: "sample-brookside", item: "Tinned chickpeas and lentils", category: "Tins and jars", level: "low", updatedDaysAgo: 6 },
  { id: "sample-need-19", foodBankId: "sample-brookside", item: "Toothpaste", category: "Toiletries", level: "low", updatedDaysAgo: 6 },
];

/** A made-up person, to show what following and a donation list look like. */
const person = { id: "sample-dave", name: "Dave S.", email: "dave.sample@example.com" };

const follows = ["sample-riverside", "sample-northgate", "sample-aldric"];

/** One thing still to take, and two already given. */
const donationList = [
  { id: "sample-list-1", needId: "sample-need-01", addedDaysAgo: 0, givenDaysAgo: null },
  { id: "sample-list-2", needId: "sample-need-10", addedDaysAgo: 10, givenDaysAgo: 8 },
  { id: "sample-list-3", needId: "sample-need-12", addedDaysAgo: 10, givenDaysAgo: 8 },
];

export const sampleData = { foodBanks, needs, person, follows, donationList };
