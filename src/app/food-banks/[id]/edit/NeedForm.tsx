"use client";

import { Plus } from "lucide-react";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { Button, Field, FormMessage, Segmented, Select } from "@/kit";
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
      className="flex flex-col gap-5"
    >
      <input type="hidden" name="foodBankId" value={foodBankId} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Item" name="item" required maxLength={120} placeholder="For example: Tinned tomatoes" />
        <Select
          label="Type of item"
          name="category"
          required
          placeholder="Choose a type"
          className="md:w-full"
          options={categories.map((category) => ({ value: category, label: category }))}
        />
      </div>
      <Segmented
        label="How short are they?"
        name="level"
        defaultValue="urgent"
        options={levels.map((level) => ({ value: level, label: levelNames[level] }))}
      />
      <Field label="Note (optional)" name="note" maxLength={200} placeholder="For example: Long-life cartons only, please." />
      <FormMessage error={state.error} message={state.message} />
      <Button type="submit" variant="primary" disabled={pending} className="w-full sm:w-fit">
        <Plus aria-hidden="true" />
        {pending ? "Adding…" : "Add need"}
      </Button>
    </form>
  );
}
