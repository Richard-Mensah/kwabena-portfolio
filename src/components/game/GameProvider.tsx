"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import { projects } from "@/data/projects";

export const ACHIEVEMENTS = {
  "first-look": { title: "First Look", text: "You opened your first case study." },
  curator: { title: "Curator", text: "Every case study explored. Studio Pass unlocked." },
  "colour-eye": { title: "Colour Eye", text: "You read the palettes like a designer." },
  connector: { title: "Connector", text: "You made it to the conversation." },
  "gallery-walker": { title: "Gallery Walker", text: "You studied 10 pieces up close in the gallery." },
  "xray-vision": { title: "X-Ray Vision", text: "You looked under the hood of a design." },
  "logo-lab": { title: "Logo Lab", text: "You stress-tested a logo like an art director." },
  "colour-hunter": { title: "Colour Hunter", text: "You searched the work by colour." },
  presenter: { title: "Presenter", text: "You launched Presentation Mode." },
  director: { title: "Director's Cut", text: "You caught every spark in the showreel." },
} as const;
export type AchievementId = keyof typeof ACHIEVEMENTS;

type Store = { viewed: string[]; gallery: string[]; achievements: AchievementId[]; playMode: boolean };
const KEY = "ka-studio-v1";
const TOTAL = projects.length;

type Ctx = Store & {
  ready: boolean;
  /** Play mode, also respecting prefers-reduced-motion. */
  play: boolean;
  total: number;
  markViewed: (slug: string) => void;
  markGallery: (id: string) => void;
  unlock: (id: AchievementId) => void;
  setPlayMode: (on: boolean) => void;
  reset: () => void;
};

const GameContext = createContext<Ctx | null>(null);

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside <GameProvider>");
  return ctx;
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const [store, setStore] = useState<Store>({ viewed: [], gallery: [], achievements: [], playMode: true });
  const [ready, setReady] = useState(false);
  const [toasts, setToasts] = useState<{ key: number; id: AchievementId }[]>([]);
  const toastKey = useRef(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<Store>;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate persisted state once on mount
        setStore((s) => ({
          viewed: Array.isArray(saved.viewed) ? saved.viewed : s.viewed,
          gallery: Array.isArray(saved.gallery) ? saved.gallery : s.gallery,
          achievements: Array.isArray(saved.achievements) ? saved.achievements.filter((a) => a in ACHIEVEMENTS) : s.achievements,
          playMode: typeof saved.playMode === "boolean" ? saved.playMode : s.playMode,
        }));
      }
    } catch {
      /* storage unavailable: play without persistence */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(store));
    } catch {}
    document.documentElement.classList.toggle("ka-calm", !store.playMode);
  }, [store, ready]);

  const pushToast = useCallback((id: AchievementId) => {
    const key = ++toastKey.current;
    setToasts((t) => (t.some((x) => x.id === id) ? t : [...t, { key, id }]));
    setTimeout(() => setToasts((t) => t.filter((x) => x.key !== key)), 4200);
  }, []);

  const unlock = useCallback(
    (id: AchievementId) => {
      setStore((s) => {
        if (s.achievements.includes(id)) return s;
        if (s.playMode) queueMicrotask(() => pushToast(id));
        return { ...s, achievements: [...s.achievements, id] };
      });
    },
    [pushToast],
  );

  const markViewed = useCallback(
    (slug: string) => {
      setStore((s) => {
        if (s.viewed.includes(slug)) return s;
        const viewed = [...s.viewed, slug];
        queueMicrotask(() => {
          if (viewed.length === 1) unlock("first-look");
          if (viewed.length >= TOTAL) unlock("curator");
        });
        return { ...s, viewed };
      });
    },
    [unlock],
  );

  const markGallery = useCallback(
    (id: string) => {
      setStore((s) => {
        if (s.gallery.includes(id)) return s;
        const gallery = [...s.gallery, id];
        if (gallery.length >= 10) queueMicrotask(() => unlock("gallery-walker"));
        return { ...s, gallery };
      });
    },
    [unlock],
  );

  const value = useMemo<Ctx>(
    () => ({
      ...store,
      ready,
      // Apply the reduced-motion override only after mount so server and first client render match.
      play: store.playMode && !(ready && reduced),
      total: TOTAL,
      markViewed,
      markGallery,
      unlock,
      setPlayMode: (on) => setStore((s) => ({ ...s, playMode: on })),
      reset: () => setStore((s) => ({ ...s, viewed: [], gallery: [], achievements: [] })),
    }),
    [store, ready, reduced, markViewed, markGallery, unlock],
  );

  return (
    <GameContext.Provider value={value}>
      <MotionConfig reducedMotion="user">
        {children}
        <div
          data-chrome
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed top-20 right-4 z-[70] flex flex-col items-end gap-2 sm:right-6"
        >
          <AnimatePresence>
            {toasts.map(({ key, id }) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, transition: { duration: 0.25 } }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                className="flex max-w-xs items-center gap-3 rounded-full bg-navy py-2 pr-5 pl-2 text-ivory shadow-2xl shadow-black/30"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-signal text-sm" aria-hidden>
                  ✦
                </span>
                <span className="leading-tight">
                  <span className="t-label block text-[0.62rem] text-ivory/60">Achievement unlocked</span>
                  <span className="block text-sm font-semibold">{ACHIEVEMENTS[id].title}</span>
                  <span className="block text-xs text-ivory/70">{ACHIEVEMENTS[id].text}</span>
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </MotionConfig>
    </GameContext.Provider>
  );
}
