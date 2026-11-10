import type { Metadata } from "next";
import Image from "next/image";
import QRCode from "qrcode";
import { education, profile } from "@/data/profile";
import { projects, type Project } from "@/data/projects";
import { logos } from "@/data/logos";
import { skillTree } from "@/data/skills";
import { curriculum } from "@/data/curriculum";
import { process, services } from "@/data/services";
import { Lightbox, Pedestal, Phone, PosterWall, CardPair, BarChart, Donut } from "@/components/print/kit";

/**
 * Print-ready 35-page Profile & Portfolio (A4 landscape).
 * Rendered to PDF by `npm run pdf` → public/kwabena-acheampong-portfolio.pdf
 */
export const metadata: Metadata = {
  title: "Profile & Portfolio (print)",
  robots: { index: false, follow: false },
};

const TOTAL = 35;
const P = (slug: string) => projects.find((p) => p.slug === slug)!;
const CLIENT = projects.filter((p) => p.kind === "Client");
const ACADEMIC = projects.filter((p) => p.kind === "Academic");

/** Fit an image inside a box (mm), keeping its aspect ratio. */
function fit(img: { width: number; height: number }, maxW: number, maxH: number) {
  const ar = img.width / img.height;
  let w = maxW;
  let h = w / ar;
  if (h > maxH) {
    h = maxH;
    w = h * ar;
  }
  return { width: `${w}mm`, height: `${h}mm` };
}

const css = `
@page { size: 297mm 210mm; margin: 0; }
[data-chrome], .loader { display: none !important; }
.grain::after { display: none !important; }
html, body { background: #d9d4c8 !important; }
@media print { html, body { background: #f5f2eb !important; } .sheets { gap: 0 !important; padding: 0 !important; } .sheet { box-shadow: none !important; } }
.sheet { width: 297mm; height: 210mm; position: relative; overflow: hidden; break-after: page; page-break-after: always;
  -webkit-print-color-adjust: exact; print-color-adjust: exact; font-size: 9.5pt; line-height: 1.5; }
.sheet:last-child { break-after: auto; page-break-after: auto; }
.dots { background-image: radial-gradient(circle at center, currentColor 0 34%, transparent 35%); background-size: 5mm 5mm; }
`;

