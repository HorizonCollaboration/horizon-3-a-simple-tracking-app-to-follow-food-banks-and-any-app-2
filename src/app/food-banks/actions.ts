"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import type { ActionResult, FormState } from "@/lib/actionResult";
import { followFoodBank, unfollowFoodBank } from "@/lib/data/follows";
import { addFoodBank, deleteFoodBank, getFoodBank, updateFoodBank } from "@/lib/data/foodBanks";
import { addNeed, deleteNeed, markNeededAgain, markNoLongerNeeded, setNeedLevel } from "@/lib/data/needs";
import { categories, levelNames, levels } from "@/lib/needs";
import { requireUser } from "@/lib/session";

const refresh = "Something went wrong. Please refresh the page and try again.";
const id = z.string(refresh).trim().min(1, refresh).max(100, refresh);

const details = z.object({
  name: z.string().trim().min(1, "Add the food bank's name.").max(120, "Keep the name under 120 characters."),
  area: z.string().trim().min(1, "Add the area it's in.").max(80, "Keep the area under 80 characters."),
  dropOffPlace: z
    .string()
    .trim()
    .min(1, "Add where people can drop things off.")
    .max(200, "Keep where to drop off under 200 characters."),
  dropOffTimes: z
    .string()
    .trim()
    .min(1, "Add when people can drop things off.")
    .max(200, "Keep the drop-off times under 200 characters."),
  plenty: z.string().trim().max(1000, "Keep what they have plenty of under 1,000 characters."),
});

const need = z.object({
  foodBankId: id,
  item: z.string().trim().min(1, "Add the item they need.").max(120, "Keep the item under 120 characters."),
  category: z.enum(categories, "Choose a type of item."),
  level: z.enum(levels, "Choose how short they are."),
  note: z.string().trim().max(200, "Keep the note under 200 characters."),
});

function readDetails(form: FormData) {
  return details.safeParse({
    name: form.get("name") ?? "",
    area: form.get("area") ?? "",
    dropOffPlace: form.get("dropOffPlace") ?? "",
    dropOffTimes: form.get("dropOffTimes") ?? "",
    plenty: form.get("plenty") ?? "",
  });
}

const gone: ActionResult = { ok: false, message: "That's no longer here. Please refresh the page." };

export async function followAction(foodBankId: string): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = id.safeParse(foodBankId);
  const name = parsed.success ? await followFoodBank(db, user.id, parsed.data) : null;

  if (!name) {
    return gone;
  }

  revalidatePath("/", "layout");

  return { ok: true, message: `You're now following ${name}. Their needs will show on What's needed.` };
}

export async function unfollowAction(foodBankId: string): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = id.safeParse(foodBankId);

  if (!parsed.success) {
    return gone;
  }

  const bank = await getFoodBank(db, parsed.data);
  await unfollowFoodBank(db, user.id, parsed.data);
  revalidatePath("/", "layout");

  return { ok: true, message: `You stopped following ${bank?.name ?? "that food bank"}.` };
}

export async function addFoodBankAction(_state: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const parsed = readDetails(form);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, message: null };
  }

  const bank = await addFoodBank(db, user.id, parsed.data);
  revalidatePath("/", "layout");
  redirect(`/food-banks/${bank.id}/edit?done=added`);
}

export async function saveFoodBankAction(_state: FormState, form: FormData): Promise<FormState> {
  await requireUser();
  const bankId = id.safeParse(form.get("id"));
  const parsed = readDetails(form);

  if (!bankId.success) {
    return { error: "That food bank is no longer here.", message: null };
  }

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, message: null };
  }

  if (!(await updateFoodBank(db, bankId.data, parsed.data))) {
    return { error: "That food bank is no longer here.", message: null };
  }

  revalidatePath("/", "layout");

  return { error: null, message: "Details saved." };
}

export async function deleteFoodBankAction(foodBankId: string): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = id.safeParse(foodBankId);

  if (!parsed.success || !(await deleteFoodBank(db, user.id, parsed.data))) {
    return { ok: false, message: "Only the person who added this food bank can delete it." };
  }

  revalidatePath("/", "layout");
  redirect("/food-banks?done=deleted");
}

export async function addNeedAction(_state: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const parsed = need.safeParse({
    foodBankId: form.get("foodBankId"),
    item: form.get("item") ?? "",
    category: form.get("category"),
    level: form.get("level"),
    note: form.get("note") ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, message: null };
  }

  const { foodBankId, note, ...rest } = parsed.data;
  const added = await addNeed(db, user.id, foodBankId, { ...rest, note: note || null });

  if (!added) {
    return { error: "That food bank is no longer here.", message: null };
  }

  revalidatePath("/", "layout");

  return { error: null, message: `Added ${added.item}. It now shows on What's needed.` };
}

export async function setNeedLevelAction(needId: string, level?: string): Promise<ActionResult> {
  await requireUser();
  const parsed = z.object({ needId: id, level: z.enum(levels) }).safeParse({ needId, level });

  if (!parsed.success) {
    return gone;
  }

  const changed = await setNeedLevel(db, parsed.data.needId, parsed.data.level);

  if (!changed) {
    return gone;
  }

  revalidatePath("/", "layout");

  return { ok: true, message: `${changed.item} is now marked: ${levelNames[changed.level as keyof typeof levelNames].toLowerCase()}.` };
}

export async function markNoLongerNeededAction(needId: string): Promise<ActionResult> {
  await requireUser();
  const parsed = id.safeParse(needId);
  const changed = parsed.success ? await markNoLongerNeeded(db, parsed.data) : null;

  if (!changed) {
    return gone;
  }

  revalidatePath("/", "layout");

  return { ok: true, message: `${changed.item} is marked as no longer needed.` };
}

export async function markNeededAgainAction(needId: string): Promise<ActionResult> {
  await requireUser();
  const parsed = id.safeParse(needId);
  const changed = parsed.success ? await markNeededAgain(db, parsed.data) : null;

  if (!changed) {
    return gone;
  }

  revalidatePath("/", "layout");

  return { ok: true, message: `${changed.item} is needed again. It shows on What's needed.` };
}

export async function deleteNeedAction(needId: string): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = id.safeParse(needId);
  const deleted = parsed.success ? await deleteNeed(db, user.id, parsed.data) : null;

  if (!deleted) {
    return { ok: false, message: "Only the person who added this need can delete it." };
  }

  revalidatePath("/", "layout");

  return { ok: true, message: `Deleted ${deleted.item}.` };
}
