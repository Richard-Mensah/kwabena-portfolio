"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { XRayPin } from "@/data/project-types";
import type { StageImage } from "@/components/mockup/MockupStage";
import { cn } from "@/lib/utils";

/**
 * Design X-Ray: annotated, keyboard-focusable pins over an artwork that explain the
 * design decisions, with an optional rule-of-thirds overlay.
 */
export function XRayImage({ img, pins, on, grid, priority }: { img: StageImage; pins: XRayPin[]; on: boolean; grid: boolean; priority?: boolean }) {
  const [active, setActive] = useState<number | null>(null);
  return (
    <div className="relative" style={{ aspectRatio: `${img.width}/${img.height}` }}>
      <Image
        src={img.src}
        alt={img.alt}
        fill
        priority={priority}
        quality={92}
        sizes="(min-width: 1024px) 50vw, 92vw"
        className={cn("object-contain transition-[filter] duration-500", on && "brightness-[.55] saturate-[.7]")}
      />
      {grid && (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {[33.333, 66.666].map((v) => (
            <span key={`v${v}`} className="absolute inset-y-0 w-px bg-signal/70" style={{ left: `${v}%` }} />
          ))}
          {[33.333, 66.666].map((v) => (
            <span key={`h${v}`} className="absolute inset-x-0 h-px bg-signal/70" style={{ top: `${v}%` }} />
          ))}
          <span className="absolute inset-[6%] border border-dashed border-ivory/50" />
        </div>
      )}
      <AnimatePresence>
        {on &&
          pins.map((p, i) => (
            <motion.div
              key={i}
              className="absolute z-10"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: i * 0.07 }}
            >
              <button
                type="button"
                onClick={() => setActive(active === i ? null : i)}
                onFocus={() => setActive(i)}
                aria-expanded={active === i}
                aria-label={`Design note ${i + 1}: ${p.title}`}
                className={cn(
                  "relative -translate-x-1/2 -translate-y-1/2 grid size-8 place-items-center rounded-full border-2 border-ivory font-mono text-[0.75rem] font-bold shadow-lg transition-colors",
                  active === i ? "bg-ivory text-navy" : "bg-signal text-ink",
                )}
              >
                <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-signal/50 motion-reduce:animate-none" />
                <span className="relative">{i + 1}</span>
              </button>
              <AnimatePresence>
                {active === i && (
                  <motion.div
                    role="note"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className={cn(
                      "absolute top-5 z-20 w-60 rounded-md bg-ivory p-4 text-ink shadow-2xl ring-1 ring-ink/10",
                      p.x > 55 ? "right-0" : "left-0",
                    )}
                  >
                    <p className="t-label text-signal-deep">Note {i + 1}</p>
                    <p className="mt-1 text-[0.95rem] leading-snug font-semibold">{p.title}</p>
                    <p className="mt-1.5 t-small text-ink/75">{p.note}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}

export function XRayList({ pins }: { pins: XRayPin[] }) {
  return (
    <ol className="grid gap-4 sm:grid-cols-2">
      {pins.map((p, i) => (
        <li key={i} className="flex gap-4 border-t border-ink/12 pt-4">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-navy font-mono text-[0.75rem] font-bold text-ivory">{i + 1}</span>
          <span>
            <span className="block t-body font-semibold">{p.title}</span>
            <span className="mt-1 block t-small text-ink/75">{p.note}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
