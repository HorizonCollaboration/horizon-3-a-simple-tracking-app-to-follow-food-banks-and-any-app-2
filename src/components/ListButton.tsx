import { Check, Plus } from "lucide-react";
import { addToListAction, removeNeedFromListAction } from "@/app/my-list/actions";
import { Button } from "@/kit";
import ActionButton from "./ActionButton";

type Props = { needId: string; item: string; planned: boolean; signedIn: boolean };

/** Adds a need to, or removes it from, the signed-in person's donation list. */
export default function ListButton({ needId, item, planned, signedIn }: Props) {
  if (!signedIn) {
    return (
      <Button href="/sign-in" size="sm">
        Sign in to add<span className="sr-only">: {item}</span>
      </Button>
    );
  }

  return planned ? (
    <ActionButton action={removeNeedFromListAction} id={needId} variant="ghost" size="sm">
      <Check aria-hidden="true" />
      On my list<span className="sr-only">: {item}. Remove it</span>
    </ActionButton>
  ) : (
    <ActionButton action={addToListAction} id={needId} variant="outline" size="sm">
      <Plus aria-hidden="true" />
      Add to my list<span className="sr-only">: {item}</span>
    </ActionButton>
  );
}
