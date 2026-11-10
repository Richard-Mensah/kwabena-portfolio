"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Download, Plus } from "lucide-react";
import { education, profile } from "@/data/profile";
import { curriculum } from "@/data/curriculum";
import { Reveal, SplitLines } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

const bio = [
  "I'm Kwabena Acheampong, a graphic designer with a foundation in advertising and packaging design.",
  "My creative interests sit at the intersection of visual communication, brand identity and advertising. I enjoy exploring how typography, colour, imagery and composition can work together to communicate an idea and create a memorable impression.",
  "My approach combines creative exploration with an appreciation for thoughtful design and purposeful communication.",
  "I believe good design should not only look beautiful. It should communicate clearly, connect with people and give ideas a recognizable visual presence.",
];

export function About() {
  const facts: [string, string][] = [
    ["Discipline", "Graphic Design: Advertising & Packaging"],
    ["Education", "B.Tech & HND, Takoradi Technical University"],
    ["Training", "Five years of studio-based design study, including industrial attachments"],
    ["Focus", "Identity · Advertising · Packaging · Campaigns"],
    ["Based in", profile.location],
  ];
  if (profile.languages.length) facts.push(["Languages", profile.languages.join(", ")]);
  if (profile.tools.length) facts.push(["Tools", profile.tools.join(", ")]);

  return (
    <section aria-label="Biography" className="pb-24 sm:pb-32">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-5">
            <figure className="lg:sticky lg:top-24">
              <div className="relative aspect-[4/5] overflow-hidden bg-ivory-deep">
                <Image
                  src="/images/portrait/kwabena-graduation-bw.jpg"
                  alt="Black-and-white portrait of Kwabena Acheampong in a suit and graduation cap, head bowed, in front of a perforated breeze-block wall."
                  fill
                  priority
                  quality={90}
                  sizes="(min-width: 1024px) 38vw, 100vw"
                  className="object-cover object-[50%_32%] grayscale transition-[filter] duration-1000 hover:grayscale-0"
                />
              </div>
              <figcaption className="mt-3 flex justify-between t-label text-muted">
                <span>Fig. 02</span>
                <span>Graduation portrait</span>
              </figcaption>
            </figure>
          </Reveal>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <p className="t-h2 text-ink">{bio[0]}</p>
            </Reveal>
            <div className="mt-10 space-y-6">
              {bio.slice(1).map((p, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <p className={cn("measure t-body text-ink/80", i === 2 && "border-l-2 border-signal pl-6 t-lead text-navy")}>{p}</p>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-14">
              <div className="border border-ink/15 bg-paper/70">
                <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
                  <p className="t-label">Quick facts</p>
                  <a href={profile.portfolioPdf} download className="t-label text-signal-deep underline-offset-4 hover:underline">
                    Portfolio PDF ↓
                  </a>
                  {profile.cvUrl && (
                    <a href={profile.cvUrl} className="t-label text-signal-deep underline-offset-4 hover:underline">
                      Download CV ↓
                    </a>
                  )}
                </div>
                <dl className="divide-y divide-ink/10">
                  {facts.map(([k, v]) => (
                    <div key={k} className="grid grid-cols-1 gap-1 px-6 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
                      <dt className="t-small text-muted">{k}</dt>
                      <dd className="t-body font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
            <Reveal className="mt-6">
              <DownloadCard />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DownloadCard({ dark = false }: { dark?: boolean }) {
  return (
    <div className="grid gap-3">
      <DownloadLink
        dark={dark}
        href={profile.profilePdf}
        label="Download · PDF · 35 pages"
        title="Executive Profile"
        text="Mission, impact in numbers, community training, ten-year vision and every case study."
      />
      <DownloadLink dark={dark} href={profile.portfolioPdf} label="Download · PDF · 16 pages" title="Portfolio" text="A shorter landscape portfolio of the work." />
    </div>
  );
}

function DownloadLink({ dark, href, label, title, text }: { dark?: boolean; href: string; label: string; title: string; text: string }) {
  return (
    <a
      href={href}
      download
      data-cursor="Download"
      className={cn(
        "group flex items-center justify-between gap-6 p-6 transition-colors",
        dark ? "bg-ivory text-navy hover:bg-sand" : "bg-navy text-ivory hover:bg-navy-soft",
      )}
    >
      <span>
        <span className={cn("t-label block", dark ? "text-muted" : "text-ivory/60")}>{label}</span>
        <span className="mt-1 block t-h3">{title}</span>
        <span className={cn("mt-1 block t-small", dark ? "text-ink/70" : "text-ivory/70")}>{text}</span>
      </span>
      <span className="grid size-14 shrink-0 place-items-center rounded-full bg-signal text-ink transition-transform duration-500 group-hover:translate-y-1">
        <Download className="size-6" aria-hidden />
      </span>
    </a>
  );
}

export function Education() {
  const [open, setOpen] = useState<string | null>(curriculum[0].pillar);
  return (
    <section aria-labelledby="education-title" className="border-t border-ink/10 bg-sand/40 py-24 sm:py-32">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <p className="t-label text-muted">
          <span className="text-signal-deep">●</span> Education & training
        </p>
        <SplitLines
          id="education-title"
          lines={[
            <>
              Five years of <span className="serif-accent text-navy">studio</span>
            </>,
            "training.",
          ]}
          className="t-display mt-5"
        />

        <div className="mt-16 grid gap-14 lg:grid-cols-12 lg:gap-10">
          <ol className="relative border-l border-ink/20 lg:col-span-5">
            {education.map((e, i) => (
              <li key={e.award} className="relative pb-14 pl-9 last:pb-0">
                <Reveal delay={i * 0.1}>
                  <span
                    className={cn("absolute top-1.5 -left-[8px] size-4 rounded-full border-[3px] border-sand", i === 0 ? "bg-signal" : "bg-navy")}
                    aria-hidden
                  />
                  <p className="font-mono text-[0.85rem] text-muted">{e.years}</p>
                  <h3 className="mt-2 t-h2">{e.award}</h3>
                  <p className="serif-accent mt-1 text-[clamp(1.35rem,1.8vw,1.7rem)] leading-snug text-navy">{e.field}</p>
                  <p className="mt-3 t-small font-semibold">{e.institution}</p>
                  <p className="measure mt-3 t-body text-ink/75">{e.notes}</p>
                </Reveal>
              </li>
            ))}
          </ol>

          <div className="lg:col-span-6 lg:col-start-7">
            <p className="t-label text-muted">Areas of study: what the training covered</p>
            <ul className="mt-6 border-t border-ink/20">
              {curriculum.map((c) => {
                const isOpen = open === c.pillar;
                const id = `pillar-${c.pillar.replace(/\W+/g, "-").toLowerCase()}`;
                return (
                  <li key={c.pillar} className="border-b border-ink/20">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={id}
                      onClick={() => setOpen(isOpen ? null : c.pillar)}
                      className="group flex w-full items-center justify-between gap-4 py-5 text-left"
                    >
                      <span className="t-h3 font-medium transition-transform duration-500 group-hover:translate-x-1.5">{c.pillar}</span>
                      <span className="flex items-center gap-3">
                        <span className="font-mono text-[0.8rem] text-muted">{String(c.courses.length).padStart(2, "0")}</span>
                        <Plus className={cn("size-5 transition-transform duration-500", isOpen && "rotate-45 text-signal-deep")} aria-hidden />
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={id}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <ul className="flex flex-wrap gap-2 pb-6">
                            {c.courses.map((course) => (
                              <li key={course} className="rounded-full border border-ink/15 bg-ivory/80 px-3.5 py-1.5 t-small">
                                {course}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
