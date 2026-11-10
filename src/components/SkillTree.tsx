"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { skillTree, type Skill } from "@/data/skills";
import { projects } from "@/data/projects";
import { useGame } from "@/components/game/GameProvider";
import { Reveal, SplitLines } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

const all = skillTree.flatMap((b) => b.skills.map((s) => ({ ...s, branch: b.name })));

export function SkillTree() {
  const { viewed, play } = useGame();
  const [selected, setSelected] = useState<string>(all[0].id);
  const skill = all.find((s) => s.id === selected)!;
  const lit = (s: Skill) => s.projects.some((p) => viewed.includes(p));
  const litCount = all.filter(lit).length;

  return (
    <section id="skills" aria-labelledby="skills-title" className="border-t border-ink/10 bg-ivory-deep/60 py-24 sm:py-32">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="t-label text-muted">
              <span className="text-signal">●</span> Skill Tree: evidence, not self-ratings
            </p>
            <SplitLines id="skills-title"
              lines={[
                <>
                  Skills, <em className="serif-accent text-navy">proven</em>
                </>,
                "in the work.",
              ]}
              className="t-display mt-5"
            />
          </div>
          <Reveal className="lg:col-span-5">
            <p className="max-w-md text-ink/75">
              Each skill links to the designs that demonstrate it and the coursework that trained it. Select a node to see
              the evidence.{" "}
              {play && (
                <span className="text-ink">
                  Nodes light up as you explore the case studies ({litCount}/{all.length} lit).
                </span>
              )}
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          {/* Tree */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:col-span-7">
            {skillTree.map((b, bi) => (
              <Reveal key={b.id} delay={bi * 0.08}>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-full bg-ink font-serif text-lg text-ivory italic" aria-hidden>
                      {b.glyph}
                    </span>
                    <h3 className="text-lg font-semibold tracking-[-0.02em]">{b.name}</h3>
                  </div>
                  <ul className="relative mt-4 ml-[21px] border-l border-ink/20 pl-0">
                    {b.skills.map((s) => {
                      const on = lit(s);
                      const isSel = s.id === selected;
                      return (
                        <li key={s.id} className="relative py-1.5 pl-7">
                          <span className="absolute top-1/2 left-0 h-px w-5 bg-ink/20" aria-hidden />
                          <button
                            type="button"
                            onClick={() => setSelected(s.id)}
                            aria-pressed={isSel}
                            data-cursor="Inspect"
                            className={cn(
                              "group flex w-full items-center gap-3 rounded-full border px-4 py-2.5 text-left t-small transition-all duration-300",
                              isSel ? "border-ink bg-ink text-ivory" : "border-ink/15 bg-paper/60 hover:border-ink",
                            )}
                          >
                            <span
                              className={cn(
                                "relative size-2.5 shrink-0 rounded-full transition-colors",
                                on ? "bg-signal" : isSel ? "bg-ivory/40" : "bg-ink/20",
                              )}
                              aria-hidden
                            >
                              {on && play && <span className="absolute inset-0 animate-ping rounded-full bg-signal/60 motion-reduce:animate-none" />}
                            </span>
                            <span className="flex-1 font-medium">{s.name}</span>
                            <span className={cn("font-mono text-[0.65rem]", isSel ? "text-ivory/60" : "text-muted")}>
                              {s.projects.length ? `${s.projects.length} work${s.projects.length > 1 ? "s" : ""}` : "study"}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Evidence panel */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="border border-ink/15 bg-paper p-6 sm:p-8"
                >
                  <p className="t-label text-muted">{skill.branch}</p>
                  <h3 className="mt-2 text-3xl leading-tight font-semibold tracking-[-0.03em]">{skill.name}</h3>
                  <p className="mt-3 text-ink/75">{skill.description}</p>

                  <p className="mt-7 t-label text-muted">Demonstrated in</p>
                  {skill.projects.length ? (
                    <ul className="mt-3 grid grid-cols-3 gap-3">
                      {skill.projects.map((slug) => {
                        const p = projects.find((x) => x.slug === slug)!;
                        return (
                          <li key={slug}>
                            <Link href={`/work/${slug}`} className="group block" data-cursor="Open">
                              <span className="relative block aspect-square overflow-hidden" style={{ backgroundColor: p.tone }}>
                                <Image
                                  src={p.image.src}
                                  alt=""
                                  fill
                                  sizes="140px"
                                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                {viewed.includes(slug) && play && (
                                  <span className="absolute top-1.5 right-1.5 grid size-5 place-items-center rounded-full bg-signal text-[0.6rem] text-ivory" aria-hidden>
                                    ✦
                                  </span>
                                )}
                              </span>
                              <span className="mt-2 block text-[0.8rem] leading-snug font-medium group-hover:underline">{p.title}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="mt-3 t-small text-ink/70">Developed through coursework and studio practice.</p>
                  )}

                  <p className="mt-7 t-label text-muted">Trained through</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {skill.courses.map((c) => (
                      <li key={c} className="rounded-full bg-ivory px-3 py-1.5 text-[0.78rem]">
                        {c}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
