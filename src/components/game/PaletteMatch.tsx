"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Check, RotateCcw, X } from "lucide-react";
import { projects, type Project } from "@/data/projects";
import { useGame } from "@/components/game/GameProvider";
import { SplitLines } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

type Round = { answer: Project; options: Project[] };
const bySlug = (s: string) => projects.find((p) => p.slug === s)!;

// Deterministic first game (no hydration mismatch); "Play again" shuffles.
const INITIAL: Round[] = [
  { answer: bySlug("jeysicles-ice-cream"), options: ["cherrys-sobolo", "jeysicles-ice-cream", "silver-package"].map(bySlug) },
  { answer: bySlug("ghana-independence-day"), options: ["ttu-src-week", "aj-lingerie-and-beads", "ghana-independence-day"].map(bySlug) },
  { answer: bySlug("aj-lingerie-and-beads"), options: ["aj-lingerie-and-beads", "independence-weekend", "ttu-src-week"].map(bySlug) },
];

function shuffle<T>(a: T[]) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}
function makeRounds(): Round[] {
  return shuffle(projects)
    .slice(0, 3)
    .map((answer) => ({
      answer,
      options: shuffle([answer, ...shuffle(projects.filter((p) => p.slug !== answer.slug)).slice(0, 2)]),
    }));
}

export function PaletteMatch() {
  const { unlock } = useGame();
  const [rounds, setRounds] = useState(INITIAL);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  const done = step >= rounds.length;
  const round = rounds[Math.min(step, rounds.length - 1)];

  const choose = (slug: string) => {
    if (picked) return;
    setPicked(slug);
    const correct = slug === round.answer.slug;
    const next = score + (correct ? 1 : 0);
    if (correct) setScore(next);
    timer.current = setTimeout(() => {
      setPicked(null);
      setStep((s) => s + 1);
      if (step === rounds.length - 1 && next >= 2) unlock("colour-eye");
    }, 1300);
  };

  const restart = () => {
    if (timer.current) clearTimeout(timer.current);
    setRounds(makeRounds());
    setStep(0);
    setScore(0);
    setPicked(null);
  };

  return (
    <section id="play" aria-labelledby="play-title" className="relative overflow-hidden bg-navy py-24 text-ivory sm:py-32">
      <span className="breeze pointer-events-none absolute -bottom-24 -left-24 size-[28rem] text-ivory/[0.04]" aria-hidden />
      <div className="mx-auto grid max-w-[1600px] gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
        <div className="lg:col-span-5">
          <p className="t-label text-ivory/60">
            <span className="text-signal">●</span> Interlude · a small game
          </p>
          <SplitLines id="play-title"
            lines={["Palette", <span key="m" className="serif-accent">Match.</span>]}
            className="t-display mt-5"
          />
          <p className="measure mt-8 t-body text-ivory/75">
            Every colour below was sampled directly from one of Kwabena&apos;s designs. Can you tell which piece each
            palette came from? Good design leaves a colour fingerprint.
          </p>
          <div className="mt-8 flex items-center gap-6 t-label text-ivory/60">
            <span>
              Round <span className="text-ivory">{Math.min(step + 1, rounds.length)}</span>/{rounds.length}
            </span>
            <span>
              Score <span className="text-ivory">{score}</span>
            </span>
          </div>
        </div>

        <div className="lg:col-span-7" aria-live="polite">
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div
                key={step + round.answer.slug}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex h-36 overflow-hidden rounded-sm sm:h-44" role="img" aria-label={`Palette: ${round.answer.palette.join(", ")}`}>
                  {round.answer.palette.map((c, i) => (
                    <motion.div
                      key={c + i}
                      className="flex flex-1 items-end p-3"
                      style={{ backgroundColor: c }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: i * 0.07, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <span className="hidden rounded bg-black/40 px-1.5 py-0.5 font-mono text-[0.6rem] text-white sm:inline">{c}</span>
                    </motion.div>
                  ))}
                </div>
                <p className="mt-8 mb-4 t-label text-ivory/60">Which work does this palette belong to?</p>
                <div className="grid grid-cols-3 gap-3 sm:gap-5">
                  {round.options.map((o) => {
                    const isAnswer = o.slug === round.answer.slug;
                    const state = picked ? (isAnswer ? "right" : picked === o.slug ? "wrong" : "dim") : "idle";
                    return (
                      <button
                        key={o.slug}
                        type="button"
                        onClick={() => choose(o.slug)}
                        disabled={!!picked}
                        data-cursor="Pick"
                        className={cn(
                          "group relative text-left transition-all duration-500",
                          state === "dim" && "opacity-30",
                          state === "idle" && "hover:-translate-y-1",
                        )}
                      >
                        <span
                          className={cn(
                            "relative block aspect-square overflow-hidden ring-2 ring-transparent transition-all",
                            state === "right" && "ring-signal",
                            state === "wrong" && "ring-ivory/40",
                          )}
                        >
                          <Image src={o.image.src} alt="" fill sizes="(min-width: 1024px) 18vw, 30vw" className="object-cover" />
                          {state === "right" && (
                            <span className="absolute inset-0 grid place-items-center bg-signal/70">
                              <Check className="size-10" aria-hidden />
                            </span>
                          )}
                          {state === "wrong" && (
                            <span className="absolute inset-0 grid place-items-center bg-navy/75">
                              <X className="size-10" aria-hidden />
                            </span>
                          )}
                        </span>
                        <span className="mt-3 block t-small font-medium">{o.title}</span>
                      </button>
                    );
                  })}
                </div>
                {picked && (
                  <p className="mt-6 t-body text-ivory/85">
                    {picked === round.answer.slug ? "Correct. " : "Not quite. "}
                    That palette belongs to <span className="font-semibold text-ivory">{round.answer.title}</span>.
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="border border-ivory/15 p-8 sm:p-12">
                <p className="t-label text-ivory/60">Result</p>
                <p className="mt-4 text-[clamp(2.5rem,5vw,4.5rem)] leading-none font-semibold tracking-[-0.04em]">
                  {score}/{rounds.length}
                  <span className="ml-4 font-serif text-[0.55em] font-normal italic">
                    {score === rounds.length ? "A true colour eye." : score >= 2 ? "Sharp eye." : "Look closer. Colour tells the story."}
                  </span>
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={restart}
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-ivory px-6 text-[0.875rem] font-semibold text-navy hover:bg-signal hover:text-ink"
                  >
                    <RotateCcw className="size-4" aria-hidden /> Play again
                  </button>
                  <Link href="/work" className="inline-flex h-12 items-center rounded-full border border-ivory/30 px-6 text-[0.875rem] font-semibold hover:border-ivory">
                    See the work
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
