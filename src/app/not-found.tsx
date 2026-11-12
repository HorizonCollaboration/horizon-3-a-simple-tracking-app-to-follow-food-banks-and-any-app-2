import { SearchX } from "lucide-react";
import { Button, EmptyState } from "@/kit";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center p-6">
      <EmptyState
        icon={SearchX}
        title={<h1>We couldn&apos;t find that</h1>}
        description="It may have been deleted. Have a look at what's needed instead."
        action={
          <Button variant="primary" href="/">
            See what&apos;s needed
          </Button>
        }
      />
    </main>
  );
}
