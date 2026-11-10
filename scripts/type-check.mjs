// Enforces the single typographic system on the Executive Profile: every visible text element must use
// one of the allowed sizes and one of the three brand families. Also confirms no generated imagery is used.
// Usage: node scripts/type-check.mjs [baseUrl]
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const base = process.argv[2] ?? "http://localhost:3456";
const ALLOWED_PT = [54, 44, 32, 24, 16, 12.5, 9.5, 7.5, 6.5];
const ALLOWED_PX = ALLOWED_PT.map((pt) => (pt * 4) / 3);

const b = await chromium.launch();
const p = await b.newPage();
await p.goto(`${base}/print/profile`, { waitUntil: "networkidle" });
const report = await p.evaluate((allowed) => {
  const bad = [];
  const families = new Set();
  const sizes = new Map();
  const walker = document.createTreeWalker(document.querySelector(".pages"), NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.textContent.trim()) continue;
    const el = node.parentElement;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || el.closest(".sr-only")) continue;
    const px = parseFloat(cs.fontSize);
    const fam = cs.fontFamily.split(",")[0].replace(/["']/g, "").trim();
    families.add(fam);
    sizes.set(px.toFixed(2), (sizes.get(px.toFixed(2)) ?? 0) + 1);
    if (!allowed.some((a) => Math.abs(a - px) < 0.05)) bad.push(`${px.toFixed(2)}px "${node.textContent.trim().slice(0, 40)}"`);
  }
  return { bad, families: [...families], sizes: Object.fromEntries(sizes) };
}, ALLOWED_PX);
const imgs = await p.evaluate(() => [...new Set([...document.querySelectorAll(".pages img")].map((i) => new URL(i.src).pathname))]);
await b.close();

const okFamily = (f) => /inter tight|instrument serif|geist mono/i.test(f);
const badFamilies = report.families.filter((f) => !okFamily(f));
const genDirs = ["public/images/ai", "public/images/generated"].filter((d) => fs.existsSync(d));
const imgSources = new Set(imgs.map((s) => path.posix.dirname(s)));

console.log("Font families:", report.families.join(", "));
console.log("Sizes used (px → count):", JSON.stringify(report.sizes));
console.log("Image folders used:", [...imgSources].join(", "));
const fails = [];
if (report.bad.length) fails.push(`${report.bad.length} element(s) off the type scale:\n  ${report.bad.slice(0, 15).join("\n  ")}`);
if (badFamilies.length) fails.push(`Unexpected font families: ${badFamilies.join(", ")}`);
if (genDirs.length) fails.push(`Generated-image folders present: ${genDirs.join(", ")}`);
if ([...imgSources].some((d) => !/\/images\/(client|projects|details|logos|portrait|brand)$/.test(d))) fails.push("Images from outside the real-artwork folders");
console.log(fails.length ? "FAIL\n" + fails.join("\n") : "PASS: one type scale, three brand families, real artwork, portraits and his logo only.");
process.exit(fails.length ? 1 : 0);
