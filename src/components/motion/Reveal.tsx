"use client";

import { motion, type HTMLMotionProps } from "motion/react";

type Props = HTMLMotionProps<"div"> & { delay?: number; y?: number };

export function Reveal({ delay = 0, y = 28, children, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Masked, line-by-line headline reveal. */
export function SplitLines({
  id,
  lines,
  className,
  lineClassName,
  delay = 0,
  as: Tag = "h2",
  onView = true,
}: {
  lines: React.ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p";
  onView?: boolean;
  id?: string;
}) {
  const anim = onView
    ? { whileInView: "show" as const, viewport: { once: true, margin: "0px 0px -10% 0px" } }
    : { animate: "show" as const };
  return (
    <Tag id={id} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className={`block will-change-transform ${lineClassName ?? ""}`}
            initial="hidden"
            {...anim}
            variants={{
              hidden: { y: "110%", rotate: 2 },
              show: { y: "0%", rotate: 0, transition: { duration: 1.05, ease: [0.16, 1, 0.3, 1], delay: delay + i * 0.09 } },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
