import Link from "next/link";
import { buttonClass } from "@/components/buttonStyles";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-4 p-6 text-center">
      <h1 className="font-display text-2xl font-bold text-ink">We couldn&apos;t find that</h1>
      <p className="text-base text-ink-muted">It may have been deleted. Have a look at what&apos;s needed instead.</p>
      <Link href="/" className={buttonClass("primary")}>
        See what&apos;s needed
      </Link>
    </main>
  );
}
