"use client";

import { useState } from "react";
import ActionButton from "@/components/ActionButton";
import { buttonClass } from "@/components/buttonStyles";
import { deleteFoodBankAction } from "../../actions";

/** Deleting asks once more first, because it can't be undone. */
export default function DeleteFoodBank({ foodBankId, name }: { foodBankId: string; name: string }) {
  const [asking, setAsking] = useState(false);

  if (!asking) {
    return (
      <button type="button" onClick={() => setAsking(true)} className={buttonClass("danger")}>
        Delete this food bank
      </button>
    );
  }

  return (
    <div className="space-y-3 rounded-card border border-danger bg-danger-soft p-4">
      <p className="text-base text-ink">
        Delete {name} and everything it needs? People&apos;s lists will lose these items too. This can&apos;t be undone.
      </p>
      <div className="flex flex-wrap gap-2">
        <ActionButton action={deleteFoodBankAction} id={foodBankId} variant="danger">
          Yes, delete it
        </ActionButton>
        <button type="button" onClick={() => setAsking(false)} className={buttonClass("outline")}>
          Keep it
        </button>
      </div>
    </div>
  );
}
