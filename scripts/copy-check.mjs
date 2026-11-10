// Checks the generated Executive Profile text for em dashes and common AI-writing tells.
// Usage: node scripts/copy-check.mjs [baseUrl]
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3456";
const TELLS = [
  "delve", "tapestry", "testament", "seamless", "elevate", "vibrant", "pivotal", "showcase", "showcasing", "underscore",
  "intricate", "fostering", "garner", "serves as", "stands as", "in today's", "not just", "not only", "landscape of",
  "cutting-edge", "game-changer", "unlock", "harness", "embark", "journey", "realm", "synergy", "leverage", "robust",
  "groundbreaking", "nestled", "boasts", "plethora", "myriad", "at its core", "let's dive",
];

const b = await chromium.launch();
const p = await b.newPage();
await p.goto(`${base}/print/profile`, { waitUntil: "networkidle" });
const text = await p.evaluate(() => document.querySelector(".pages")?.innerText ?? "");
await b.close();

const problems = [];
const dashes = text.match(/—/g)?.length ?? 0;
if (dashes) problems.push(`${dashes} em dash(es)`);
const curly = text.match(/[“”‘’]/g)?.length ?? 0;
if (curly) problems.push(`${curly} curly quote(s)`);
const lower = text.toLowerCase();
for (const t of TELLS) {
  const re = new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g");
  const n = lower.match(re)?.length ?? 0;
  if (n) {
    const i = lower.search(re);
    problems.push(`"${t}" x${n}: …${text.slice(Math.max(0, i - 50), i + 60).replace(/\s+/g, " ")}…`);
  }
}
console.log(`Checked ${text.length.toLocaleString()} characters of profile text.`);
console.log(problems.length ? "Problems:\n- " + problems.join("\n- ") : "Clean: no em dashes, curly quotes or AI-tell words.");
process.exit(problems.length ? 1 : 0);
