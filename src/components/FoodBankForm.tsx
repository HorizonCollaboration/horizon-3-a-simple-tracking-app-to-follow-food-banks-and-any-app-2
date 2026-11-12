"use client";

import { startTransition, useActionState } from "react";
import { Button, Field, FormMessage, TextArea } from "@/kit";
import type { FormState } from "@/lib/actionResult";

type Details = { name: string; area: string; dropOffPlace: string; dropOffTimes: string; plenty: string };

type Props = {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  /** Set when editing a food bank that's already here. */
  foodBankId?: string;
  initial?: Details;
  submitLabel: string;
};

const empty: Details = { name: "", area: "", dropOffPlace: "", dropOffTimes: "", plenty: "" };
const start: FormState = { error: null, message: null };

/** A food bank's name, area, drop-off details and what they have plenty of. */
export default function FoodBankForm({ action, foodBankId, initial = empty, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, start);

  return (
    <form
      // Sending the form this way keeps what people typed if something needs fixing.
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        startTransition(() => formAction(data));
      }}
      className="flex flex-col gap-5"
    >
      {foodBankId && <input type="hidden" name="id" value={foodBankId} />}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" required maxLength={120} defaultValue={initial.name} />
        <Field label="Area" name="area" required maxLength={80} defaultValue={initial.area} />
      </div>
      <Field label="Where to drop off" name="dropOffPlace" required maxLength={200} defaultValue={initial.dropOffPlace} />
      <Field
        label="When to drop off"
        name="dropOffTimes"
        required
        maxLength={200}
        defaultValue={initial.dropOffTimes}
        placeholder="For example: Tuesday and Thursday, 09:30 to 12:30"
      />
      <TextArea
        label="What they have plenty of"
        hint="One item on each line. Leave it empty if you're not sure."
        name="plenty"
        rows={4}
        maxLength={1000}
        defaultValue={initial.plenty}
      />
      <FormMessage error={state.error} message={state.message} />
      <Button type="submit" variant="primary" disabled={pending} className="w-full sm:w-fit">
        {pending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
