"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, ViewTransition } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { education, profile } from "@/data/profile";
import { useGame } from "@/components/game/GameProvider";
import { Reveal, SplitLines } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/magic/Magnetic";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Statement — words fill with ink as you scroll                       */
/* ------------------------------------------------------------------ */
const STATEMENT: { w: string; style?: "serif" | "signal" }[] = [
  ..."I create".split(" ").map((w) => ({ w })),
  { w: "meaningful", style: "serif" },
  ..."visual identities and compelling design experiences that help ideas become recognizable,".split(" ").map((w) => ({ w })),
  { w: "memorable", style: "serif" },
  { w: "brands.", style: "signal" },
];

export function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  return (
    <section aria-label="Creative positioning" className="relative overflow-hidden py-24 sm:py-36">
      <div aria-hidden className="mesh-warm pointer-events-none absolute inset-0 opacity-80" />
      <div className="relative mx-auto grid max-w-[1600px] gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
        <p className="t-label text-muted lg:col-span-2 lg:pt-4">
          <span className="text-signal-deep">●</span> Positioning
        </p>
        <p ref={ref} className="t-display lg:col-span-10">
          {STATEMENT.map((item, i) => (
            <Word key={i} item={item} i={i} n={STATEMENT.length} progress={scrollYProgress} />
          ))}
        </p>
      </div>
    </section>
  );
}

function Word({ item, i, n, progress }: { item: (typeof STATEMENT)[number]; i: number; n: number; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [i / n, (i + 1) / n], [0.16, 1]);
  return (
    <>
      <motion.span
        style={{ opacity }}
        className={cn(item.style === "serif" && "serif-accent text-navy", item.style === "signal" && "text-signal-deep")}
      >
        {item.w}
      </motion.span>{" "}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Featured work — draggable, snap-scrolling rail                       */
/* ------------------------------------------------------------------ */
export function FeaturedRail() {
  const rail = useRef<HTMLUListElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const { viewed, play } = useGame();
  const [dragging, setDragging] = useState(false);

  const scrollBy = (dir: 1 | -1) => rail.current?.scrollBy({ left: dir * rail.current.clientWidth * 0.7, behavior: "smooth" });

  return (
    <section aria-labelledby="featured-title" className="border-t border-ink/10 bg-ivory-deep/60 py-24 sm:py-32">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="t-label text-muted">
              <span className="text-signal-deep">●</span> Selected Work · {projects.length} case studies
            </p>
            <SplitLines
              id="featured-title"
              lines={[
                <>
                  Work that <span className="serif-accent text-navy">speaks.</span>
                </>,
              ]}
              className="t-display mt-5"
            />
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => scrollBy(-1)} aria-label="Scroll work left" className="grid size-12 place-items-center rounded-full border border-ink/20 transition-colors hover:border-ink hover:bg-ink hover:text-ivory">
              <ArrowLeft className="size-5" />
            </button>
            <button type="button" onClick={() => scrollBy(1)} aria-label="Scroll work right" className="grid size-12 place-items-center rounded-full border border-ink/20 transition-colors hover:border-ink hover:bg-ink hover:text-ivory">
              <ArrowRight className="size-5" />
            </button>
            <Link href="/work" className="ml-2 hidden h-12 items-center rounded-full bg-navy px-6 text-[0.8rem] font-semibold tracking-[0.1em] text-ivory uppercase hover:bg-signal-deep sm:inline-flex">
              View all work
            </Link>
          </div>
        </div>
      </div>

      <ul
        ref={rail}
        data-cursor="Drag"
        className={cn(
          "rail mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-5 pb-4 sm:gap-8 sm:px-8 lg:px-12",
          dragging && "snap-none scroll-auto select-none",
        )}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || !rail.current) return;
          drag.current = { x: e.clientX, left: rail.current.scrollLeft, moved: false };
        }}
        onPointerMove={(e) => {
          if (!drag.current || !rail.current) return;
          const dx = e.clientX - drag.current.x;
          if (Math.abs(dx) > 5) {
            drag.current.moved = true;
            setDragging(true);
          }
          rail.current.scrollLeft = drag.current.left - dx;
        }}
        onPointerUp={() => {
          setTimeout(() => setDragging(false), 0);
          drag.current = null;
        }}
        onPointerLeave={() => {
          drag.current = null;
          setDragging(false);
        }}
        onClickCapture={(e) => {
          if (dragging) e.preventDefault();
        }}
      >
        {projects.map((p) => (
          <li key={p.slug} className="shrink-0 snap-start">
            <Link href={`/work/${p.slug}`} draggable={false} className="group block" aria-label={`${p.title}: ${p.category}`}>
              <div className="relative flex h-[clamp(18rem,42vw,30rem)] items-center p-5 sm:p-8" style={{ backgroundColor: p.tone }}>
                <ViewTransition name={`art-${p.slug}`}>
                  <Image
                    src={p.image.src}
                    alt={p.alt}
                    width={p.image.width}
                    height={p.image.height}
                    draggable={false}
                    sizes="(min-width: 1024px) 40vw, 80vw"
                    className="h-full w-auto object-contain shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)] transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-[1.03]"
                  />
                </ViewTransition>
                {play && viewed.includes(p.slug) && (
                  <span className="absolute top-3 right-3 rounded-full bg-navy px-3 py-1 t-label text-[0.62rem] text-ivory">✦ Collected</span>
                )}
              </div>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-mono text-[0.8rem] text-muted">{p.index}</span>
                <span className="t-h3 group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">{p.title}</span>
              </div>
              <p className="mt-1 pl-8 t-small text-muted">{p.category}</p>
            </Link>
          </li>
        ))}
        <li className="flex shrink-0 snap-start items-center pr-5">
          <Link href="/work" className="group grid size-48 place-items-center rounded-full bg-navy text-center text-ivory transition-colors hover:bg-signal-deep sm:size-56">
            <span>
              <span className="t-label text-ivory/70">See every</span>
              <span className="mt-2 block text-2xl font-semibold tracking-[-0.03em]">Case study →</span>
            </span>
          </Link>
        </li>
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Services teaser                                                     */
/* ------------------------------------------------------------------ */
const SERVICE_WORK: Record<string, string[]> = {
  "01": ["chris-gold-buying-agent", "clichy-gold-agent", "kelewele-fest-26"],
  "02": ["clichy-gold-agent", "royal-chop-delicacies", "ghana-independence-day"],
  "03": ["gifty-beauty-salon", "highlife-brownies", "royal-chop-delicacies"],
  "04": ["nhyira-flour", "fans-liquid-soap", "cherrys-sobolo"],
};

