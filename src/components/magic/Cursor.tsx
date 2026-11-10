"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useGame } from "@/components/game/GameProvider";

/**
 * Contextual cursor. Elements opt in with `data-cursor="View"` (label shown in the ring).
 * Only active for fine pointers while play mode is on.
 */
export function Cursor() {
  const { play } = useGame();
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.6 });

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setEnabled(mq.matches && play);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [play]);

  useEffect(() => {
    document.documentElement.classList.toggle("ka-cursor", enabled);
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor], a, button, input, textarea, select, label");
      setHover(!!t);
      setLabel(t?.dataset.cursor ?? null);
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("ka-cursor");
    };
  }, [enabled, x, y]);

  if (!enabled) return null;
  const size = label ? 84 : hover ? 44 : 12;

  return (
    <motion.div
      aria-hidden
      data-chrome
      className="pointer-events-none fixed top-0 left-0 z-[90] mix-blend-difference"
      style={{ x: sx, y: sy, opacity: visible ? 1 : 0 }}
    >
      <motion.div
        className="grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-black"
        animate={{ width: size, height: size }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
      >
        {label && <span className="t-label text-[0.6rem] font-semibold">{label}</span>}
      </motion.div>
    </motion.div>
  );
}
