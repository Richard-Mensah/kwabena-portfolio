"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <section className="mx-auto flex min-h-[80vh] max-w-[1600px] flex-col justify-center px-5 pt-24 sm:px-8 lg:px-12">
      <p className="t-label text-muted">Something went wrong</p>
      <h1 className="t-page mt-5">
        A small <span className="serif-accent text-navy">misprint.</span>
      </h1>
      <div className="mt-10 flex gap-4">
        <button type="button" onClick={reset} className="h-12 rounded-full bg-navy px-6 t-small font-semibold text-ivory hover:bg-signal hover:text-ink">
          Try again
        </button>
        <Link href="/" className="inline-flex h-12 items-center rounded-full border border-ink/20 px-6 t-small font-semibold hover:border-ink">
          Back to home
        </Link>
      </div>
    </section>
  );
}
