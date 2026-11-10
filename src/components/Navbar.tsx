"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Command, Menu, Sparkles, X } from "lucide-react";
import { openPalette } from "@/components/innovations/CommandPalette";
import { isActive, navLinks, profile } from "@/data/profile";
import { useGame } from "@/components/game/GameProvider";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { playMode, setPlayMode } = useGame();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Mobile menu: lock scroll, Escape to close, trap focus, restore focus.
  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && menuRef.current) {
        const items = Array.from(menuRef.current.querySelectorAll<HTMLElement>("a,button"));
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
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      toggle?.focus();
    };
  }, [open]);

  return (
    <>
      <header
        data-chrome
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500",
          scrolled ? "border-b border-ink/10 bg-ivory/85 backdrop-blur-md" : "border-b border-transparent",
        )}
      >
        <nav aria-label="Primary" className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
          <Link href="/" className="group flex items-center gap-3" aria-label={`${profile.name}, home`}>
            <Image
              src="/images/brand/ka-mark.png"
              alt=""
              width={598}
              height={351}
              priority
              className="h-8 w-auto transition-transform duration-500 group-hover:-translate-y-0.5"
            />
            <span className="hidden leading-none sm:block">
              <span className="block text-[0.82rem] font-semibold tracking-[0.08em] uppercase">{profile.name}</span>
              <span className="mt-1 block text-[0.75rem] text-muted">{profile.shortTitle}</span>
            </span>
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            <ul className="flex items-center gap-6">
              {navLinks.map((l) => {
                const on = isActive(pathname, l.href);
                return (
                  <li key={l.href}>
                    <Link href={l.href} aria-current={on ? "page" : undefined} className="group relative py-2 text-[0.9rem] font-medium">
                      {l.label}
                      <span
                        className={cn(
                          "absolute -bottom-0.5 left-0 h-[1.5px] w-full origin-left bg-signal transition-transform duration-500 ease-[var(--ease-expo)]",
                          on ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
            <SearchButton />
            <PlayToggle on={playMode} onChange={setPlayMode} />
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <SearchButton compact />
            <PlayToggle on={playMode} onChange={setPlayMode} compact />
            <button
              ref={toggleRef}
              type="button"
              className="grid size-11 place-items-center rounded-full border border-ink/15"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu className="size-5" />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[80] flex flex-col bg-navy px-6 pt-5 pb-8 text-ivory"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between">
              <span className="t-label text-ivory/60">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-11 place-items-center rounded-full border border-ivory/25"
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </div>
            <ul className="mt-auto">
              {navLinks.map((l, i) => (
                <li key={l.href} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.15 + i * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive(pathname, l.href) ? "page" : undefined}
                      className="flex items-baseline gap-4 py-1 text-[clamp(2.5rem,11vw,4.25rem)] leading-[1.05] font-semibold tracking-[-0.045em] aria-[current=page]:text-signal"
                    >
                      <span className="t-label text-ivory/50">0{i + 1}</span>
                      {l.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
            {profile.availability && (
              <p className="mt-10 flex items-center gap-2 border-t border-ivory/15 pt-6 t-small">
                <span className="size-2 rounded-full bg-signal" aria-hidden />
                {profile.availability}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function SearchButton({ compact }: { compact?: boolean }) {
  return (
    <button
      type="button"
      onClick={openPalette}
      aria-label="Search work and actions (Ctrl or Command + K)"
      data-testid="open-palette"
      className="flex h-10 items-center gap-2 rounded-full border border-ink/15 px-3.5 text-[0.8rem] font-medium transition-colors hover:border-ink"
    >
      <Command className="size-4" aria-hidden />
      {!compact && <span className="font-mono text-[0.72rem] text-muted">Ctrl K</span>}
    </button>
  );
}

function PlayToggle({ on, onChange, compact }: { on: boolean; onChange: (v: boolean) => void; compact?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label="Play mode: animations, cursor and archive game"
      onClick={() => onChange(!on)}
      data-cursor={on ? "Calm" : "Play"}
      className={cn(
        "flex h-10 items-center gap-2 rounded-full border px-3.5 text-[0.8rem] font-medium transition-colors",
        on ? "border-navy bg-navy text-ivory" : "border-ink/15 hover:border-ink",
      )}
    >
      <Sparkles className="size-4" aria-hidden />
      {compact ? <span className="sr-only">Play mode</span> : <span>Play {on ? "on" : "off"}</span>}
    </button>
  );
}
