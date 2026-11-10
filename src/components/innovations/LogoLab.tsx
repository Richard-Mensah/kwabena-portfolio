"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Contrast, Droplet } from "lucide-react";
import { logos } from "@/data/logos";
import { useGame } from "@/components/game/GameProvider";
import { SplitLines, Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

type Ground = "native" | "ivory" | "ink" | "signal" | "photo";
const GROUNDS: { id: Ground; label: string }[] = [
  { id: "native", label: "As designed" },
  { id: "ivory", label: "Light" },
  { id: "ink", label: "Dark" },
  { id: "signal", label: "Colour" },
  { id: "photo", label: "On photo" },
];
const SIZES = [16, 32, 64, 128];

/** Logo Lab: stress-test each mark on different grounds, at different sizes, in mono and inverted. */
export function LogoLab() {
  const { unlock } = useGame();
  const [idx, setIdx] = useState(0);
  const [ground, setGround] = useState<Ground>("native");
  const [size, setSize] = useState(260);
  const [mono, setMono] = useState(false);
  const [invert, setInvert] = useState(false);
  const logo = logos[idx];
  const touched = () => unlock("logo-lab");

  const bg =
    ground === "native"
      ? { backgroundColor: logo.ground }
      : ground === "ivory"
        ? { backgroundColor: "#F5F2EB" }
        : ground === "ink"
          ? { backgroundColor: "#171717" }
          : ground === "signal"
            ? { backgroundColor: "#E64B32" }
            : { backgroundImage: "linear-gradient(rgba(0,0,0,.35),rgba(0,0,0,.35)), url(/images/client/gifty-beauty-salon.jpg)", backgroundSize: "cover", backgroundPosition: "center 30%" };

  const filter = [mono && "grayscale(1) contrast(1.15)", invert && "invert(1)"].filter(Boolean).join(" ") || undefined;
  const sizeLabel = size <= 24 ? "Favicon" : size <= 72 ? "App icon / avatar" : size <= 160 ? "Business card / social" : size <= 300 ? "Poster" : "Signage";
  const warn = ground !== "native" && logo.lightMark && (ground === "ivory") && !invert;

  return (
    <section id="logo-lab" aria-labelledby="logo-lab-title" className="relative overflow-hidden bg-navy py-24 text-ivory sm:py-32">
      <div aria-hidden className="mesh-navy pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="t-label text-ivory/60">
              <span className="text-signal">●</span> Innovation · Logo Lab
            </p>
            <SplitLines
              id="logo-lab-title"
              lines={[
                <>
                  Logos, <span className="serif-accent">stress-tested.</span>
                </>,
              ]}
              className="t-display mt-5"
            />
          </div>
          <Reveal className="lg:col-span-5">
            <p className="t-body text-ivory/75">
              A logo has to survive a 16px favicon and a roadside banner, on light, dark and photographic grounds. Try each of Kwabena&apos;s marks
              the way an art director would.
            </p>
          </Reveal>
        </div>

        <div role="tablist" aria-label="Choose a logo" className="mt-12 flex gap-3 overflow-x-auto pb-2">
          {logos.map((l, i) => (
            <button
              key={l.slug}
              role="tab"
              type="button"
              aria-selected={i === idx}
              onClick={() => {
                setIdx(i);
                touched();
              }}
              className={cn(
                "flex shrink-0 items-center gap-3 rounded-full border py-1.5 pr-4 pl-1.5 text-[0.85rem] font-medium transition-colors",
                i === idx ? "border-ivory bg-ivory text-navy" : "border-ivory/20 hover:border-ivory/60",
              )}
            >
              <span className="relative size-9 overflow-hidden rounded-full" style={{ backgroundColor: l.ground }}>
                <Image src={l.mark} alt="" fill sizes="36px" className="object-contain p-1" />
              </span>
              {l.name}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* Stage */}
          <div className="lg:col-span-8">
            <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-2xl ring-1 ring-ivory/10 transition-[background-color] duration-500 sm:aspect-[16/10]" style={bg}>
              <motion.div
                key={logo.slug}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
                style={{ width: size, maxWidth: "88%", aspectRatio: `${logo.markWidth}/${logo.markHeight}`, filter }}
              >
                <Image src={logo.mark} alt={logo.alt} fill sizes="(min-width: 1024px) 50vw, 90vw" className="object-contain" />
              </motion.div>
              <span className="absolute bottom-3 left-3 rounded-full bg-black/45 px-3 py-1 font-mono text-[0.7rem] text-white backdrop-blur-sm">
                {size}px · {sizeLabel}
              </span>
              {warn && (
                <span className="absolute top-3 right-3 rounded-full bg-signal px-3 py-1 text-[0.75rem] font-semibold text-ink">Light mark: try &quot;Invert&quot;</span>
              )}
            </div>

            {/* Size ladder */}
            <div className="mt-4 grid grid-cols-4 gap-3">
              {SIZES.map((s) => (
                <div key={s} className="flex flex-col items-center justify-end gap-2 rounded-xl p-3 ring-1 ring-ivory/10" style={{ backgroundColor: logo.ground }}>
                  <span className="relative" style={{ width: s, height: (s * logo.markHeight) / logo.markWidth, filter }}>
                    <Image src={logo.mark} alt="" fill sizes={`${s * 2}px`} className="object-contain" />
                  </span>
                  <span className={cn("font-mono text-[0.65rem]", logo.lightMark || logo.ground !== "#FFFFFF" ? "text-white/70" : "text-ink/60")}>{s}px</span>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-7 lg:col-span-4">
            <div>
              <p className="t-label text-ivory/60">Ground</p>
              <div role="radiogroup" aria-label="Background" className="mt-3 flex flex-wrap gap-2">
                {GROUNDS.map((g) => (
                  <button
                    key={g.id}
                    role="radio"
                    type="button"
                    aria-checked={ground === g.id}
                    onClick={() => {
                      setGround(g.id);
                      touched();
                    }}
                    data-testid={`ground-${g.id}`}
                    className={cn(
                      "h-10 rounded-full border px-4 text-[0.85rem] font-medium transition-colors",
                      ground === g.id ? "border-signal bg-signal text-ink" : "border-ivory/20 hover:border-ivory/60",
                    )}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="logo-size" className="t-label text-ivory/60">
                Scale test · {size}px
              </label>
              <input
                id="logo-size"
                type="range"
                min={16}
                max={560}
                step={4}
                value={size}
                onChange={(e) => {
                  setSize(Number(e.target.value));
                  touched();
                }}
                className="mt-4 w-full accent-[#E64B32]"
              />
              <div className="mt-2 flex justify-between font-mono text-[0.65rem] text-ivory/50">
                <span>Favicon</span>
                <span>Card</span>
                <span>Poster</span>
                <span>Signage</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                aria-pressed={mono}
                onClick={() => {
                  setMono((m) => !m);
                  touched();
                }}
                className={cn("inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[0.85rem] font-medium", mono ? "border-ivory bg-ivory text-navy" : "border-ivory/20 hover:border-ivory/60")}
              >
                <Droplet className="size-4" aria-hidden /> Mono
              </button>
              <button
                type="button"
                aria-pressed={invert}
                onClick={() => {
                  setInvert((v) => !v);
                  touched();
                }}
                className={cn("inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[0.85rem] font-medium", invert ? "border-ivory bg-ivory text-navy" : "border-ivory/20 hover:border-ivory/60")}
              >
                <Contrast className="size-4" aria-hidden /> Invert
              </button>
            </div>
            <div className="rounded-2xl bg-ivory/[0.06] p-6 ring-1 ring-ivory/10">
              <p className="t-label text-ivory/60">Concept</p>
              <p className="mt-2 t-h3">{logo.name}</p>
              <p className="mt-2 t-small text-ivory/75">{logo.concept}</p>
              <div className="mt-4 flex h-3 overflow-hidden rounded-full">
                {logo.palette.map((c) => (
                  <span key={c} className="flex-1" style={{ backgroundColor: c }} />
                ))}
              </div>
              {logo.caseSlug && (
                <Link href={`/work/${logo.caseSlug}`} className="mt-5 inline-flex items-center gap-1.5 text-[0.85rem] font-semibold text-signal hover:text-ivory">
                  See the full identity <ArrowUpRight className="size-4" aria-hidden />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
