"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Download, FileText, Image as ImageIcon, Layers, Presentation as PresentIcon, Search, Sparkles } from "lucide-react";
import { projects } from "@/data/projects";
import { navLinks, profile } from "@/data/profile";
import { useGame } from "@/components/game/GameProvider";
import { cn } from "@/lib/utils";

export const openPalette = () => window.dispatchEvent(new CustomEvent("ka:palette"));
export const startPresentation = (from = 0) => window.dispatchEvent(new CustomEvent("ka:present", { detail: from }));

type Item = { id: string; label: string; hint: string; group: string; icon: React.ReactNode; run: () => void; keywords?: string };

/** Subsequence fuzzy score: higher is better, -1 means no match. */
function score(query: string, text: string) {
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  const t = text.toLowerCase();
  const direct = t.indexOf(q);
  if (direct >= 0) return 100 - direct;
  let ti = 0;
  let s = 0;
  for (const ch of q) {
    const found = t.indexOf(ch, ti);
    if (found < 0) return -1;
    s += found === ti ? 3 : 1;
    ti = found + 1;
  }
  return s;
}

/** ⌘K / Ctrl+K command palette: jump to any case study, page or action. */
export function CommandPalette() {
  const router = useRouter();
  const { playMode, setPlayMode } = useGame();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("ka:palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("ka:palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset the query each time the palette opens
    setQ("");
    setSel(0);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      document.body.style.overflow = prev;
      opener?.focus?.();
    };
  }, [open]);

  const items: Item[] = useMemo(() => {
    const go = (href: string) => () => {
      setOpen(false);
      router.push(href);
    };
    return [
      ...projects.map((p) => ({
        id: p.slug,
        label: p.title,
        hint: `${p.index} · ${p.kind === "Client" ? "Client work" : "Academic"} · ${p.category}`,
        group: "Case studies",
        icon: <Layers className="size-4" aria-hidden />,
        keywords: `${p.brand} ${p.filters.join(" ")} ${p.disciplines.join(" ")}`,
        run: go(`/work/${p.slug}`),
      })),
      ...navLinks.map((l) => ({ id: `page-${l.href}`, label: l.label, hint: "Page", group: "Pages", icon: <FileText className="size-4" aria-hidden />, run: go(l.href) })),
      { id: "logo-lab", label: "Logo Lab", hint: "Stress-test the logos", group: "Pages", icon: <ImageIcon className="size-4" aria-hidden />, keywords: "logos identity marks", run: go("/work#logo-lab") },
      {
        id: "present",
        label: "Start Presentation Mode",
        hint: "Full-screen slideshow of every case, made for interviews",
        group: "Actions",
        icon: <PresentIcon className="size-4" aria-hidden />,
        keywords: "slideshow present interview",
        run: () => {
          setOpen(false);
          startPresentation(0);
        },
      },
      {
        id: "pdf",
        label: "Download portfolio PDF",
        hint: "16-page Profile & Portfolio",
        group: "Actions",
        icon: <Download className="size-4" aria-hidden />,
        keywords: "cv resume download",
        run: () => {
          setOpen(false);
          const a = document.createElement("a");
          a.href = profile.portfolioPdf;
          a.download = "";
          a.click();
        },
      },
      {
        id: "profile-pdf",
        label: "Download Executive Profile",
        hint: "35-page profile: mission, impact, vision and all case studies",
        group: "Actions",
        icon: <Download className="size-4" aria-hidden />,
        keywords: "executive profile cv resume pdf vision mission",
        run: () => {
          setOpen(false);
          const a = document.createElement("a");
          a.href = profile.profilePdf;
          a.download = "";
          a.click();
        },
      },
      {
        id: "play",
        label: `Turn play mode ${playMode ? "off" : "on"}`,
        hint: "Animations, cursor and archive game",
        group: "Actions",
        icon: <Sparkles className="size-4" aria-hidden />,
        run: () => {
          setPlayMode(!playMode);
          setOpen(false);
        },
      },
    ];
  }, [router, playMode, setPlayMode]);

  const results = useMemo(() => {
    if (!q.trim()) return items;
    return items
      .map((it) => ({ it, s: Math.max(score(q, it.label) * 2, score(q, `${it.hint} ${it.keywords ?? ""}`)) }))
      .filter((r) => r.s >= 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.it);
  }, [q, items]);

  const safeSel = Math.min(sel, Math.max(0, results.length - 1));

  useEffect(() => {
    listRef.current?.querySelector(`[data-idx="${safeSel}"]`)?.scrollIntoView({ block: "nearest" });
  }, [safeSel]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      results[safeSel]?.run();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          data-chrome
          className="fixed inset-0 z-[96] flex items-start justify-center bg-navy/55 px-3 pt-[12vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ y: -16, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="w-full max-w-xl overflow-hidden rounded-2xl bg-ivory shadow-2xl ring-1 ring-ink/10"
          >
            <div className="flex items-center gap-3 border-b border-ink/10 px-4">
              <Search className="size-5 text-muted" aria-hidden />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setSel(0);
                }}
                onKeyDown={onKeyDown}
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-list"
                aria-activedescendant={results[safeSel] ? `pal-${results[safeSel].id}` : undefined}
                aria-label="Search work, pages and actions"
                placeholder="Search work, pages, actions…"
                className="h-14 w-full bg-transparent t-body outline-none placeholder:text-muted"
              />
              <kbd className="rounded border border-ink/15 px-1.5 py-0.5 font-mono text-[0.7rem] text-muted">Esc</kbd>
            </div>
            <ul ref={listRef} id="palette-list" role="listbox" className="max-h-[52vh] overflow-y-auto p-2">
              {results.length === 0 && <li className="px-3 py-6 text-center t-small text-muted">No matches for “{q}”.</li>}
              {results.map((it, i) => {
                const header = i === 0 || results[i - 1].group !== it.group ? it.group : null;
                return (
                  <li key={it.id} role="presentation">
                    {header && <p className="px-3 pt-3 pb-1 t-label text-[0.65rem] text-muted">{header}</p>}
                    <div
                      id={`pal-${it.id}`}
                      role="option"
                      aria-selected={i === safeSel}
                      data-idx={i}
                      onMouseMove={() => setSel(i)}
                      onClick={() => it.run()}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5",
                        i === safeSel ? "bg-navy text-ivory" : "text-ink hover:bg-ink/5",
                      )}
                    >
                      <span className={cn("grid size-8 shrink-0 place-items-center rounded-md", i === safeSel ? "bg-ivory/15" : "bg-ink/5")}>{it.icon}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[0.95rem] font-medium">{it.label}</span>
                        <span className={cn("block truncate text-[0.8rem]", i === safeSel ? "text-ivory/70" : "text-muted")}>{it.hint}</span>
                      </span>
                      {i === safeSel && <ArrowRight className="size-4 shrink-0" aria-hidden />}
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="flex items-center justify-between border-t border-ink/10 px-4 py-2.5 text-[0.75rem] text-muted">
              <span>
                <kbd className="font-mono">↑↓</kbd> navigate · <kbd className="font-mono">Enter</kbd> open
              </span>
              <span>
                <kbd className="font-mono">Ctrl/⌘ K</kbd> toggle
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
