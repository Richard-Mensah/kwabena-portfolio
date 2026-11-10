/* eslint-disable @next/next/no-img-element */
// One frame of the showreel as a pure function of time. Rendered frame by frame to MP4 by scripts/render-reel.mjs.
import type { CSSProperties } from "react";
import { REEL, REEL_SCENES } from "@/data/reel";
import type { Project } from "@/data/projects";

const W = REEL.width;
const H = REEL.height;
const FLAME = ["#FDB202", "#FE6305", "#FC3902"];
const INK = "#171717";
const IVORY = "#F5F2EB";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const prog = (t: number, start: number, dur: number) => clamp01((t - start) / dur);
const out = (x: number) => 1 - Math.pow(1 - x, 4);
const inOut = (x: number) => (x < 0.5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2);

const sans: CSSProperties = { fontFamily: "var(--font-sans)" };
const mono: CSSProperties = { fontFamily: "var(--font-mono)", letterSpacing: "0.18em", textTransform: "uppercase" };
const serif: CSSProperties = { fontFamily: "var(--font-serif)", fontStyle: "italic" };

function barColors(p?: Project) {
  const c = p ? [...p.palette] : [...FLAME];
  while (c.length < 4) c.push(FLAME[c.length % 3]);
  return c.slice(0, 4);
}

/** Full-frame colour bars: rise in over the last 0.5 s of a segment, sweep away in the first 0.6 s of the next. */
function Bars({ colors, phase, p }: { colors: string[]; phase: "in" | "out"; p: number }) {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", zIndex: 50 }}>
      {colors.map((c, i) => {
        const local = clamp01(p * 1.25 - i * 0.08);
        const y = phase === "in" ? 100 * (1 - inOut(local)) : -100 * inOut(local);
        return <div key={i} style={{ flex: 1, background: c, transform: `translateY(${y}%)` }} />;
      })}
    </div>
  );
}

