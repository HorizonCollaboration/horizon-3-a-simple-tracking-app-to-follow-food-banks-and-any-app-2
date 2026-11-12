// Fixed by Horizon: don't change this file.
import { LogIn } from "lucide-react";
import horizon from "@/horizon.json";
import { Card, Tile } from "@/kit";
import SignInForm from "./SignInForm";

export default function SignInPage() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 p-6">
      <div className="flex flex-col gap-3">
        <Tile icon={LogIn} size="lg" />
        <h1 className="text-2xl font-semibold tracking-tight">Sign in to {horizon.name}</h1>
        <p className="text-sm text-muted-foreground">We&apos;ll email you a link. No password needed.</p>
      </div>
      <Card>
        <SignInForm />
      </Card>
    </main>
  );
}
