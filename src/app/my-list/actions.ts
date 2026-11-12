"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import type { ActionResult } from "@/lib/actionResult";
import { addToList, markGiven, removeListItem, removeNeedFromList } from "@/lib/data/donationList";
import { requireUser } from "@/lib/session";

const id = z.string().trim().min(1).max(100);

const gone: ActionResult = { ok: false, message: "That's no longer on the list. Please refresh the page." };

export async function addToListAction(needId: string): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = id.safeParse(needId);
  const item = parsed.success ? await addToList(db, user.id, parsed.data) : null;

  if (!item) {
    return { ok: false, message: "That item is no longer needed, so it wasn't added." };
  }

  revalidatePath("/", "layout");

  return { ok: true, message: `Added ${item} to your list.` };
}

export async function removeNeedFromListAction(needId: string): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = id.safeParse(needId);
  const item = parsed.success ? await removeNeedFromList(db, user.id, parsed.data) : null;

  if (!item) {
    return gone;
  }

  revalidatePath("/", "layout");

  return { ok: true, message: `Removed ${item} from your list.` };
}

export async function removeListItemAction(itemId: string): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = id.safeParse(itemId);
  const item = parsed.success ? await removeListItem(db, user.id, parsed.data) : null;

  if (!item) {
    return gone;
  }

  revalidatePath("/", "layout");

  return { ok: true, message: `Removed ${item} from your list.` };
}

export async function markGivenAction(itemId: string): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = id.safeParse(itemId);
  const item = parsed.success ? await markGiven(db, user.id, parsed.data) : null;

  if (!item) {
    return gone;
  }

  revalidatePath("/", "layout");

  return { ok: true, message: `Thank you. ${item} is marked as given.` };
}
