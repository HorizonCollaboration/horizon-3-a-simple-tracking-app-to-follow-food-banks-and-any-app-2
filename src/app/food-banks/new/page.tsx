import { Store } from "lucide-react";
import AppShell from "@/components/AppShell";
import FoodBankForm from "@/components/FoodBankForm";
import { Card, ScreenHeader } from "@/kit";
import { requireUser } from "@/lib/session";
import { addFoodBankAction } from "../actions";

/** Add a food bank. Signed-in people only. */
export default async function NewFoodBankPage() {
  const user = await requireUser();

  return (
    <AppShell current="banks" user={user}>
      <ScreenHeader
        back={{ label: "All food banks", href: "/food-banks" }}
        icon={Store}
        tone="indigo"
        title="Add a food bank"
        description="Everyone will see it. After you add it, you can say what they need."
      />
      <Card>
        <FoodBankForm action={addFoodBankAction} submitLabel="Add food bank" />
      </Card>
    </AppShell>
  );
}
