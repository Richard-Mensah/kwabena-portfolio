"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/services";
import { cn } from "@/lib/utils";

export function Services() {
  const [open, setOpen] = useState(0);
  return (
    <section aria-label="Services" className="pb-24 sm:pb-32">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <ul className="border-t border-ink">
          {services.map((s, i) => {
            const isOpen = open === i;
            const panel = `service-${s.index}`;
            return (
              <li key={s.index} className="border-b border-ink/20" onMouseEnter={() => setOpen(i)}>
                <h2>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panel}
                    onClick={() => setOpen(i)}
                    onFocus={() => setOpen(i)}
                    className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-7 text-left sm:grid-cols-[5rem_1fr_auto] sm:py-9"
                  >
                    <span className={cn("font-mono text-[0.85rem] transition-colors", isOpen ? "text-signal-deep" : "text-muted")}>{s.index}</span>
                    <span
                      className={cn(
                        "t-display transition-all duration-700 ease-[var(--ease-expo)]",
                        isOpen ? "translate-x-1 text-navy sm:translate-x-5" : "text-ink/55 group-hover:text-ink",
                      )}
                    >
                      {s.title}
                    </span>
                    <span
                      className={cn(
                        "grid size-11 place-items-center rounded-full border transition-all duration-500 sm:size-14",
                        isOpen ? "rotate-45 border-signal bg-signal text-ink" : "border-ink/20",
                      )}
                      aria-hidden
                    >
                      <ArrowUpRight className="size-5" />
                    </span>
                  </button>
                </h2>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panel}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-6 pb-10 sm:grid-cols-[5rem_1fr] lg:grid-cols-[5rem_minmax(0,30rem)_1fr]">
                        <span className="hidden sm:block" />
                        <p className="serif-accent text-[clamp(1.4rem,2vw,1.85rem)] leading-snug text-navy">{s.lede}</p>
                        <ul className="flex flex-wrap content-start gap-2 sm:col-start-2 lg:col-start-auto">
                          {s.items.map((it, k) => (
                            <motion.li
                              key={it}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 + k * 0.05 }}
                              className="rounded-full border border-ink/15 bg-paper/50 px-4 py-2 t-small"
                            >
                              {it}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
