"use client";

import { useState, ViewTransition } from "react";
import { Box, Grid3x3, ScanEye, Square } from "lucide-react";
import type { MockupKind, XRayPin } from "@/data/project-types";
import { MockupScene, type StageImage } from "@/components/mockup/MockupStage";
import { XRayImage } from "@/components/innovations/XRay";
import { useGame } from "@/components/game/GameProvider";
import { cn } from "@/lib/utils";

type Mode = "flat" | "context" | "xray";

/** Case-study hero: Flat ↔ In context (Mockup Studio) ↔ X-Ray, with a thirds-grid toggle. */
export function CaseStage({
  img,
  mockup,
  tone,
  pins,
  slug,
  transitionName,
}: {
  img: StageImage;
  mockup: MockupKind;
  tone: string;
  pins: XRayPin[];
  slug: string;
  transitionName?: string;
}) {
  const { unlock } = useGame();
  const [mode, setMode] = useState<Mode>(mockup === "card" ? "context" : "flat");
  const [grid, setGrid] = useState(false);

  const choose = (m: Mode) => {
    setMode(m);
    if (m === "xray") unlock("xray-vision");
  };

  const tabs: { id: Mode; label: string; icon: React.ReactNode; hidden?: boolean }[] = [
    { id: "flat", label: "Flat", icon: <Square className="size-4" aria-hidden /> },
    { id: "context", label: "In context", icon: <Box className="size-4" aria-hidden /> },
    { id: "xray", label: "Design X-Ray", icon: <ScanEye className="size-4" aria-hidden />, hidden: pins.length === 0 },
  ];

  const wide = img.width / img.height > 1.4;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Presentation mode" className="inline-flex rounded-full bg-ink/[0.06] p-1">
          {tabs
            .filter((t) => !t.hidden)
            .map((t) => (
              <button
                key={t.id}
                role="tab"
                type="button"
                aria-selected={mode === t.id}
                aria-controls={`stage-${slug}`}
                onClick={() => choose(t.id)}
                data-testid={`stage-${t.id}`}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-full px-4 text-[0.85rem] font-medium transition-colors",
                  mode === t.id ? "bg-navy text-ivory shadow" : "text-ink/70 hover:text-ink",
                )}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
        </div>
        {mode !== "context" && (
          <button
            type="button"
            aria-pressed={grid}
            onClick={() => setGrid((g) => !g)}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[0.85rem] font-medium transition-colors",
              grid ? "border-signal bg-signal text-ink" : "border-ink/15 hover:border-ink",
            )}
          >
            <Grid3x3 className="size-4" aria-hidden /> Thirds grid
          </button>
        )}
      </div>

      <div
        id={`stage-${slug}`}
        role="tabpanel"
        className={cn("relative overflow-hidden", mode === "context" ? (wide ? "aspect-[16/10]" : "aspect-[4/5] sm:aspect-[4/3] lg:aspect-[16/10]") : "")}
        style={mode !== "context" ? { backgroundColor: tone } : undefined}
      >
        {mode === "context" ? (
          <MockupScene img={img} kind={mockup} tone={tone} priority />
        ) : (
          <div className={cn("mx-auto", wide ? "max-w-[1200px] p-4 sm:p-10" : "max-w-[760px] p-5 sm:p-12")}>
            {transitionName ? (
              <ViewTransition name={transitionName}>
                <div className="shadow-[0_50px_100px_-40px_rgba(0,0,0,0.5)]">
                  <XRayImage img={img} pins={pins} on={mode === "xray"} grid={grid} priority />
                </div>
              </ViewTransition>
            ) : (
              <div className="shadow-[0_50px_100px_-40px_rgba(0,0,0,0.5)]">
                <XRayImage img={img} pins={pins} on={mode === "xray"} grid={grid} />
              </div>
            )}
          </div>
        )}
      </div>
      {mode === "xray" && <p className="mt-3 t-small text-muted">Select a numbered pin, or press Tab, to read each design decision.</p>}
    </div>
  );
}
