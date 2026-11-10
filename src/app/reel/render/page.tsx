import type { Metadata } from "next";
import { ReelRenderer } from "./renderer";

export const metadata: Metadata = { title: "Showreel render", robots: { index: false, follow: false } };

/** Internal route used by scripts/render-reel.mjs to draw the showreel frame by frame. */
export default function ReelRenderPage() {
  return (
    <>
      <style>{`[data-chrome], .loader { display: none !important; } .grain::after { display: none !important; } html, body { margin: 0; background: #171717 !important; overflow: hidden; }`}</style>
      <ReelRenderer />
    </>
  );
}
