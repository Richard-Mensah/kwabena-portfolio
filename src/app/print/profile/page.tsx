import type { Metadata } from "next";
import Image from "next/image";
import QRCode from "qrcode";
import { education, profile } from "@/data/profile";
import { projects, type Project } from "@/data/projects";
import { logos } from "@/data/logos";
import { curriculum } from "@/data/curriculum";
import { services } from "@/data/services";
import { skillTree } from "@/data/skills";
import { Accent, Art, BarChart, Breeze, CardPair, Donut, Eyebrow, Label, Lightbox, Page, Palette, Pedestal, Phone, PosterWall, T } from "@/components/print/kit";

/**
 * 35-page A4 portrait Executive Profile & Portfolio.
 * Rendered to PDF by `npm run pdf:profile` -> public/kwabena-acheampong-executive-profile.pdf
 */
export const metadata: Metadata = { title: "Executive Profile (print)", robots: { index: false, follow: false } };

const P = (slug: string) => projects.find((p) => p.slug === slug)!;
const img = (p: Project) => ({ src: p.image.src, width: p.image.width, height: p.image.height, alt: p.alt });
const piece = (p: Project, i = 0) => {
  const x = p.pieces![i];
  return { src: x.src, width: x.width, height: x.height, alt: x.alt };
};

const css = `
@page { size: 210mm 297mm; margin: 0; }
[data-chrome], .loader { display: none !important; }
.grain::after { display: none !important; }
html, body { background: #d9d4c8 !important; }
@media print { html, body { background: #f5f2eb !important; } .pages { gap: 0 !important; padding: 0 !important; } .page { box-shadow: none !important; } }
.page { width: 210mm; height: 297mm; position: relative; overflow: hidden; break-after: page; page-break-after: always;
  -webkit-print-color-adjust: exact; print-color-adjust: exact; font-size: 9.5pt; line-height: 1.55; }
.page:last-child { break-after: auto; page-break-after: auto; }
`;

const YEARS = `${profile.experienceYears}+`;
const TRAINED = `${profile.peopleTrained}+`;
const clientCount = projects.filter((p) => p.kind === "Client").length;

export default async function ExecutiveProfile() {
  const qr = await QRCode.toString(profile.siteUrl, { type: "svg", margin: 0, color: { dark: "#1B2540", light: "#0000" } });
  return (
    <>
      <style>{css}</style>
      <div className="pages flex flex-col items-center gap-10 py-10">
        <Cover />
        <AtAGlance />
        <Contents />
        <AboutPage />
        <MissionPage />
        <NumbersPage />
        <EducationPage />
        <StudyPage />
        <ExpertisePage />
        <ServicesPage />
        <ProcessPage />
        <Opener n={12} kind="Client" />
        <CasePage n={13} p={P("chris-gold-buying-agent")} stage={<Lightbox img={img(P("chris-gold-buying-agent"))} />} />
        <ApplicationsPage n={14} p={P("chris-gold-buying-agent")} />
        <CasePage n={15} p={P("clichy-gold-agent")} stage={<Phone img={img(P("clichy-gold-agent"))} tone={P("clichy-gold-agent").tone} width="74mm" />} />
        <CardPage n={16} p={P("clichy-gold-agent")} />
        <CasePage n={17} p={P("nhyira-flour")} stage={<Pedestal img={img(P("nhyira-flour"))} tone={P("nhyira-flour").tone} width="74mm" />} />
        <CasePage n={18} p={P("fans-liquid-soap")} stage={<Pedestal img={img(P("fans-liquid-soap"))} tone={P("fans-liquid-soap").tone} width="96mm" />} />
        <CasePage n={19} p={P("royal-chop-delicacies")} stage={<PosterWall img={img(P("royal-chop-delicacies"))} width="82mm" />} />
        <SecondPiecePage n={20} p={P("royal-chop-delicacies")} />
        <CasePage n={21} p={P("gifty-beauty-salon")} stage={<PosterWall img={img(P("gifty-beauty-salon"))} width="82mm" />} />
        <CasePage n={22} p={P("kelewele-fest-26")} stage={<PosterWall img={img(P("kelewele-fest-26"))} width="80mm" />} />
        <CasePage n={23} p={P("highlife-brownies")} stage={<Phone img={img(P("highlife-brownies"))} tone={P("highlife-brownies").tone} width="64mm" />} />
        <CasePage n={24} p={P("wedding-naming-invitation")} stage={<PosterWall img={img(P("wedding-naming-invitation"))} width="78mm" />} note="Names and the RSVP number are blurred to protect the families' privacy." />
        <LogoWallPage />
        <Opener n={26} kind="Academic" />
        <CasePage n={27} p={P("cherrys-sobolo")} stage={<Pedestal img={img(P("cherrys-sobolo"))} tone={P("cherrys-sobolo").tone} width="96mm" />} />
        <PairPage n={28} a={P("aj-lingerie-and-beads")} b={P("silver-package")} />
        <PairPage n={29} a={P("independence-weekend")} b={P("ttu-src-week")} />
        <PairPage n={30} a={P("ghana-independence-day")} b={P("jeysicles-ice-cream")} />
        <CommunityPage />
        <InnovationsPage />
        <VisionPage />
        <StudyAbroadPage />
        <ContactPage qr={qr} />
      </div>
    </>
  );
}

/* =============================== 01 Cover =============================== */
function Cover() {
  return (
    <Page
      n={1}
      section="Cover"
      tone="navy"
      bleed={
        <>
          <div className="absolute right-0 bottom-0 h-[178mm] w-[124mm] overflow-hidden">
            <Image src="/images/portrait/kwabena-graduation-navy.jpg" alt="Kwabena Acheampong in a navy suit, red tie and graduation cap." fill unoptimized loading="eager" className="object-cover object-[50%_20%]" />
          </div>
          <div className="absolute right-[112mm] bottom-0 h-[178mm] w-[20mm] text-navy">
            <Breeze />
          </div>
        </>
      }
    >
      <div className="flex items-center justify-between">
        <span className="relative block h-[12mm] w-[21mm]">
          <Image src="/images/brand/ka-mark-light.png" alt="Kwabena Acheampong logo" fill unoptimized loading="eager" className="object-contain object-left" />
        </span>
        <Label dark>Executive Profile & Portfolio · 2026</Label>
      </div>
      <div className="mt-[22mm] max-w-[150mm]">
        <Eyebrow dark>Graphic Designer · Ghana</Eyebrow>
        <h1 className={`${T.cover} mt-[6mm]`}>
          <Accent className="block text-sand">Kwabena</Accent>
          <span className="block">Acheampong</span>
        </h1>
        <p className={`${T.h1} mt-[6mm] max-w-[80mm]`}>Brand identity, packaging and advertising design.</p>
      </div>
      <div className="mt-auto grid w-[66mm] gap-[4mm]">
        {[
          [YEARS, "years of professional practice"],
          [String(projects.length), "case studies inside"],
          [TRAINED, "young people trained for free"],
        ].map(([n, l]) => (
          <div key={l} className="border-t border-ivory/20 pt-[2.5mm]">
            <p className={`${T.d3} text-ivory`}>{n}</p>
            <p className={`${T.small} text-ivory/70`}>{l}</p>
          </div>
        ))}
      </div>
    </Page>
  );
}

