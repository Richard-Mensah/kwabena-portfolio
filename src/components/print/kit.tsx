import Image from "next/image";

/**
 * Print kit for the A4 portrait Executive Profile.
 * ONE typographic system: every text element uses a token from `T`. No other sizes are allowed
 * (scripts/type-check.mjs enforces this on the rendered page).
 */
export const T = {
  cover: "text-[54pt] leading-[0.9] tracking-[-0.05em] font-semibold",
  d1: "text-[44pt] leading-[0.92] tracking-[-0.05em] font-semibold",
  d2: "text-[32pt] leading-[0.98] tracking-[-0.045em] font-semibold",
  d3: "text-[24pt] leading-[1.02] tracking-[-0.04em] font-semibold",
  h1: "text-[16pt] leading-[1.15] tracking-[-0.025em] font-semibold",
  h2: "text-[12.5pt] leading-[1.2] tracking-[-0.02em] font-semibold",
  body: "text-[9.5pt] leading-[1.55]",
  small: "text-[7.5pt] leading-[1.45]",
  label: "font-mono text-[6.5pt] leading-[1.3] tracking-[0.16em] uppercase",
} as const;

/** Allowed sizes in CSS px (pt × 4/3), used by the type checker. */
export const ALLOWED_PX = [54, 44, 32, 24, 16, 12.5, 9.5, 7.5, 6.5].map((pt) => Math.round((pt * 4) / 3 * 100) / 100);

export const TOTAL_PAGES = 35;

type Img = { src: string; width: number; height: number; alt: string };

/** Instrument Serif italic accent. Inherits the size of its parent token. */
export function Accent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`font-serif font-normal italic tracking-[-0.01em] ${className}`}>{children}</span>;
}

export function Label({ children, dark, className = "" }: { children: React.ReactNode; dark?: boolean; className?: string }) {
  return <p className={`${T.label} ${dark ? "text-ivory/60" : "text-muted"} ${className}`}>{children}</p>;
}

/** Section eyebrow with the signal dot. */
export function Eyebrow({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p className={`${T.label} ${dark ? "text-ivory/65" : "text-muted"}`}>
      <span className="mr-[2mm] inline-block size-[2mm] rounded-full bg-signal align-middle" />
      {children}
    </p>
  );
}

/** A4 portrait page with fixed margins and a fixed footer (folio, section, page x / 35). */
export function Page({
  n,
  section,
  children,
  tone = "ivory",
  bleed,
  className = "",
}: {
  n: number;
  section: string;
  children: React.ReactNode;
  tone?: "ivory" | "navy" | "sand" | "ink";
  bleed?: React.ReactNode;
  className?: string;
}) {
  const dark = tone === "navy" || tone === "ink";
  const bg = { ivory: "bg-ivory text-ink", navy: "bg-navy text-ivory", sand: "bg-sand/70 text-ink", ink: "bg-ink text-ivory" }[tone];
  return (
    <section className={`page shadow-2xl ${bg}`}>
      {bleed}
      <div className={`relative flex h-full flex-col px-[16mm] pt-[16mm] pb-[20mm] ${className}`}>{children}</div>
      <footer className={`absolute inset-x-[16mm] bottom-[9mm] flex items-center justify-between border-t pt-[2.5mm] ${T.label} ${dark ? "border-ivory/15 text-ivory/55" : "border-ink/12 text-muted"}`}>
        <span>Kwabena Acheampong · Executive Profile</span>
        <span>{section}</span>
        <span>
          <span className={dark ? "text-ivory" : "text-ink"}>{String(n).padStart(2, "0")}</span> / {TOTAL_PAGES}
        </span>
      </footer>
    </section>
  );
}

