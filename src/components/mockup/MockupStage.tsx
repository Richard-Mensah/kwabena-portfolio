"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { MockupKind } from "@/data/project-types";
import { useGame } from "@/components/game/GameProvider";

export type StageImage = { src: string; width: number; height: number; alt: string };

/**
 * In-Context Mockup Studio: renders an artwork inside a CSS-3D scene chosen by `kind`.
 * Pointer-driven tilt + specular light sweep; static when play mode is off / reduced motion.
 */
export function MockupScene({ img, kind, tone, priority }: { img: StageImage; kind: MockupKind; tone: string; priority?: boolean }) {
  const { play } = useGame();
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 120, damping: 18 });
  const sy = useSpring(py, { stiffness: 120, damping: 18 });
  const rotY = useTransform(sx, [0, 1], [-9, 9]);
  const rotX = useTransform(sy, [0, 1], [7, -7]);
  const lightX = useTransform(sx, (v) => `${v * 100}%`);
  const lightY = useTransform(sy, (v) => `${v * 100}%`);

  const onMove = (e: React.PointerEvent) => {
    if (!play || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  const tilt = play ? { rotateX: rotX, rotateY: rotY } : {};
  const sheen = (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute inset-0 mix-blend-soft-light"
      style={{ background: useTransform([lightX, lightY], ([x, y]) => `radial-gradient(60% 60% at ${x} ${y}, rgba(255,255,255,.55), transparent 60%)`) }}
    />
  );

  if (kind === "card") return <CardFlip img={img} />;
  const wide = img.width / img.height > 1.3;

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className="relative flex h-full w-full items-center justify-center overflow-hidden [perspective:1400px]"
      style={{ background: SCENE_BG[kind](tone) }}
    >
      {kind === "poster" && (
        <>
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-[18%] bg-[linear-gradient(#0000,rgba(0,0,0,.12))]" />
          <div aria-hidden className="absolute inset-x-[10%] bottom-[9%] h-[2px] bg-black/10" />
          <motion.div style={tilt} className={`relative [transform-style:preserve-3d] ${wide ? "w-[min(82%,62rem)]" : "w-[min(66%,30rem)]"}`}>
            <div className="relative bg-[#141414] p-[3.5%] shadow-[0_40px_70px_-25px_rgba(0,0,0,.6),0_10px_20px_-10px_rgba(0,0,0,.4)]">
              <div className="relative bg-white p-[6%]">
                <Art img={img} priority={priority} />
              </div>
              {sheen}
            </div>
          </motion.div>
        </>
      )}

      {kind === "social" && (
        <motion.div style={tilt} className="relative w-[min(56%,21rem)] [transform-style:preserve-3d]">
          <div className="relative rounded-[2.4rem] bg-[#0d0d0f] p-[4%] shadow-[0_50px_80px_-30px_rgba(0,0,0,.65)] ring-1 ring-white/10">
            <div className="overflow-hidden rounded-[1.9rem] bg-white">
              <div className="flex items-center gap-2 px-3 pt-6 pb-2">
                <span className="grid size-6 place-items-center rounded-full bg-navy text-[0.5rem] font-bold text-ivory">KA</span>
                <span className="text-[0.62rem] leading-tight font-semibold text-ink">
                  kwabena.design
                  <span className="block font-normal text-muted">Sponsored</span>
                </span>
              </div>
              <Art img={img} priority={priority} />
              <div className="flex items-center gap-3 px-3 py-2.5 text-ink" aria-hidden>
                <span className="text-sm">♡</span>
                <span className="text-sm">💬</span>
                <span className="text-sm">↗</span>
                <span className="ml-auto h-1.5 w-10 rounded-full bg-ink/10" />
              </div>
            </div>
            <span aria-hidden className="absolute top-[2.2%] left-1/2 h-[2.4%] w-[30%] -translate-x-1/2 rounded-full bg-black" />
            {sheen}
          </div>
        </motion.div>
      )}

      {kind === "packaging" && (
        <motion.div style={tilt} className="relative w-[min(60%,22rem)] [transform-style:preserve-3d]">
          <div className="relative overflow-hidden rounded-sm shadow-[0_45px_60px_-30px_rgba(0,0,0,.55)]">
            <Art img={img} priority={priority} />
            {sheen}
          </div>
          <div aria-hidden className="relative mt-1 h-[38%] overflow-hidden opacity-35 [mask-image:linear-gradient(#000,transparent_70%)]">
            <div className="-scale-y-100">
              <Art img={img} />
            </div>
          </div>
          <div aria-hidden className="absolute -bottom-2 left-1/2 h-6 w-[85%] -translate-x-1/2 rounded-[50%] bg-black/25 blur-xl" />
        </motion.div>
      )}

      {kind === "identity" && (
        <motion.div style={tilt} className="relative w-[min(80%,52rem)] [transform-style:preserve-3d]">
          <div className="relative overflow-hidden rounded-md shadow-[0_0_120px_-20px_rgba(236,204,112,.45),0_40px_80px_-30px_rgba(0,0,0,.8)] ring-1 ring-white/10">
            <Art img={img} priority={priority} />
            {sheen}
          </div>
        </motion.div>
      )}
    </div>
  );
}

const SCENE_BG: Record<Exclude<MockupKind, "card">, (tone: string) => string> = {
  poster: () => "radial-gradient(80% 70% at 50% 35%, #fbf8f2, #e7e0d2 70%, #d9d0bf)",
  social: (tone) => `radial-gradient(70% 70% at 50% 40%, ${tone}, color-mix(in oklab, ${tone} 70%, #1b2540))`,
  packaging: (tone) => `radial-gradient(70% 60% at 50% 38%, #ffffff, ${tone} 75%)`,
  identity: () => "radial-gradient(60% 60% at 50% 40%, #2a2418, #0b0a08 75%)",
};

function Art({ img, priority }: { img: StageImage; priority?: boolean }) {
  return (
    <Image
      src={img.src}
      alt={img.alt}
      width={img.width}
      height={img.height}
      priority={priority}
      quality={90}
      sizes="(min-width: 1024px) 40vw, 80vw"
      className="block h-auto w-full"
    />
  );
}

/** Two-sided business card: the source image holds the front (top half) and back (bottom half). */
function CardFlip({ img }: { img: StageImage }) {
  const { play } = useGame();
  const [flipped, setFlipped] = useState(false);
  const face = (pos: "top" | "bottom") => (
    <span
      className="absolute inset-0 rounded-[4%] bg-no-repeat shadow-[0_40px_60px_-28px_rgba(0,0,0,.6)] [backface-visibility:hidden]"
      style={{
        backgroundImage: `url(${img.src})`,
        backgroundSize: "104% auto",
        backgroundPosition: `center ${pos === "top" ? "1%" : "99%"}`,
        transform: pos === "bottom" ? "rotateY(180deg)" : undefined,
      }}
    />
  );
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-5 bg-[radial-gradient(70%_60%_at_50%_40%,#2b2519,#0d0b08_75%)] [perspective:1400px]">
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-label={`Business card, showing the ${flipped ? "back" : "front"}. Activate to flip.`}
        data-cursor="Flip"
        className="relative aspect-[1.72/1] w-[min(82%,40rem)] [transform-style:preserve-3d]"
        style={{ transform: `rotateY(${flipped ? 180 : 0}deg) rotateX(${play ? 8 : 0}deg)`, transition: "transform .9s cubic-bezier(.16,1,.3,1)" }}
      >
        {face("top")}
        {face("bottom")}
      </button>
      <p className="t-label text-ivory/60">Tap the card to flip · {flipped ? "Back" : "Front"}</p>
      <span className="sr-only">{img.alt}</span>
    </div>
  );
}