export function ServicesTeaser() {
  return (
    <section aria-labelledby="services-teaser-title" className="py-24 sm:py-32">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="t-label text-muted">
              <span className="text-signal-deep">●</span> Creative services
            </p>
            <SplitLines
              id="services-teaser-title"
              lines={[
                "What I can",
                <>
                  help you <span className="serif-accent text-navy">build.</span>
                </>,
              ]}
              className="t-display mt-5"
            />
          </div>
          <Reveal className="lg:col-span-4 lg:col-start-9">
            <p className="t-body text-ink/75">Four connected disciplines, grounded in formal training in advertising, packaging and corporate identity.</p>
            <Link href="/services" className="mt-5 inline-flex items-center gap-2 border-b border-ink pb-0.5 text-[0.8rem] font-semibold tracking-[0.1em] uppercase hover:border-signal hover:text-signal-deep">
              All services & process <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-px overflow-hidden border border-ink/12 bg-ink/12 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <li key={s.index} className="bg-ivory">
              <Reveal delay={i * 0.08} className="h-full">
                <Link href="/services" className="group flex h-full min-h-[18rem] flex-col justify-between p-7 transition-colors duration-500 hover:bg-navy hover:text-ivory">
                  <span className="flex items-center justify-between">
                    <span className="font-mono text-[0.8rem] text-signal-deep group-hover:text-signal">{s.index}</span>
                    <ArrowUpRight className="size-5 opacity-40 transition-all group-hover:rotate-45 group-hover:opacity-100" aria-hidden />
                  </span>
                  <span>
                    <span className="mb-5 flex -space-x-3">
                      {SERVICE_WORK[s.index].map((slug) => {
                        const pr = projects.find((x) => x.slug === slug)!;
                        return (
                          <span
                            key={slug}
                            className="relative size-12 overflow-hidden rounded-lg ring-2 ring-ivory transition-transform duration-500 group-hover:-translate-y-1 group-hover:ring-navy"
                            style={{ backgroundColor: pr.tone }}
                          >
                            <Image src={pr.image.src} alt="" fill sizes="48px" className="object-cover" />
                          </span>
                        );
                      })}
                    </span>
                    <span className="t-h3 block">{s.title}</span>
                    <span className="mt-3 block t-small text-muted group-hover:text-ivory/75">{s.lede}</span>
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* About teaser                                                        */
/* ------------------------------------------------------------------ */
export function AboutTeaser() {
  return (
    <section aria-labelledby="about-teaser-title" className="bg-sand/45 py-24 sm:py-32">
      <div className="mx-auto grid max-w-[1600px] gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
        <Reveal className="lg:col-span-4">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/images/portrait/kwabena-graduation-bw.jpg"
              alt="Black-and-white portrait of Kwabena Acheampong in a suit and graduation cap, head bowed, in front of a breeze-block wall."
              fill
              sizes="(min-width: 1024px) 30vw, 100vw"
              className="object-cover object-[50%_30%] grayscale"
            />
          </div>
        </Reveal>
        <div className="lg:col-span-7 lg:col-start-6">
          <p className="t-label text-muted">
            <span className="text-signal-deep">●</span> About
          </p>
          <SplitLines
            id="about-teaser-title"
            lines={[
              "Behind every visual",
              <>
                is an <span className="serif-accent text-navy">idea.</span>
              </>,
            ]}
            className="t-display mt-5"
          />
          <Reveal>
            <p className="t-lead measure mt-8 text-ink/85">
              I&apos;m {profile.firstName}, a graphic designer with a foundation in advertising and packaging design, shaped by five years
              of studio-based training at Takoradi Technical University.
            </p>
          </Reveal>
          <ul className="mt-10 grid gap-px border border-ink/12 bg-ink/12 sm:grid-cols-2">
            {education.map((e) => (
              <li key={e.award} className="bg-ivory/80 p-6">
                <p className="font-mono text-[0.8rem] text-muted">{e.years}</p>
                <p className="mt-2 t-h3">{e.award}</p>
                <p className="serif-accent text-lg text-navy">{e.field}</p>
              </li>
            ))}
          </ul>
          <Link href="/about" className="mt-10 inline-flex h-12 items-center gap-3 rounded-full border border-ink pr-1.5 pl-6 text-[0.8rem] font-semibold tracking-[0.1em] uppercase transition-colors hover:bg-ink hover:text-ivory">
            Read the full story
            <span className="grid size-9 place-items-center rounded-full bg-ink text-ivory">
              <ArrowRight className="size-4" aria-hidden />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Closing CTA                                                         */
/* ------------------------------------------------------------------ */
export function CtaBand() {
  return (
    <section aria-labelledby="cta-title" className="bg-flame relative overflow-hidden py-24 text-ink sm:py-32">
      <span className="breeze pointer-events-none absolute -top-20 -right-20 size-[26rem] text-ink/10" aria-hidden />
      <div className="relative mx-auto flex max-w-[1600px] flex-col gap-12 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12">
        <SplitLines
          id="cta-title"
          lines={[
            "Have an idea?",
            <>
              Let&apos;s make it <span className="serif-accent">visual.</span>
            </>,
          ]}
          className="t-page"
        />
        <Magnetic strength={0.4}>
          <Link
            href="/contact"
            data-cursor="Talk"
            className="grid size-40 shrink-0 place-items-center rounded-full bg-navy text-center text-ivory transition-transform duration-500 hover:scale-105 sm:size-48"
          >
            <span>
              <span className="t-label text-ivory/70">Start a</span>
              <span className="mt-1 block text-2xl font-semibold tracking-[-0.03em]">project →</span>
            </span>
          </Link>
        </Magnetic>
      </div>
    </section>
  );
}


/* ------------------------------------------------------------------ */
/* Stats band — count-up numbers                                       */
/* ------------------------------------------------------------------ */
const CLIENT_BRANDS = [
  "Chris Gold Buying Agent",
  "Clichy Gold Agent",
  "Nhyira Flour",
  "Royal Chop Delicacies",
  "Fans Liquid Soap",
  "Gifty Beauty Salon",
  "The Kelewele Hub",
  "Highlife Brownies",
  "Gather & Grow Assn.",
  "Afia Noodles Hub",
  "Dove Music",
  "5th Anniversary Celebration",
];

export function StatsBand() {
  const clientCases = projects.filter((p) => p.kind === "Client").length;
  const stats = [
    { n: projects.length, label: "Case studies", sub: `${clientCases} client · ${projects.length - clientCases} academic` },
    { n: CLIENT_BRANDS.length, label: "Brands designed for", sub: "Food, beauty, gold trade, FMCG, music & community" },
    { n: profile.experienceYears, suffix: "+", label: "Years of practice", sub: "Branding, advertising and packaging for real clients" },
    { n: profile.peopleTrained, suffix: "+", label: "Young people trained", sub: "Free, hands-on design training in the community" },
  ];
  return (
    <section aria-label="At a glance" className="relative overflow-hidden bg-navy py-20 text-ivory sm:py-24">
      <div aria-hidden className="mesh-navy pointer-events-none absolute inset-0" />
      <div className="relative mx-auto grid max-w-[1600px] gap-px overflow-hidden px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-12">
        {stats.map((st, i) => (
          <Reveal key={st.label} delay={i * 0.08}>
            <div className="border-t border-ivory/15 py-8 pr-6">
              <p className="sheen-text text-[clamp(3.5rem,7vw,6.5rem)] leading-none font-semibold tracking-[-0.05em]">
                <CountUp to={st.n} />
                {"suffix" in st && <span className="text-flame">{st.suffix}</span>}
              </p>
              <p className="mt-3 t-h3">{st.label}</p>
              <p className="mt-1 t-small text-ivory/65">{st.sub}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(to);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started.current) return;
      started.current = true;
      const t0 = performance.now();
      const tick = (t: number) => {
        const k = Math.min(1, (t - t0) / 1400);
        setN(Math.round(to * (1 - Math.pow(1 - k, 3))));
        if (k < 1) requestAnimationFrame(tick);
      };
      setN(0);
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{n}</span>;
}

/* ------------------------------------------------------------------ */
/* Client brands marquee                                               */
/* ------------------------------------------------------------------ */
export function BrandsMarquee() {
  const row = [...CLIENT_BRANDS, ...CLIENT_BRANDS];
  return (
    <section aria-label="Brands Kwabena has designed for" className="overflow-hidden border-b border-ink/10 bg-ivory py-10">
      <p className="mx-auto mb-6 max-w-[1600px] px-5 t-label text-muted sm:px-8 lg:px-12">
        <span className="text-signal-deep">●</span> Brands I&apos;ve designed for
      </p>
      <ul className="sr-only">
        {CLIENT_BRANDS.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      <div aria-hidden className="marquee flex w-max gap-14 whitespace-nowrap">
        {row.map((b, i) => (
          <span key={i} className={i % 3 === 1 ? "serif-accent text-[clamp(1.6rem,2.6vw,2.4rem)] text-navy" : "text-[clamp(1.4rem,2.4vw,2.2rem)] font-semibold tracking-[-0.03em] text-ink/80"}>
            {b}
            <span className="ml-14 inline-block size-2 rounded-full bg-signal align-middle" />
          </span>
        ))}
      </div>
    </section>
  );
}
