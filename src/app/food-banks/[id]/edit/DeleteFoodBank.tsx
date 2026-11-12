"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import ActionButton from "@/components/ActionButton";
import { Button } from "@/kit";
import { deleteFoodBankAction } from "../../actions";

/** Deleting asks once more first, because it can't be undone. */
export default function DeleteFoodBank({ foodBankId, name }: { foodBankId: string; name: string }) {
  const [asking, setAsking] = useState(false);

  if (!asking) {
    return (
      <Button variant="danger" onClick={() => setAsking(true)}>
        <Trash2 aria-hidden="true" />
        Delete this food bank
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-red-50 p-4">
      <p className="text-sm text-red-900">
        Delete {name} and everything it needs? People&apos;s lists will lose these items too. This can&apos;t be undone.
      </p>
      <div className="flex flex-wrap gap-2">
        <ActionButton action={deleteFoodBankAction} id={foodBankId} variant="danger">
          Yes, delete it
        </ActionButton>
        <Button onClick={() => setAsking(false)}>Keep it</Button>
      </div>
    </div>
  );
}
