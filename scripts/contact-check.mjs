// Verifies contact links and the form's mailto fallback. Usage: node scripts/contact-check.mjs [baseUrl] [shot.png]
import { chromium } from "playwright";
const [base = "http://localhost:3456", shot] = process.argv.slice(2);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => sessionStorage.setItem("ka-seen", "1"));
const p = await ctx.newPage();
await p.goto(base + "/contact", { waitUntil: "networkidle" });
const links = await p.locator('a[href^="mailto:"], a[href^="tel:"], a[href^="https://wa.me/"]').evaluateAll((as) => as.map((a) => `${a.textContent.trim()} -> ${a.getAttribute("href")}`));
console.log(links.join("\n"));
// Intercept the mailto navigation the form triggers
await p.evaluate(() => {
  Object.defineProperty(window, "__mailto", { value: null, writable: true });
  const desc = Object.getOwnPropertyDescriptor(Location.prototype, "href");
  void desc;
});
await p.fill("#name", "Test Visitor");
await p.fill("#email", "test@example.com");
await p.fill("#message", "I would love a new packaging concept.");
const [req] = await Promise.all([
  p.waitForEvent("request", { predicate: (r) => r.url().startsWith("mailto:"), timeout: 3000 }).catch(() => null),
  p.getByRole("button", { name: /send message/i }).click(),
]);
await p.waitForTimeout(500);
console.log("form status:", await p.locator("#form-status").innerText());
if (req) console.log("mailto:", decodeURIComponent(req.url()).slice(0, 120));
if (shot) {
  await p.locator('section[aria-label="Contact form"]').screenshot({ path: shot });
}
await b.close();