export default async function PrintPortfolio() {
  const url = profile.siteUrl.replace(/^https?:\/\//, "");
  const qr = await QRCode.toString(profile.siteUrl, { type: "svg", margin: 0, color: { dark: "#1B2540", light: "#0000" } });

  return (
    <>
      <style>{css}</style>
      <div className="sheets flex flex-col items-center gap-10 py-10">
        <Cover />
        <Contents />
        <Profile />
        <Glance />
        <EducationSheet />
        <Expertise />
        <ServicesSheet />

        <Opener n={8} num="06" title="Client" accent="work." items={CLIENT} first={9} intro="Nine commissions for real businesses and families in Ghana: gold traders, food brands, a salon, a soap maker, a festival and a wedding. Each brief came with a real audience and a real budget." />
        <IdentitySheet p={P("chris-gold-buying-agent")} n={9} chapter="06 · Client work · Brand identity" />
        <InContext p={P("chris-gold-buying-agent")} n={10} chapter="06 · Client work · Brand applications" left={<ApplicationsPanel p={P("chris-gold-buying-agent")} />} />
        <BrandPair p={P("clichy-gold-agent")} n={11} chapter="06 · Client work · Brand system" />
        <InContext p={P("clichy-gold-agent")} n={12} chapter="06 · Client work · In context" left={<DuoPanel a={<Phone img={img(P("clichy-gold-agent"))} width="64mm" tone="#3a2c12" />} b={<CardPair img={pieceImg(P("clichy-gold-agent"), 0)} cardW="68mm" />} ca="Social advert in the feed" cb="Business card, front and back" />} />
        <CaseFull p={P("nhyira-flour")} n={13} chapter="06 · Client work · Packaging" />
        <CaseFull p={P("fans-liquid-soap")} n={14} chapter="06 · Client work · Packaging" />
        <BrandPair p={P("royal-chop-delicacies")} n={15} chapter="06 · Client work · Food brand campaign" />
        <InContext p={P("royal-chop-delicacies")} n={16} chapter="06 · Client work · In context" left={<DuoPanel a={<PosterWall img={img(P("royal-chop-delicacies"))} width="74mm" />} b={<Phone img={pieceImg(P("royal-chop-delicacies"), 0)} width="62mm" tone={P("royal-chop-delicacies").tone} />} ca="Flyer framed on a wall" cb="Offer post in the feed" />} />
        <CaseFull p={P("gifty-beauty-salon")} n={17} chapter="06 · Client work · Beauty advertising" />
        <CaseFull p={P("highlife-brownies")} n={18} chapter="06 · Client work · Food advertising" />
        <CaseFull p={P("kelewele-fest-26")} n={19} chapter="06 · Client work · Event campaign" />
        <CaseFull p={P("wedding-naming-invitation")} n={20} chapter="06 · Client work · Event stationery" />
        <LogoWall n={21} />
        <LogoStudy n={22} />

        <Opener n={23} num="08" title="Academic" accent="work." items={ACADEMIC} first={24} light intro="Seven projects from the B.Tech and HND studios at Takoradi Technical University: packaging, advertising, national campaigns and tourism. This is where the method behind the client work was trained." />
        <CaseFull p={P("cherrys-sobolo")} n={24} chapter="08 · Academic work · Packaging" />
        <InContext p={P("cherrys-sobolo")} n={25} chapter="08 · Academic work · In context" left={<MockPanel p={P("cherrys-sobolo")} />} />
        <CaseFull p={P("aj-lingerie-and-beads")} n={26} chapter="08 · Academic work · Advertising" />
        <CaseFull p={P("silver-package")} n={27} chapter="08 · Academic work · Advertising" />
        <CaseFull p={P("jeysicles-ice-cream")} n={28} chapter="08 · Academic work · Advertising" />
        <CaseFull p={P("independence-weekend")} n={29} chapter="08 · Academic work · Tourism campaign" />
        <CaseFull p={P("ghana-independence-day")} n={30} chapter="08 · Academic work · National campaign" />
        <CaseFull p={P("ttu-src-week")} n={31} chapter="08 · Academic work · Event campaign" />

        <XRaySheet n={32} items={[P("kelewele-fest-26"), P("nhyira-flour")]} />
        <Impact n={33} />
        <Vision />
        <Contact qr={qr} url={url} />
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
function Sheet({ n, children, className = "", dark = false, footDark, chapter }: { n: number; children: React.ReactNode; className?: string; dark?: boolean; footDark?: boolean; chapter?: string }) {
  const fd = footDark ?? dark;
  return (
    <section className={`sheet shadow-2xl ${dark ? "bg-navy text-ivory" : "bg-ivory text-ink"} ${className}`}>
      {children}
      <footer className={`absolute inset-x-[14mm] bottom-[7mm] flex items-center justify-between font-mono text-[6.5pt] tracking-[0.16em] uppercase ${fd ? "text-ivory/55" : "text-muted"}`}>
        <span>Kwabena Acheampong · Profile & Portfolio</span>
        {chapter && <span className="hidden">{chapter}</span>}
        <span>
          <span className={fd ? "text-ivory" : "text-ink"}>{String(n).padStart(2, "0")}</span> / {TOTAL}
        </span>
      </footer>
    </section>
  );
}

function Chapter({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p className={`font-mono text-[7pt] tracking-[0.16em] uppercase ${dark ? "text-ivory/60" : "text-muted"}`}>
      <span className="mr-[2mm] inline-block size-[2mm] rounded-full bg-signal align-middle" />
      {children}
    </p>
  );
}

function Serif({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`font-serif font-normal italic tracking-[-0.01em] ${className}`}>{children}</span>;
}

function Palette({ colors, h = "6mm" }: { colors: string[]; h?: string }) {
  return (
    <div className="flex overflow-hidden rounded-[1mm]" style={{ height: h }}>
      {colors.map((c) => (
        <div key={c} className="flex flex-1 items-end p-[1mm]" style={{ backgroundColor: c }}>
          <span className="rounded-[0.5mm] bg-black/35 px-[0.8mm] font-mono text-[5pt] text-white">{c}</span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 01 · Cover                                                          */
/* ------------------------------------------------------------------ */
function Cover() {
  return (
    <Sheet n={1} dark>
      <div className="absolute inset-y-0 left-0 flex w-[178mm] flex-col justify-between p-[16mm] pb-[18mm]">
        <div className="flex items-center justify-between">
          <span className="relative block h-[11mm] w-[19mm]">
            <Image src="/images/brand/ka-mark-light.png" alt="Kwabena Acheampong logo" fill unoptimized loading="eager" className="object-contain object-left" />
          </span>
          <span className="font-mono text-[7pt] tracking-[0.18em] text-ivory/70 uppercase">Profile & Portfolio · 2026</span>
        </div>

        <div>
          <p className="font-mono text-[7.5pt] tracking-[0.18em] text-ivory/70 uppercase">
            <span className="mr-[2mm] inline-block h-px w-[8mm] bg-signal align-middle" />
            {profile.label}
          </p>
          <h1 className="mt-[8mm] leading-[0.88] font-semibold tracking-[-0.05em]">
            <Serif className="block text-[60pt] text-sand">Kwabena</Serif>
            <span className="block text-[64pt]">Acheampong</span>
          </h1>
          <p className="mt-[8mm] text-[15pt] leading-snug font-medium tracking-[-0.02em]">{profile.title}</p>
          <p className="mt-[3mm] max-w-[128mm] text-[10pt] leading-relaxed text-ivory/75">{profile.statement}</p>
        </div>

        <div className="flex items-end justify-between gap-[6mm] border-t border-ivory/20 pt-[5mm]">
          {["Visual identity", "Advertising", "Packaging", "Campaign design"].map((d, i) => (
            <div key={d}>
              <p className="font-mono text-[6.5pt] text-signal">0{i + 1}</p>
              <p className="text-[9.5pt] font-medium">{d}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-y-0 right-0 w-[119mm]">
        <Image src="/images/portrait/kwabena-graduation-navy.jpg" alt="Kwabena Acheampong" fill unoptimized loading="eager" className="object-cover object-[50%_22%]" />
        <div className="dots absolute inset-y-0 left-[-1mm] w-[17mm] text-navy" />
        <div className="absolute inset-y-0 left-[-1mm] w-[9mm] bg-navy" />
        <div className="absolute right-[10mm] bottom-[20mm] grid size-[30mm] place-items-center rounded-full bg-signal-deep text-center text-ivory shadow-2xl">
          <span className="font-mono text-[6pt] leading-snug tracking-[0.14em] uppercase">
            B.Tech
            <br />
            <Serif className="text-[10pt] tracking-normal normal-case">Advertising & Packaging</Serif>
          </span>
        </div>
      </div>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */
/* 02 · Profile                                                        */
/* ------------------------------------------------------------------ */
function Profile() {
  const stats = [
    ["16", "case studies", "9 client commissions · 7 academic projects"],
    ["12", "brands", "food, beauty, gold trade, FMCG, music & community"],
    ["5", "logos", "identities designed from mark to merchandise"],
    [`${profile.experienceYears}+`, "years", "of professional practice, after five years of study"],
  ];
  const facts: [string, string][] = [
    ["Discipline", "Graphic Design: Advertising & Packaging"],
    ["Education", "B.Tech Graphic Design · HND Commercial Arts"],
    ["Training", "Five years of studio study incl. industrial attachments"],
    ["Focus", "Identity · Advertising · Packaging · Campaigns"],
    ["Based in", profile.location],
  ];
  if (profile.languages.length) facts.push(["Languages", profile.languages.join(", ")]);
  if (profile.tools.length) facts.push(["Tools", profile.tools.join(", ")]);

  return (
    <Sheet n={3}>
      <div className="dots absolute -top-[10mm] -right-[10mm] size-[60mm] text-ochre/30" />
      <div className="grid h-full grid-cols-[150mm_1fr] gap-[14mm] p-[14mm] pb-[18mm]">
        <div className="flex flex-col">
          <Chapter>01 · Profile</Chapter>
          <h2 className="mt-[7mm] text-[30pt] leading-[1.02] font-semibold tracking-[-0.045em]">
            I create <Serif className="text-navy">meaningful</Serif> visual identities and compelling design experiences that help ideas
            become recognizable, <Serif className="text-navy">memorable</Serif> <span className="text-signal-deep">brands.</span>
          </h2>
          <div className="mt-auto grid grid-cols-2 gap-px border border-ink/12 bg-ink/12">
            {stats.map(([n, u, t]) => (
              <div key={u} className="bg-ivory p-[5mm]">
                <p className="text-[34pt] leading-none font-semibold tracking-[-0.05em] text-navy">
                  {n}
                  <Serif className="ml-[2mm] text-[14pt] text-ink">{u}</Serif>
                </p>
                <p className="mt-[2mm] text-[8pt] text-muted">{t}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="relative mb-[6mm] h-[44mm] overflow-hidden">
            <Image src="/images/portrait/kwabena-graduation-bw.jpg" alt="" fill unoptimized loading="eager" className="object-cover object-[50%_28%] grayscale" />
          </div>
          <p className="text-[12pt] leading-snug font-semibold tracking-[-0.02em]">
            I&apos;m Kwabena Acheampong, a graphic designer with a foundation in advertising and packaging design.
          </p>
          <p className="mt-[3mm] text-[8.5pt] leading-relaxed text-ink/80">
            My creative interests sit at the intersection of visual communication, brand identity and advertising. I explore how typography,
            colour, imagery and composition work together to communicate an idea and create a memorable impression. I combine creative
            exploration with purposeful communication.
          </p>
          <p className="mt-[3mm] border-l-2 border-signal pl-[3mm] font-serif text-[11pt] leading-snug text-navy italic">
            Good design should not only look beautiful. It should communicate clearly, connect with people and give ideas a recognizable
            visual presence.
          </p>
          <dl className="mt-auto divide-y divide-ink/10 border-y border-ink/15">
            {facts.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[22mm_1fr] gap-[3mm] py-[1.6mm] text-[8pt]">
                <dt className="text-muted">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */
/* 03 · Education & training                                           */
/* ------------------------------------------------------------------ */
function EducationSheet() {
  return (
    <Sheet n={5} className="bg-sand/60">
      <div className="grid h-full grid-cols-[112mm_1fr] gap-[14mm] p-[14mm] pb-[18mm]">
        <div className="flex flex-col">
          <Chapter>03 · Education & training</Chapter>
          <h2 className="mt-[7mm] text-[32pt] leading-[0.98] font-semibold tracking-[-0.045em]">
            Five years of <Serif className="text-navy">studio</Serif> training.
          </h2>
          <ol className="mt-[9mm] space-y-[7mm] border-l border-ink/25 pl-[7mm]">
            {education.map((e, i) => (
              <li key={e.award} className="relative">
                <span className={`absolute top-[1mm] -left-[9.1mm] size-[4mm] rounded-full border-[0.8mm] border-sand ${i === 0 ? "bg-signal" : "bg-navy"}`} />
                <p className="font-mono text-[7.5pt] text-muted">{e.years}</p>
                <p className="mt-[1mm] text-[16pt] leading-tight font-semibold tracking-[-0.03em]">{e.award}</p>
                <Serif className="block text-[12pt] leading-snug text-navy">{e.field}</Serif>
                <p className="mt-[1mm] text-[8pt] font-semibold">{e.institution}</p>
                <p className="mt-[1.5mm] text-[8pt] leading-relaxed text-ink/75">{e.notes}</p>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <p className="font-mono text-[7pt] tracking-[0.16em] text-muted uppercase">Areas of study: what the training covered</p>
          <div className="mt-[5mm] grid grid-cols-2 gap-[3mm]">
            {curriculum.map((c, i) => (
              <div key={c.pillar} className={`bg-ivory/85 p-[4mm] ${i === curriculum.length - 1 ? "col-span-2" : ""}`}>
                <div className="flex items-baseline justify-between">
                  <p className="text-[10.5pt] font-semibold tracking-[-0.02em]">{c.pillar}</p>
                  <span className="font-mono text-[6.5pt] text-signal-deep">{String(c.courses.length).padStart(2, "0")}</span>
                </div>
                <ul className="mt-[2mm] flex flex-wrap gap-[1.2mm]">
                  {c.courses.map((course) => (
                    <li key={course} className="rounded-full border border-ink/15 px-[2mm] py-[0.4mm] text-[6.8pt]">
                      {course}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */
/* 04 · Expertise (evidence-based skill map)                           */
/* ------------------------------------------------------------------ */
function Expertise() {
  return (
    <Sheet n={6}>
      <div className="flex h-full flex-col p-[14mm] pb-[18mm]">
        <div className="flex items-end justify-between gap-[10mm]">
          <div>
            <Chapter>04 · Expertise</Chapter>
            <h2 className="mt-[6mm] text-[30pt] leading-[0.98] font-semibold tracking-[-0.045em]">
              Skills, <Serif className="text-navy">proven</Serif> in the work.
            </h2>
          </div>
          <p className="max-w-[92mm] text-[8.5pt] leading-relaxed text-ink/75">
            An evidence-based map: every skill is linked to the portfolio pieces that demonstrate it and the coursework that trained it. There are no
            self-rated percentages.
          </p>
        </div>

        <div className="mt-[8mm] grid flex-1 grid-cols-4 gap-[4mm]">
          {skillTree.map((b) => (
            <div key={b.id} className="flex flex-col border-t-2 border-navy pt-[3mm]">
              <div className="flex items-center gap-[2mm]">
                <span className="grid size-[7mm] place-items-center rounded-full bg-navy font-serif text-[9pt] text-ivory italic">{b.glyph}</span>
                <p className="text-[10pt] font-semibold tracking-[-0.02em]">{b.name}</p>
              </div>
              <ul className="mt-[3mm] flex flex-1 flex-col gap-[2.6mm]">
                {b.skills.map((s) => (
                  <li key={s.id}>
                    <p className="text-[8.8pt] font-semibold tracking-[-0.01em]">{s.name}</p>
                    <p className="mt-[0.3mm] text-[6.9pt] leading-snug text-ink/70">{s.description}</p>
                    <div className="mt-[2mm] flex gap-[1.5mm]">
                      {s.projects.length ? (
                        s.projects.slice(0, 4).map((slug) => {
                          const pr = P(slug);
                          return (
                            <span key={slug} className="relative block size-[9mm] overflow-hidden rounded-[0.6mm] ring-1 ring-ink/10" style={{ backgroundColor: pr.tone }}>
                              <Image src={pr.image.src} alt="" fill unoptimized loading="eager" className="object-cover" />
                            </span>
                          );
                        })
                      ) : (
                        <span className="rounded-full bg-ivory-deep px-[2mm] py-[0.5mm] text-[6.5pt] text-muted">Coursework & studio practice</span>
                      )}
                    </div>
                    <p className="mt-[1mm] text-[6.1pt] leading-snug text-muted"><span className="font-semibold text-ink/70">Trained:</span> {s.courses.join(" · ")}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */
/* 05 · Services & process                                             */
/* ------------------------------------------------------------------ */
const SEEN_IN: Record<string, string[]> = {
  "01": ["chris-gold-buying-agent", "clichy-gold-agent", "kelewele-fest-26"],
  "02": ["clichy-gold-agent", "royal-chop-delicacies", "ghana-independence-day"],
  "03": ["gifty-beauty-salon", "highlife-brownies", "royal-chop-delicacies"],
  "04": ["nhyira-flour", "fans-liquid-soap", "cherrys-sobolo"],
};

function ServicesSheet() {
  return (
    <Sheet n={7} footDark>
      <div className="flex h-[128mm] flex-col p-[14mm] pb-[6mm]">
        <div className="flex items-end justify-between">
          <div>
            <Chapter>05 · Services & process</Chapter>
            <h2 className="mt-[6mm] text-[30pt] leading-[0.98] font-semibold tracking-[-0.045em]">
              What I can help you <Serif className="text-navy">build.</Serif>
            </h2>
          </div>
          <p className="max-w-[86mm] text-[8.5pt] leading-relaxed text-ink/75">
            Four connected disciplines, grounded in formal training in advertising, packaging and corporate identity. Each can stand alone or
            work as one brand system.
          </p>
        </div>
        <div className="mt-[7mm] grid flex-1 grid-cols-4 gap-px border border-ink/12 bg-ink/12">
          {services.map((s) => (
            <div key={s.index} className="flex flex-col bg-ivory p-[4.5mm]">
              <span className="font-mono text-[7pt] text-signal-deep">{s.index}</span>
              <p className="mt-[2mm] text-[12.5pt] leading-tight font-semibold tracking-[-0.025em]">{s.title}</p>
              <Serif className="mt-[1.5mm] block text-[9pt] leading-snug text-navy">{s.lede}</Serif>
              <ul className="mt-[4mm] space-y-[0.8mm]">
                {s.items.map((it) => (
                  <li key={it} className="flex items-center gap-[1.5mm] text-[7.5pt]">
                    <span className="size-[1.2mm] rounded-full bg-signal" />
                    {it}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-[3mm]">
                <p className="font-mono text-[6pt] tracking-[0.14em] text-muted uppercase">Seen in</p>
                <div className="mt-[1.5mm] flex gap-[1.5mm]">
                  {SEEN_IN[s.index].map((slug) => {
                    const pr = P(slug);
                    return (
                      <span key={slug} className="relative block size-[12mm] overflow-hidden rounded-[0.6mm] ring-1 ring-ink/10" style={{ backgroundColor: pr.tone }}>
                        <Image src={pr.image.src} alt="" fill unoptimized loading="eager" className="object-cover" />
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[82mm] bg-navy px-[14mm] pt-[8mm] text-ivory">
        <p className="text-[18pt] font-semibold tracking-[-0.035em]">
          From the first idea to the final <Serif>visual.</Serif>
        </p>
        <ol className="relative mt-[7mm] grid grid-cols-4 gap-[6mm]">
          <span className="absolute top-[3.5mm] left-0 h-px w-full bg-ivory/35" />
          {process.map((st) => (
            <li key={st.index} className="relative">
              <span className="relative grid size-[7mm] place-items-center rounded-full border border-ivory/60 bg-navy font-mono text-[6.5pt]">{st.index}</span>
              <p className="mt-[3.5mm] text-[14pt] font-semibold tracking-[-0.03em]">{st.title}</p>
              <p className="mt-[1mm] text-[8pt] leading-snug text-ivory/75">{st.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */
/* Case study: full page                                              */
/* ------------------------------------------------------------------ */
function CaseFull({ p, n, chapter }: { p: Project; n: number; chapter: string }) {
  return (
    <Sheet n={n}>
      <div className="absolute inset-y-0 left-0 flex w-[168mm] items-center justify-center" style={{ backgroundColor: p.tone }}>
        <div className="relative shadow-[0_20mm_30mm_-14mm_rgba(0,0,0,0.45)]" style={fit(p.image, 136, 166)}>
          <Image src={p.image.src} alt={p.alt} fill unoptimized loading="eager" className="object-contain" />
        </div>
        <span className="absolute top-[10mm] left-[12mm] font-mono text-[7pt] tracking-[0.16em] text-ink/60 uppercase">Project {p.index} / 16</span>
      </div>

      <div className="absolute inset-y-0 right-0 flex w-[129mm] flex-col p-[12mm] pb-[16mm]">
        <Chapter>{chapter}</Chapter>
        <h2 className="mt-[5mm] text-[26pt] leading-none font-semibold tracking-[-0.045em]">{p.title}</h2>
        <p className="mt-[1.5mm] text-[8pt] text-muted">{p.category} · {p.brand}</p>
        <p className="mt-[4mm] text-[8.5pt] leading-relaxed text-ink/80">{p.overview}</p>
        <p className="mt-[4mm] border-l-2 border-signal pl-[3mm] font-serif text-[11pt] leading-snug text-navy italic">{p.objective}</p>
        <p className="mt-[4mm] font-mono text-[6.5pt] tracking-[0.16em] text-muted uppercase">Design approach</p>
        <ol className="mt-[1.5mm] space-y-[1.5mm]">
          {p.approach.map((a, i) => (
            <li key={i} className="grid grid-cols-[5mm_1fr] text-[7.4pt] leading-snug text-ink/80">
              <span className="font-mono text-signal-deep">0{i + 1}</span>
              {a}
            </li>
          ))}
        </ol>
        <div className="mt-auto grid grid-cols-2 gap-[3mm] pt-[4mm]">
          {p.details.map((d) => (
            <div key={d.src} className="flex h-[22mm] items-center justify-center p-[2mm]" style={{ backgroundColor: p.tone }}>
              <div className="relative h-full w-full">
                <Image src={d.src} alt={d.alt} fill unoptimized loading="eager" className="object-contain" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-[3mm]">
          <Palette colors={p.palette} />
        </div>
        <p className="mt-[2.5mm] text-[7pt] text-muted">
          <span className="font-semibold text-ink">Deliverables:</span> {p.deliverables.join(" · ")}
        </p>
      </div>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */
/* Client identity: logo + applications                               */
/* ------------------------------------------------------------------ */
function IdentitySheet({ p, n, chapter }: { p: Project; n: number; chapter: string }) {
  const merch = p.pieces?.[0];
  return (
    <Sheet n={n} dark>
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_30%_30%,#2a2418,#0b0a08_75%)]" />
      <div className="relative grid h-full grid-cols-[1fr_100mm] gap-[10mm] p-[14mm] pb-[18mm]">
        <div className="flex flex-col">
          <Chapter dark>{chapter}</Chapter>
          <div className="relative mt-[6mm] h-[64mm] shadow-[0_0_40mm_-6mm_rgba(236,204,112,.35)]">
            <Image src={p.image.src} alt={p.alt} fill unoptimized loading="eager" className="object-contain" />
          </div>
          {merch && (
            <div className="relative mt-[6mm] flex-1 overflow-hidden rounded-[1.5mm] ring-1 ring-ivory/10">
              <Image src={merch.src} alt={merch.alt} fill unoptimized loading="eager" className="object-cover" />
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <p className="font-mono text-[7pt] tracking-[0.16em] text-ivory/60 uppercase">Project {p.index} / 16 · Client work</p>
          <h2 className="mt-[3mm] text-[26pt] leading-[0.95] font-semibold tracking-[-0.045em]">{p.title}</h2>
          <p className="mt-[2mm] text-[8pt] text-ivory/60">{p.category}</p>
          <p className="mt-[4mm] text-[8.3pt] leading-relaxed text-ivory/80">{p.overview}</p>
          <p className="mt-[4mm] border-l-2 border-signal pl-[3mm] font-serif text-[11pt] leading-snug text-sand italic">{p.objective}</p>
          <ol className="mt-[4mm] space-y-[1.5mm]">
            {p.approach.slice(0, 3).map((a, i) => (
              <li key={i} className="grid grid-cols-[5mm_1fr] text-[7.4pt] leading-snug text-ivory/75">
                <span className="font-mono text-signal">0{i + 1}</span>
                {a}
              </li>
            ))}
          </ol>
          <div className="mt-auto">
            <Palette colors={p.palette} h="5mm" />
            <p className="mt-[2.5mm] text-[7pt] text-ivory/60">
              <span className="font-semibold text-ivory">Deliverables:</span> {p.deliverables.join(" · ")}
            </p>
          </div>
        </div>
      </div>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */
/* One brand, two pieces (each shown individually)                     */
/* ------------------------------------------------------------------ */
function BrandPair({ p, n, chapter }: { p: Project; n: number; chapter: string }) {
  const pieces = [{ src: p.image.src, width: p.image.width, height: p.image.height, alt: p.alt, title: "Hero piece" }, ...(p.pieces ?? [])];
  return (
    <Sheet n={n}>
      <div className="grid h-full grid-cols-[1fr_92mm] gap-[9mm] p-[14mm] pb-[16mm]">
        <div className="flex flex-col">
          <Chapter>{chapter}</Chapter>
          <div className="mt-[5mm] grid flex-1 grid-cols-2 gap-[4mm]">
            {pieces.slice(0, 2).map((pc) => (
              <figure key={pc.src} className="flex flex-col">
                <div className="flex flex-1 items-center justify-center rounded-[1.5mm] p-[5mm]" style={{ backgroundColor: p.tone }}>
                  <div className="relative w-full shadow-[0_12mm_20mm_-10mm_rgba(0,0,0,0.5)]" style={{ aspectRatio: `${pc.width}/${pc.height}`, maxHeight: "128mm" }}>
                    <Image src={pc.src} alt={pc.alt} fill unoptimized loading="eager" className="object-contain" />
                  </div>
                </div>
                <figcaption className="mt-[2mm] text-[7pt] text-muted">{pc.title}</figcaption>
              </figure>
            ))}
          </div>
        </div>
        <div className="flex flex-col pt-[9mm]">
          <p className="font-mono text-[7pt] tracking-[0.16em] text-muted uppercase">Project {p.index} / 16 · Client work</p>
          <h2 className="mt-[3mm] text-[24pt] leading-[0.95] font-semibold tracking-[-0.045em]">{p.title}</h2>
          <p className="mt-[2mm] text-[8pt] text-muted">{p.category}</p>
          <p className="mt-[4mm] text-[8.2pt] leading-relaxed text-ink/80">{p.overview}</p>
          <p className="mt-[3.5mm] border-l-2 border-signal pl-[3mm] font-serif text-[10.5pt] leading-snug text-navy italic">{p.objective}</p>
          <ol className="mt-[3.5mm] space-y-[1.4mm]">
            {p.approach.slice(0, 3).map((a, i) => (
              <li key={i} className="grid grid-cols-[5mm_1fr] text-[7.2pt] leading-snug text-ink/75">
                <span className="font-mono text-signal-deep">0{i + 1}</span>
                {a}
              </li>
            ))}
          </ol>
          <div className="mt-auto">
            <Palette colors={p.palette} h="5mm" />
            <p className="mt-[2.5mm] text-[7pt] text-muted">
              <span className="font-semibold text-ink">Deliverables:</span> {p.deliverables.join(" · ")}
            </p>
          </div>
        </div>
      </div>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */
/* Logo wall                                                           */
/* ------------------------------------------------------------------ */
function LogoWall({ n }: { n: number }) {
  return (
    <Sheet n={n} dark>
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_80%_20%,#2a3761,#1b2540_70%)]" />
      <div className="relative flex h-full flex-col p-[14mm] pb-[18mm]">
        <div className="flex items-end justify-between gap-[10mm]">
          <div>
            <Chapter dark>07 · Logo design</Chapter>
            <h2 className="mt-[5mm] text-[30pt] leading-[0.98] font-semibold tracking-[-0.045em]">
              Marks that <Serif className="text-sand">stay.</Serif>
            </h2>
          </div>
          <p className="max-w-[110mm] text-[8.5pt] leading-relaxed text-ivory/75">
            Five logos for clients in gold trading, community, food, celebration and music. Each is built around one ownable symbol and tested
            for legibility from favicon to signage.
          </p>
        </div>
        <div className="mt-[8mm] grid flex-1 grid-cols-5 gap-[4mm]">
          {logos.map((l) => (
            <figure key={l.slug} className="flex flex-col">
              <div className="relative aspect-square overflow-hidden rounded-[1.5mm] ring-1 ring-ivory/10" style={{ backgroundColor: l.ground }}>
                <Image src={l.src} alt={l.alt} fill unoptimized loading="eager" className="object-contain" />
              </div>
              <figcaption className="mt-[3mm]">
                <p className="text-[10pt] leading-tight font-semibold tracking-[-0.02em]">{l.name}</p>
                <p className="mt-[1.5mm] text-[7pt] leading-snug text-ivory/70">{l.concept}</p>
                <div className="mt-[2.5mm] flex h-[2.5mm] overflow-hidden rounded-full">
                  {l.palette.map((c) => (
                    <span key={c} className="flex-1" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */
/* 10 · Vision & contact                                               */
/* ------------------------------------------------------------------ */
const DIRECTIONS = [
  {
    t: "Living identity systems",
    d: "Identities designed as flexible systems: marks, colour and type that move across print, packaging, social and motion while staying recognizable at every size.",
  },
  {
    t: "Purposeful, connected packaging",
    d: "Packaging that informs as well as sells: clearer label hierarchy, material-conscious choices and connected labels (QR) that link a product to its story.",
  },
  {
    t: "Interactive, playful campaigns",
    d: "Turning audiences into participants. This portfolio's companion website is a working example, with Design X-Ray annotations, in-context mockups, colour search, a Logo Lab and a gamified Studio Archive.",
  },
  {
    t: "Culture-rooted, globally legible",
    d: "Bringing Ghanaian colour, celebration and visual culture into contemporary design that reads clearly to international audiences.",
  },
];

const OPEN_TO = [
  "Brand identity & strategy projects",
  "Packaging & product launches",
  "Campaign, event & social graphics",
  "Design roles & internships",
  "Postgraduate study opportunities",
];


/* ------------------------------------------------------------------ */
/* Helpers for mockups                                                 */
/* ------------------------------------------------------------------ */
const img = (p: Project) => ({ ...p.image, alt: p.alt });
const pieceImg = (p: Project, i: number) => {
  const pc = p.pieces![i];
  return { src: pc.src, width: pc.width, height: pc.height, alt: pc.alt };
};

/* ------------------------------------------------------------------ */
/* 02 · Contents                                                       */
/* ------------------------------------------------------------------ */
const CONTENTS: [string, string, string][] = [
  ["01", "Profile", "03"],
  ["02", "At a glance", "04"],
  ["03", "Education & training", "05"],
  ["04", "Expertise", "06"],
  ["05", "Services & process", "07"],
  ["06", "Client work", "08 to 20"],
  ["07", "Logo design", "21 to 22"],
  ["08", "Academic work", "23 to 31"],
  ["09", "Design X-Ray", "32"],
  ["10", "Community impact", "33"],
  ["11", "Vision", "34"],
  ["12", "Contact", "35"],
];

function Contents() {
  return (
    <Sheet n={2}>
      <div className="grid h-full grid-cols-[110mm_1fr]">
        <div className="relative flex flex-col justify-between overflow-hidden bg-navy p-[14mm] pb-[18mm] text-ivory">
          <div className="dots absolute -right-[14mm] -bottom-[14mm] size-[70mm] text-ivory/[0.07]" />
          <Chapter dark>Contents</Chapter>
          <div>
            <h2 className="text-[44pt] leading-[0.92] font-semibold tracking-[-0.05em]">
              Inside this <Serif className="text-sand">portfolio.</Serif>
            </h2>
            <p className="mt-[5mm] max-w-[80mm] text-[9pt] leading-relaxed text-ivory/75">
              Thirty-five pages: who I am and how I was trained, then sixteen case studies, nine for real clients and seven from university, each shown at full size.
            </p>
          </div>
          <div className="grid grid-cols-8 gap-[1.6mm]">
            {projects.map((p) => (
              <span key={p.slug} className="relative block aspect-square overflow-hidden rounded-[0.6mm]" style={{ backgroundColor: p.tone }}>
                <Image src={p.image.src} alt="" fill unoptimized loading="eager" className="object-cover" />
              </span>
            ))}
          </div>
        </div>
        <ol className="flex flex-col justify-center px-[16mm] pb-[10mm]">
          {CONTENTS.map(([num, name, pg]) => (
            <li key={num} className="grid grid-cols-[12mm_1fr_auto] items-baseline border-b border-ink/12 py-[3.1mm]">
              <span className="font-mono text-[7.5pt] text-signal-deep">{num}</span>
              <span className="text-[14pt] leading-none font-semibold tracking-[-0.03em]">{name}</span>
              <span className="font-mono text-[7.5pt] text-muted">{pg}</span>
            </li>
          ))}
        </ol>
      </div>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */
/* 04 · At a glance                                                    */
/* ------------------------------------------------------------------ */
function Glance() {
  const stats: [string, string, string][] = [
    [String(projects.length), "Case studies", `${CLIENT.length} client · ${ACADEMIC.length} academic`],
    ["12", "Client brands", "Food, beauty, gold trade, household goods, music, community"],
    [String(CLIENT.length), "Commissions", "Briefs delivered for paying clients"],
    [String(logos.length), "Logos", "Identities from mark to merchandise"],
    [`${profile.experienceYears}+`, "Years of practice", "Professional design work since graduating"],
    [`${profile.peopleTrained}+`, "Young people trained", "Free, hands-on community design training"],
  ];
  const disc = ["Advertising", "Events & Print", "Packaging", "Identity", "Tourism"].map((d) => ({
    label: d,
    value: projects.filter((p) => p.filters.includes(d as never)).length,
  }));
  const sectors = [
    { label: "Food and drink", value: 5, color: "#E64B32" },
    { label: "Gold trading", value: 2, color: "#D9A44E" },
    { label: "Community and events", value: 2, color: "#1B2540" },
    { label: "Beauty", value: 1, color: "#E081A6" },
    { label: "Household goods", value: 1, color: "#10C0E4" },
    { label: "Music", value: 1, color: "#2A3761" },
  ];
  return (
    <Sheet n={4}>
      <div className="flex h-full flex-col p-[14mm] pb-[18mm]">
        <div className="flex items-end justify-between gap-[10mm]">
          <div>
            <Chapter>02 · At a glance</Chapter>
            <h2 className="mt-[6mm] text-[30pt] leading-[0.98] font-semibold tracking-[-0.045em]">
              The work in <Serif className="text-navy">numbers.</Serif>
            </h2>
          </div>
          <p className="max-w-[96mm] text-[8.5pt] leading-relaxed text-ink/75">
            Every figure on this page can be checked against the case studies that follow. The training figure counts young people who joined my free community sessions.
          </p>
        </div>
        <div className="mt-[7mm] grid grid-cols-6 gap-px border border-ink/12 bg-ink/12">
          {stats.map(([n, l, d], i) => (
            <div key={l} className={`p-[4.5mm] ${i === 5 ? "bg-navy text-ivory" : "bg-ivory"}`}>
              <p className={`text-[30pt] leading-none font-semibold tracking-[-0.05em] ${i === 5 ? "text-sand" : "text-navy"}`}>{n}</p>
              <p className="mt-[2.5mm] text-[9.5pt] font-semibold tracking-[-0.01em]">{l}</p>
              <p className={`mt-[1mm] text-[7pt] leading-snug ${i === 5 ? "text-ivory/70" : "text-muted"}`}>{d}</p>
            </div>
          ))}
        </div>
        <div className="mt-[8mm] grid flex-1 grid-cols-[1fr_1fr] gap-[12mm]">
          <div>
            <p className="font-mono text-[7pt] tracking-[0.16em] text-muted uppercase">Case studies by discipline</p>
            <div className="mt-[5mm]">
              <BarChart data={disc} max={Math.max(...disc.map((d) => d.value))} />
            </div>
            <p className="mt-[4mm] text-[7pt] text-muted">A project can appear under more than one discipline.</p>
          </div>
          <div>
            <p className="font-mono text-[7pt] tracking-[0.16em] text-muted uppercase">Client brands by sector</p>
            <div className="mt-[4mm] flex items-center gap-[8mm]">
              <Donut data={sectors} size={50} />
              <ul className="space-y-[2mm]">
                {sectors.map((s) => (
                  <li key={s.label} className="flex items-center gap-[2.5mm] text-[8pt]">
                    <span className="size-[3mm] rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="w-[38mm]">{s.label}</span>
                    <span className="font-semibold">{s.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */
/* Section opener                                                      */
/* ------------------------------------------------------------------ */
function Opener({ n, num, title, accent, intro, items, first, light }: { n: number; num: string; title: string; accent: string; intro: string; items: Project[]; first: number; light?: boolean }) {
  const pages: Record<string, number> = {};
  // Page numbers as laid out in PrintPortfolio
  const map: Record<string, number> = {
    "chris-gold-buying-agent": 9, "clichy-gold-agent": 11, "nhyira-flour": 13, "fans-liquid-soap": 14, "royal-chop-delicacies": 15,
    "gifty-beauty-salon": 17, "highlife-brownies": 18, "kelewele-fest-26": 19, "wedding-naming-invitation": 20,
    "cherrys-sobolo": 24, "aj-lingerie-and-beads": 26, "silver-package": 27, "jeysicles-ice-cream": 28, "independence-weekend": 29,
    "ghana-independence-day": 30, "ttu-src-week": 31,
  };
  items.forEach((p, i) => (pages[p.slug] = map[p.slug] ?? first + i));
  const tiles = items.length % 3 ? [...items, ...Array(3 - (items.length % 3)).fill(null)] : items;
  return (
    <Sheet n={n} dark={!light} className={light ? "bg-sand/70" : ""}>
      {!light && <div className="absolute inset-0 bg-[radial-gradient(70%_80%_at_20%_80%,#2a3761,#1b2540_70%)]" />}
      <div className="relative grid h-full grid-cols-[1fr_150mm] gap-[12mm] p-[14mm] pb-[18mm]">
        <div className="flex flex-col">
          <Chapter dark={!light}>{num} · Section</Chapter>
          <p className={`mt-auto font-mono text-[9pt] ${light ? "text-signal-deep" : "text-signal"}`}>{num}</p>
          <h2 className="mt-[2mm] text-[56pt] leading-[0.88] font-semibold tracking-[-0.055em]">
            {title}
            <br />
            <Serif className={light ? "text-navy" : "text-sand"}>{accent}</Serif>
          </h2>
          <p className={`mt-[6mm] max-w-[105mm] text-[9pt] leading-relaxed ${light ? "text-ink/80" : "text-ivory/75"}`}>{intro}</p>
          <ol className={`mt-[7mm] grid grid-cols-2 gap-x-[6mm] gap-y-[1.6mm] border-t pt-[4mm] ${light ? "border-ink/20" : "border-ivory/20"}`}>
            {items.map((p) => (
              <li key={p.slug} className="flex items-baseline justify-between gap-[2mm] text-[7.8pt]">
                <span className="truncate font-medium">{p.title}</span>
                <span className={`font-mono text-[6.5pt] ${light ? "text-muted" : "text-ivory/55"}`}>p. {String(pages[p.slug]).padStart(2, "0")}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="grid grid-cols-3 content-center gap-[3mm]">
          {tiles.map((p, i) =>
            p ? (
              <div key={p.slug} className="relative aspect-square overflow-hidden rounded-[1mm] shadow-[0_8mm_14mm_-8mm_rgba(0,0,0,.5)]" style={{ backgroundColor: p.tone }}>
                <Image src={p.image.src} alt={p.alt} fill unoptimized loading="eager" className="object-cover" />
                <span className="absolute bottom-[1.5mm] left-[1.5mm] rounded-[0.6mm] bg-black/55 px-[1.2mm] py-[0.3mm] font-mono text-[5.5pt] text-white">{p.index}</span>
              </div>
            ) : (
              <div key={`t${i}`} className={`flex aspect-square flex-col justify-end rounded-[1mm] p-[4mm] ${i % 2 ? "bg-signal-deep text-ivory" : light ? "bg-navy text-ivory" : "bg-ivory text-ink"}`}>
                <p className="text-[26pt] leading-none font-semibold tracking-[-0.05em]">{i % 2 ? "2" : items.length}</p>
                <p className="mt-[1.5mm] text-[7.5pt] leading-snug">{i % 2 ? "qualifications: HND and B.Tech" : light ? "projects from TTU studios" : "client commissions"}</p>
              </div>
            ),
          )}
        </div>
      </div>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */
/* In context: mockups, visual direction and details                   */
/* ------------------------------------------------------------------ */
function InContext({ p, n, chapter, left }: { p: Project; n: number; chapter: string; left: React.ReactNode }) {
  return (
    <Sheet n={n}>
      <div className="grid h-full grid-cols-[1fr_96mm] gap-[9mm] p-[14mm] pb-[17mm]">
        <div className="flex min-h-0 flex-col">
          <Chapter>{chapter}</Chapter>
          <div className="mt-[5mm] min-h-0 flex-1">{left}</div>
        </div>
        <div className="flex flex-col pt-[9mm]">
          <p className="font-mono text-[7pt] tracking-[0.16em] text-muted uppercase">Project {p.index} / 16 · How it lives</p>
          <h2 className="mt-[3mm] text-[22pt] leading-[0.95] font-semibold tracking-[-0.045em]">{p.title}</h2>
          <p className="mt-[1.5mm] text-[8pt] text-muted">{p.brand}</p>
          <p className="mt-[5mm] font-mono text-[6.5pt] tracking-[0.16em] text-muted uppercase">Visual direction</p>
          <dl className="mt-[2mm] space-y-[2.4mm]">
            {p.visualDirection.slice(0, 4).map((v) => (
              <div key={v.label} className="border-l-2 border-signal pl-[3mm]">
                <dt className="text-[8.5pt] font-semibold">{v.label}</dt>
                <dd className="mt-[0.5mm] text-[7.4pt] leading-snug text-ink/75">{v.text}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-auto grid grid-cols-2 gap-[3mm] pt-[4mm]">
            {p.details.slice(0, 2).map((d) => (
              <figure key={d.src}>
                <div className="flex h-[24mm] items-center justify-center p-[1.5mm]" style={{ backgroundColor: p.tone }}>
                  <div className="relative h-full w-full">
                    <Image src={d.src} alt={d.alt} fill unoptimized loading="eager" className="object-contain" />
                  </div>
                </div>
                <figcaption className="mt-[1.2mm] text-[6.5pt] leading-snug text-muted">{d.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </Sheet>
  );
}

function DuoPanel({ a, b, ca, cb }: { a: React.ReactNode; b: React.ReactNode; ca: string; cb: string }) {
  return (
    <div className="grid h-full grid-cols-2 gap-[4mm]">
      {[
        [a, ca],
        [b, cb],
      ].map(([node, cap], i) => (
        <figure key={i} className="flex min-h-0 flex-col">
          <div className="min-h-0 flex-1">{node}</div>
          <figcaption className="mt-[2mm] text-[7pt] text-muted">{cap}</figcaption>
        </figure>
      ))}
    </div>
  );
}

function MockPanel({ p }: { p: Project }) {
  const i = img(p);
  const node =
    p.mockup === "identity" ? <Lightbox img={i} width="130mm" /> :
    p.mockup === "social" ? <Phone img={i} width="70mm" tone={p.tone} /> :
    p.mockup === "packaging" ? <Pedestal img={i} width="80mm" tone={p.tone} /> :
    <PosterWall img={i} width="86mm" />;
  return (
    <figure className="flex h-full flex-col">
      <div className="min-h-0 flex-1">{node}</div>
      <figcaption className="mt-[2mm] text-[7pt] text-muted">{p.mockup === "social" ? "As it appears in a social feed" : "Shown in a real-world setting"}</figcaption>
    </figure>
  );
}

function ApplicationsPanel({ p }: { p: Project }) {
  const pc = p.pieces?.[0];
  if (!pc) return <MockPanel p={p} />;
  return (
    <figure className="flex h-full flex-col">
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-[1.5mm] bg-[#0b0a08]">
        <Image src={pc.src} alt={pc.alt} fill unoptimized loading="eager" className="object-contain" />
      </div>
      <figcaption className="mt-[2mm] text-[7pt] text-muted">{pc.title}: the mark carried onto staff ID, signage and apparel</figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* 22 · Logo study: every mark at every size                           */
/* ------------------------------------------------------------------ */
function LogoStudy({ n }: { n: number }) {
  return (
    <Sheet n={n}>
      <div className="flex h-full flex-col p-[14mm] pb-[18mm]">
        <div className="flex items-end justify-between gap-[10mm]">
          <div>
            <Chapter>07 · Logo design · Scale test</Chapter>
            <h2 className="mt-[5mm] text-[30pt] leading-[0.98] font-semibold tracking-[-0.045em]">
              From signage to <Serif className="text-navy">favicon.</Serif>
            </h2>
          </div>
          <p className="max-w-[104mm] text-[8.5pt] leading-relaxed text-ink/75">
            A logo has to work as a shop sign, a profile picture and a tiny browser icon. Each mark below is shown at four sizes so you can judge where it holds up.
          </p>
        </div>
        <div className="mt-[7mm] grid flex-1 grid-cols-5 gap-[5mm]">
          {logos.map((l) => (
            <div key={l.slug} className="flex flex-col">
              <div className="relative h-[44mm] overflow-hidden rounded-[1.5mm] ring-1 ring-ink/10" style={{ backgroundColor: l.ground }}>
                <Image src={l.src} alt={l.alt} fill unoptimized loading="eager" className="object-contain" />
              </div>
              <p className="mt-[1.5mm] font-mono text-[6pt] tracking-[0.14em] text-muted uppercase">Signage</p>
              <div className="mt-[4mm] flex items-end gap-[3mm]">
                {[
                  ["Avatar", "size-[20mm] rounded-full"],
                  ["App icon", "size-[13mm] rounded-[3mm]"],
                  ["Favicon", "size-[6mm] rounded-[1mm]"],
                ].map(([label, cls]) => (
                  <div key={label} className="flex flex-col items-start">
                    <span className={`relative block overflow-hidden ring-1 ring-ink/10 ${cls}`} style={{ backgroundColor: l.ground }}>
                      <Image src={l.src} alt="" fill unoptimized loading="eager" className="object-contain" />
                    </span>
                    <span className="mt-[1.2mm] font-mono text-[5.5pt] tracking-[0.1em] text-muted uppercase">{label}</span>
                  </div>
                ))}
              </div>
              <p className="mt-[4mm] text-[9.5pt] leading-tight font-semibold tracking-[-0.02em]">{l.name}</p>
              <div className="mt-[2mm] flex h-[2.5mm] overflow-hidden rounded-full">
                {l.palette.map((c) => (
                  <span key={c} className="flex-1" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */
/* 32 · Design X-Ray                                                   */
/* ------------------------------------------------------------------ */
function XRaySheet({ n, items }: { n: number; items: Project[] }) {
  return (
    <Sheet n={n} dark>
      <div className="absolute inset-0 bg-[radial-gradient(70%_80%_at_80%_20%,#2a3761,#1b2540_70%)]" />
      <div className="relative flex h-full flex-col p-[14mm] pb-[18mm]">
        <div className="flex items-end justify-between gap-[10mm]">
          <div>
            <Chapter dark>09 · Design X-Ray</Chapter>
            <h2 className="mt-[5mm] text-[30pt] leading-[0.98] font-semibold tracking-[-0.045em]">
              Every decision, <Serif className="text-sand">explained.</Serif>
            </h2>
          </div>
          <p className="max-w-[110mm] text-[8.5pt] leading-relaxed text-ivory/75">
            On my website each case study has numbered notes laid over the artwork. Here are two of them in print: what each part of the design does and why it is there.
          </p>
        </div>
        <div className="mt-[7mm] grid flex-1 grid-cols-2 gap-[10mm]">
          {items.map((p) => (
            <div key={p.slug} className="grid grid-cols-[68mm_1fr] gap-[5mm]">
              <div className="flex items-start justify-center">
                <div className="relative" style={fit(p.image, 68, 118)}>
                  <Image src={p.image.src} alt={p.alt} fill unoptimized loading="eager" className="object-contain" />
                  {p.xray.slice(0, 4).map((pin, i) => (
                    <span
                      key={i}
                      className="absolute grid size-[5.5mm] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-signal font-mono text-[6.5pt] font-semibold text-ink ring-[0.6mm] ring-white"
                      style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                    >
                      {i + 1}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-mono text-[6.5pt] tracking-[0.16em] text-ivory/55 uppercase">{p.index} · {p.kind === "Client" ? "Client work" : "Academic"}</p>
                <p className="mt-[1mm] text-[13pt] leading-tight font-semibold tracking-[-0.03em]">{p.title}</p>
                <ol className="mt-[3mm] space-y-[2.6mm]">
                  {p.xray.slice(0, 4).map((pin, i) => (
                    <li key={i} className="grid grid-cols-[6mm_1fr] gap-[1mm]">
                      <span className="grid size-[4.5mm] place-items-center rounded-full bg-signal font-mono text-[6pt] font-semibold text-ink">{i + 1}</span>
                      <div>
                        <p className="text-[8pt] font-semibold">{pin.title}</p>
                        <p className="mt-[0.4mm] text-[7pt] leading-snug text-ivory/75">{pin.note}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */
/* 33 · Community impact                                               */
/* ------------------------------------------------------------------ */
function Impact({ n }: { n: number }) {
  const trained = `${profile.peopleTrained}+`;
  return (
    <Sheet n={n} className="bg-sand/70">
      <div className="dots absolute -top-[12mm] -right-[12mm] size-[64mm] text-ochre/40" />
      <div className="relative grid h-full grid-cols-[1fr_118mm] gap-[12mm] p-[14mm] pb-[18mm]">
        <div className="flex flex-col">
          <Chapter>10 · Community impact</Chapter>
          <p className="mt-[8mm] text-[72pt] leading-[0.85] font-semibold tracking-[-0.06em] text-navy">{trained}</p>
          <h2 className="mt-[3mm] text-[22pt] leading-[1.02] font-semibold tracking-[-0.04em]">
            young people trained, <Serif className="text-signal-deep">free of charge.</Serif>
          </h2>
          <p className="mt-[5mm] max-w-[130mm] text-[8.8pt] leading-relaxed text-ink/85">
            Alongside client work I run voluntary design training in my community. It is free. The aim is simple: give young people practical experience on real design tasks so they can start building skills and a portfolio of their own.
          </p>
          <p className="mt-[3mm] max-w-[130mm] text-[8.8pt] leading-relaxed text-ink/85">
            Design is hard to learn alone. Software is expensive, tutorials only go so far, and feedback is hard to find. A few hours of hands-on practice with someone who has done the work can change that.
          </p>
          <div className="mt-auto grid grid-cols-3 gap-[4mm]">
            {[
              [trained, "Participants so far"],
              ["Free", "No fees, ever"],
              ["Practical", "Real tasks, not theory"],
            ].map(([v, l]) => (
              <div key={l} className="rounded-[1.5mm] bg-ivory/85 p-[4mm]">
                <p className="text-[18pt] leading-none font-semibold tracking-[-0.04em] text-navy">{v}</p>
                <p className="mt-[1.5mm] text-[7.5pt] text-muted">{l}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="grid grid-cols-[repeat(15,1fr)] gap-[1.8mm]" aria-hidden>
            {Array.from({ length: profile.peopleTrained }).map((_, i) => (
              <span key={i} className="aspect-square rounded-full bg-navy" />
            ))}
          </div>
          <p className="mt-[3mm] text-[7pt] text-muted">Each dot is one young person trained.</p>
          <div className="mt-[8mm] rounded-[1.5mm] bg-navy p-[6mm] text-ivory">
            <p className="font-mono text-[6.5pt] tracking-[0.16em] text-ivory/60 uppercase">Where this is going</p>
            <p className="mt-[2mm] text-[11pt] leading-snug font-semibold tracking-[-0.02em]">
              My goal is to turn these sessions into a structured, free programme that can reach <Serif className="text-sand">1,000 young people</Serif> over the next ten years.
            </p>
          </div>
        </div>
      </div>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */
/* 34 · Vision                                                         */
/* ------------------------------------------------------------------ */
function Vision() {
  return (
    <Sheet n={34} dark>
      <div className="dots absolute -bottom-[16mm] -left-[16mm] size-[70mm] text-ivory/[0.06]" />
      <div className="grid h-full grid-cols-[1fr_88mm] gap-[12mm] p-[14mm] pb-[18mm]">
        <div className="flex flex-col">
          <Chapter dark>11 · Vision · where my practice is heading</Chapter>
          <h2 className="mt-[6mm] text-[32pt] leading-[0.98] font-semibold tracking-[-0.045em]">
            Designing what&apos;s <Serif className="text-sand">next.</Serif>
          </h2>
          <p className="mt-[4mm] max-w-[150mm] text-[9pt] leading-relaxed text-ivory/75">
            Grounded in advertising and packaging, my practice is moving toward design that is systematic, participatory and rooted in culture. These are the directions I am developing:
          </p>
          <ol className="mt-[7mm] grid grid-cols-2 content-start gap-x-[7mm] gap-y-[6mm]">
            {DIRECTIONS.map((d, i) => (
              <li key={d.t} className="border-t border-ivory/25 pt-[3mm]">
                <span className="font-mono text-[7pt] text-signal">0{i + 1}</span>
                <p className="mt-[1mm] text-[12pt] leading-tight font-semibold tracking-[-0.025em]">{d.t}</p>
                <p className="mt-[1.5mm] text-[7.8pt] leading-relaxed text-ivory/75">{d.d}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="flex flex-col">
          <div className="relative h-[86mm] overflow-hidden rounded-[1.5mm]">
            <Image src="/images/portrait/kwabena-graduation-navy.jpg" alt="Kwabena Acheampong at graduation" fill unoptimized loading="eager" className="object-cover object-[50%_22%]" />
          </div>
          <div className="mt-[5mm] rounded-[1.5mm] bg-ivory p-[5mm] text-ink">
            <p className="font-mono text-[6.5pt] tracking-[0.16em] text-muted uppercase">Next step</p>
            <p className="mt-[1.5mm] text-[12pt] leading-tight font-semibold tracking-[-0.025em]">
              A Master&apos;s degree <Serif className="text-navy">abroad.</Serif>
            </p>
            <p className="mt-[1.5mm] text-[7.6pt] leading-relaxed text-ink/75">
              I want the depth that is hard to get from client work alone: research, strategy and an international view of how brands are built. It all feeds back into my practice and the free training I run at home.
            </p>
          </div>
          <blockquote className="mt-auto border-l-2 border-signal pl-[4mm]">
            <p className="font-serif text-[11.5pt] leading-snug text-sand italic">
              &ldquo;Good design should communicate clearly, connect with people and give ideas a recognizable visual presence.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */
/* 35 · Contact (back cover)                                           */
/* ------------------------------------------------------------------ */
function Contact({ qr, url }: { qr: string; url: string }) {
  const { email, phone, whatsapp } = profile.contact;
  const lines = [
    email && ["Email", email],
    phone && ["Phone", phone],
    whatsapp && ["WhatsApp", phone && phone.replace(/\D/g, "") === whatsapp ? phone : `+${whatsapp}`],
    profile.socials.linkedin && ["LinkedIn", profile.socials.linkedin.replace(/^https?:\/\/(www\.)?/, "")],
    profile.socials.behance && ["Behance", profile.socials.behance.replace(/^https?:\/\/(www\.)?/, "")],
    profile.socials.instagram && ["Instagram", profile.socials.instagram.replace(/^https?:\/\/(www\.)?/, "")],
  ].filter(Boolean) as [string, string][];

  return (
    <Sheet n={35} dark>
      <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_75%_30%,#2a3761,#141c33_75%)]" />
      <div className="absolute inset-x-0 top-0 h-[3mm] bg-[linear-gradient(115deg,#FDB202,#FE6305_55%,#FC3902)]" />
      <div className="relative grid h-full grid-cols-[1fr_104mm] gap-[14mm] p-[16mm] pb-[20mm]">
        <div className="flex flex-col">
          <span className="relative block h-[24mm] w-[74mm]">
            <Image src="/images/brand/ka-logo-light.png" alt="Kwabena Acheampong, Graphic Designer and Brand Strategy Creative. Design, Inspire, Communicate." fill unoptimized loading="eager" className="object-contain object-left" />
          </span>
          <h2 className="mt-auto text-[46pt] leading-[0.92] font-semibold tracking-[-0.05em]">
            Have an idea?
            <br />
            Let&apos;s make it <Serif className="text-sand">visual.</Serif>
          </h2>
          <p className="mt-[5mm] max-w-[130mm] text-[9pt] leading-relaxed text-ivory/75">
            Open to brand, packaging and campaign projects, creative roles and postgraduate study.
          </p>
          <ul className="mt-[6mm] flex flex-wrap gap-[2mm]">
            {OPEN_TO.map((x) => (
              <li key={x} className="rounded-full border border-ivory/25 px-[3mm] py-[1mm] text-[7.5pt]">
                {x}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col rounded-[2mm] bg-ivory p-[8mm] text-ink">
          <p className="font-mono text-[7pt] tracking-[0.16em] text-muted uppercase">Contact</p>
          {lines.length > 0 && (
            <dl className="mt-[4mm] divide-y divide-ink/10 border-y border-ink/15">
              {lines.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[22mm_1fr] py-[2.2mm] text-[9pt]">
                  <dt className="text-muted">{k}</dt>
                  <dd className="font-semibold break-all">{v}</dd>
                </div>
              ))}
            </dl>
          )}
          <p className="mt-[4mm] text-[8pt] text-ink/75">Based in {profile.location}.</p>
          <div className="relative mt-[5mm] h-[34mm] overflow-hidden rounded-[1.5mm] bg-ink">
            <Image src="/video/kwabena-showreel-poster.jpg" alt="Still from Kwabena's showreel" fill unoptimized loading="eager" className="object-cover" />
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <span className="absolute bottom-[3mm] left-[3mm] flex items-center gap-[2mm] text-ivory">
              <span className="grid size-[7mm] place-items-center rounded-full bg-[linear-gradient(115deg,#FDB202,#FE6305_55%,#FC3902)] text-[7pt] text-ink">▶</span>
              <span className="text-[8pt] font-semibold">Watch the showreel on the website</span>
            </span>
          </div>
          <div className="mt-auto flex items-end gap-[5mm]">
            <div className="size-[30mm] shrink-0" dangerouslySetInnerHTML={{ __html: qr }} />
            <div>
              <p className="font-mono text-[6.5pt] tracking-[0.14em] text-muted uppercase">Interactive portfolio</p>
              <p className="mt-[1mm] text-[8.5pt] font-semibold whitespace-nowrap">{url}</p>
              <p className="mt-[1mm] text-[7pt] text-muted">Scan to watch the showreel and explore every case study</p>
            </div>
          </div>
          <p className="mt-[5mm] text-[6.5pt] text-muted">© 2026 Kwabena Acheampong. All rights reserved.</p>
        </div>
      </div>
    </Sheet>
  );
}
