import { chromium } from "playwright";
const base = process.argv[2] ?? "http://localhost:3456";
const routes = ["/", "/work", "/gallery", "/about", "/services", "/contact", ...["chris-gold-buying-agent","clichy-gold-agent","nhyira-flour","royal-chop-delicacies","fans-liquid-soap","gifty-beauty-salon","kelewele-fest-26","highlife-brownies","wedding-naming-invitation","cherrys-sobolo","aj-lingerie-and-beads","silver-package","independence-weekend","ghana-independence-day","jeysicles-ice-cream","ttu-src-week"].map((s) => "/work/" + s)];
const b = await chromium.launch(); const bad = [];
for (const w of [1440, 1024, 768, 390, 360]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 800 } });
  await ctx.addInitScript(() => sessionStorage.setItem("ka-seen", "1"));
  const p = await ctx.newPage();
  for (const r of routes) {
    await p.goto(base + r, { waitUntil: "load" });
    const sw = await p.evaluate(() => document.documentElement.scrollWidth);
    if (sw > w) bad.push(`${r} @${w}: scrollWidth ${sw}`);
  }
  await ctx.close();
}
await b.close();
console.log(bad.length ? bad.join("\n") : "No horizontal overflow on any route/width.");
