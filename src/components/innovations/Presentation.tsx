"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Pause, Play, X } from "lucide-react";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { useGame } from "@/components/game/GameProvider";

const SLIDES = projects;

/** Presentation Mode: a full-screen, keyboard-driven slideshow of every case study (for interviews). */
export function Presentation() {
  const { unlock } = useGame();
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [auto, setAuto] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const go = useCallback((d: number) => {
    setDir(d);
    setI((x) => (x + d + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    const onPresent = (e: Event) => {
      const from = (e as CustomEvent<number>).detail ?? 0;
      setI(from);
      setOpen(true);
      unlock("presenter");
    };
    window.addEventListener("ka:present", onPresent);
    return () => window.removeEventListener("ka:present", onPresent);
  }, [unlock]);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      else if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        go(-1);
      } else if (e.key.toLowerCase() === "p") setAuto((a) => !a);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      setAuto(false);
      opener?.focus?.();
    };
  }, [open, go]);

  useEffect(() => {
    if (!open || !auto) return;
    const t = setInterval(() => go(1), 6000);
    return () => clearInterval(t);
  }, [open, auto, go]);

  const p = SLIDES[i];
  const wide = p.image.width / p.image.height > 1.3;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          data-chrome
          role="dialog"
          aria-modal="true"
          aria-label={`Presentation: ${p.title}, slide ${i + 1} of ${SLIDES.length}`}
          className="fixed inset-0 z-[97] flex flex-col bg-navy text-ivory"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60" style={{ background: `radial-gradient(60% 60% at 70% 45%, ${p.palette[0]}55, transparent 70%)` }} />
          <div className="relative flex items-center justify-between px-5 py-4 sm:px-8">
            <p className="t-label text-ivory/70">
              {profile.name} · <span className="text-ivory">{String(i + 1).padStart(2, "0")}</span> / {String(SLIDES.length).padStart(2, "0")}
            </p>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setAuto((a) => !a)} aria-pressed={auto} aria-label={auto ? "Pause autoplay" : "Autoplay slides"} className="grid size-11 place-items-center rounded-full border border-ivory/25 hover:bg-ivory hover:text-navy">
                {auto ? <Pause className="size-4" /> : <Play className="size-4" />}
              </button>
              <button ref={closeRef} type="button" onClick={() => setOpen(false)} aria-label="Exit presentation" className="grid size-11 place-items-center rounded-full border border-ivory/25 hover:bg-ivory hover:text-navy">
                <X className="size-5" />
              </button>
            </div>
          </div>

          <div className="relative grid min-h-0 flex-1 items-center gap-8 px-5 pb-6 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-14">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={p.slug}
                className="relative h-[42svh] lg:col-span-7 lg:h-[72svh]"
                initial={{ opacity: 0, x: dir * 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -80 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image src={p.image.src} alt={p.alt} fill sizes="(min-width: 1024px) 58vw, 92vw" quality={90} className="object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,.45)]" priority />
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${p.slug}-text`}
                className="lg:col-span-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, delay: 0.1 }}
              >
                <p className="t-label text-ivory/60">
                  <span className="text-signal">{p.index}</span> · {p.kind === "Client" ? "Client work" : "Academic"} · {p.category}
                </p>
                <h2 className="mt-4 t-display">{p.title}</h2>
                <p className="mt-5 max-w-lg t-lead text-ivory/85">{p.summary}</p>
                <div className="mt-6 flex h-3 max-w-xs overflow-hidden rounded-full">
                  {p.palette.map((c) => (
                    <span key={c} className="flex-1" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <Link href={`/work/${p.slug}`} onClick={() => setOpen(false)} className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-signal px-5 text-[0.85rem] font-semibold text-ink hover:bg-ivory">
                  Open full case study <ArrowRight className="size-4" aria-hidden />
                </Link>
              </motion.div>
            </AnimatePresence>
            {wide && <span className="sr-only">Wide artwork</span>}
          </div>

          <div className="relative flex items-center gap-4 px-5 pb-5 sm:px-8">
            <button type="button" onClick={() => go(-1)} aria-label="Previous slide" className="grid size-12 place-items-center rounded-full border border-ivory/25 hover:bg-ivory hover:text-navy">
              <ArrowLeft className="size-5" />
            </button>
            <div className="flex h-1 flex-1 gap-1" aria-hidden>
              {SLIDES.map((s, k) => (
                <span key={s.slug} className="h-full flex-1 rounded-full transition-colors" style={{ backgroundColor: k <= i ? "#E64B32" : "rgba(245,242,235,.2)" }} />
              ))}
            </div>
            <button type="button" onClick={() => go(1)} aria-label="Next slide" className="grid size-12 place-items-center rounded-full border border-ivory/25 hover:bg-ivory hover:text-navy">
              <ArrowRight className="size-5" />
            </button>
          </div>
          <p className="sr-only" aria-live="polite">
            Slide {i + 1} of {SLIDES.length}: {p.title}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
