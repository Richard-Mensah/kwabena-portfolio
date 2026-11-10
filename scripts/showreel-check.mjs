// Verifies the homepage showreel: autoplay advances, controls work, spark hunt counts, no console errors.
// Usage: node scripts/showreel-check.mjs [baseUrl] [shotDir]
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3456";
const shots = process.argv[3];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
p.on("pageerror", (e) => errors.push(e.message));
p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await p.goto(base, { waitUntil: "networkidle" });

const reel = p.locator('section[aria-label="Showreel"]');
await reel.scrollIntoViewIfNeeded();
await p.waitForTimeout(800);
const counter = () => reel.locator("span.font-mono").first().innerText();
const results = [];
const check = (name, ok) => results.push(`${ok ? "PASS" : "FAIL"} ${name}`);

const vt = () => p.evaluate(() => document.querySelector('section[aria-label="Showreel"] video').currentTime);
await p.waitForFunction(() => document.querySelector('section[aria-label="Showreel"] video')?.readyState >= 2, null, { timeout: 20000 });
const v0 = await vt();
await p.waitForTimeout(6500);
const v1 = await vt();
check(`video autoplays (${v0.toFixed(1)}s -> ${v1.toFixed(1)}s)`, v1 - v0 > 4);
check(`scene counter follows video (${await counter()})`, (await counter()).startsWith(v1 > 7.6 ? "02" : "01"));
if (shots) await p.screenshot({ path: `${shots}/reel-1.png` });

await reel.getByRole("button", { name: "Pause showreel" }).click();
const cp = await counter();
await p.waitForTimeout(5200);
check("pause holds the scene", (await counter()) === cp);

await reel.getByRole("button", { name: "Next scene" }).click();
await p.waitForTimeout(300);
check("next button", (await counter()) !== cp);

await reel.getByRole("tab").nth(4).click();
await reel.getByRole("button", { name: "Play showreel" }).click();
await p.waitForTimeout(300);
check("segment jump to scene 5", (await counter()).startsWith("05"));

await reel.getByRole("button", { name: /Catch the spark/ }).click({ timeout: 6000 });
await p.waitForTimeout(400);
check("spark collected", (await reel.getByText(/Sparks 1\//).count()) === 1);
if (shots) await p.screenshot({ path: `${shots}/reel-2.png` });

await reel.locator('[aria-roledescription="video player"]').focus();
await p.keyboard.press("ArrowRight");
await p.waitForTimeout(300);
check("arrow key navigation", (await counter()).startsWith("06"));

check(`no console errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`, errors.length === 0);
await b.close();
console.log(results.join("\n"));
process.exit(results.some((r) => r.startsWith("FAIL")) ? 1 : 0);
