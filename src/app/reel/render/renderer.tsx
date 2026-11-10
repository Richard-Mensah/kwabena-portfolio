"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { ReelFrame } from "@/components/reel/ReelFrame";
import { REEL, REEL_DURATION, REEL_SCENES } from "@/data/reel";

declare global {
  interface Window {
    __reel?: { duration: number; fps: number; setT: (t: number) => void; ready: () => Promise<void> };
  }
}

export function ReelRenderer() {
  const [t, setT] = useState(0);

  useEffect(() => {
    const srcs = [...REEL_SCENES.map((p) => p.image.src), "/images/brand/ka-logo-light.png"];
    const ready = async () => {
      await Promise.all(
        srcs.map(
          (s) =>
            new Promise<void>((res) => {
              const im = new Image();
              im.onload = () => im.decode().then(() => res(), () => res());
              im.onerror = () => res();
              im.src = s;
            }),
        ),
      );
      await document.fonts.ready;
    };
    window.__reel = { duration: REEL_DURATION, fps: REEL.fps, setT: (v) => flushSync(() => setT(v)), ready };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#171717" }}>
      <ReelFrame t={t} />
    </div>
  );
}
