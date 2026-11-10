import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { getAdjacent, getProject, projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { Reveal, SplitLines } from "@/components/motion/Reveal";
import { TrackView } from "@/components/case-study/TrackView";
import { CaseStage } from "@/components/case-study/CaseStage";
import { PresentButton } from "@/components/case-study/PresentButton";
import { XRayList } from "@/components/innovations/XRay";
import { MockupScene } from "@/components/mockup/MockupStage";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  const title = `${p.title} | ${p.category}`;
  return {
    title,
    description: p.summary,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: {
      title: `${title} | ${profile.name}`,
      description: p.summary,
      images: [{ url: p.image.src, width: p.image.width, height: p.image.height, alt: p.alt }],
    },
  };
}

export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const { prev, next } = getAdjacent(p.slug);
  const total = String(projects.length).padStart(2, "0");
  const position = projects.findIndex((x) => x.slug === p.slug);
  const redacted = p.slug === "wedding-naming-invitation" || p.pieces?.some((x) => x.src.includes("business-card"));

  return (
    <article className="pt-28 sm:pt-32">
      <TrackView slug={p.slug} />

      {/* Header */}
      <header className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-24 right-0 h-[28rem] w-[28rem] rounded-full opacity-40 blur-3xl" style={{ background: p.palette[1] ?? p.palette[0] }} />
        <div className="relative mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/work" className="group inline-flex items-center gap-2 t-label text-muted hover:text-ink">
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" aria-hidden />
              All work
            </Link>
            <PresentButton from={position} />
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="t-label text-muted">
                <span className="text-signal-deep">Project {p.index}</span> / {total} · {p.kind === "Client" ? "Client work · Freelance" : "Academic · TTU"}
              </p>
              <SplitLines as="h1" onView={false} lines={[p.title]} className="t-page mt-5" />
              <p className="mt-6 max-w-2xl t-lead text-ink/80">{p.summary}</p>
            </div>
            <div className="flex flex-wrap gap-2 lg:col-span-4 lg:justify-end">
              {p.filters.map((f) => (
                <span key={f} className="rounded-full border border-ink/15 bg-paper/60 px-3.5 py-1.5 t-small">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Stage: Flat ↔ In context ↔ X-Ray */}
      <section aria-label="Artwork" className="mx-auto mt-12 max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <CaseStage
          img={{ src: p.image.src, width: p.image.width, height: p.image.height, alt: p.alt }}
          mockup={p.mockup}
          tone={p.tone}
          pins={p.xray}
          slug={p.slug}
          transitionName={`art-${p.slug}`}
        />
        {redacted && (
          <p className="mt-3 inline-flex items-center gap-2 t-small text-muted">
            <ShieldCheck className="size-4 text-navy" aria-hidden /> Personal names and contact details are blurred to protect the client&apos;s privacy.
          </p>
        )}
      </section>

      {/* Palette */}
      <div className="mx-auto mt-10 max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="flex h-16 overflow-hidden rounded-xl sm:h-20" role="img" aria-label={`Colour palette sampled from the artwork: ${p.palette.join(", ")}`}>
          {p.palette.map((c) => (
            <div key={c} className="relative flex min-w-0 flex-1 items-end p-3" style={{ backgroundColor: c }}>
              <span className="hidden rounded bg-black/35 px-1.5 py-0.5 font-mono text-[0.6rem] text-white sm:inline">{c}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Story + sticky facts */}
      <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <dl className="divide-y divide-ink/10 overflow-hidden rounded-2xl border border-ink/12 bg-paper/70">
                {[
                  ["Type", p.kind === "Client" ? "Client work · Freelance" : "Academic portfolio piece"],
                  ["Brand", p.brand],
                  ["Discipline", p.category],
                  ["Pieces", String(1 + (p.pieces?.length ?? 0))],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-3 px-5 py-3.5">
                    <dt className="t-small text-muted">{k}</dt>
                    <dd className="t-small font-medium">{v}</dd>
                  </div>
                ))}
                <div className="px-5 py-4">
                  <dt className="t-small text-muted">Deliverables</dt>
                  <dd className="mt-2 flex flex-wrap gap-1.5">
                    {p.deliverables.map((d) => (
                      <span key={d} className="rounded-full bg-ivory px-3 py-1 text-[0.8rem]">
                        {d}
                      </span>
                    ))}
                  </dd>
                </div>
                <div className="px-5 py-4">
                  <dt className="t-small text-muted">Skills shown</dt>
                  <dd className="mt-2 t-small">{p.disciplines.join(" · ")}</dd>
                </div>
              </dl>
            </div>
          </aside>

          <div className="space-y-14 lg:col-span-7 lg:col-start-6">
            <Reveal>
              <h2 className="t-label text-muted">Overview</h2>
              <p className="measure mt-4 t-lead text-ink/85">{p.overview}</p>
            </Reveal>

            <aside className="flex gap-3 rounded-xl border-l-2 border-signal bg-paper/60 px-5 py-4 t-small text-ink/70">
              <span className="font-semibold text-ink">Designer&apos;s notes.</span>
              <span>The sections below are an interpretive reading of the finished work. No original brief was supplied, so objectives are described as the design communicates them.</span>
            </aside>

            <Reveal>
              <h2 className="t-label text-muted">Creative objective</h2>
              <p className="serif-accent mt-4 text-[clamp(1.6rem,2.6vw,2.4rem)] leading-snug text-navy">{p.objective}</p>
            </Reveal>

            <Reveal>
              <h2 className="t-label text-muted">Design approach</h2>
              <ol className="mt-6 space-y-6">
                {p.approach.map((a, i) => (
                  <li key={i} className="grid grid-cols-[2.5rem_1fr] gap-2 border-t border-ink/10 pt-5">
                    <span className="font-mono t-small text-signal-deep">0{i + 1}</span>
                    <p className="measure t-body text-ink/80">{a}</p>
                  </li>
                ))}
              </ol>
            </Reveal>

            {p.xray.length > 0 && (
              <Reveal>
                <h2 className="t-label text-muted">Design X-Ray · annotated decisions</h2>
                <div className="mt-6">
                  <XRayList pins={p.xray} />
                </div>
              </Reveal>
            )}
          </div>
        </div>

        {/* Additional pieces, each shown individually */}
        {p.pieces && p.pieces.length > 0 && (
          <section aria-label="More pieces from this project" className="mt-24">
            <p className="t-label text-muted">
              <span className="text-signal-deep">●</span> More from this project
            </p>
            <div className="mt-6 grid gap-8">
              {p.pieces.map((piece) => (
                <Reveal key={piece.src}>
                  <figure className="overflow-hidden rounded-2xl">
                    <div className={piece.width / piece.height > 1.3 ? "aspect-[16/10]" : "aspect-[4/5] sm:aspect-[16/11]"}>
                      <MockupScene img={piece} kind={piece.mockup} tone={p.tone} />
                    </div>
                    <figcaption className="flex flex-wrap items-baseline justify-between gap-3 bg-paper/70 px-5 py-4">
                      <span className="t-body font-semibold">{piece.title}</span>
                      <span className="t-small text-muted">{p.title}</span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* Details */}
        {p.details.length > 0 && (
          <div className={`mt-24 grid gap-8 ${p.details.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            {p.details.map((d, i) => (
              <Reveal key={d.src} delay={i * 0.1}>
                <figure>
                  <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl p-6 sm:p-10" style={{ backgroundColor: p.tone }}>
                    <Image
                      src={d.src}
                      alt={d.alt}
                      width={d.width}
                      height={d.height}
                      quality={92}
                      sizes="(min-width: 768px) 45vw, 100vw"
                      className="h-auto max-h-full w-auto max-w-full object-contain shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)]"
                    />
                  </div>
                  <figcaption className="mt-3 flex gap-3 t-small text-muted">
                    <span className="font-mono">Detail {String.fromCharCode(65 + i)}</span>
                    <span>{d.caption}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}

        {/* Visual direction */}
        <div className="mt-24 grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <h2 className="t-label text-muted">Visual direction</h2>
            <dl className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
              {p.visualDirection.map((v) => (
                <div key={v.label} className="grid gap-2 py-5 sm:grid-cols-[10rem_1fr]">
                  <dt className="t-body font-semibold">{v.label}</dt>
                  <dd className="t-body text-ink/75">{v.text}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>

      {/* Next project preview */}
      <nav aria-label="More projects" className="grid md:grid-cols-[1fr_2fr]">
        <Link href={`/work/${prev.slug}`} className="group flex items-center gap-6 border-t border-ink/10 p-8 hover:bg-ivory-deep sm:p-12">
          <ArrowLeft className="size-5 shrink-0 transition-transform group-hover:-translate-x-1" aria-hidden />
          <span>
            <span className="t-label text-muted">Previous · {prev.index}</span>
            <span className="mt-1 block t-h3">{prev.title}</span>
          </span>
        </Link>
        <Link href={`/work/${next.slug}`} className="group mesh-navy-card relative grid items-center gap-8 overflow-hidden p-8 text-ivory sm:grid-cols-[1fr_auto] sm:p-12">
          <span>
            <span className="t-label text-ivory/60">Next · {next.index} · {next.kind === "Client" ? "Client work" : "Academic"}</span>
            <span className="mt-2 block t-display">{next.title}</span>
            <span className="mt-4 inline-flex items-center gap-2 t-small font-semibold text-signal">
              View case study <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </span>
          </span>
          <span className="relative hidden h-44 w-44 overflow-hidden rounded-xl shadow-2xl ring-1 ring-ivory/15 transition-transform duration-700 group-hover:scale-105 group-hover:rotate-2 sm:block" style={{ backgroundColor: next.tone }}>
            <Image src={next.image.src} alt="" fill sizes="176px" className="object-cover" />
          </span>
        </Link>
      </nav>
    </article>
  );
}
