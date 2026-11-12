"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { buttonClass, inputClass } from "@/components/buttonStyles";
import type { FormState } from "@/lib/actionResult";
import { categories, levelNames, levels } from "@/lib/needs";
import { addNeedAction } from "../../actions";

const start: FormState = { error: null, message: null };

/** Adds something a food bank is short of. */
export default function NeedForm({ foodBankId }: { foodBankId: string }) {
  const [state, formAction, pending] = useActionState(addNeedAction, start);
  const form = useRef<HTMLFormElement>(null);

  // Clear the form once the need is added, ready for the next one.
  useEffect(() => {
    if (state.message) form.current?.reset();
  }, [state]);

  return (
    <form
      ref={form}
      // Sending the form this way keeps what people typed if something needs fixing.
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        startTransition(() => formAction(data));
      }}
      className="space-y-4"
    >
      <input type="hidden" name="foodBankId" value={foodBankId} />
      <div>
        <label htmlFor="need-item" className="text-base font-medium text-ink">
          Item
        </label>
        <input
          id="need-item"
          name="item"
          required
          maxLength={120}
          placeholder="For example: Tinned tomatoes"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="need-category" className="text-base font-medium text-ink">
          Type of item
        </label>
        <select id="need-category" name="category" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            Choose a type
          </option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <fieldset>
        <legend className="text-base font-medium text-ink">How short are they?</legend>
        <div className="mt-1 grid grid-cols-2 gap-2">
          {levels.map((level) => (
            <label
              key={level}
              className="flex min-h-11 cursor-pointer items-center gap-2 rounded-control border border-line bg-surface px-3 text-base text-ink has-[:checked]:border-primary has-[:checked]:bg-primary-soft has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary"
            >
              <input type="radio" name="level" value={level} defaultChecked={level === "urgent"} className="h-5 w-5" />
              {levelNames[level]}
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="need-note" className="text-base font-medium text-ink">
          Note (optional)
        </label>
        <input
          id="need-note"
          name="note"
          maxLength={200}
          placeholder="For example: Long-life cartons only, please."
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
        {pending ? "Adding…" : "Add need"}
      </button>
    </form>
  );
}
