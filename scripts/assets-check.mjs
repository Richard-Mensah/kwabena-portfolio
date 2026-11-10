// Fails if any of the 16 artworks extracted from works.pdf is missing or not referenced by the site data.
// Usage: node scripts/assets-check.mjs
import fs from "node:fs";

const ASSETS = [
  "client/royal-chop-menu-flyer.jpg",
  "client/royal-chop-social-offer.jpg",
  "client/gifty-beauty-salon.jpg",
  "client/kelewele-fest-26.jpg",
  "client/highlife-brownies.jpg",
  "client/nhyira-flour.jpg",
  "client/wedding-naming-invitation.jpg",
  "client/fans-liquid-soap.jpg",
  "client/clichy-gold-ad.jpg",
  "client/clichy-business-card.jpg",
  "client/chris-gold-logo.jpg",
  "client/chris-gold-merch-mockups.jpg",
  "logos/gather-and-grow.jpg",
  "logos/afia-noodles-hub.jpg",
  "logos/fifth-anniversary.jpg",
  "logos/dove-music.jpg",
];

const data = ["src/data/projects-client.ts", "src/data/logos.ts"].map((f) => fs.readFileSync(f, "utf8")).join("\n");
let failed = 0;
for (const a of ASSETS) {
  const file = `public/images/${a}`;
  const exists = fs.existsSync(file);
  const name = a.split("/").pop();
  const referenced = data.includes(name) || data.includes("${C}/" + name) || data.includes("${L}/" + name);
  const ok = exists && referenced;
  if (!ok) failed++;
  console.log(`${ok ? "OK  " : "FAIL"} ${a}${exists ? "" : " (missing file)"}${referenced ? "" : " (not referenced)"}`);
}
console.log(failed ? `\n${failed} asset problem(s).` : `\nAll ${ASSETS.length} works.pdf artworks present and referenced.`);
process.exit(failed ? 1 : 0);