function Scene({ p, i, u }: { p: Project; i: number; u: number }) {
  const S = REEL.scene;
  const exit = out(prog(u, S - 0.75, 0.3));
  // Artwork fitted into the right-hand stage
  const box = { x: 990, y: 150, w: 780, h: 780 };
  const ar = p.image.width / p.image.height;
  const fw = ar >= box.w / box.h ? box.w : box.h * ar;
  const fh = fw / ar;
  const ax = box.x + (box.w - fw) / 2;
  const ay = box.y + (box.h - fh) / 2;
  const reveal = out(prog(u, 0.3, 1.0));
  const zoom = 1.1 - 0.1 * (u / S);
  const drift = -14 * (u / S);
  const words = p.title.split(" ");
  const label = out(prog(u, 0.45, 0.6));
  const sum = out(prog(u, 0.95, 0.7));
  const num = out(prog(u, 0.25, 1.1));

  return (
    <div style={{ position: "absolute", inset: 0, background: INK, overflow: "hidden" }}>
      {/* palette-washed blurred backdrop */}
      <img
        src={p.image.src}
        alt=""
        style={{
          position: "absolute",
          inset: -120,
          width: W + 240,
          height: H + 240,
          objectFit: "cover",
          filter: "blur(70px) saturate(1.5)",
          opacity: 0.5,
          transform: `scale(${1.15 + 0.05 * (u / S)}) translateX(${drift * 2}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(60% 75% at 72% 50%, ${p.palette[0]}66, transparent 70%), linear-gradient(90deg, ${INK} 6%, ${INK}cc 42%, ${INK}33)`,
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(120% 90% at 50% 125%, ${INK}, transparent 60%)` }} />

      {/* giant scene number */}
      <div
        style={{
          ...sans,
          position: "absolute",
          left: -20,
          bottom: -150,
          fontSize: 560,
          fontWeight: 600,
          letterSpacing: "-0.08em",
          lineHeight: 1,
          color: "rgba(245,242,235,0.05)",
          transform: `translateY(${120 * (1 - num)}px)`,
        }}
      >
        {String(i + 1).padStart(2, "0")}
      </div>

      {/* artwork */}
      <div
        style={{
          position: "absolute",
          left: ax,
          top: ay,
          width: fw,
          height: fh,
          clipPath: `inset(0 0 0 ${100 * (1 - reveal)}%)`,
          boxShadow: "0 50px 90px -30px rgba(0,0,0,.7)",
          overflow: "hidden",
          opacity: 1 - exit * 0.4,
        }}
      >
        <img
          src={p.image.src}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom}) translateX(${drift}px)` }}
        />
      </div>

      {/* text */}
      <div style={{ position: "absolute", left: 190, top: 300, width: 740, color: IVORY, opacity: 1 - exit, transform: `translateY(${-24 * exit}px)` }}>
        <p style={{ ...mono, fontSize: 19, color: "rgba(245,242,235,.65)", opacity: label, transform: `translateY(${14 * (1 - label)}px)` }}>
          <span style={{ color: FLAME[0] }}>{p.index}</span> · {p.kind === "Client" ? "Client work" : "Academic"} · {p.category.split(" / ")[0]}
        </p>
        <h2 style={{ ...sans, marginTop: 26, fontSize: words.join(" ").length > 22 ? 96 : 112, fontWeight: 600, letterSpacing: "-0.045em", lineHeight: 0.98 }}>
          {words.map((w, wi) => {
            const k = out(prog(u, 0.5 + wi * 0.08, 0.85));
            return (
              <span key={wi} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.1em", marginRight: "0.24em" }}>
                <span style={{ display: "inline-block", transform: `translateY(${110 * (1 - k)}%) rotate(${6 * (1 - k)}deg)` }}>{w}</span>
              </span>
            );
          })}
        </h2>
        <p style={{ ...sans, marginTop: 28, maxWidth: 600, fontSize: 27, lineHeight: 1.45, color: "rgba(245,242,235,.8)", opacity: sum }}>{p.summary}</p>
        <div style={{ marginTop: 34, display: "flex", gap: 10 }}>
          {p.palette.map((c, ci) => (
            <span key={c + ci} style={{ height: 14, borderRadius: 99, background: c, width: 64 * out(prog(u, 1.1 + ci * 0.07, 0.55)) }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Intro({ t }: { t: number }) {
  const logo = out(prog(t, 0.15, 1.1));
  const line = inOut(prog(t, 0.9, 0.9));
  const cap = out(prog(t, 1.2, 0.7));
  const glow = 0.35 + 0.25 * Math.sin(t * 1.6);
  return (
    <div style={{ position: "absolute", inset: 0, background: INK, overflow: "hidden", display: "grid", placeItems: "center" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(45% 55% at 50% 60%, rgba(254,99,5,${glow * 0.5}), transparent 70%)` }} />
      <div style={{ position: "relative", textAlign: "center" }}>
        <div style={{ clipPath: `inset(${100 * (1 - logo)}% 0 0 0)`, transform: `translateY(${40 * (1 - logo)}px) scale(${0.96 + 0.04 * logo})` }}>
          <img src="/images/brand/ka-logo-light.png" alt="" style={{ width: 820, height: "auto" }} />
        </div>
        <div style={{ margin: "34px auto 0", height: 4, width: 460 * line, borderRadius: 4, background: `linear-gradient(90deg, ${FLAME.join(",")})` }} />
        <p style={{ ...mono, marginTop: 30, fontSize: 20, color: "rgba(245,242,235,.7)", opacity: cap, transform: `translateY(${12 * (1 - cap)}px)` }}>
          Showreel · {REEL_SCENES.length} selected projects
        </p>
      </div>
    </div>
  );
}

function Outro({ u }: { u: number }) {
  const a = out(prog(u, 0.45, 0.9));
  const b = out(prog(u, 0.9, 0.8));
  const fade = prog(u, REEL.outro - 0.5, 0.5);
  return (
    <div style={{ position: "absolute", inset: 0, background: INK, overflow: "hidden", display: "grid", placeItems: "center" }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, ${FLAME[0]}22, ${FLAME[1]}33 55%, ${FLAME[2]}22)` }} />
      <div style={{ position: "relative", textAlign: "center", color: IVORY, opacity: 1 - fade }}>
        <div style={{ opacity: a, transform: `translateY(${30 * (1 - a)}px)` }}>
          <img src="/images/brand/ka-logo-light.png" alt="" style={{ width: 640, height: "auto" }} />
        </div>
        <p style={{ ...sans, marginTop: 40, fontSize: 64, fontWeight: 600, letterSpacing: "-0.04em", opacity: b, transform: `translateY(${20 * (1 - b)}px)` }}>
          Have an idea? Let&apos;s make it <span style={{ ...serif, fontWeight: 400 }}>visual.</span>
        </p>
        <p style={{ ...mono, marginTop: 26, fontSize: 20, color: "rgba(245,242,235,.75)", opacity: b }}>acheamponggkb23@gmail.com</p>
      </div>
    </div>
  );
}

export function ReelFrame({ t }: { t: number }) {
  const n = REEL_SCENES.length;
  const S = REEL.scene;
  const endScenes = REEL.intro + n * S;
  let body;
  let bars = null;
  const BAR_OUT = 0.5;
  const BAR_IN = 0.6;

  if (t < REEL.intro) {
    body = <Intro t={t} />;
    if (t > REEL.intro - BAR_OUT) bars = <Bars colors={barColors(REEL_SCENES[0])} phase="in" p={(t - (REEL.intro - BAR_OUT)) / BAR_OUT} />;
  } else if (t < endScenes) {
    const i = Math.min(n - 1, Math.floor((t - REEL.intro) / S));
    const u = t - REEL.intro - i * S;
    body = <Scene p={REEL_SCENES[i]} i={i} u={u} />;
    if (u < BAR_IN) bars = <Bars colors={barColors(REEL_SCENES[i])} phase="out" p={u / BAR_IN} />;
    else if (u > S - BAR_OUT) bars = <Bars colors={barColors(REEL_SCENES[i + 1])} phase="in" p={(u - (S - BAR_OUT)) / BAR_OUT} />;
  } else {
    const u = t - endScenes;
    body = <Outro u={u} />;
    if (u < BAR_IN) bars = <Bars colors={barColors()} phase="out" p={u / BAR_IN} />;
  }

  return (
    <div style={{ position: "relative", width: W, height: H, overflow: "hidden", background: INK }}>
      {body}
      {bars}
    </div>
  );
}
