import Link from "next/link";
import AppShell from "@/components/AppShell";
import { buttonClass } from "@/components/buttonStyles";
import FoodBankForm from "@/components/FoodBankForm";
import ScreenHeading from "@/components/ScreenHeading";
import { requireUser } from "@/lib/session";
import { addFoodBankAction } from "../actions";

/** Add a food bank. Signed-in people only. */
export default async function NewFoodBankPage() {
  const user = await requireUser();

  return (
    <AppShell current="banks" user={user}>
      <div className="mx-auto max-w-2xl space-y-6">
        <Link href="/food-banks" className={buttonClass("outline")}>
          <span aria-hidden="true">←</span> Back to all food banks
        </Link>
        <ScreenHeading intro="Everyone will see it. After you add it, you can say what they need.">
          Add a food bank
        </ScreenHeading>
        <section className="rounded-card bg-surface p-4 shadow-card">
          <FoodBankForm action={addFoodBankAction} submitLabel="Add food bank" />
        </section>
      </div>
    </AppShell>
  );
}
