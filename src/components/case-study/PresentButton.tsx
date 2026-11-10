"use client";

import { Presentation } from "lucide-react";
import { startPresentation } from "@/components/innovations/CommandPalette";

export function PresentButton({ from }: { from: number }) {
  return (
    <button
      type="button"
      onClick={() => startPresentation(from)}
      className="inline-flex h-10 items-center gap-2 rounded-full border border-ink/15 px-4 text-[0.85rem] font-medium transition-colors hover:border-navy hover:bg-navy hover:text-ivory"
    >
      <Presentation className="size-4" aria-hidden /> Present from here
    </button>
  );
}
