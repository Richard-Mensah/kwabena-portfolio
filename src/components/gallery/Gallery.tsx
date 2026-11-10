"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Expand, X } from "lucide-react";
import { galleryItems, type GalleryKind } from "@/data/gallery";
import { useGame } from "@/components/game/GameProvider";
import { cn } from "@/lib/utils";

const KINDS: ("All" | GalleryKind)[] = ["All", "Artwork", "Logo", "Detail", "Portrait"];
const PLURAL: Record<string, string> = { All: "All", Artwork: "Artworks", Logo: "Logos", Detail: "Details", Portrait: "Portraits" };

export function Gallery() {
  const { gallery, play, markGallery } = useGame();
  const [kind, setKind] = useState<"All" | GalleryKind>("All");
  const [open, setOpen] = useState<number | null>(null);
  const list = kind === "All" ? galleryItems : galleryItems.filter((g) => g.kind === kind);

  const show = useCallback(
    (i: number) => {
      const n = list.length;
      const idx = ((i % n) + n) % n;
      setOpen(idx);
      markGallery(list[idx].id);
    },
    [list, markGallery],
  );

  return (
    <section aria-label="Gallery" className="pb-24 sm:pb-32">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-6 border-y border-ink/12 py-5">
          <div role="group" aria-label="Filter gallery" className="flex flex-wrap gap-2">
            {KINDS.map((k) => {
              const count = k === "All" ? galleryItems.length : galleryItems.filter((g) => g.kind === k).length;
              return (
                <button
                  key={k}
                  type="button"
                  aria-pressed={kind === k}
                  onClick={() => setKind(k)}
                  className={cn(
                    "h-10 rounded-full border px-4 text-[0.875rem] font-medium transition-colors",
                    kind === k ? "border-navy bg-navy text-ivory" : "border-ink/15 hover:border-ink",
                  )}
                >
                  {PLURAL[k]} <span className="ml-1 font-mono text-[0.75rem] opacity-60">{count}</span>
                </button>
              );
            })}
          </div>
          {play && (
            <p className="t-small text-muted">
              <span className="font-semibold text-ink">{Math.min(gallery.length, 10)}/10</span> studied up close
              {gallery.length >= 10 ? " · Gallery Walker unlocked ✦" : " · open 10 pieces to unlock Gallery Walker"}
            </p>
          )}
        </div>

        <p className="sr-only" aria-live="polite">
          Showing {list.length} items
        </p>

        <motion.ul layout className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3 2xl:columns-4">
          <AnimatePresence mode="popLayout">
            {list.map((g, i) => (
              <motion.li
                key={g.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.06 }}
                className="mb-6 break-inside-avoid"
              >
                <button
                  type="button"
                  onClick={() => show(i)}
                  data-cursor="View"
                  aria-label={`Open ${g.title} in full screen`}
                  className="group relative block w-full text-left"
                >
                  <span
                    className={cn("relative block overflow-hidden", g.kind === "Detail" ? "p-6 sm:p-8" : g.kind === "Artwork" ? "p-4 sm:p-5" : "")}
                    style={{ backgroundColor: g.tone }}
                  >
                    <Image
                      src={g.src}
                      alt={g.alt}
                      width={g.width}
                      height={g.height}
                      sizes="(min-width: 1536px) 24vw, (min-width: 1024px) 31vw, (min-width: 640px) 47vw, 100vw"
                      className="h-auto w-full transition-transform duration-[1.1s] ease-[var(--ease-expo)] group-hover:scale-[1.04]"
                    />
                    <span className="absolute inset-0 flex items-end bg-gradient-to-t from-navy/80 via-navy/0 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                      <span className="flex w-full items-center justify-between gap-3 text-ivory">
                        <span className="t-small font-medium">{g.title}</span>
                        <Expand className="size-4 shrink-0" aria-hidden />
                      </span>
                    </span>
                    {play && gallery.includes(g.id) && (
                      <span className="absolute top-3 right-3 grid size-6 place-items-center rounded-full bg-signal text-[0.65rem] text-ivory" aria-hidden>
                        ✦
                      </span>
                    )}
                  </span>
                  <span className="mt-3 flex items-baseline justify-between gap-4">
                    <span className="t-small font-medium">{g.kind === "Detail" ? g.caption : g.title}</span>
                    <span className="t-label shrink-0 text-[0.65rem] text-muted">{g.kind}</span>
                  </span>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>

      <AnimatePresence>
        {open !== null && list[open] && (
          <Lightbox key="lightbox" index={open} total={list.length} item={list[open]} onClose={() => setOpen(null)} onStep={(d) => show(open + d)} />
        )}
      </AnimatePresence>
    </section>
  );
}

function Lightbox({
  item,
  index,
  total,
  onClose,
  onStep,
}: {
  item: (typeof galleryItems)[number];
  index: number;
  total: number;
  onClose: () => void;
  onStep: (d: 1 | -1) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const start = useRef<number | null>(null);
  const [dir, setDir] = useState<1 | -1>(1);

  const step = useCallback(
    (d: 1 | -1) => {
      setDir(d);
      onStep(d);
    },
    [onStep],
  );

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      opener?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "Tab" && dialogRef.current) {
        const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("a,button"));
        const [f, l] = [items[0], items[items.length - 1]];
        if (e.shiftKey && document.activeElement === f) {
          e.preventDefault();
          l.focus();
        } else if (!e.shiftKey && document.activeElement === l) {
          e.preventDefault();
          f.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, step]);

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title}, image ${index + 1} of ${total}`}
      data-cursor="Swipe"
      className="fixed inset-0 z-[88] flex flex-col bg-navy text-ivory"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onPointerDown={(e) => (start.current = e.clientX)}
      onPointerUp={(e) => {
        if (start.current === null) return;
        const dx = e.clientX - start.current;
        start.current = null;
        if (Math.abs(dx) > 60) step(dx < 0 ? 1 : -1);
      }}
    >
      <div className="flex items-center justify-between px-5 py-4 sm:px-8">
        <p className="t-label text-ivory/70">
          <span className="text-ivory">{String(index + 1).padStart(2, "0")}</span> / {String(total).padStart(2, "0")} · {item.kind}
        </p>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className="grid size-11 place-items-center rounded-full border border-ivory/25 hover:bg-ivory hover:text-navy">
          <X className="size-5" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={item.id}
            className="relative h-[calc(100svh-11rem)] w-full"
            initial={{ opacity: 0, x: dir * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -60 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              quality={92}
              sizes="90vw"
              priority
              draggable={false}
              className="object-contain drop-shadow-2xl"
            />
          </motion.div>
        </AnimatePresence>
        <button type="button" onClick={() => step(-1)} aria-label="Previous image" className="absolute top-1/2 left-3 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-ivory/25 hover:bg-ivory hover:text-navy sm:grid">
          <ArrowLeft className="size-5" />
        </button>
        <button type="button" onClick={() => step(1)} aria-label="Next image" className="absolute top-1/2 right-3 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-ivory/25 hover:bg-ivory hover:text-navy sm:grid">
          <ArrowRight className="size-5" />
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <div>
          <p className="t-h3">{item.title}</p>
          <p className="t-small text-ivory/70">{item.caption}</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => step(-1)} aria-label="Previous image" className="grid size-11 place-items-center rounded-full border border-ivory/25 sm:hidden">
            <ArrowLeft className="size-5" />
          </button>
          <button type="button" onClick={() => step(1)} aria-label="Next image" className="grid size-11 place-items-center rounded-full border border-ivory/25 sm:hidden">
            <ArrowRight className="size-5" />
          </button>
          {item.slug && (
            <Link href={`/work/${item.slug}`} className="inline-flex h-11 items-center gap-2 rounded-full bg-signal px-5 text-[0.8rem] font-semibold tracking-[0.08em] text-ink uppercase hover:bg-ivory">
              Case study <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
