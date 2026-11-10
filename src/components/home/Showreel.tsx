"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useMotionValue, useTransform, type MotionValue } from "motion/react";
import { ArrowRight, Maximize2, Minimize2, Pause, Play, SkipBack, SkipForward, Sparkles } from "lucide-react";
import { REEL, REEL_DURATION, REEL_SCENES, sceneAt, sceneStart } from "@/data/reel";
import { useGame } from "@/components/game/GameProvider";
import { cn } from "@/lib/utils";

const N = REEL_SCENES.length;

/** Spark position per scene, kept over the artwork side of the frame (in % of the video box). */
function sparkPos(slug: string) {
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return { x: 58 + (h % 28), y: 24 + ((h >>> 7) % 46) };
}

/**
 * Showreel: a rendered motion-graphics video of Kwabena's work (scripts/render-reel.mjs) that autoplays muted
 * and loops. Pauses off-screen, in background tabs, with Play mode off and under reduced motion.
 * Overlay controls seek by scene; a spark hunt runs on top of the video.
 */
export function Showreel() {
  const { play, unlock } = useGame();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(sectionRef, { amount: 0.3 });
  const near = useInView(sectionRef, { amount: 0.15, once: true });
  const [override, setOverride] = useState<boolean | null>(null);
  const [hidden, setHidden] = useState(false);
  const [idx, setIdx] = useState(0);
  const [sparkOn, setSparkOn] = useState(false);
  const [sparks, setSparks] = useState<string[]>([]);
  const [burst, setBurst] = useState(0);
  const [theatre, setTheatre] = useState(false);
  const time = useMotionValue(0);

  const wantPlay = override ?? play;
  const playing = wantPlay && inView && !hidden;
  const scene = REEL_SCENES[idx];

  // Sources mount lazily when the reel nears the viewport; load them once.
  useEffect(() => {
    if (near) videoRef.current?.load();
  }, [near]);

  // Drive play/pause from visibility, tab state, Play mode and the user's choice.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !near) return;
    if (playing) v.play().catch(() => setOverride(false));
    else v.pause();
  }, [playing, near]);

  // Sync overlay with the video clock.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const v = videoRef.current;
      if (v) {
        const t = v.currentTime;
        time.set(t);
        const i = sceneAt(t);
        setIdx((p) => (p === i ? p : i));
        const u = t - sceneStart(i);
        const on = t >= REEL.intro && u > 1.3 && u < REEL.scene - 0.6;
        setSparkOn((p) => (p === on ? p : on));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [time]);

  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    const onFs = () => setTheatre(document.fullscreenElement === stageRef.current);
    document.addEventListener("visibilitychange", onVis);
    document.addEventListener("fullscreenchange", onFs);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      document.removeEventListener("fullscreenchange", onFs);
    };
  }, []);

  const seekScene = (i: number) => {
    const v = videoRef.current;
    if (!v) return;
    const n = ((i % N) + N) % N;
    v.currentTime = sceneStart(n) + 0.01;
    time.set(v.currentTime);
    setIdx(n);
  };

  const collect = () => {
    if (sparks.includes(scene.slug)) return;
    const next = [...sparks, scene.slug];
    setSparks(next);
    setBurst((b) => b + 1);
    if (next.length === N) unlock("director");
  };

  const toggleTheatre = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await stageRef.current?.requestFullscreen();
    } catch {
      /* fullscreen not available */
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") seekScene(idx + 1);
    else if (e.key === "ArrowLeft") seekScene(idx - 1);
    else if (e.key === " " && e.target === e.currentTarget) {
      e.preventDefault();
      setOverride(!wantPlay);
    }
  };

  const spark = sparkPos(scene.slug);
  const got = sparks.includes(scene.slug);

  return (
    <section ref={sectionRef} aria-label="Showreel" className="relative bg-ink pt-16 text-ivory md:pt-0">
      <div
        ref={stageRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        role="region"
        aria-roledescription="video player"
        aria-label={`Showreel video of Kwabena's work. Scene ${idx + 1} of ${N}: ${scene.title}. Left and right arrow keys change scenes, space pauses.`}
        className={cn(
          "relative mx-auto flex flex-col overflow-clip bg-ink outline-none focus-visible:ring-2 focus-visible:ring-flame-orange focus-visible:ring-inset",
          theatre ? "h-svh justify-center" : "md:block",
        )}
      >
        {/* Top bar */}
        <div className="z-20 flex items-center justify-between gap-4 px-5 py-3 sm:px-8 md:absolute md:inset-x-0 md:top-0 md:bg-gradient-to-b md:from-ink/80 md:to-transparent md:pt-20 md:pb-10 lg:px-12">
          <p className="t-label text-ivory/70">
            <span className={cn("mr-2 inline-block size-2 rounded-full align-middle", playing ? "animate-pulse bg-flame-orange motion-reduce:animate-none" : "bg-ivory/40")} />
            Showreel · {N} scenes
          </p>
          <p className="flex items-center gap-2 t-label text-ivory/70" aria-live="polite">
            <Sparkles className="size-3.5 text-flame-amber" aria-hidden />
            Sparks {sparks.length}/{N}
          </p>
        </div>

        {/* Video */}
        <div className={cn("relative w-full", theatre ? "aspect-video max-h-[calc(100svh-7.5rem)]" : "aspect-video md:aspect-auto md:h-[min(calc(100svh-7.5rem),56.25vw)] md:min-h-[30rem]")}>
          <video
            ref={videoRef}
            poster={REEL.poster}
            muted
            loop
            playsInline
            preload={near ? "auto" : "none"}
            disablePictureInPicture
            aria-hidden
            className="absolute inset-0 size-full object-cover"
          >
            {near && <source src={REEL.video} type="video/mp4" />}
            {near && <source src={REEL.webm} type="video/webm" />}
          </video>

          {/* Spark hunt */}
          <AnimatePresence>
            {sparkOn && !got && (
              <motion.button
                key={`spark-${scene.slug}`}
                type="button"
                onClick={collect}
                data-cursor="Catch"
                aria-label={`Catch the spark on ${scene.title}`}
                className="absolute z-10 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center"
                style={{ left: `${spark.x}%`, top: `${spark.y}%` }}
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 2.2, opacity: 0, transition: { duration: 0.4 } }}
                transition={{ type: "spring", stiffness: 260, damping: 14 }}
              >
                <span className="absolute inset-0 animate-ping rounded-full bg-flame-amber/40 motion-reduce:animate-none" />
                <span className="bg-flame relative grid size-9 place-items-center rounded-full text-ink shadow-[0_0_28px_rgba(253,178,2,.75)]">
                  <Sparkles className="size-4" aria-hidden />
                </span>
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {burst > 0 && (
              <motion.span
                key={`burst-${burst}`}
                aria-hidden
                className="text-flame pointer-events-none absolute top-1/4 right-[8%] z-20 text-4xl font-semibold"
                initial={{ y: 10, opacity: 0, scale: 0.8 }}
                animate={{ y: -30, opacity: [0, 1, 0], scale: 1.1 }}
                transition={{ duration: 1.2 }}
                onAnimationComplete={() => setBurst(0)}
              >
                +1 spark
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="z-20 px-5 pt-3 pb-6 sm:px-8 md:pb-5 lg:px-12">
          <div className="flex gap-1" role="tablist" aria-label="Scenes">
            {REEL_SCENES.map((s, i) => (
              <button
                key={s.slug}
                type="button"
                role="tab"
                aria-selected={i === idx}
                aria-label={`Scene ${i + 1}: ${s.title}`}
                onClick={() => seekScene(i)}
                className="group relative h-6 flex-1"
              >
                <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-ivory/20 transition-[height] group-hover:h-[5px]">
                  <Segment i={i} time={time} />
                </span>
                {sparks.includes(s.slug) && <span aria-hidden className="absolute top-0 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-flame-amber" />}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CtrlButton label="Previous scene" onClick={() => seekScene(idx - 1)}>
                <SkipBack className="size-4" />
              </CtrlButton>
              <CtrlButton label={playing ? "Pause showreel" : "Play showreel"} onClick={() => setOverride(!wantPlay)} primary>
                {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
              </CtrlButton>
              <CtrlButton label="Next scene" onClick={() => seekScene(idx + 1)}>
                <SkipForward className="size-4" />
              </CtrlButton>
              <span className="ml-2 font-mono text-[0.75rem] text-ivory/70">
                {String(idx + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <p className="hidden t-small text-ivory/60 xl:block">Catch the spark in every scene to unlock the Director&apos;s Cut.</p>
              <Link
                href={`/work/${scene.slug}`}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-ivory px-5 text-[0.85rem] font-semibold text-ink transition-colors hover:bg-flame-amber"
              >
                <span className="hidden sm:inline">View case:</span> <span className="max-w-[11rem] truncate sm:max-w-[16rem]">{scene.title}</span>
                <ArrowRight className="size-4 shrink-0" aria-hidden />
              </Link>
              <CtrlButton label={theatre ? "Exit theatre mode" : "Theatre mode"} onClick={toggleTheatre}>
                {theatre ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
              </CtrlButton>
            </div>
          </div>
        </div>
      </div>
      <p className="sr-only">
        A {Math.round(REEL_DURATION)} second silent showreel of {N} projects: {REEL_SCENES.map((s) => s.title).join(", ")}.
      </p>
    </section>
  );
}

function Segment({ i, time }: { i: number; time: MotionValue<number> }) {
  const scaleX = useTransform(time, (t) => Math.min(1, Math.max(0, (t - sceneStart(i)) / REEL.scene)));
  return <motion.span className="bg-flame absolute inset-0 origin-left rounded-full" style={{ scaleX }} />;
}

function CtrlButton({ children, label, onClick, primary }: { children: React.ReactNode; label: string; onClick: () => void; primary?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "grid size-11 place-items-center rounded-full transition-colors",
        primary ? "bg-flame text-ink hover:brightness-110" : "border border-ivory/25 bg-ink/30 text-ivory backdrop-blur-sm hover:border-ivory hover:bg-ivory hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