/* =============================== 02 At a glance =============================== */
function AtAGlance() {
  const stats = [
    [YEARS, "Years of practice", "Freelance and client work alongside and after study."],
    [String(projects.length), "Case studies", `${clientCount} client commissions and ${projects.length - clientCount} academic projects.`],
    ["12", "Client brands", "Food, beauty, gold trading, household goods, music and community groups."],
    [TRAINED, "People trained", "Young people given free, practical design experience."],
    [String(logos.length), "Logos designed", "Each one built around a single, simple symbol."],
    ["2", "Qualifications", "B.Tech and HND, Takoradi Technical University."],
  ];
  return (
    <Page n={2} section="At a glance">
      <Eyebrow>At a glance</Eyebrow>
      <h2 className={`${T.d2} mt-[6mm] max-w-[160mm]`}>
        I design brands that people <Accent className="text-navy">notice</Accent> and trust.
      </h2>
      <div className="mt-[8mm] grid grid-cols-2 gap-[8mm]">
        <p className={`${T.body} text-ink/85`}>
          I&apos;m Kwabena Acheampong, a graphic designer from Ghana. For more than four years I have designed logos, packaging, adverts and event campaigns for small businesses, community groups and private clients.
        </p>
        <p className={`${T.body} text-ink/85`}>
          Most of my clients are local businesses that need their brand to work hard from day one. So I care about clarity: the right message, in the right order, in colours people remember.
        </p>
      </div>
      <div className="mt-[12mm] grid grid-cols-3 gap-px overflow-hidden rounded-[2mm] border border-ink/12 bg-ink/12">
        {stats.map(([n, l, s]) => (
          <div key={l} className="bg-ivory p-[6mm]">
            <p className={`${T.d1} text-navy`}>{n}</p>
            <p className={`${T.h2} mt-[3mm]`}>{l}</p>
            <p className={`${T.small} mt-[1.5mm] text-muted`}>{s}</p>
          </div>
        ))}
      </div>
      <div className="mt-auto grid grid-cols-[1fr_auto] items-end gap-[8mm] border-t border-ink/12 pt-[5mm]">
        <p className={`${T.h1}`}>
          Five years of formal training, four years of client work, and a habit of <Accent className="text-navy">teaching</Accent> what I learn.
        </p>
        <span className="relative block h-[22mm] w-[22mm] text-ochre/50">
          <Breeze cell={5} r={1.7} />
        </span>
      </div>
    </Page>
  );
}

/* =============================== 03 Contents =============================== */
function Contents() {
  const rows: [string, string, string][] = [
    ["01", "Profile", "04"],
    ["02", "Mission, vision and values", "05"],
    ["03", "Impact in numbers", "06"],
    ["04", "Education and training", "07"],
    ["05", "Expertise and services", "09"],
    ["06", "How I work", "11"],
    ["07", "Client work", "12"],
    ["08", "Logos", "25"],
    ["09", "Academic work", "26"],
    ["10", "Community impact", "31"],
    ["11", "Five innovations", "32"],
    ["12", "Ten-year vision", "33"],
    ["13", "Higher education", "34"],
    ["14", "Contact", "35"],
  ];
  return (
    <Page n={3} section="Contents" tone="sand">
      <Eyebrow>Contents</Eyebrow>
      <h2 className={`${T.d1} mt-[6mm]`}>
        What&apos;s <Accent className="text-navy">inside.</Accent>
      </h2>
      <ol className="mt-[14mm] divide-y divide-ink/15 border-y border-ink/15">
        {rows.map(([i, t, pg]) => (
          <li key={i} className="grid grid-cols-[14mm_1fr_auto] items-baseline py-[3.4mm]">
            <span className={`${T.label} text-signal-deep`}>{i}</span>
            <span className={T.h1}>{t}</span>
            <span className={`${T.label} text-muted`}>Page {pg}</span>
          </li>
        ))}
      </ol>
    </Page>
  );
}

