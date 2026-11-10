# Kwabena Acheampong — Portfolio

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion. Fully static (SSG).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Editing content

All copy lives in `src/data/`:

| File | What it controls |
|---|---|
| `profile.ts` | Name, titles, availability line, **contact details, socials, Formspree ID, CV link, languages, tools**, education |
| `projects.ts` | The 7 academic case studies + the combined, ordered list of all 16 |
| `skills.ts` | Skill Tree: each skill → the projects that show it and the courses that trained it |
| `curriculum.ts` | "Areas of study" course names |
| `services.ts` | Services and process steps |
| `projects-client.ts` | The 9 client case studies (copy, palettes, X-Ray notes, extra pieces) |
| `logos.ts` | The 5 logos used by the Logo Lab, gallery and PDF logo wall |
| `gallery.ts` | Gallery wall (built automatically from projects, logos + portraits) |

Pages: `/` (home), `/work`, `/work/[slug]` (16 case studies), `/gallery`, `/about`, `/services`, `/contact`.

Colour system and type scale are documented at the top of `src/app/globals.css`. Use the `t-*` utilities (`t-page`, `t-display`, `t-h2`, `t-h3`, `t-lead`, `t-body`, `t-small`, `t-label`) rather than one-off font sizes.

**Contact details** (email, phone, WhatsApp) are set in `profile.ts`; any empty field — such as the socials — is hidden on the site. The contact form opens a pre-filled email; for in-page sending:

- set `formspreeId` (create a free form at formspree.io), **or**
- set `contact.email`, and the form falls back to opening a pre-filled email.

To add a CV, drop the PDF in `public/` and set `cvUrl: "/your-file.pdf"`. Also update `siteUrl` once the site is deployed.

## Executive Profile PDF (35 pages, A4 portrait)

Route `/print/profile` (noindex). Built from the same data, using one strict type scale (`src/components/print/kit.tsx`, token `T`).

```bash
npm run pdf:profile                                              # → public/kwabena-acheampong-executive-profile.pdf
python scripts/compress-pdf.py public/kwabena-acheampong-executive-profile.pdf
node scripts/copy-check.mjs    # no em dashes, curly quotes or AI-tell words
node scripts/type-check.mjs    # only the 9 scale sizes, 3 brand fonts, real artwork/portraits only
```

Facts supplied by Kwabena live in `profile.ts`: `experienceYears` (4) and `peopleTrained` (150).

## Profile & Portfolio PDF (16 pages)

The downloadable PDF is designed as a page of the site (`/print/portfolio`, hidden from search engines). It is built from the same data files, so update `profile.ts` first, then regenerate:

```bash
npm run build && npx next start -p 3456   # in one terminal
npm run pdf                                # in another → public/kwabena-acheampong-portfolio.pdf
npm run pdf:compress                       # optional: ~15 MB → ~9 MB, no visible loss (needs Python + pymupdf)
npm run build                              # rebuild so the new PDF is served
```

The QR code on page 16 points to `profile.siteUrl`. Regenerate the PDF after the site's real domain is set.

## Privacy

Artwork was extracted from `Portfolio.pdf` with the student name and index-number strips cropped out. No index numbers, dates of birth or grades are published. Transcripts were used only to describe the programmes.

## Play mode

The site includes an optional game layer: a Studio Archive that collects case studies, achievements, the Palette Match game, the Skill Tree glow, a custom cursor and an intro loader. Visitors can switch it off from the nav. It turns off automatically for `prefers-reduced-motion`.

## QA scripts

With the server running on port 3456:

```bash
node scripts/qa.mjs http://localhost:3456 qa-shots home work/cherrys-sobolo   # screenshots + console/network errors
node scripts/interactions.mjs http://localhost:3456 qa-shots                  # filters, form, game, menu, 404, reduced motion
node scripts/overflow.mjs                                                       # horizontal overflow at 5 widths
```

## Innovations

1. **Design X-Ray**: annotated design-decision pins on every case study (`xray` in the project data).
2. **In-Context Mockup Studio**: Flat ↔ In context scenes (poster, phone, packaging, identity, 3D business card).
3. **Search work by colour**: the Colour DNA strip and colour picker on `/work` rank work by perceptual (OKLab) distance.
4. **Logo Lab**: grounds, scale stress test, size ladder, mono/invert (`/work#logo-lab`).
5. **Ctrl/⌘ K command palette + Presentation Mode**: search everything; full-screen keyboard slideshow for interviews.

## Client work privacy

Personal names and contact details on the wedding invitation and the Clichy business card are blurred at source
(the files in `public/images/client/`). Business numbers printed on public adverts are left as designed.

## More checks

```bash
npm run check:assets                                   # all 16 works.pdf artworks exist and are referenced
node scripts/hydration.mjs                             # no hydration errors (incl. reduced motion)
node scripts/scenes.mjs http://localhost:3456 shots    # captures every mockup scene
```
