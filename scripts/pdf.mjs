// Renders /print/portfolio to a 10-page A4-landscape PDF in /public.
// Usage: (server running) node scripts/pdf.mjs [baseUrl]
import { chromium } from "playwright";
import fs from "node:fs";

// Usage: node scripts/pdf.mjs [baseUrl] [route] [output]
const base = process.argv[2] ?? "http://localhost:3456";
// Normalise the route: Git Bash on Windows can rewrite "/print/x" into "C:/Program Files/Git/print/x".
const rawRoute = process.argv[3] ?? "/print/portfolio";
const route = rawRoute.includes("print/") ? "/print/" + rawRoute.split("print/").pop() : rawRoute.startsWith("/") ? rawRoute : "/" + rawRoute;
const out = process.argv[4] ?? "public/kwabena-acheampong-portfolio.pdf";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready.then(() => true));
// Only wait for images that are actually rendered (hidden site chrome may hold lazy images that never load).
await page.waitForFunction(() => [...document.images].filter((i) => i.offsetParent !== null).every((i) => i.complete), null, { timeout: 30000 });
await page.emulateMedia({ media: "print" });
const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true });
fs.writeFileSync(out, pdf);
await browser.close();
console.log(`Saved ${out} (${(pdf.length / 1024 / 1024).toFixed(2)} MB)`);