/* =============================== 04 About =============================== */
function AboutPage() {
  return (
    <Page n={4} section="Profile">
      <Eyebrow>01 · Profile</Eyebrow>
      <div className="mt-[6mm] grid grid-cols-[70mm_1fr] gap-[10mm]">
        <div>
          <div className="relative h-[96mm] overflow-hidden rounded-[2mm]">
            <Image src="/images/portrait/kwabena-graduation-bw.jpg" alt="Black-and-white portrait of Kwabena Acheampong." fill unoptimized loading="eager" className="object-cover object-[50%_28%] grayscale" />
          </div>
          <Label className="mt-[2mm]">Graduation portrait</Label>
        </div>
        <div>
          <h2 className={T.d2}>
            Design with a <Accent className="text-navy">job</Accent> to do.
          </h2>
          <p className={`${T.body} mt-[6mm] text-ink/85`}>
            I like work that has to perform. A flyer has to get someone to call. A label has to explain a product in two seconds on a crowded shelf. A logo has to survive being printed small on a pen and large on a banner. That practical side is what I enjoy most.
          </p>
          <p className={`${T.body} mt-[4mm] text-ink/85`}>
            My training covered the whole chain, from drawing and lettering to photography, printing and packaging. I think about how a design will be produced as much as how it looks on a screen.
          </p>
        </div>
      </div>
      <div className="mt-[10mm] grid grid-cols-2 gap-[8mm]">
        <div className="rounded-[2mm] border border-ink/12 bg-paper/70 p-[6mm]">
          <Label>What clients get</Label>
          <ul className={`${T.body} mt-[3mm] space-y-[2mm]`}>
            <li>A clear brand idea before any decoration.</li>
            <li>Files that print correctly the first time.</li>
            <li>Versions for social media, print and signage.</li>
            <li>Honest advice on what will work for the budget.</li>
          </ul>
        </div>
        <div className="rounded-[2mm] border border-ink/12 bg-paper/70 p-[6mm]">
          <Label>Quick facts</Label>
          <dl className={`${T.body} mt-[3mm] space-y-[2mm]`}>
            {[
              ["Discipline", "Graphic design, advertising and packaging"],
              ["Education", "B.Tech and HND, Takoradi Technical University"],
              ["Experience", `${YEARS} years of client work`],
              ["Based in", profile.location],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[24mm_1fr]">
                <dt className="text-muted">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <blockquote className="mt-auto border-l-2 border-signal pl-[5mm]">
        <p className={`${T.h1} text-navy`}>
          <Accent>&quot;Good design should communicate clearly, connect with people and give ideas a recognizable visual presence.&quot;</Accent>
        </p>
      </blockquote>
    </Page>
  );
}

/* =============================== 05 Mission =============================== */
function MissionPage() {
  const values = [
    ["Clarity first", "If the message is unclear, no amount of decoration will save it. I work out what must be read first, then design around it."],
    ["Made to be produced", "A design is only finished when it prints well, fits the pack and reads on a phone. I prepare files for the real world."],
    ["Fair to growing businesses", "Many of my clients are building something new. I look for the option that gives them the most impact for what they can spend."],
    ["Share what I know", "Free design training for young people is part of how I work, not an extra. Skills grow when they are passed on."],
  ];
  return (
    <Page
      n={5}
      section="Mission and vision"
      tone="navy"
      bleed={
        <div className="absolute -top-[20mm] -right-[30mm] h-[120mm] w-[120mm] text-ivory/[0.05]">
          <Breeze cell={9} r={3.4} />
        </div>
      }
    >
      <Eyebrow dark>02 · Mission, vision and values</Eyebrow>
      <div className="mt-[10mm] grid gap-[10mm]">
        <div>
          <Label dark>Mission</Label>
          <p className={`${T.d3} mt-[3mm]`}>
            To give growing businesses and community groups clear, confident brands they can afford, and to share practical design skills with young people who would not otherwise get the <Accent className="text-sand">chance.</Accent>
          </p>
        </div>
        <div>
          <Label dark>Vision</Label>
          <p className={`${T.d3} mt-[3mm]`}>
            A design practice rooted in Ghana and working internationally, known for brands that are easy to read, easy to trust and hard to <Accent className="text-sand">forget.</Accent>
          </p>
        </div>
      </div>
      <div className="mt-auto">
        <Label dark>Values</Label>
        <div className="mt-[4mm] grid grid-cols-2 gap-[6mm]">
          {values.map(([t, d], i) => (
            <div key={t} className="border-t border-ivory/20 pt-[3mm]">
              <p className={`${T.label} text-signal`}>0{i + 1}</p>
              <p className={`${T.h2} mt-[1.5mm]`}>{t}</p>
              <p className={`${T.small} mt-[1.5mm] text-ivory/75`}>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}

/* =============================== 06 Numbers =============================== */
function NumbersPage() {
  const disc = ["Advertising", "Events & Print", "Packaging", "Identity", "Tourism"].map((d) => ({ label: d, value: projects.filter((p) => p.filters.includes(d as never)).length }));
  const sectors = [
    { label: "Food and drink", value: 5, color: "#E64B32" },
    { label: "Gold trading", value: 2, color: "#D9A44E" },
    { label: "Community and events", value: 2, color: "#1B2540" },
    { label: "Beauty", value: 1, color: "#E081A6" },
    { label: "Household goods", value: 1, color: "#10C0E4" },
    { label: "Music", value: 1, color: "#2A3761" },
  ];
  const timeline = [
    ["2017", "Starts HND in Commercial Arts (Graphic Design) at TTU"],
    ["2020", "Completes HND and begins the B.Tech in Advertising and Packaging"],
    ["2022", "Completes the B.Tech, including industrial attachment"],
    ["2022 to 2026", "Client work across 12 brands; free training for 150+ young people"],
  ];
  return (
    <Page n={6} section="Impact in numbers">
      <Eyebrow>03 · Impact in numbers</Eyebrow>
      <h2 className={`${T.d2} mt-[6mm]`}>
        The work, <Accent className="text-navy">counted.</Accent>
      </h2>
      <div className="mt-[10mm] grid grid-cols-2 gap-[10mm]">
        <div>
          <Label>Case studies by discipline</Label>
          <p className={`${T.small} mt-[1mm] text-muted`}>Some projects cover more than one discipline.</p>
          <div className="mt-[5mm]">
            <BarChart data={disc} max={Math.max(...disc.map((d) => d.value))} />
          </div>
        </div>
        <div>
          <Label>Client brands by sector</Label>
          <div className="mt-[5mm] flex items-center gap-[6mm]">
            <Donut data={sectors} size={42} />
            <ul className="space-y-[1.8mm]">
              {sectors.map((s) => (
                <li key={s.label} className={`${T.small} flex items-center gap-[2mm]`}>
                  <span className="size-[2.6mm] rounded-full" style={{ backgroundColor: s.color }} />
                  {s.label} <span className="font-semibold">{s.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-[12mm] grid grid-cols-4 gap-px overflow-hidden rounded-[2mm] bg-ink/12">
        {[
          [String(projects.length), "case studies"],
          ["12", "client brands"],
          [YEARS, "years of practice"],
          [TRAINED, "people trained"],
        ].map(([n, l]) => (
          <div key={l} className="bg-navy p-[5mm] text-ivory">
            <p className={T.d2}>{n}</p>
            <p className={`${T.small} mt-[1mm] text-ivory/70`}>{l}</p>
          </div>
        ))}
      </div>
      <div className="mt-auto">
        <Label>Timeline</Label>
        <ol className="relative mt-[4mm] border-l border-ink/20 pl-[6mm]">
          {timeline.map(([y, t], i) => (
            <li key={y} className="relative pb-[3.4mm] last:pb-0">
              <span className={`absolute top-[1.3mm] -left-[7.4mm] size-[2.8mm] rounded-full border-2 border-ivory ${i === timeline.length - 1 ? "bg-signal" : "bg-navy"}`} />
              <span className={`${T.label} text-signal-deep`}>{y}</span>
              <p className={`${T.body}`}>{t}</p>
            </li>
          ))}
        </ol>
      </div>
    </Page>
  );
}

/* =============================== 07 Education =============================== */
function EducationPage() {
  return (
    <Page n={7} section="Education">
      <Eyebrow>04 · Education and training</Eyebrow>
      <h2 className={`${T.d2} mt-[6mm]`}>
        Five years of <Accent className="text-navy">studio</Accent> training.
      </h2>
      <p className={`${T.body} mt-[5mm] max-w-[140mm] text-ink/80`}>
        Both qualifications are from Takoradi Technical University. The HND gave me the foundations. The B.Tech went deeper into advertising and packaging, with a research project and an industrial attachment.
      </p>
      <div className="mt-[10mm] grid gap-[6mm]">
        {education.map((e, i) => (
          <div key={e.award} className={`grid grid-cols-[36mm_1fr] gap-[6mm] rounded-[2mm] p-[7mm] ${i === 0 ? "bg-navy text-ivory" : "border border-ink/12 bg-paper/70"}`}>
            <div>
              <p className={`${T.label} ${i === 0 ? "text-signal" : "text-signal-deep"}`}>{e.years}</p>
              <p className={`${T.d3} mt-[2mm]`}>{i === 0 ? "B.Tech" : "HND"}</p>
            </div>
            <div>
              <p className={T.h1}>{e.award}</p>
              <p className={`${T.h2} mt-[1mm]`}>
                <Accent className={i === 0 ? "text-sand" : "text-navy"}>{e.field}</Accent>
              </p>
              <p className={`${T.small} mt-[1.5mm] font-semibold`}>{e.institution}</p>
              <p className={`${T.body} mt-[3mm] ${i === 0 ? "text-ivory/80" : "text-ink/80"}`}>{e.notes}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-[8mm] grid grid-cols-4 gap-px overflow-hidden rounded-[2mm] bg-ink/12">
        {[
          ["5", "years of study"],
          ["2", "qualifications"],
          ["2", "industrial attachments"],
          [String(curriculum.reduce((n, c) => n + c.courses.length, 0)), "course areas"],
        ].map(([n, l]) => (
          <div key={l} className="bg-sand/60 p-[5mm]">
            <p className={`${T.d2} text-navy`}>{n}</p>
            <p className={`${T.small} mt-[1mm] text-muted`}>{l}</p>
          </div>
        ))}
      </div>
      <div className="mt-auto grid grid-cols-3 gap-[6mm] border-t border-ink/12 pt-[5mm]">
        {[
          ["Research", "A supervised project and thesis in the final year of the B.Tech."],
          ["Industry", "Industrial attachments completed in both programmes."],
          ["Range", "Drawing, photography, print, packaging and digital imaging."],
        ].map(([t, d]) => (
          <div key={t}>
            <p className={T.h2}>{t}</p>
            <p className={`${T.small} mt-[1mm] text-muted`}>{d}</p>
          </div>
        ))}
      </div>
    </Page>
  );
}

/* =============================== 08 Areas of study =============================== */
function StudyPage() {
  return (
    <Page n={8} section="Education" tone="sand">
      <Eyebrow>04 · Areas of study</Eyebrow>
      <h2 className={`${T.d2} mt-[6mm]`}>
        What the training <Accent className="text-navy">covered.</Accent>
      </h2>
      <div className="mt-[10mm] grid grid-cols-2 gap-[5mm]">
        {curriculum.map((c, i) => (
          <div key={c.pillar} className={`rounded-[2mm] bg-ivory/85 p-[5mm] ${i === curriculum.length - 1 ? "col-span-2" : ""}`}>
            <div className="flex items-baseline justify-between">
              <p className={T.h2}>{c.pillar}</p>
              <span className={`${T.label} text-signal-deep`}>{String(c.courses.length).padStart(2, "0")}</span>
            </div>
            <ul className="mt-[3mm] flex flex-wrap gap-[1.6mm]">
              {c.courses.map((course) => (
                <li key={course} className={`${T.small} rounded-full border border-ink/15 px-[2.4mm] py-[0.6mm]`}>
                  {course}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Page>
  );
}

/* =============================== 09 Expertise =============================== */
function ExpertisePage() {
  return (
    <Page n={9} section="Expertise">
      <Eyebrow>05 · Expertise</Eyebrow>
      <h2 className={`${T.d2} mt-[6mm]`}>
        Skills, <Accent className="text-navy">proven</Accent> in the work.
      </h2>
      <p className={`${T.body} mt-[4mm] max-w-[150mm] text-ink/80`}>Every skill below points to the projects that show it. There are no self-rated percentages here.</p>
      <div className="mt-[8mm] grid grid-cols-2 gap-x-[8mm] gap-y-[6mm]">
        {skillTree.map((b) => (
          <div key={b.id} className="border-t-2 border-navy pt-[3mm]">
            <p className={T.h2}>{b.name}</p>
            <ul className="mt-[3mm] space-y-[3mm]">
              {b.skills.map((s) => (
                <li key={s.id}>
                  <div className="flex items-baseline justify-between gap-[3mm]">
                    <p className={`${T.body} font-semibold`}>{s.name}</p>
                    <span className={`${T.label} text-muted`}>{s.projects.length ? `${s.projects.length} projects` : "coursework"}</span>
                  </div>
                  <div className="mt-[1.5mm] flex gap-[1.2mm]">
                    {s.projects.slice(0, 5).map((slug) => {
                      const pr = P(slug);
                      return (
                        <span key={slug} className="relative block size-[8mm] overflow-hidden rounded-[0.6mm] ring-1 ring-ink/10" style={{ backgroundColor: pr.tone }}>
                          <Image src={pr.image.src} alt="" fill unoptimized loading="eager" className="object-cover" />
                        </span>
                      );
                    })}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Page>
  );
}

/* =============================== 10 Services =============================== */
const SEEN_IN: Record<string, string[]> = {
  "01": ["chris-gold-buying-agent", "clichy-gold-agent", "kelewele-fest-26"],
  "02": ["clichy-gold-agent", "royal-chop-delicacies", "ghana-independence-day"],
  "03": ["gifty-beauty-salon", "highlife-brownies", "royal-chop-delicacies"],
  "04": ["nhyira-flour", "fans-liquid-soap", "cherrys-sobolo"],
};
function ServicesPage() {
  return (
    <Page n={10} section="Services">
      <Eyebrow>05 · Services</Eyebrow>
      <h2 className={`${T.d2} mt-[6mm]`}>
        What I can help you <Accent className="text-navy">build.</Accent>
      </h2>
      <div className="mt-[10mm] grid flex-1 grid-cols-2 gap-[6mm]">
        {services.map((s) => (
          <div key={s.index} className="flex flex-col rounded-[2mm] border border-ink/12 bg-paper/70 p-[6mm]">
            <p className={`${T.label} text-signal-deep`}>{s.index}</p>
            <p className={`${T.h1} mt-[2mm]`}>{s.title}</p>
            <p className={`${T.body} mt-[2mm] text-navy`}>
              <Accent>{s.lede}</Accent>
            </p>
            <ul className={`${T.small} mt-[4mm] space-y-[1.4mm]`}>
              {s.items.map((it) => (
                <li key={it} className="flex items-center gap-[2mm]">
                  <span className="size-[1.4mm] rounded-full bg-signal" />
                  {it}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-[5mm]">
              <Label>Seen in</Label>
              <div className="mt-[2mm] flex gap-[2mm]">
                {SEEN_IN[s.index].map((slug) => {
                  const pr = P(slug);
                  return (
                    <span key={slug} className="relative block h-[22mm] w-[22mm] overflow-hidden rounded-[1mm] ring-1 ring-ink/10" style={{ backgroundColor: pr.tone }}>
                      <Image src={pr.image.src} alt="" fill unoptimized loading="eager" className="object-cover" />
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
}

/* =============================== 11 Process =============================== */
function ProcessPage() {
  const steps = [
    ["Discover", "I start with questions. Who is this for, where will they see it, and what should they do next? A street flyer and a shelf label need very different answers."],
    ["Define", "I write down the one message the design has to carry. Then I choose the type, colour and visual idea that fit it."],
    ["Design", "I sketch a few rough directions, then refine one. I test it at real size: on a phone screen, on an A4 print or on the side of a pack."],
    ["Deliver", "Print-ready files with the right bleed and colour settings, plus versions for social media and signage."],
  ];
  return (
    <Page n={11} section="How I work" tone="navy">
      <Eyebrow dark>06 · How I work</Eyebrow>
      <h2 className={`${T.d2} mt-[6mm]`}>
        From the first idea to the final <Accent className="text-sand">visual.</Accent>
      </h2>
      <ol className="mt-[14mm] grid gap-[8mm]">
        {steps.map(([t, d], i) => (
          <li key={t} className="grid grid-cols-[26mm_1fr] gap-[6mm] border-t border-ivory/20 pt-[5mm]">
            <p className={`${T.d1} text-ivory/25`}>0{i + 1}</p>
            <div>
              <p className={T.h1}>{t}</p>
              <p className={`${T.body} mt-[2mm] text-ivory/80`}>{d}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-auto grid grid-cols-[1fr_40mm] items-end gap-[8mm] border-t border-ivory/20 pt-[6mm]">
        <p className={`${T.d3}`}>
          Every brief starts with one question: what should someone <Accent className="text-sand">do</Accent> after they see this?
        </p>
        <span className="relative block h-[30mm] w-[40mm] text-ivory/15">
          <Breeze cell={5} r={1.7} />
        </span>
      </div>
    </Page>
  );
}

/* =============================== Section openers =============================== */
function Opener({ n, kind }: { n: number; kind: "Client" | "Academic" }) {
  const list = projects.filter((p) => p.kind === kind);
  const client = kind === "Client";
  return (
    <Page
      n={n}
      section={client ? "Client work" : "Academic work"}
      tone={client ? "ink" : "navy"}
      bleed={
        <div className="absolute inset-x-0 bottom-0 h-[110mm] text-ivory/[0.06]">
          <Breeze cell={11} r={4.2} />
        </div>
      }
    >
      <Eyebrow dark>{client ? "07 · Client work" : "09 · Academic work"}</Eyebrow>
      <h2 className={`${T.cover} mt-[30mm]`}>
        {client ? "Client" : "Academic"}
        <br />
        <Accent className="text-sand">work.</Accent>
      </h2>
      <p className={`${T.h1} mt-[10mm] max-w-[130mm] text-ivory/85`}>
        {client
          ? `${list.length} commissions for real businesses and families: identities, packaging, adverts, event posters and stationery.`
          : `${list.length} projects from my B.Tech and HND courses at Takoradi Technical University.`}
      </p>
      <div className="mt-auto grid grid-cols-5 gap-[3mm]">
        {list.slice(0, 5).map((p) => (
          <span key={p.slug} className="relative block aspect-[4/5] overflow-hidden rounded-[1mm] ring-1 ring-ivory/15" style={{ backgroundColor: p.tone }}>
            <Image src={p.image.src} alt="" fill unoptimized loading="eager" className="object-cover" />
          </span>
        ))}
      </div>
    </Page>
  );
}

/* =============================== Case page =============================== */
function CaseHeader({ p }: { p: Project }) {
  return (
    <div className="flex items-baseline justify-between">
      <Eyebrow>
        {p.kind === "Client" ? "Client work" : "Academic work"} · {p.category}
      </Eyebrow>
      <Label>
        Project {p.index} / {projects.length}
      </Label>
    </div>
  );
}

function CaseText({ p, compact }: { p: Project; compact?: boolean }) {
  return (
    <>
      <h2 className={`${T.d2} mt-[6mm]`}>{p.title}</h2>
      {p.brand !== p.title && <p className={`${T.small} mt-[1mm] text-muted`}>{p.brand}</p>}
      <div className="mt-[5mm] grid grid-cols-[1fr_68mm] gap-[8mm]">
        <div>
          <p className={`${T.body} text-ink/85`}>{compact ? p.summary : p.overview}</p>
          <p className={`${T.h2} mt-[4mm] border-l-2 border-signal pl-[3mm] text-navy`}>
            <Accent>{p.objective}</Accent>
          </p>
        </div>
        <div>
          <Label>Design approach</Label>
          <ol className="mt-[2mm] space-y-[1.8mm]">
            {p.approach.slice(0, compact ? 2 : 3).map((a, i) => (
              <li key={i} className={`${T.small} grid grid-cols-[5mm_1fr] text-ink/80`}>
                <span className="font-mono text-signal-deep">0{i + 1}</span>
                {a}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
}

function CasePage({ n, p, stage, note }: { n: number; p: Project; stage: React.ReactNode; note?: string }) {
  return (
    <Page n={n} section={p.kind === "Client" ? "Client work" : "Academic work"}>
      <CaseHeader p={p} />
      <div className="mt-[5mm] h-[138mm]">{stage}</div>
      {note && <p className={`${T.small} mt-[1.5mm] text-muted`}>{note}</p>}
      <CaseText p={p} />
      <div className="mt-auto grid grid-cols-[1fr_auto] items-end gap-[6mm]">
        <Palette colors={p.palette} />
        <p className={`${T.small} max-w-[80mm] text-right text-muted`}>{p.deliverables.join(" · ")}</p>
      </div>
    </Page>
  );
}

/* 14: Chris Gold applications */
function ApplicationsPage({ n, p }: { n: number; p: Project }) {
  return (
    <Page n={n} section="Client work" tone="ink">
      <Eyebrow dark>Client work · Brand applications</Eyebrow>
      <h2 className={`${T.d2} mt-[6mm]`}>
        One mark, <Accent className="text-sand">everywhere.</Accent>
      </h2>
      <p className={`${T.body} mt-[4mm] max-w-[150mm] text-ivory/80`}>
        I tested the Chris Gold identity on the things the business really uses: staff ID, a pen, an outdoor banner and a T-shirt. The ring mark also works alone, cropped large as a graphic on the shirt hem.
      </p>
      <div className="mt-[8mm] overflow-hidden rounded-[2mm] ring-1 ring-ivory/10">
        <Art img={piece(p)} />
      </div>
      <div className="mt-[6mm] grid grid-cols-2 gap-[5mm]">
        {p.details.map((d) => (
          <figure key={d.src}>
            <div className="flex h-[52mm] items-center justify-center overflow-hidden rounded-[2mm] bg-[#16130e] p-[3mm]">
              <div className="relative h-full w-full">
                <Image src={d.src} alt={d.alt} fill unoptimized loading="eager" className="object-contain" />
              </div>
            </div>
            <figcaption className={`${T.small} mt-[1.5mm] text-ivory/65`}>{d.caption}</figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-auto">
        <Palette colors={p.palette} />
      </div>
    </Page>
  );
}

/* 16: Clichy business card */
function CardPage({ n, p }: { n: number; p: Project }) {
  return (
    <Page n={n} section="Client work">
      <Eyebrow>Client work · Stationery</Eyebrow>
      <h2 className={`${T.d2} mt-[6mm]`}>
        The brand, in your <Accent className="text-navy">hand.</Accent>
      </h2>
      <p className={`${T.body} mt-[4mm] max-w-[150mm] text-ink/80`}>
        The Clichy business card carries the same crescent and gold bars into print. The front pairs a hexagon badge with contact details on black. The back keeps only the logo and the line &quot;Where Precision Meets Luxury&quot;.
      </p>
      <div className="mt-[8mm] h-[150mm]">
        <CardPair img={piece(p)} />
      </div>
      <p className={`${T.small} mt-[2mm] text-muted`}>The manager&apos;s name, phone numbers, email and QR code are blurred for privacy.</p>
      <div className="mt-auto grid grid-cols-3 gap-[6mm] border-t border-ink/12 pt-[4mm]">
        {p.visualDirection.map((v) => (
          <div key={v.label}>
            <p className={T.h2}>{v.label}</p>
            <p className={`${T.small} mt-[1mm] text-muted`}>{v.text}</p>
          </div>
        ))}
      </div>
    </Page>
  );
}

/* 20: Royal Chop social piece */
function SecondPiecePage({ n, p }: { n: number; p: Project }) {
  return (
    <Page n={n} section="Client work">
      <Eyebrow>Client work · Social media</Eyebrow>
      <h2 className={`${T.d2} mt-[6mm]`}>
        Same brand, new <Accent className="text-navy">channel.</Accent>
      </h2>
      <p className={`${T.body} mt-[4mm] max-w-[150mm] text-ink/80`}>
        For social media I moved Royal Chop onto a deep red, put one dish in a hand reaching toward the viewer and made the offer impossible to miss: 20% off the first order. The cream wordmark keeps it connected to the flyer.
      </p>
      <div className="mt-[8mm] h-[160mm]">
        <Phone img={piece(p)} tone={p.tone} width="86mm" />
      </div>
      <div className="mt-auto grid grid-cols-3 gap-[6mm] border-t border-ink/12 pt-[4mm]">
        {p.visualDirection.map((v) => (
          <div key={v.label}>
            <p className={T.h2}>{v.label}</p>
            <p className={`${T.small} mt-[1mm] text-muted`}>{v.text}</p>
          </div>
        ))}
      </div>
    </Page>
  );
}

/* 25: Logo wall */
function LogoWallPage() {
  return (
    <Page n={25} section="Logos" tone="navy">
      <Eyebrow dark>08 · Logos</Eyebrow>
      <h2 className={`${T.d2} mt-[6mm]`}>
        Marks that <Accent className="text-sand">stay.</Accent>
      </h2>
      <p className={`${T.body} mt-[4mm] max-w-[150mm] text-ivory/80`}>Five logos for clients in gold trading, community work, food, celebration and music. Each is built around one symbol you can draw from memory.</p>
      <div className="mt-[8mm] grid grid-cols-2 gap-[5mm]">
        {logos.map((l, i) => (
          <figure key={l.slug} className={i === 0 ? "col-span-2" : ""}>
            <div className={`relative overflow-hidden rounded-[2mm] ring-1 ring-ivory/10 ${i === 0 ? "h-[46mm]" : "h-[54mm]"}`} style={{ backgroundColor: l.ground }}>
              <Image src={l.src} alt={l.alt} fill unoptimized loading="eager" className="object-contain" />
            </div>
            <figcaption className="mt-[2mm]">
              <p className={T.h2}>{l.name}</p>
              <p className={`${T.small} mt-[0.5mm] text-ivory/70`}>{l.concept}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </Page>
  );
}

/* Academic two-up */
function PairPage({ n, a, b }: { n: number; a: Project; b: Project }) {
  return (
    <Page n={n} section="Academic work">
      <Eyebrow>Academic work · Takoradi Technical University</Eyebrow>
      <div className="mt-[6mm] grid flex-1 grid-rows-2 gap-[8mm]">
        {[a, b].map((p) => {
          const wide = p.image.width / p.image.height > 1.4;
          return (
            <div key={p.slug} className="grid grid-cols-[92mm_1fr] gap-[7mm]">
              <div className="flex items-center justify-center overflow-hidden rounded-[2mm] p-[5mm]" style={{ backgroundColor: p.tone }}>
                <div className="shadow-[0_10mm_16mm_-8mm_rgba(0,0,0,.45)]" style={{ width: wide ? "82mm" : "66mm" }}>
                  <Art img={img(p)} />
                </div>
              </div>
              <div className="flex flex-col">
                <Label>
                  Project {p.index} · {p.category}
                </Label>
                <h3 className={`${T.d3} mt-[2mm]`}>{p.title}</h3>
                <p className={`${T.body} mt-[3mm] text-ink/85`}>{p.summary}</p>
                <ol className="mt-[3mm] space-y-[1.6mm]">
                  {p.approach.slice(0, 2).map((x, i) => (
                    <li key={i} className={`${T.small} grid grid-cols-[5mm_1fr] text-ink/80`}>
                      <span className="font-mono text-signal-deep">0{i + 1}</span>
                      {x}
                    </li>
                  ))}
                </ol>
                <div className="mt-auto">
                  <Palette colors={p.palette} h="4mm" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Page>
  );
}

/* =============================== 31 Community =============================== */
function CommunityPage() {
  return (
    <Page
      n={31}
      section="Community impact"
      tone="sand"
      bleed={
        <div className="absolute top-0 right-0 h-[150mm] w-[90mm] text-ochre/30">
          <Breeze cell={8} r={2.8} />
        </div>
      }
    >
      <Eyebrow>10 · Community impact</Eyebrow>
      <p className={`${T.cover} mt-[16mm] text-navy`}>{TRAINED}</p>
      <h2 className={`${T.d2} mt-[3mm] max-w-[140mm]`}>
        young people trained, <Accent className="text-signal-deep">free of charge.</Accent>
      </h2>
      <p className={`${T.body} mt-[6mm] max-w-[140mm] text-ink/85`}>
        Alongside client work I run voluntary design training in my community. It is free. The aim is simple: give young people practical experience on real design tasks so they can start building skills and a portfolio of their own.
      </p>
      <p className={`${T.body} mt-[4mm] max-w-[140mm] text-ink/85`}>
        Design is hard to learn alone. Software is expensive, tutorials only go so far, and feedback is hard to find. Many of the young people I meet have good ideas but no one to show them the next step. A few hours of hands-on practice can change that.
      </p>
      <div className="mt-[10mm] grid grid-cols-3 gap-[5mm]">
        {[
          [TRAINED, "Participants so far"],
          ["Free", "No fees, ever"],
          ["Practical", "Real tasks, not theory"],
        ].map(([n, l]) => (
          <div key={l} className="rounded-[2mm] bg-ivory/85 p-[5mm]">
            <p className={`${T.d3} text-navy`}>{n}</p>
            <p className={`${T.small} mt-[1mm] text-muted`}>{l}</p>
          </div>
        ))}
      </div>
      <div className="mt-[8mm]">
        <div className="grid grid-cols-[repeat(25,1fr)] gap-[1.4mm]" aria-hidden>
          {Array.from({ length: profile.peopleTrained }).map((_, i) => (
            <span key={i} className="aspect-square rounded-full bg-navy" />
          ))}
        </div>
        <p className={`${T.small} mt-[2mm] text-muted`}>Each dot is one young person trained.</p>
      </div>
      <div className="mt-auto rounded-[2mm] bg-navy p-[7mm] text-ivory">
        <Label dark>Where this is going</Label>
        <p className={`${T.h1} mt-[2mm]`}>
          My goal is to turn these sessions into a structured, free programme that can reach <Accent className="text-sand">1,000 young people</Accent> over the next ten years.
        </p>
      </div>
    </Page>
  );
}

/* =============================== 32 Innovations =============================== */
function InnovationsPage() {
  const items = [
    ["Design X-Ray", "Every case study on my website has numbered notes laid over the artwork. Each note explains one decision: why this type, why this colour, why this order.", "Area: design reasoning you can see"],
    ["Work in context", "Each piece can be viewed flat or in a realistic setting: a framed poster on a wall, a phone feed, a product on a shelf or a two-sided business card.", "Area: mockups for real-world judgement"],
    ["Search by colour", "Visitors can pick any colour and see which of my projects use it, ranked by how close the match is.", "Area: colour as a way into the work"],
    ["Logo stress test", "A logo lab shows each mark on light, dark and photo backgrounds, from 16 pixels up to signage size, in colour and in one colour.", "Area: legibility at every size"],
    ["Presentation mode", "One key turns the site into a full-screen slideshow of every project, ready for an interview or a call with a client.", "Area: presenting work with confidence"],
  ];
  return (
    <Page n={32} section="Five innovations">
      <Eyebrow>11 · Five innovations</Eyebrow>
      <h2 className={`${T.d2} mt-[6mm]`}>
        Five ways my work is <Accent className="text-navy">presented</Accent> differently.
      </h2>
      <p className={`${T.body} mt-[4mm] max-w-[150mm] text-ink/80`}>My portfolio website goes further than a gallery. These five features show how I like to explain and present design work.</p>
      <ol className="mt-[8mm] grid gap-[5mm]">
        {items.map(([t, d, a], i) => (
          <li key={t} className="grid grid-cols-[18mm_1fr] gap-[5mm] rounded-[2mm] border border-ink/12 bg-paper/70 p-[5mm]">
            <p className={`${T.d2} text-signal-deep`}>0{i + 1}</p>
            <div>
              <p className={T.h1}>{t}</p>
              <p className={`${T.body} mt-[1.5mm] text-ink/80`}>{d}</p>
              <p className={`${T.label} mt-[2mm] text-navy`}>{a}</p>
            </div>
          </li>
        ))}
      </ol>
    </Page>
  );
}

/* =============================== 33 Ten-year vision =============================== */
function VisionPage() {
  const steps = [
    ["2026", "Apply to Master's programmes abroad with this profile and my portfolio."],
    ["2027 to 2028", "Complete a Master's in brand, communication or packaging design."],
    ["2029", "Work in an international studio to learn how large brand systems are run."],
    ["2031", "Open my own studio in Ghana, focused on identity and packaging for growing businesses."],
    ["2033", "Turn my community sessions into a structured free design programme."],
    ["2036", "Lead a studio known across West Africa and beyond, with 1,000 young people trained."],
  ];
  return (
    <Page n={33} section="Ten-year vision" tone="navy">
      <Eyebrow dark>12 · Ten-year vision</Eyebrow>
      <h2 className={`${T.d2} mt-[6mm]`}>
        Where I want to be by <Accent className="text-sand">2036.</Accent>
      </h2>
      <p className={`${T.body} mt-[4mm] max-w-[150mm] text-ivory/80`}>These are goals, not achievements. I wrote them down so I can be held to them.</p>
      <ol className="relative mt-[12mm] flex-1 border-l border-ivory/25 pl-[10mm]">
        {steps.map(([y, t], i) => (
          <li key={y} className="relative pb-[9mm] last:pb-0">
            <span className={`absolute top-[1mm] -left-[12mm] size-[4mm] rounded-full border-[0.8mm] border-navy ${i === steps.length - 1 ? "bg-signal" : "bg-ivory"}`} />
            <p className={`${T.label} text-signal`}>{y}</p>
            <p className={`${T.h1} mt-[1.5mm] max-w-[140mm]`}>{t}</p>
          </li>
        ))}
      </ol>
    </Page>
  );
}

/* =============================== 34 Higher education =============================== */
function StudyAbroadPage() {
  return (
    <Page n={34} section="Higher education">
      <Eyebrow>13 · Higher education</Eyebrow>
      <h2 className={`${T.d2} mt-[6mm]`}>
        The next step is a <Accent className="text-navy">Master&apos;s</Accent> abroad.
      </h2>
      <div className="mt-[8mm] grid grid-cols-[1fr_62mm] gap-[8mm]">
        <div>
          <p className={`${T.body} text-ink/85`}>
            My degree gave me strong practical skills, and client work has taught me a lot about real deadlines and real budgets. What I want now is the depth that is hard to get from client work alone: research, strategy, and an international view of how brands are built and how design is taught.
          </p>
          <p className={`${T.body} mt-[4mm] text-ink/85`}>
            I want to study how brand systems hold together over time, how packaging design is changing with sustainability rules, and how design can be taught well. All three feed straight back into my studio plans and the free training I run at home.
          </p>
        </div>
        <div className="relative h-[80mm] overflow-hidden rounded-[2mm]">
          <Image src="/images/portrait/kwabena-graduation-navy.jpg" alt="Kwabena Acheampong in graduation cap." fill unoptimized loading="eager" className="object-cover object-[50%_18%]" />
        </div>
      </div>
      <div className="mt-[10mm] grid grid-cols-2 gap-[6mm]">
        <div className="rounded-[2mm] bg-navy p-[6mm] text-ivory">
          <Label dark>What I bring</Label>
          <ul className={`${T.body} mt-[3mm] space-y-[2mm]`}>
            <li>{YEARS} years of client work across 12 brands</li>
            <li>{projects.length} documented case studies</li>
            <li>A B.Tech and an HND in graphic design</li>
            <li>Teaching experience with {TRAINED} young people</li>
          </ul>
        </div>
        <div className="rounded-[2mm] border border-ink/12 bg-paper/70 p-[6mm]">
          <Label>What I am looking for</Label>
          <ul className={`${T.body} mt-[3mm] space-y-[2mm]`}>
            <li>Brand or communication design</li>
            <li>Packaging design and production</li>
            <li>Design strategy and research</li>
            <li>Programmes with studio and industry links</li>
          </ul>
        </div>
      </div>
      <blockquote className="mt-auto border-l-2 border-signal pl-[5mm]">
        <p className={`${T.h1} text-navy`}>
          <Accent>I want to learn from the best and bring what I learn home.</Accent>
        </p>
      </blockquote>
    </Page>
  );
}

/* =============================== 35 Contact =============================== */
function ContactPage({ qr }: { qr: string }) {
  const url = profile.siteUrl.replace(/^https?:\/\//, "");
  const { email, phone, whatsapp } = profile.contact;
  return (
    <Page
      n={35}
      section="Contact"
      tone="navy"
      bleed={
        <div className="absolute inset-x-0 bottom-0 h-[120mm] text-ivory/[0.05]">
          <Breeze cell={10} r={3.8} />
        </div>
      }
    >
      <Eyebrow dark>14 · Contact</Eyebrow>
      <h2 className={`${T.cover} mt-[24mm]`}>
        Let&apos;s make it <Accent className="text-sand">visual.</Accent>
      </h2>
      <p className={`${T.h1} mt-[8mm] max-w-[140mm] text-ivory/85`}>Open to brand, packaging and campaign projects, design roles and postgraduate study.</p>
      <div className="mt-[14mm] rounded-t-[2mm] border-b border-ink/10 bg-ivory px-[8mm] pt-[8mm] pb-[6mm]">
        <span className="relative block h-[26mm] w-[80mm]">
          <Image src="/images/brand/ka-logo.png" alt="Kwabena Acheampong, Graphic Designer and Brand Strategy Creative. Design, Inspire, Communicate." fill unoptimized loading="eager" className="object-contain object-left" />
        </span>
      </div>
      <div className="grid grid-cols-[1fr_auto] items-end gap-[10mm] rounded-b-[2mm] bg-ivory p-[8mm] text-ink">
        <dl className={`${T.body} space-y-[3mm]`}>
          {[
            ["Email", email],
            ["Phone", phone],
            ["WhatsApp", whatsapp && phone.replace(/\D/g, "") === whatsapp ? phone : whatsapp ? `+${whatsapp}` : ""],
            ["Portfolio", url],
          ]
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <div key={k} className="grid grid-cols-[26mm_1fr]">
                <dt className={`${T.label} self-center text-muted`}>{k}</dt>
                <dd className={`${T.h2}`}>{v}</dd>
              </div>
            ))}
        </dl>
        <div className="text-center">
          <div className="size-[30mm]" dangerouslySetInnerHTML={{ __html: qr }} />
          <p className={`${T.label} mt-[2mm] text-muted`}>Scan for the portfolio</p>
        </div>
      </div>
      <p className={`${T.small} mt-auto text-ivory/60`}>© 2026 Kwabena Acheampong. All artwork shown is my own design work.</p>
    </Page>
  );
}
