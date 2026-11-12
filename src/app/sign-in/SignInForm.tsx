"use client";

// Fixed by Horizon: don't change this file.
import { MailCheck } from "lucide-react";
import { useActionState } from "react";
import { Button, Field, FormMessage } from "@/kit";
import { sendSignInLink, type SignInState } from "./actions";

const initial: SignInState = { sent: false, error: null };

export default function SignInForm() {
  const [state, action, pending] = useActionState(sendSignInLink, initial);

  if (state.sent) {
    return (
      <div className="flex items-start gap-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
        <MailCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        Check your email for a link to sign in. It works once, for 15 minutes.
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <Field label="Your email address" name="email" type="email" autoComplete="email" required />
      <FormMessage error={state.error} />
      <Button type="submit" variant="primary" disabled={pending}>
        {pending ? "Sending…" : "Send me a sign-in link"}
      </Button>
    </form>
  );
}
