// Visual + functional QA. Usage: node scripts/qa.mjs <baseUrl> <outDir> [paths...]
import { chromium } from "playwright";
import fs from "node:fs";

const [base = "http://localhost:3456", out = "qa-shots", ...paths] = process.argv.slice(2);
const routes = (paths.length ? paths : ["home"]).map((p) => (p === "home" ? "/" : p.startsWith("/") ? p : "/" + p));
const widths = (process.env.WIDTHS ?? "1440,390").split(",").map(Number);
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const problems = [];
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 600 ? 844 : 900 }, deviceScaleFactor: 1 });
  await ctx.addInitScript(() => sessionStorage.setItem("ka-seen", "1"));
  const page = await ctx.newPage();
  page.on("console", (m) => m.type() === "error" && problems.push(`[${w}] console: ${m.text()}`));
  page.on("pageerror", (e) => problems.push(`[${w}] pageerror: ${e.message}`));
  page.on("response", (r) => r.status() >= 400 && problems.push(`[${w}] ${r.status()} ${r.url()}`));
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: "networkidle" });
    // Scroll through to trigger in-view reveals and lazy images.
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 500) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(120);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1500);
    const name = `${route === "/" ? "home" : route.replaceAll("/", "_")}-${w}`;
    await page.screenshot({ path: `${out}/${name}-top.png` });
    await page.screenshot({ path: `${out}/${name}-full.png`, fullPage: true });
  }
  await ctx.close();
}
await browser.close();
console.log(problems.length ? problems.join("\n") : "No console errors or failed requests.");
