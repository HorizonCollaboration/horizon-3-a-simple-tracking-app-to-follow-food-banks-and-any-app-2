import { Bell, BellOff } from "lucide-react";
import { followAction, unfollowAction } from "@/app/food-banks/actions";
import { Button } from "@/kit";
import ActionButton from "./ActionButton";

type Props = { foodBankId: string; name: string; following: boolean; signedIn: boolean; size?: "sm" | "md" };

export default function FollowButton({ foodBankId, name, following, signedIn, size = "md" }: Props) {
  if (!signedIn) {
    return (
      <Button href="/sign-in" size={size}>
        Sign in to follow<span className="sr-only"> {name}</span>
      </Button>
    );
  }

  return following ? (
    <ActionButton action={unfollowAction} id={foodBankId} variant="ghost" size={size}>
      <BellOff aria-hidden="true" />
      Stop following<span className="sr-only"> {name}</span>
    </ActionButton>
  ) : (
    <ActionButton action={followAction} id={foodBankId} variant="secondary" size={size}>
      <Bell aria-hidden="true" />
      Follow<span className="sr-only"> {name}</span>
    </ActionButton>
  );
}
