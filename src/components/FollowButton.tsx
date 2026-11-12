import Link from "next/link";
import { followAction, unfollowAction } from "@/app/food-banks/actions";
import ActionButton from "./ActionButton";
import { buttonClass } from "./buttonStyles";

type Props = { foodBankId: string; name: string; following: boolean; signedIn: boolean };

export default function FollowButton({ foodBankId, name, following, signedIn }: Props) {
  if (!signedIn) {
    return (
      <Link href="/sign-in" className={buttonClass("outline")}>
        Sign in to follow<span className="sr-only"> {name}</span>
      </Link>
    );
  }

  return following ? (
    <ActionButton action={unfollowAction} id={foodBankId} variant="outline">
      Stop following<span className="sr-only"> {name}</span>
    </ActionButton>
  ) : (
    <ActionButton action={followAction} id={foodBankId}>
      Follow<span className="sr-only"> {name}</span>
    </ActionButton>
  );
}
