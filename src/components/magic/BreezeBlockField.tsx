"use client";

import { useEffect, useRef } from "react";
import { useGame } from "@/components/game/GameProvider";

/**
 * A perforated "breeze-block" screen drawn over the portrait, echoing the wall
 * in the graduation photographs. Apertures widen around the pointer (or a tap)
 * to reveal the image beneath. Pauses off-screen; disabled in calm/reduced mode.
 */
export function BreezeBlockField({ color = "#F5F2EB" }: { color?: string }) {
  const { play } = useGame();
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !play) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0,
      h = 0,
      cell = 34,
      dpr = 1,
      raf = 0,
      running = true;
    const t0 = performance.now();
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    let radii: Float32Array = new Float32Array(0);
    let cols = 0,
      rows = 0;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      cell = Math.max(26, Math.min(40, w / 11));
      cols = Math.ceil(w / cell) + 1;
      rows = Math.ceil(h / cell) + 1;
      radii = new Float32Array(cols * rows);
    };

    const draw = (now: number) => {
      if (!running) return;
      const intro = Math.min(1, (now - t0) / 1600);
      const ease = 1 - Math.pow(1 - intro, 3);
      pointer.x += (pointer.tx - pointer.x) * 0.14;
      pointer.y += (pointer.ty - pointer.y) * 0.14;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "destination-out";

      const open = cell * 0.78; // fully clears the screen
      const pinhole = cell * 0.16;
      const reach = cell * 3.6;
      const fx = w * 0.5,
        fy = h * 0.38; // keep the face/torso clear
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const k = j * cols + i;
          const cx = i * cell + (j % 2 ? cell / 2 : 0);
          const cy = j * cell;
          // Rest state: clear in the centre, dissolving into a perforated screen at the edges.
          const dn = Math.hypot((cx - fx) / (w * 0.5), (cy - fy) / (h * 0.62));
          const e = Math.min(1, Math.max(0, (dn - 0.62) / 0.42));
          const edge = e * e * (3 - 2 * e);
          const rest = open * (1 - edge) + pinhole * edge;
          // Pointer opens nearby apertures fully.
          const near = Math.max(0, 1 - Math.hypot(cx - pointer.x, cy - pointer.y) / reach);
          // Staggered intro: apertures open from the centre outward.
          const stagger = Math.min(1, Math.max(0, ease * 1.8 - dn * 0.8));
          const target = Math.max(rest, open * Math.pow(near, 0.7)) * stagger;
          radii[k] += (target - radii[k]) * 0.18;
          if (radii[k] < 0.5) continue;
          ctx.beginPath();
          ctx.arc(cx, cy, radii[k], 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - r.left;
      pointer.ty = e.clientY - r.top;
      if (pointer.x < -999) {
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
      }
    };
    const onLeave = () => {
      pointer.tx = -9999;
      pointer.ty = -9999;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      const vis = entry.isIntersecting;
      if (vis && !running) {
        running = true;
        raf = requestAnimationFrame(draw);
      } else if (!vis) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);
    const host = canvas.parentElement!;
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerdown", onMove);
    host.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [play, color]);

  if (!play) return null;
  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 size-full" />;
}
