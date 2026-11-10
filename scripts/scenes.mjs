// Captures the In-Context Mockup Studio scene for one case per mockup kind.
import { chromium } from "playwright";
const [base = "http://localhost:3456", out = "qa-shots"] = process.argv.slice(2);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 } });
await ctx.addInitScript(() => sessionStorage.setItem("ka-seen", "1"));
const p = await ctx.newPage();
for (const slug of ["royal-chop-delicacies", "clichy-gold-agent", "nhyira-flour", "chris-gold-buying-agent", "ttu-src-week"]) {
  await p.goto(`${base}/work/${slug}`, { waitUntil: "networkidle" });
  await p.locator('[data-testid="stage-context"]').click();
  await p.waitForTimeout(1200);
  await p.locator(`#stage-${slug}`).screenshot({ path: `${out}/scene-${slug}.png` });
}
// business card scene (piece B on Clichy)
await p.goto(`${base}/work/clichy-gold-agent`, { waitUntil: "networkidle" });
const fig = p.locator("figure").filter({ hasText: "Business card" }).first();
await fig.scrollIntoViewIfNeeded();
await p.waitForTimeout(1200);
await fig.screenshot({ path: `${out}/scene-card-front.png` });
await p.getByRole("button", { name: /Business card, showing the front/ }).first().click({ force: true });
await p.waitForTimeout(1400);
await fig.screenshot({ path: `${out}/scene-card-back.png` });
await b.close();
console.log("scenes captured");
