"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Lock, X } from "lucide-react";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { ACHIEVEMENTS, useGame, type AchievementId } from "@/components/game/GameProvider";

export function ArchiveHud() {
  const { play, ready, viewed, total, achievements, reset } = useGame();
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const n = viewed.length;
  const complete = n >= total;

  // Stay out of the way on the hero; appear once the visitor starts exploring.
  useEffect(() => {
    const onScroll = () => setShown(pathname !== "/" || window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!ready || !play) return null;

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, y: 20 }}
        animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        tabIndex={shown ? 0 : -1}
        aria-hidden={!shown}
        style={{ pointerEvents: shown ? "auto" : "none" }}
        data-chrome
        aria-haspopup="dialog"
        aria-label={`Studio Archive: ${n} of ${total} works collected. Open archive`}
        data-cursor="Archive"
        className="fixed bottom-4 left-4 z-[65] flex items-center gap-3 rounded-full border border-ink/10 bg-ivory/90 py-2 pr-4 pl-2 shadow-lg shadow-black/10 backdrop-blur-md sm:bottom-6 sm:left-6"
      >
        <span className="relative grid size-9 place-items-center">
          <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90" aria-hidden>
            <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeOpacity=".12" strokeWidth="2.5" />
            <motion.circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="#E64B32"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={100.5}
              animate={{ strokeDashoffset: 100.5 * (1 - n / total) }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
          <span className="text-[0.7rem] font-semibold">{complete ? "✦" : n}</span>
        </span>
        <span className="text-left leading-tight">
          <span className="block t-label text-[0.58rem] text-muted">Studio Archive</span>
          <span className="block text-[0.8rem] font-semibold">
            {complete ? "Studio Pass unlocked" : `${n}/${total} collected`}
          </span>
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[85] flex items-end justify-center bg-navy/60 p-3 backdrop-blur-sm sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              ref={panelRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="archive-title"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="max-h-[90svh] w-full max-w-3xl overflow-y-auto bg-ivory p-6 outline-none sm:p-10"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="t-label text-muted">Your collection</p>
                  <h2 id="archive-title" className="mt-2 text-4xl font-semibold tracking-[-0.04em]">
                    Studio Archive
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="grid size-11 place-items-center rounded-full border border-ink/15"
                  aria-label="Close archive"
                >
                  <X className="size-5" />
                </button>
              </div>

              <ul className="mt-8 grid grid-cols-4 gap-3 sm:grid-cols-7">
                {projects.map((p) => {
                  const got = viewed.includes(p.slug);
                  return (
                    <li key={p.slug}>
                      <Link
                        href={`/work/${p.slug}`}
                        onClick={() => setOpen(false)}
                        className="group block"
                        aria-label={`${p.title}${got ? " (collected)" : " (not yet collected)"}`}
                      >
                        <span className="relative block aspect-square overflow-hidden rounded-full" style={{ backgroundColor: got ? p.tone : "#e2ddd2" }}>
                          {got ? (
                            <Image src={p.image.src} alt="" fill sizes="120px" className="object-cover" />
                          ) : (
                            <span className="absolute inset-0 grid place-items-center text-muted">
                              <Lock className="size-4" aria-hidden />
                            </span>
                          )}
                        </span>
                        <span className="mt-2 block text-center font-mono text-[0.65rem] text-muted">{p.index}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-8">
                <p className="t-label text-muted">Achievements</p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {(Object.keys(ACHIEVEMENTS) as AchievementId[]).map((id) => {
                    const got = achievements.includes(id);
                    return (
                      <li key={id} className={`flex items-center gap-3 border p-3 ${got ? "border-ink/20" : "border-ink/10 opacity-50"}`}>
                        <span className={`grid size-8 place-items-center rounded-full text-[0.8rem] ${got ? "bg-signal text-ivory" : "bg-ink/10"}`} aria-hidden>
                          {got ? "✦" : "?"}
                        </span>
                        <span>
                          <span className="block t-small font-semibold">
                            {ACHIEVEMENTS[id].title}
                            <span className="sr-only">{got ? ", unlocked" : ", locked"}</span>
                          </span>
                          <span className="block text-[0.8rem] text-muted">{ACHIEVEMENTS[id].text}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {complete ? (
                <StudioPass onNavigate={() => setOpen(false)} />
              ) : (
                <p className="mt-8 border-t border-ink/10 pt-6 t-small text-muted">
                  Open {total - n} more case {total - n === 1 ? "study" : "studies"} to unlock the Studio Pass.
                </p>
              )}

              {n > 0 && (
                <button type="button" onClick={reset} className="mt-6 text-[0.8rem] text-muted underline underline-offset-4">
                  Reset progress
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function StudioPass({ onNavigate }: { onNavigate: () => void }) {
  return (
    <motion.div
      initial={{ rotateX: -20, opacity: 0, y: 20 }}
      animate={{ rotateX: 0, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
      className="relative mt-8 overflow-hidden bg-navy p-7 text-ivory"
      style={{ transformPerspective: 800 }}
    >
      <span className="breeze pointer-events-none absolute -top-8 -right-8 size-44 text-signal/30" aria-hidden />
      <p className="t-label text-stone">Studio Pass · No. 007</p>
      <p className="mt-3 max-w-md text-2xl leading-snug font-semibold tracking-[-0.02em]">
        Thank you for exploring every piece. You&apos;ve seen how {profile.firstName} thinks. Let&apos;s make something together.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/contact"
          onClick={onNavigate}
          className="inline-flex h-11 items-center rounded-full bg-signal px-5 t-small font-semibold text-ink hover:bg-ivory"
        >
          Start a project
        </Link>
        <a href={profile.portfolioPdf} download className="inline-flex h-11 items-center rounded-full border border-ivory/25 px-5 t-small font-semibold hover:border-ivory">
          Portfolio PDF ↓
        </a>
        {profile.cvUrl && (
          <a href={profile.cvUrl} className="rounded-full border border-ivory/25 px-5 py-2.5 t-small font-semibold hover:border-ivory">
            Download CV
          </a>
        )}
      </div>
    </motion.div>
  );
}
