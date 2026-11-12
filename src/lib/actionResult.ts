/** What a button's server action sends back: whether it worked, and what to tell the person. */
export type ActionResult = { ok: boolean; message: string };

/** What a form's server action sends back. */
export type FormState = { error: string | null; message: string | null };
