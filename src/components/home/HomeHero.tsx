"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { ArrowDownRight, ArrowRight, Download } from "lucide-react";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { BreezeBlockField } from "@/components/magic/BreezeBlockField";
import { Magnetic } from "@/components/magic/Magnetic";
import { useGame } from "@/components/game/GameProvider";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Real artwork floating around the portrait. Positions are % of the stage. */
const FLOAT = [
  { slug: "nhyira-flour", left: "3%", top: "4%", mLeft: "-6%", mTop: "6%", w: "clamp(6.5rem, 12vw, 12.5rem)", rot: -9, depth: 0.55, bob: "7s", mobile: true },
  { slug: "kelewele-fest-26", left: "79%", top: "2%", mLeft: "74%", mTop: "48%", w: "clamp(6.5rem, 11vw, 11.5rem)", rot: 8, depth: 0.9, bob: "8.5s", mobile: true },
  { slug: "gifty-beauty-salon", left: "15%", top: "21%", w: "clamp(6rem, 9.5vw, 10rem)", rot: 6, depth: 1.25, bob: "6.5s" },
  { slug: "clichy-gold-agent", left: "68%", top: "40%", w: "clamp(6rem, 10vw, 10.5rem)", rot: -6, depth: 1.1, bob: "7.8s" },
  { slug: "royal-chop-delicacies", left: "25%", top: "-2%", w: "clamp(5rem, 7vw, 7.5rem)", rot: -4, depth: 0.35, bob: "9s" },
  { slug: "chris-gold-buying-agent", left: "65.5%", top: "1%", w: "clamp(7rem, 10vw, 11rem)", rot: 4, depth: 0.45, bob: "8s" },
];

const NAME_A = "Kwabena";
const NAME_B = "Acheampong";

export function HomeHero() {
  const { play } = useGame();
  const ref = useRef<HTMLElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18 });
  const sy = useSpring(py, { stiffness: 60, damping: 18 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const nameY = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);

  useEffect(() => {
    if (!play) return;
    const move = (e: PointerEvent) => {
      px.set(e.clientX / window.innerWidth - 0.5);
      py.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [play, px, py]);

  return (
    <section ref={ref} aria-label="Introduction" className="relative flex min-h-[100svh] flex-col overflow-hidden pt-16">
      {/* Warm ochre wash behind the stage — echoes the wall in the portrait */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[78%] bg-[radial-gradient(60%_55%_at_50%_42%,color-mix(in_oklab,var(--color-sand)_75%,transparent),transparent_72%)]"
      />

      {/* Top band */}
      <div className="relative z-30 mx-auto flex w-full max-w-[1600px] items-start justify-between gap-6 px-5 pt-6 sm:px-8 lg:px-12">
        <motion.p
          className="t-label text-muted"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <span className="mr-2 inline-block h-px w-8 bg-signal align-middle" aria-hidden />
          {profile.label}
        </motion.p>
        {profile.availability && (
          <motion.p
            className="hidden items-center gap-2 rounded-full border border-ink/15 bg-ivory/70 px-3.5 py-1.5 t-small backdrop-blur-sm sm:flex"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-flame-orange/60 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-flame-orange" />
            </span>
            {profile.availability}
          </motion.p>
        )}
      </div>

      {/* Stage */}
      <div className="relative z-10 mx-auto w-full max-w-[1600px] flex-1 px-5 sm:px-8 lg:px-12">
        <div className="relative h-[clamp(22rem,58svh,30rem)] md:h-[min(64svh,44rem)] md:min-h-[26rem]">
          {FLOAT.map((f, i) => (
            <FloatingArt key={f.slug} index={i} {...f} mx={sx} my={sy} scroll={scrollYProgress} />
          ))}

          {/* Portrait */}
          <motion.div
            className="absolute top-[6%] left-1/2 z-20 h-[86%] -translate-x-1/2 md:top-[4%] md:h-[92%]"
            style={{ scale: portraitScale }}
          >
            <motion.div
              className="relative aspect-[3/4] h-full overflow-hidden bg-sand shadow-[0_60px_120px_-50px_rgba(27,37,64,0.55)]"
              initial={{ clipPath: "inset(100% 0 0 0)", rotate: 0 }}
              animate={{ clipPath: "inset(0% 0 0 0)", rotate: -2 }}
              transition={{ duration: 1.3, ease: EASE, delay: 0.25 }}
              data-cursor="Reveal"
            >
              <Image
                src="/images/portrait/kwabena-graduation-navy.jpg"
                alt="Kwabena Acheampong in a navy suit, red tie and graduation cap, standing in front of a circular-patterned breeze-block wall."
                fill
                priority
                quality={90}
                sizes="(min-width: 1024px) 26vw, (min-width: 640px) 40vw, 70vw"
                className="object-cover object-[50%_26%]"
              />
              <BreezeBlockField color="#ead9b6" />
            </motion.div>
            <motion.span
              className="absolute -right-4 -bottom-4 z-30 grid size-24 place-items-center bg-flame rounded-full text-center text-ink shadow-[0_20px_50px_-12px_rgba(254,99,5,.6)] sm:-right-10 sm:size-28"
              initial={{ scale: 0, rotate: -40 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 14, delay: 1.3 }}
              aria-hidden
            >
              <span className="t-label leading-snug text-[0.62rem]">
                B.Tech
                <br />
                <span className="serif-accent text-[0.95rem] leading-tight tracking-normal normal-case">Advertising &amp; Packaging</span>
              </span>
            </motion.span>
          </motion.div>

          {/* Side copy (desktop): sits in the open lower corners of the stage */}
          <motion.div
            className="absolute bottom-6 left-0 z-30 hidden max-w-[19rem] md:block"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.9, ease: EASE }}
          >
            <IntroCopy />
          </motion.div>
          <motion.div
            className="absolute right-0 bottom-6 z-30 hidden max-w-[21rem] text-right md:block"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.9, ease: EASE }}
          >
            <Tagline />
          </motion.div>
        </div>
      </div>

      {/* Name */}
      <motion.div style={{ y: nameY }} className="relative z-0 mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <h1 className="t-hero -mt-[0.12em] flex flex-col pb-[0.16em] md:flex-row md:justify-between">
          <span className="sr-only">
            {profile.name}, {profile.title}
          </span>
          <Letters text={NAME_A} delay={0.45} className="serif-accent text-navy md:text-[1.02em]" />
          <Letters text={NAME_B} delay={0.6} />
        </h1>
      </motion.div>

      {/* Mobile copy */}
      <div className="relative z-30 mx-auto grid w-full gap-8 px-5 pt-4 pb-12 sm:px-8 md:hidden">
        <Tagline />
        <IntroCopy />
      </div>

    </section>
  );
}

