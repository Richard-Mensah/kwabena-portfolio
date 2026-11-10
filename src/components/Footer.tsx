import Link from "next/link";
import Image from "next/image";
import { ArrowUp, ArrowUpRight, Download } from "lucide-react";
import { activeSocials, navLinks, profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { logos } from "@/data/logos";

export function Footer() {
  const socials = activeSocials();
  const clientCases = projects.filter((p) => p.kind === "Client").length;
  return (
    <footer data-chrome className="relative overflow-hidden bg-[linear-gradient(180deg,var(--color-navy),#0f1526)] text-ivory">
      <div aria-hidden className="mesh-navy pointer-events-none absolute inset-0 opacity-70" />
      <div className="relative mx-auto max-w-[1600px] px-5 pb-10 sm:px-8 lg:px-12">
        {/* Big CTA */}
        <div className="flex flex-col gap-10 border-b border-ivory/15 py-20 lg:flex-row lg:items-end lg:justify-between">
          <p className="t-page max-w-[14ch]">
            Got a brief? <span className="serif-accent text-signal">Let&apos;s talk.</span>
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex h-14 items-center gap-2 rounded-full bg-signal px-7 text-[0.85rem] font-semibold tracking-[0.08em] text-ink uppercase transition-colors hover:bg-ivory"
            >
              Start a project <ArrowUpRight className="size-4" aria-hidden />
            </Link>
            <a
              href={profile.portfolioPdf}
              download
              className="inline-flex h-14 items-center gap-2 rounded-full border border-ivory/30 px-7 text-[0.85rem] font-semibold tracking-[0.08em] uppercase transition-colors hover:border-ivory hover:bg-ivory hover:text-navy"
            >
              <Download className="size-4" aria-hidden /> Portfolio PDF
            </a>
            <a
              href={profile.profilePdf}
              download
              className="inline-flex h-14 items-center gap-2 rounded-full border border-ivory/30 px-7 text-[0.85rem] font-semibold tracking-[0.08em] uppercase transition-colors hover:border-ivory hover:bg-ivory hover:text-navy"
            >
              <Download className="size-4" aria-hidden /> Executive Profile
            </a>
          </div>
        </div>

        <div className="grid gap-12 pt-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Image
              src="/images/brand/ka-logo-light.png"
              alt={`${profile.name}, ${profile.title}. Design, Inspire, Communicate.`}
              width={1429}
              height={472}
              className="h-auto w-full max-w-[22rem]"
            />
            <p className="mt-6 max-w-sm t-small text-ivory/65">{profile.statement}</p>
          </div>
          <div className="grid grid-cols-3 gap-4 md:col-span-4">
            {[
              [projects.length, "case studies"],
              [clientCases, "client projects"],
              [logos.length, "logos"],
            ].map(([n, l]) => (
              <div key={String(l)} className="border-t border-ivory/15 pt-3">
                <p className="text-[2rem] leading-none font-semibold tracking-[-0.04em]">{String(n).padStart(2, "0")}</p>
                <p className="mt-1 text-[0.8rem] text-ivory/60">{l}</p>
              </div>
            ))}
          </div>
          <nav aria-label="Footer" className="md:col-span-2 md:col-start-11">
            <p className="t-label text-ivory/50">Navigate</p>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="t-body text-ivory/80 hover:text-ivory hover:underline hover:underline-offset-4">
                    {l.label}
                  </Link>
                </li>
              ))}
              {socials.map(([label, url]) => (
                <li key={label}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="t-body text-ivory/80 hover:text-ivory hover:underline">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p
          aria-hidden
          className="mt-16 overflow-hidden pb-[0.12em] text-[clamp(3.5rem,13.5vw,14rem)] leading-[0.9] font-semibold tracking-[-0.06em] whitespace-nowrap text-ivory/[0.06] select-none"
        >
          Acheampong
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-ivory/15 pt-6 t-small text-ivory/60">
          <p>© 2026 {profile.name}. All rights reserved.</p>
          <p className="hidden sm:block">
            Press <kbd className="rounded border border-ivory/25 px-1.5 font-mono text-[0.75rem]">Ctrl K</kbd> to search everything
          </p>
          <a href="#top" className="group flex items-center gap-2 hover:text-ivory">
            Back to top
            <ArrowUp className="size-4 transition-transform group-hover:-translate-y-0.5" aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  );
}
