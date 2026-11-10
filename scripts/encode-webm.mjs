// Encodes the rendered showreel MP4 to a VP9 WebM companion (for browsers without H.264).
// Usage: node scripts/encode-webm.mjs [ffmpegPath]
import { execSync, spawnSync } from "node:child_process";
import fs from "node:fs";
const ffmpeg = process.argv[2] ?? execSync(`python -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"`).toString().trim();
const r = spawnSync(ffmpeg, ["-y", "-i", "public/video/kwabena-showreel.mp4", "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "34", "-deadline", "good", "-cpu-used", "3", "-row-mt", "1", "-an", "public/video/kwabena-showreel.webm"], { stdio: "inherit" });
if (r.status) process.exit(r.status);
console.log(`WebM: ${(fs.statSync("public/video/kwabena-showreel.webm").size / 1048576).toFixed(1)} MB`);