function Tagline() {
  return (
    <p className="t-h3 text-ink">
      Designing identities.
      <br />
      Building <span className="serif-accent text-navy">visual stories.</span>
      <br />
      Creating impact<span className="text-signal">.</span>
    </p>
  );
}

function IntroCopy() {
  return (
    <>
      <p className="t-small text-ink/80">{profile.heroIntro}</p>
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Magnetic>
          <Link
            href="/work"
            data-cursor="Go"
            className="group inline-flex h-12 items-center gap-3 rounded-full bg-navy pr-1.5 pl-6 text-[0.8rem] font-semibold tracking-[0.1em] text-ivory uppercase transition-colors hover:bg-signal-deep"
          >
            Explore my work
            <span className="grid size-9 place-items-center rounded-full bg-ivory text-navy transition-transform duration-500 group-hover:translate-x-0.5">
              <ArrowRight className="size-4" aria-hidden />
            </span>
          </Link>
        </Magnetic>
        <Link href="/contact" className="group inline-flex items-center gap-1.5 text-[0.8rem] font-semibold tracking-[0.1em] uppercase">
          <span className="border-b border-ink pb-0.5 transition-colors group-hover:border-signal group-hover:text-signal-deep">Let&apos;s connect</span>
          <ArrowDownRight className="size-4 transition-transform group-hover:rotate-[-45deg]" aria-hidden />
        </Link>
        <a
          href={profile.portfolioPdf}
          download
          className="group inline-flex items-center gap-1.5 text-[0.8rem] font-semibold tracking-[0.1em] uppercase"
        >
          <Download className="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden />
          <span className="border-b border-ink/30 pb-0.5 group-hover:border-signal group-hover:text-signal-deep">Portfolio PDF</span>
        </a>
      </div>
    </>
  );
}

function Letters({ text, delay, className }: { text: string; delay: number; className?: string }) {
  return (
    <span aria-hidden className={`-mb-[0.14em] block overflow-hidden pb-[0.2em] ${className ?? ""}`}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block will-change-transform"
          initial={{ y: "105%", rotate: 8 }}
          animate={{ y: "0%", rotate: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: delay + i * 0.035 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

function FloatingArt({
  slug,
  left,
  top,
  w,
  rot,
  depth,
  bob,
  mobile,
  mLeft,
  mTop,
  index,
  mx,
  my,
  scroll,
}: (typeof FLOAT)[number] & { index: number; mx: MotionValue<number>; my: MotionValue<number>; scroll: MotionValue<number> }) {
  const p = projects.find((x) => x.slug === slug)!;
  const x = useTransform(mx, (v) => v * depth * -70);
  const yPointer = useTransform(my, (v) => v * depth * -50);
  const yScroll = useTransform(scroll, [0, 1], [0, -260 * depth]);
  const y = useTransform(() => yPointer.get() + yScroll.get());

  return (
    <motion.div
      className={`absolute top-[var(--mt)] left-[var(--ml)] z-10 md:top-[var(--t)] md:left-[var(--l)] ${mobile ? "" : "hidden md:block"}`}
      style={{ ["--l" as string]: left, ["--t" as string]: top, ["--ml" as string]: mLeft ?? left, ["--mt" as string]: mTop ?? top, width: w, x, y }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, ease: EASE, delay: 0.9 + index * 0.08 }}
    >
      <div className="bob" style={{ ["--bob" as string]: bob, animationDelay: `${-index * 1.3}s` }}>
        <Link
          href={`/work/${slug}`}
          data-cursor="Open"
          aria-label={`${p.title}, view case study`}
          className="group block transition-transform duration-500 hover:z-40 hover:scale-[1.06]"
          style={{ rotate: `${rot}deg` }}
        >
          <Image
            src={p.image.src}
            alt=""
            width={p.image.width}
            height={p.image.height}
            sizes="(min-width: 768px) 12vw, 30vw"
            className="h-auto w-full shadow-[0_30px_50px_-25px_rgba(23,23,23,0.55)] ring-1 ring-ink/5"
          />
          <span className="pointer-events-none absolute -bottom-7 left-0 t-label text-[0.62rem] whitespace-nowrap text-muted opacity-0 transition-opacity group-hover:opacity-100">
            {p.index} · {p.title}
          </span>
        </Link>
      </div>
    </motion.div>
  );
}
