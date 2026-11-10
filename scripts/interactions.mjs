// Functional checks for interactions, game and innovations. Usage: node scripts/interactions.mjs <baseUrl> <outDir>
import { chromium } from "playwright";

const [base = "http://localhost:3456", out = "qa-shots"] = process.argv.slice(2);
const results = [];
const check = (name, ok, extra = "") => results.push(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? " — " + extra : ""}`);
const browser = await chromium.launch();
const errors = [];

async function newPage(opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  await ctx.addInitScript(() => sessionStorage.setItem("ka-seen", "1"));
  const page = await ctx.newPage();
  page.setDefaultTimeout(10000);
  page.on("pageerror", (e) => errors.push(e.message));
  return { ctx, page };
}

// ---------------- Desktop ----------------
{
  const { ctx, page } = await newPage();

  for (const r of ["/", "/work", "/gallery", "/about", "/services", "/contact"]) {
    const res = await page.goto(base + r, { waitUntil: "load" });
    check(`Route ${r} returns 200`, res.status() === 200, String(res.status()));
  }

  // Work: filters
  await page.goto(base + "/work", { waitUntil: "networkidle" });
  const grid = page.locator('main section[aria-label="Projects"]');
  const cards = () => grid.locator('a[href^="/work/"]').count();
  const slugs = await grid.locator('a[href^="/work/"]').evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute("href")))]);
  const all = await cards();
  await page.getByRole("group", { name: "Filter by type" }).getByRole("button", { name: /^Client work/ }).click();
  await page.waitForTimeout(900);
  const client = await cards();
  await page.getByRole("group", { name: "Filter by type" }).getByRole("button", { name: /^All/ }).click();
  await page.getByRole("group", { name: "Filter by discipline" }).getByRole("button", { name: /^Packaging/ }).click();
  await page.waitForTimeout(900);
  const packaging = await cards();
  await page.getByRole("group", { name: "Filter by discipline" }).getByRole("button", { name: /^All/ }).click();
  await page.waitForTimeout(700);
  check("Work: 16 cases; Type=Client shows 9; Discipline=Packaging shows 3", all === 16 && client === 9 && packaging === 3, `all=${all} client=${client} packaging=${packaging}`);

  // Innovation 3: search by colour
  await page.locator('[data-testid="dna-swatch"]').first().click();
  await page.waitForTimeout(900);
  const colourCount = await cards();
  const badge = await page.getByText("Closest colour match").count();
  check("Colour search filters & ranks work", colourCount > 0 && colourCount < 16 && badge === 1, `matches=${colourCount}`);
  await page.screenshot({ path: `${out}/colour-search.png` });

  // Innovation 4: Logo Lab
  await page.locator("#logo-lab").scrollIntoViewIfNeeded();
  await page.locator('[data-testid="ground-ivory"]').click();
  await page.getByRole("tab", { name: /Dove Music/ }).click();
  await page.locator("#logo-size").fill("64");
  await page.getByRole("button", { name: "Invert" }).click();
  await page.waitForTimeout(500);
  const sizeLabel = await page.locator("#logo-lab").getByText(/64px · /).count();
  check("Logo Lab: ground, logo, scale & invert controls respond", sizeLabel === 1);
  await page.screenshot({ path: `${out}/logo-lab.png` });

  // Innovation 1 + 2: case page X-Ray and Mockup Studio
  await page.goto(base + "/work/clichy-gold-agent", { waitUntil: "networkidle" });
  await page.locator('[data-testid="stage-xray"]').click();
  await page.waitForTimeout(800);
  const pins = await page.getByRole("button", { name: /^Design note \d/ }).count();
  await page.getByRole("button", { name: /^Design note 1/ }).click();
  const note = await page.getByRole("note").count();
  await page.screenshot({ path: `${out}/xray.png` });
  check("Design X-Ray shows pins and opens a note", pins >= 4 && note === 1, `pins=${pins}`);
  await page.locator('[data-testid="stage-context"]').click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}/context.png` });
  const card = await page.getByRole("button", { name: /Business card, showing the front/ }).count();
  check("Mockup Studio renders scene + 3D business card", card >= 1);

  // Innovation 5: command palette
  await page.keyboard.press("Control+k");
  await page.waitForTimeout(400);
  await page.keyboard.type("kelewele");
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${out}/palette.png` });
  await page.keyboard.press("Enter");
  await page.waitForURL("**/work/kelewele-fest-26", { timeout: 8000 }).catch(() => {});
  check("Command palette searches and navigates (Ctrl+K → Enter)", page.url().endsWith("/work/kelewele-fest-26"), page.url());

  // Presentation mode
  await page.getByRole("button", { name: "Present from here" }).click();
  await page.waitForTimeout(800);
  const label1 = await page.getByRole("dialog").getAttribute("aria-label");
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(900);
  const label2 = await page.getByRole("dialog").getAttribute("aria-label");
  await page.screenshot({ path: `${out}/presentation.png` });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(700);
  const presClosed = (await page.getByRole("dialog").count()) === 0;
  check("Presentation Mode advances with → and exits with Esc", /slide 7 of 16/.test(label1 ?? "") && /slide 8 of 16/.test(label2 ?? "") && presClosed, `${label1} → ${label2}`);

  // Contact form
  await page.goto(base + "/contact", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /send message/i }).click();
  const errCount = await page.locator("form [id$='-error']").count();
  check("Form: shows 3 validation errors on empty submit", errCount === 3, `errors=${errCount}`);

  // Gallery: every works.pdf image + lightbox
  await page.goto(base + "/gallery", { waitUntil: "networkidle" });
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 700) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(80);
  }
  const loaded = await page.evaluate(() =>
    [
      "royal-chop-menu-flyer", "royal-chop-social-offer", "gifty-beauty-salon", "kelewele-fest-26", "highlife-brownies", "nhyira-flour",
      "wedding-naming-invitation", "fans-liquid-soap", "clichy-gold-ad", "clichy-business-card", "chris-gold-logo", "chris-gold-merch-mockups",
      "gather-and-grow", "afia-noodles-hub", "fifth-anniversary", "dove-music",
    ].filter((n) => [...document.images].some((i) => decodeURIComponent(i.currentSrc || i.src).includes(n) && i.naturalWidth > 0)),
  );
  check("Gallery renders all 16 works.pdf artworks", loaded.length === 16, `${loaded.length}/16`);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.getByRole("button", { name: /in full screen/ }).first().click();
  await page.waitForTimeout(600);
  for (let k = 0; k < 10; k++) {
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(220);
  }
  const counter = await page.getByRole("dialog").getAttribute("aria-label");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(800);
  check("Gallery lightbox steps with arrows and closes with Esc", /image 11 of \d+/.test(counter ?? "") && (await page.getByRole("dialog").count()) === 0, counter ?? "");

  // Archive: collect every case
  for (const s of slugs) {
    await page.goto(base + s, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(350);
  }
  const store = await page.evaluate(() => JSON.parse(localStorage.getItem("ka-studio-v1") || "{}"));
  check(`Archive: all ${slugs.length} cases collected`, store.viewed?.length === slugs.length, `viewed=${store.viewed?.length}`);
  const want = ["first-look", "curator", "connector", "gallery-walker", "colour-hunter", "logo-lab", "xray-vision", "presenter"];
  check("Achievements unlocked (incl. new innovations)", want.every((a) => store.achievements?.includes(a)), JSON.stringify(store.achievements));

  const res404 = await page.goto(base + "/work/does-not-exist");
  check("Unknown case study returns 404", res404.status() === 404, String(res404.status()));
  await ctx.close();
}

// ---------------- Mobile ----------------
{
  const { ctx, page } = await newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.waitForTimeout(900);
  const open = await page.getByRole("dialog", { name: "Menu" }).isVisible();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(900);
  check("Mobile menu opens and closes with Escape", open && (await page.getByRole("dialog", { name: "Menu" }).count()) === 0);
  await page.getByTestId("open-palette").locator("visible=true").click();
  await page.waitForTimeout(500);
  check("Mobile: command palette opens from nav button", (await page.getByRole("dialog", { name: "Command palette" }).count()) === 1);
  await ctx.close();
}

// ---------------- Reduced motion ----------------
{
  const { ctx, page } = await newPage({ reducedMotion: "reduce" });
  await page.goto(base + "/", { waitUntil: "networkidle" });
  const loaderShown = await page.locator(".loader").isVisible();
  const canvas = await page.locator("main canvas").count();
  check("Reduced motion: no loader, no canvas field", !loaderShown && canvas === 0, `loader=${loaderShown} canvas=${canvas}`);
  await ctx.close();
}

await browser.close();
console.log(results.join("\n"));
console.log(errors.length ? "Page errors:\n" + errors.join("\n") : "No page errors.");
