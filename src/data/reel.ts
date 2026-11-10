import { projects, type Project } from "@/data/projects";

/** The showreel cut: every client piece, then three academic highlights. Shared by the video renderer and the homepage player. */
export const REEL_SCENES: Project[] = [
  ...projects.filter((p) => p.kind === "Client"),
  ...["cherrys-sobolo", "independence-weekend", "ttu-src-week"].map((s) => projects.find((p) => p.slug === s)!),
];

export const REEL = {
  fps: 30,
  width: 1920,
  height: 1080,
  intro: 3,
  scene: 4.6,
  outro: 3.6,
  video: "/video/kwabena-showreel.mp4",
  webm: "/video/kwabena-showreel.webm",
  poster: "/video/kwabena-showreel-poster.jpg",
} as const;

export const REEL_DURATION = REEL.intro + REEL_SCENES.length * REEL.scene + REEL.outro;
export const sceneStart = (i: number) => REEL.intro + i * REEL.scene;

/** Which scene a playback time belongs to (intro counts as scene 0, outro as the last). */
export function sceneAt(t: number) {
  return Math.min(REEL_SCENES.length - 1, Math.max(0, Math.floor((t - REEL.intro) / REEL.scene)));
}
