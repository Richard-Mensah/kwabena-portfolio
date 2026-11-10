"use client";

import { motion } from "motion/react";
import { process } from "@/data/services";
import { Reveal, SplitLines } from "@/components/motion/Reveal";

export function Process() {
  return (
    <section aria-labelledby="process-title" className="bg-navy py-24 text-ivory sm:py-32">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <p className="t-label text-ivory/60">
          <span className="text-signal">●</span> Creative process
        </p>
        <SplitLines
          id="process-title"
          lines={[
            "From the first idea",
            <>
              to the final <span className="serif-accent">visual.</span>
            </>,
          ]}
          className="t-display mt-5 max-w-5xl"
        />

        <ol className="relative mt-20 grid gap-12 md:grid-cols-4 md:gap-8">
          <motion.span
            aria-hidden
            className="absolute top-[1.4rem] left-0 hidden h-px w-full origin-left bg-ivory/40 md:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "0px 0px -20% 0px" }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          />
          <span aria-hidden className="absolute top-0 bottom-0 left-[1.4rem] w-px bg-ivory/20 md:hidden" />
          {process.map((step, i) => (
            <li key={step.index} className="relative pl-16 md:pl-0">
              <Reveal delay={0.2 + i * 0.15}>
                <span className="absolute top-0 left-0 grid size-[2.8rem] place-items-center rounded-full border border-ivory/50 bg-navy font-mono text-[0.8rem] md:relative">
                  {step.index}
                </span>
                <h3 className="t-h2 md:mt-10">{step.title}</h3>
                <p className="mt-3 max-w-xs t-body text-ivory/75">{step.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
