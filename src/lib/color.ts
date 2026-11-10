/** Colour maths for "Search work by colour": hex → OKLab and perceptual distance. */

export type Lab = [number, number, number];

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const lin = (c: number) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

export function hexToOklab(hex: string): Lab {
  const [r, g, b] = hexToRgb(hex).map(lin);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

export function deltaE(a: Lab, b: Lab) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

/** Smallest distance between a target colour and any colour of a palette. */
export function paletteDistance(target: string, palette: string[]) {
  const t = hexToOklab(target);
  return Math.min(...palette.map((c) => deltaE(t, hexToOklab(c))));
}

/** Chroma (colourfulness) — used to keep near-greys out of the Colour DNA strip. */
export function chroma(hex: string) {
  const [, a, b] = hexToOklab(hex);
  return Math.hypot(a, b);
}

export function hue(hex: string) {
  const [, a, b] = hexToOklab(hex);
  return (Math.atan2(b, a) * 180) / Math.PI;
}

/** Readable text colour (ink or white) for a given background. */
export function onColor(hex: string) {
  return hexToOklab(hex)[0] > 0.68 ? "#171717" : "#ffffff";
}
