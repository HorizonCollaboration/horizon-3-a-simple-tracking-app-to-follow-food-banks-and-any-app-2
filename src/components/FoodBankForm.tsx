"use client";

import { startTransition, useActionState } from "react";
import type { FormState } from "@/lib/actionResult";
import { buttonClass, inputClass } from "./buttonStyles";

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
  const field = (name: keyof Details) => `${foodBankId ?? "new"}-${name}`;

  return (
    <form
      // Sending the form this way keeps what people typed if something needs fixing.
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        startTransition(() => formAction(data));
      }}
      className="space-y-4"
    >
      {foodBankId && <input type="hidden" name="id" value={foodBankId} />}
      <div>
        <label htmlFor={field("name")} className="text-base font-medium text-ink">
          Name
        </label>
        <input id={field("name")} name="name" required maxLength={120} defaultValue={initial.name} className={inputClass} />
      </div>
      <div>
        <label htmlFor={field("area")} className="text-base font-medium text-ink">
          Area
        </label>
        <input id={field("area")} name="area" required maxLength={80} defaultValue={initial.area} className={inputClass} />
      </div>
      <div>
        <label htmlFor={field("dropOffPlace")} className="text-base font-medium text-ink">
          Where to drop off
        </label>
        <input
          id={field("dropOffPlace")}
          name="dropOffPlace"
          required
          maxLength={200}
          defaultValue={initial.dropOffPlace}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor={field("dropOffTimes")} className="text-base font-medium text-ink">
          When to drop off
        </label>
        <input
          id={field("dropOffTimes")}
          name="dropOffTimes"
          required
          maxLength={200}
          defaultValue={initial.dropOffTimes}
          placeholder="For example: Tuesday and Thursday, 09:30 to 12:30"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor={field("plenty")} className="text-base font-medium text-ink">
          What they have plenty of
        </label>
        <p id={`${field("plenty")}-hint`} className="text-base text-ink-muted">
          One item on each line. Leave it empty if you&apos;re not sure.
        </p>
        <textarea
          id={field("plenty")}
          name="plenty"
          rows={4}
          maxLength={1000}
          defaultValue={initial.plenty}
          aria-describedby={`${field("plenty")}-hint`}
          className={inputClass}
        />
      </div>
      <div role="status" aria-live="polite">
        {state.error && (
          <p className="rounded-card bg-danger-soft p-3 text-base text-danger">
            <span aria-hidden="true">! </span>
            {state.error}
          </p>
        )}
        {state.message && (
          <p className="rounded-card bg-success-soft p-3 text-base text-success">
            <span aria-hidden="true">✓ </span>
            {state.message}
          </p>
        )}
      </div>
      <button type="submit" disabled={pending} className={buttonClass("primary", "w-full sm:w-auto")}>
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
