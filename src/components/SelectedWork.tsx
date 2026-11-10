"use client";

import { useMemo, useState, ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Layers, Pipette, X } from "lucide-react";
import { disciplines, kinds, projects, type Discipline, type Project } from "@/data/projects";
import { useGame } from "@/components/game/GameProvider";
import { chroma, deltaE, hexToOklab, hue, onColor, paletteDistance } from "@/lib/color";
import { cn } from "@/lib/utils";

type KindFilter = (typeof kinds)[number];

/** Colour DNA: every distinct, colourful swatch across all palettes, sorted by hue. */
const DNA = (() => {
  const out: string[] = [];
  projects
    .flatMap((p) => p.palette)
    .filter((c) => chroma(c) > 0.05)
    .forEach((c) => {
      if (!out.some((o) => deltaE(hexToOklab(o), hexToOklab(c)) < 0.07)) out.push(c);
    });
  return out.sort((a, b) => hue(a) - hue(b));
})();

const MATCH_THRESHOLD = 0.16;

/** Editorial rhythm for the 12-column grid; wide artworks always span the full row. */
const RHYTHM = ["md:col-span-7", "md:col-span-5 md:mt-40", "md:col-span-5 md:col-start-2", "md:col-span-6 md:mt-24"];

export function SelectedWork() {
  const { unlock } = useGame();
  const [kind, setKind] = useState<KindFilter>("All");
  const [disc, setDisc] = useState<"All" | Discipline>("All");
  const [colour, setColour] = useState<string | null>(null);

  const list = useMemo(() => {
    let l = projects.filter((p) => (kind === "All" || p.kind === kind) && (disc === "All" || p.filters.includes(disc)));
    if (colour) {
      l = l
        .map((p) => ({ p, d: paletteDistance(colour, p.palette) }))
        .filter((x) => x.d < MATCH_THRESHOLD)
        .sort((a, b) => a.d - b.d)
        .map((x) => x.p);
    }
    return l;
  }, [kind, disc, colour]);

  const editorial = kind === "All" && disc === "All" && !colour;

  const pickColour = (c: string | null) => {
    setColour(c);
    if (c) unlock("colour-hunter");
  };

  // Build grid items with layout classes and section dividers.
  const items: React.ReactNode[] = [];
  let r = 0;
  let lastKind: string | null = null;
  list.forEach((p, i) => {
    if (!colour && kind === "All" && p.kind !== lastKind) {
      items.push(<Divider key={`div-${p.kind}`} kind={p.kind} count={list.filter((x) => x.kind === p.kind).length} />);
      r = 0;
    }
    lastKind = p.kind;
    const wide = p.image.width / p.image.height > 1.4;
    let cls: string;
    if (wide) cls = "md:col-span-12";
    else if (editorial) cls = RHYTHM[r++ % RHYTHM.length];
    else cls = "md:col-span-6";
    items.push(
      <motion.li
        key={p.slug}
        layout
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.05 }}
        className={cls}
      >
        <ProjectCard project={p} badge={colour && i === 0 ? "Closest colour match" : undefined} />
      </motion.li>,
    );
  });

  return (
    <section aria-label="Projects" className="pb-24 sm:pb-32">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        {/* Controls */}
        <div className="space-y-5 border-y border-ink/12 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <FilterGroup
              label="Type"
              options={kinds.map((k) => ({ id: k, label: k === "Client" ? "Client work" : k, count: k === "All" ? projects.length : projects.filter((p) => p.kind === k).length }))}
              value={kind}
              onChange={(v) => setKind(v as KindFilter)}
              pillId="kind-pill"
            />
            <p className="t-small text-muted">Open a case study to add it to your Studio Archive.</p>
          </div>
          <FilterGroup
            label="Discipline"
            options={disciplines.map((d) => ({ id: d, label: d, count: d === "All" ? projects.length : projects.filter((p) => p.filters.includes(d as Discipline)).length }))}
            value={disc}
            onChange={(v) => setDisc(v as "All" | Discipline)}
            pillId="disc-pill"
          />
          {/* Search by colour */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="t-label w-24 shrink-0 text-muted">Colour</span>
            <div role="group" aria-label="Search work by colour" className="flex flex-1 flex-wrap items-center gap-1.5">
              {DNA.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={colour === c}
                  aria-label={`Show work using colours close to ${c}`}
                  title={c}
                  onClick={() => pickColour(colour === c ? null : c)}
                  data-testid="dna-swatch"
                  className={cn(
                    "size-7 rounded-full ring-offset-2 ring-offset-ivory transition-transform hover:scale-110",
                    colour === c ? "scale-110 ring-2 ring-ink" : "ring-1 ring-ink/10",
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
              <label className="relative ml-1 grid size-9 cursor-pointer place-items-center rounded-full border border-dashed border-ink/30 hover:border-ink" title="Pick any colour">
                <Pipette className="size-4" aria-hidden />
                <span className="sr-only">Pick any colour</span>
                <input type="color" value={colour ?? "#E64B32"} onChange={(e) => pickColour(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0" />
              </label>
              {colour && (
                <button
                  type="button"
                  onClick={() => pickColour(null)}
                  className="ml-1 inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[0.8rem] font-semibold"
                  style={{ backgroundColor: colour, color: onColor(colour) }}
                >
                  {colour.toUpperCase()} <X className="size-3.5" aria-hidden />
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          Showing {list.length} of {projects.length} projects
        </p>

        {list.length === 0 ? (
          <div className="py-24 text-center">
            <p className="t-h3">No pieces match that combination.</p>
            <button
              type="button"
              onClick={() => {
                setKind("All");
                setDisc("All");
                setColour(null);
              }}
              className="mt-5 h-11 rounded-full bg-navy px-6 text-[0.85rem] font-semibold text-ivory"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <motion.ul layout className="mt-12 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-12 md:gap-y-24">
            <AnimatePresence mode="popLayout">
              {items}
              {editorial && (
                <motion.li key="quote" layout className="md:col-span-5 md:col-start-2 md:self-center">
                  <blockquote className="border-l-2 border-signal pl-6">
                    <p className="serif-accent text-[clamp(1.6rem,2.4vw,2.25rem)] leading-snug text-navy">
                      &ldquo;Good design should communicate clearly, connect with people and give ideas a recognizable visual presence.&rdquo;
                    </p>
                    <footer className="mt-4 t-label text-muted">Kwabena Acheampong</footer>
                  </blockquote>
                </motion.li>
              )}
              {editorial && (
                <motion.li key="archive-tile" layout className="md:col-span-4 md:col-start-8 md:self-center">
                  <ArchiveTile />
                </motion.li>
              )}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>
    </section>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
  pillId,
}: {
  label: string;
  options: { id: string; label: string; count: number }[];
  value: string;
  onChange: (v: string) => void;
  pillId: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="t-label w-24 shrink-0 text-muted">{label}</span>
      <div role="group" aria-label={`Filter by ${label.toLowerCase()}`} className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={value === o.id}
            onClick={() => onChange(o.id)}
            className={cn(
              "relative h-10 rounded-full border px-4 text-[0.875rem] font-medium transition-colors",
              value === o.id ? "border-navy text-ivory" : "border-ink/15 hover:border-ink",
            )}
          >
            {value === o.id && <motion.span layoutId={pillId} className="absolute inset-0 rounded-full bg-navy" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
            <span className="relative">
              {o.label} <span className="ml-1 font-mono text-[0.75rem] opacity-60">{o.count}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Divider({ kind, count }: { kind: string; count: number }) {
  const client = kind === "Client";
  return (
    <motion.li layout className="md:col-span-12">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/15 pb-5">
        <div>
          <p className="t-label text-muted">
            <span className="text-signal-deep">●</span> {client ? "Freelance & commissioned" : "Takoradi Technical University"}
          </p>
          <h2 className="mt-3 t-h2">
            {client ? (
              <>
                Client <span className="serif-accent text-navy">work</span>
              </>
            ) : (
              <>
                Academic <span className="serif-accent text-navy">work</span>
              </>
            )}
          </h2>
        </div>
        <p className="font-mono text-[0.85rem] text-muted">{String(count).padStart(2, "0")} case studies</p>
      </div>
    </motion.li>
  );
}

function ArchiveTile() {
  const { viewed, total, play, setPlayMode } = useGame();
  const n = viewed.length;
  return (
    <div className="mesh-navy-card relative overflow-hidden rounded-2xl p-8 text-ivory sm:p-10">
      <span className="breeze pointer-events-none absolute -top-10 -right-10 size-48 text-ivory/10" aria-hidden />
      <p className="t-label text-ivory/60">Studio Archive</p>
      <p className="mt-4 t-h2">{n >= total ? "Archive complete." : `${n} of ${total} collected`}</p>
      <div className="mt-6 flex gap-1" aria-hidden>
        {projects.map((p) => (
          <span
            key={p.slug}
            className="h-2 flex-1 rounded-full transition-colors duration-700"
            style={{ backgroundColor: viewed.includes(p.slug) ? p.palette[1] ?? p.palette[0] : "rgba(245,242,235,0.15)" }}
          />
        ))}
      </div>
      <p className="mt-6 t-small text-ivory/75">
        {n >= total ? "You have seen every piece. Your Studio Pass is waiting in the archive." : "Open every case study to unlock the Studio Pass. Progress is saved on this device."}
      </p>
      {!play && (
        <button type="button" onClick={() => setPlayMode(true)} className="mt-6 t-small underline underline-offset-4">
          Turn play mode on
        </button>
      )}
    </div>
  );
}

export function ProjectCard({ project: p, badge }: { project: Project; badge?: string }) {
  const { viewed, play } = useGame();
  const collected = viewed.includes(p.slug);
  const wide = p.image.width / p.image.height > 1.4;
  const count = 1 + (p.pieces?.length ?? 0);
  const dark = hexToOklab(p.tone)[0] < 0.4;

  return (
    <Link href={`/work/${p.slug}`} className="group block" data-cursor="Open case" aria-label={`${p.title}: ${p.category}. View case study`}>
      <div className="relative overflow-hidden rounded-xl" style={{ backgroundColor: p.tone }}>
        <div aria-hidden className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100" style={{ background: `radial-gradient(70% 60% at 50% 40%, ${p.palette[1] ?? p.palette[0]}33, transparent 70%)` }} />
        <div className={cn("relative", wide ? "p-4 sm:p-8 lg:p-12" : "p-6 sm:p-10 lg:p-14")}>
          <ViewTransition name={`art-${p.slug}`}>
            <div className="relative overflow-hidden shadow-[0_30px_60px_-30px_rgba(0,0,0,0.55)]">
              <Image
                src={p.image.src}
                alt={p.alt}
                width={p.image.width}
                height={p.image.height}
                quality={90}
                sizes={wide ? "(min-width: 768px) 90vw, 100vw" : "(min-width: 768px) 50vw, 100vw"}
                className="h-auto w-full transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-[1.035]"
              />
            </div>
          </ViewTransition>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex h-1.5 translate-y-full transition-transform duration-500 group-hover:translate-y-0" aria-hidden>
          {p.palette.map((c) => (
            <span key={c} className="flex-1" style={{ backgroundColor: c }} />
          ))}
        </div>
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className={cn("rounded-full px-3 py-1 t-label text-[0.62rem] backdrop-blur-sm", dark ? "bg-ivory/90 text-ink" : "bg-ink/80 text-ivory")}>
            {p.kind === "Client" ? "Client work" : "Academic"}
          </span>
          {count > 1 && (
            <span className={cn("inline-flex items-center gap-1 rounded-full px-3 py-1 t-label text-[0.62rem] backdrop-blur-sm", dark ? "bg-ivory/90 text-ink" : "bg-ink/80 text-ivory")}>
              <Layers className="size-3" aria-hidden /> {count} pieces
            </span>
          )}
          {badge && <span className="rounded-full bg-signal px-3 py-1 t-label text-[0.62rem] text-ink">{badge}</span>}
        </div>
        {play && collected && (
          <span className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-navy px-3 py-1 t-label text-[0.62rem] text-ivory">
            <span className="text-signal">✦</span> Collected
          </span>
        )}
      </div>

      <div className="mt-5 flex items-start justify-between gap-6">
        <div className="flex gap-4">
          <span className="pt-1 font-mono text-[0.8rem] text-muted">{p.index}</span>
          <div>
            <h3 className="t-h3">
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-700 ease-[var(--ease-expo)] group-hover:bg-[length:100%_1px]">
                {p.title}
              </span>
            </h3>
            <p className="mt-1 t-small text-muted">{p.category}</p>
          </div>
        </div>
        <span className="grid size-11 shrink-0 place-items-center rounded-full border border-ink/15 transition-all duration-500 group-hover:rotate-45 group-hover:border-navy group-hover:bg-navy group-hover:text-ivory">
          <ArrowUpRight className="size-4" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
