import Link from "next/link";
import { addToListAction, removeNeedFromListAction } from "@/app/my-list/actions";
import ActionButton from "./ActionButton";
import { buttonClass } from "./buttonStyles";

type Props = { needId: string; item: string; planned: boolean; signedIn: boolean; className?: string };

/** Adds a need to, or removes it from, the signed-in person's donation list. */
export default function ListButton({ needId, item, planned, signedIn, className = "" }: Props) {
  if (!signedIn) {
    return (
      <Link href="/sign-in" className={buttonClass("outline", className)}>
        Sign in to add to a list<span className="sr-only">: {item}</span>
      </Link>
    );
  }

  return planned ? (
    <ActionButton action={removeNeedFromListAction} id={needId} variant="outline" className={className}>
      Remove from my list<span className="sr-only">: {item}</span>
    </ActionButton>
  ) : (
    <ActionButton action={addToListAction} id={needId} className={className}>
      Add to my list<span className="sr-only">: {item}</span>
    </ActionButton>
  );
}
