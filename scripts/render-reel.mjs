// Renders the showreel to MP4: draws /reel/render frame by frame and encodes with ffmpeg (H.264, web-optimised).
// Usage: node scripts/render-reel.mjs [baseUrl] [ffmpegPath]
// Writes public/video/kwabena-showreel.mp4 and public/video/kwabena-showreel-poster.jpg
import { chromium } from "playwright";
import { spawn, execSync } from "node:child_process";
import fs from "node:fs";

const base = process.argv[2] ?? "http://localhost:3456";
const ffmpeg =
  process.argv[3] ?? execSync(`python -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"`).toString().trim();
fs.mkdirSync("public/video", { recursive: true });

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await p.goto(`${base}/reel/render`, { waitUntil: "networkidle" });
await p.waitForFunction(() => !!window.__reel);
await p.evaluate(() => window.__reel.ready());
const { duration, fps } = await p.evaluate(() => ({ duration: window.__reel.duration, fps: window.__reel.fps }));
const frames = Math.round(duration * fps);
console.log(`Rendering ${frames} frames (${duration.toFixed(1)} s @ ${fps} fps)`);

const enc = spawn(
  ffmpeg,
  [
    "-y", "-f", "image2pipe", "-framerate", String(fps), "-c:v", "mjpeg", "-i", "-",
    "-c:v", "libx264", "-preset", "slow", "-crf", "23", "-pix_fmt", "yuv420p", "-profile:v", "high",
    "-movflags", "+faststart", "-an", "public/video/kwabena-showreel.mp4",
  ],
  { stdio: ["pipe", "inherit", "inherit"] },
);

const t0 = Date.now();
for (let f = 0; f < frames; f++) {
  const t = f / fps;
  await p.evaluate((v) => window.__reel.setT(v), t);
  const buf = await p.screenshot({ type: "jpeg", quality: 95 });
  if (!enc.stdin.write(buf)) await new Promise((r) => enc.stdin.once("drain", r));
  // Poster: scene 1, fully revealed
  if (Math.abs(t - 5.2) < 0.5 / fps) fs.writeFileSync("public/video/kwabena-showreel-poster.jpg", await p.screenshot({ type: "jpeg", quality: 82 }));
  if (f % 150 === 0) console.log(`  frame ${f}/${frames}  ${((Date.now() - t0) / 1000).toFixed(0)} s`);
}
enc.stdin.end();
await new Promise((r) => enc.on("close", r));
await b.close();
const mb = (fs.statSync("public/video/kwabena-showreel.mp4").size / 1048576).toFixed(1);
console.log(`Done: public/video/kwabena-showreel.mp4 (${mb} MB) in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
