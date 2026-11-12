"use client";

import { useTransition, type ReactNode } from "react";
import type { ActionResult } from "@/lib/actionResult";
import { buttonClass, type ButtonVariant } from "./buttonStyles";
import { useFlash } from "./Flash";

type Props = {
  action: (id: string, value?: string) => Promise<ActionResult>;
  id: string;
  value?: string;
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
};

/** A button that runs one server action and then says what happened. */
export default function ActionButton({ action, id, value, variant = "primary", className = "", children }: Props) {
  const [pending, startTransition] = useTransition();
  const say = useFlash();

  return (
    <button
      type="button"
      disabled={pending}
      aria-busy={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await action(id, value);
          // Nothing comes back when the action moves the person to another screen.
          if (result) say(result);
        })
      }
      className={buttonClass(variant, className)}
    >
      {children}
    </button>
  );
}