export function Palette({ colors, h = "5mm" }: { colors: string[]; h?: string }) {
  return (
    <div className="flex overflow-hidden rounded-[1mm]" style={{ height: h }}>
      {colors.map((c) => (
        <div key={c} className="flex flex-1 items-end p-[1mm]" style={{ backgroundColor: c }}>
          <span className={`rounded-[0.5mm] bg-black/35 px-[0.8mm] text-white ${T.label}`} style={{ letterSpacing: "0.08em" }}>
            {c}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Breeze-block pattern (the circular wall in Kwabena's portraits) as an SVG field. */
export function Breeze({ className = "", color = "currentColor", cell = 7, r = 2.4 }: { className?: string; color?: string; cell?: number; r?: number }) {
  const id = `bz-${cell}-${r}`;
  return (
    <svg aria-hidden className={className} width="100%" height="100%">
      <defs>
        <pattern id={id} width={`${cell}mm`} height={`${cell}mm`} patternUnits="userSpaceOnUse">
          <circle cx={`${cell / 2}mm`} cy={`${cell / 2}mm`} r={`${r}mm`} fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

export function Art({ img, className = "", fit = "contain" }: { img: Img; className?: string; fit?: "contain" | "cover" }) {
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: `${img.width}/${img.height}` }}>
      <Image src={img.src} alt={img.alt} fill unoptimized loading="eager" className={fit === "cover" ? "object-cover" : "object-contain"} />
    </div>
  );
}

/* ----------------------------- Print mockups ----------------------------- */

/** Framed poster on a lit wall. */
export function PosterWall({ img, width = "92mm" }: { img: Img; width?: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[1.5mm] bg-[radial-gradient(80%_70%_at_50%_30%,#fbf8f2,#e7e0d2_70%,#d6ccb9)]">
      <div className="absolute inset-x-0 bottom-0 h-[16%] bg-[linear-gradient(#0000,rgba(0,0,0,.1))]" />
      <div className="relative bg-[#141414] p-[2.4mm] shadow-[0_14mm_22mm_-10mm_rgba(0,0,0,.55)]" style={{ width }}>
        <div className="bg-white p-[4mm]">
          <Art img={img} />
        </div>
      </div>
    </div>
  );
}

/** Social feed on a phone. */
export function Phone({ img, width = "70mm", tone }: { img: Img; width?: string; tone: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[1.5mm]" style={{ background: `radial-gradient(70% 70% at 50% 40%, ${tone}, color-mix(in oklab, ${tone} 65%, #1b2540))` }}>
      <div className="relative rounded-[8mm] bg-[#0d0d0f] p-[2.2mm] shadow-[0_16mm_24mm_-10mm_rgba(0,0,0,.6)]" style={{ width }}>
        <div className="overflow-hidden rounded-[6.2mm] bg-white">
          <div className="flex items-center gap-[2mm] px-[3mm] pt-[6mm] pb-[2mm]">
            <span className={`grid size-[5mm] place-items-center rounded-full bg-navy text-ivory ${T.label}`} style={{ letterSpacing: 0 }}>
              KA
            </span>
            <span className={`${T.small} font-semibold text-ink`}>kwabena.design</span>
          </div>
          <Art img={img} />
          <div className="flex items-center gap-[3mm] px-[3mm] py-[2.5mm]">
            <span className="h-[1.6mm] w-[10mm] rounded-full bg-ink/15" />
            <span className="h-[1.6mm] w-[6mm] rounded-full bg-ink/10" />
          </div>
        </div>
        <span className="absolute top-[1.6%] left-1/2 h-[2.2%] w-[28%] -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  );
}

/** Product on a pedestal with a floor reflection. */
export function Pedestal({ img, width = "92mm", tone }: { img: Img; width?: string; tone: string }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[1.5mm]" style={{ background: `radial-gradient(70% 60% at 50% 35%, #ffffff, ${tone} 78%)` }}>
      <div className="relative shadow-[0_14mm_20mm_-10mm_rgba(0,0,0,.5)]" style={{ width }}>
        <Art img={img} />
      </div>
      <div className="relative h-[22mm] overflow-hidden opacity-30 [mask-image:linear-gradient(#000,transparent_80%)]" style={{ width }}>
        <div className="-scale-y-100">
          <Art img={img} />
        </div>
      </div>
    </div>
  );
}

/** Logo or identity on a dark, warmly lit wall. */
export function Lightbox({ img, width = "150mm" }: { img: Img; width?: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[1.5mm] bg-[radial-gradient(60%_60%_at_50%_42%,#2a2418,#0b0a08_78%)]">
      <div className="relative overflow-hidden rounded-[1mm] shadow-[0_0_30mm_-4mm_rgba(236,204,112,.4)] ring-1 ring-white/10" style={{ width }}>
        <Art img={img} />
      </div>
    </div>
  );
}

/** Two-sided business card: front and back laid on a dark surface (source holds front above back). */
export function CardPair({ img, cardW = "118mm" }: { img: Img; cardW?: string }) {
  const face = (pos: "top" | "bottom", cls: string) => (
    <span
      className={`absolute aspect-[1.72/1] rounded-[3mm] bg-no-repeat shadow-[0_10mm_18mm_-8mm_rgba(0,0,0,.7)] ${cls}`}
      style={{ width: cardW, backgroundImage: `url(${img.src})`, backgroundSize: "104% auto", backgroundPosition: `center ${pos === "top" ? "1%" : "99%"}` }}
    />
  );
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[1.5mm] bg-[radial-gradient(70%_60%_at_50%_40%,#2b2519,#0d0b08_78%)]">
      {face("bottom", "top-[14%] left-[30%] rotate-[8deg]")}
      {face("top", "top-[40%] left-[8%] -rotate-[5deg]")}
      <span className="sr-only">{img.alt}</span>
    </div>
  );
}

/* ----------------------------- Charts ----------------------------- */

export function BarChart({ data, max, color = "#1B2540", dark }: { data: { label: string; value: number }[]; max: number; color?: string; dark?: boolean }) {
  return (
    <div className="space-y-[2.6mm]">
      {data.map((d) => (
        <div key={d.label} className="grid grid-cols-[34mm_1fr_8mm] items-center gap-[3mm]">
          <span className={`${T.small} ${dark ? "text-ivory/80" : "text-ink/80"}`}>{d.label}</span>
          <span className={`relative h-[3.2mm] overflow-hidden rounded-full ${dark ? "bg-ivory/10" : "bg-ink/8"}`}>
            <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${(d.value / max) * 100}%`, backgroundColor: color }} />
          </span>
          <span className={`${T.small} text-right font-semibold`}>{d.value}</span>
        </div>
      ))}
    </div>
  );
}

/** Donut chart for proportions. */
export function Donut({ data, size = 46 }: { data: { label: string; value: number; color: string }[]; size?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const R = 16;
  const C = 2 * Math.PI * R;
  const lens = data.map((d) => (d.value / total) * C);
  const offsets = lens.map((_, i) => lens.slice(0, i).reduce((s, x) => s + x, 0));
  return (
    <svg viewBox="0 0 40 40" style={{ width: `${size}mm`, height: `${size}mm` }} aria-hidden>
      <circle cx="20" cy="20" r={R} fill="none" stroke="rgba(23,23,23,.06)" strokeWidth="6" />
      {data.map((d, i) => (
        <circle key={d.label} cx="20" cy="20" r={R} fill="none" stroke={d.color} strokeWidth="6" strokeDasharray={`${lens[i] - 0.4} ${C - lens[i] + 0.4}`} strokeDashoffset={-offsets[i]} transform="rotate(-90 20 20)" />
      ))}
    </svg>
  );
}
