import { chromium } from "playwright";
const b = await chromium.launch();
for (const opts of [{ viewport: { width: 390, height: 844 }, hasTouch: true }, { viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" }, { viewport: { width: 390, height: 844 }, reducedMotion: "reduce" }]) {
  for (const r of ["/", "/work", "/gallery", "/about", "/work/clichy-gold-agent"]) {
    const ctx = await b.newContext(opts);
    await ctx.addInitScript(() => sessionStorage.setItem("ka-seen", "1"));
    const p = await ctx.newPage();
    const errs = [];
    p.on("pageerror", (e) => errs.push(e.message.slice(0, 90)));
    await p.goto("http://localhost:3456" + r, { waitUntil: "networkidle" });
    await p.waitForTimeout(400);
    if (errs.length) console.log(JSON.stringify(opts), r, errs);
    await ctx.close();
  }
}
await b.close();
console.log("done");
