"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Loader2 } from "lucide-react";
import { activeSocials, profile } from "@/data/profile";
import { DownloadCard } from "@/components/About";
import { useGame } from "@/components/game/GameProvider";
import { Reveal } from "@/components/motion/Reveal";
import { buildMailto, cn } from "@/lib/utils";

export function Contact() {
  const { unlock, ready } = useGame();

  useEffect(() => {
    if (ready) unlock("connector");
  }, [ready, unlock]);

  const { email, phone, whatsapp } = profile.contact;
  const socials = activeSocials();
  const channels = [
    email && { label: "Email", value: email, href: `mailto:${email}` },
    phone && { label: "Phone", value: phone, href: `tel:${phone.replace(/\s+/g, "")}` },
    whatsapp && { label: "WhatsApp", value: phone && phone.replace(/\D/g, "") === whatsapp ? phone : `+${whatsapp}`, href: `https://wa.me/${whatsapp}` },
    ...socials.map(([label, url]) => ({ label, value: url.replace(/^https?:\/\/(www\.)?/, ""), href: url })),
  ].filter(Boolean) as { label: string; value: string; href: string }[];

  return (
    <section aria-label="Contact form" className="relative overflow-hidden bg-navy py-20 text-ivory sm:py-28">
      <span className="breeze pointer-events-none absolute top-10 -right-20 size-[30rem] text-ivory/[0.05]" aria-hidden />
      <div className="relative mx-auto grid max-w-[1600px] gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
        <Reveal className="lg:col-span-5">
          <p className="t-label text-ivory/60">
            <span className="text-signal">●</span> Start a conversation
          </p>
          <p className="mt-6 t-h2">Tell me what you&apos;re building.</p>
          <p className="measure mt-6 t-body text-ivory/75">
            Whether you&apos;re building a brand, launching a product or looking for thoughtful creative direction, let&apos;s start a
            conversation. Recruiters and admissions teams are warmly welcome too.
          </p>
          {channels.length > 0 && (
            <ul className="mt-10 divide-y divide-ivory/10 border-y border-ivory/10">
              {channels.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex items-center justify-between gap-4 py-4"
                  >
                    <span className="t-label text-ivory/60">{c.label}</span>
                    <span className="flex items-center gap-3 t-body font-medium">
                      {c.value}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-10">
            <DownloadCard dark />
          </div>
        </Reveal>

        <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}

type Status = { state: "idle" | "sending" | "sent" | "error"; message?: string };
const projectTypes = ["Brand identity", "Brand strategy & direction", "Advertising / campaign", "Packaging", "Job / study opportunity", "Something else"];

function ContactForm() {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const sending = useRef(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending.current) return; // guard against double submits
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: real people never fill this hidden field.
    if (String(data.get("company_website") ?? "")) {
      setStatus({ state: "sent", message: "Thank you, your message is on its way." });
      return;
    }
    data.delete("company_website");

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const type = String(data.get("type") ?? "");
    const message = String(data.get("message") ?? "").trim();

    const errs: Record<string, string> = {};
    if (!name) errs.name = "Please tell me your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errs.email = "Please enter a valid email address.";
    if (message.length < 10) errs.message = "A short description helps (at least 10 characters).";
    if (message.length > 4000) errs.message = "Please keep your message under 4,000 characters.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }

    if (profile.formspreeId) {
      sending.current = true;
      setStatus({ state: "sending" });
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 15000);
        const res = await fetch(`https://formspree.io/f/${profile.formspreeId}`, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data,
          signal: controller.signal,
        });
        clearTimeout(timer);
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        setStatus({ state: "sent", message: "Thank you, your message is on its way. I'll be in touch soon." });
      } catch {
        setStatus({ state: "error", message: "Something went wrong sending your message. Please try again." });
      } finally {
        sending.current = false;
      }
      return;
    }

    if (profile.contact.email) {
      window.location.href = buildMailto(profile.contact.email, `New enquiry: ${type || "General"}`, `${message}\n\nFrom ${name} (${email})`);
      setStatus({ state: "sent", message: "Your email app should open with the message ready to send." });
      return;
    }

    console.warn("[contact] Set profile.formspreeId or profile.contact.email in src/data/profile.ts to enable the form.");
    setStatus({ state: "error", message: "The inbox isn't connected just yet. Please check back soon." });
  }

  const field =
    "mt-2 w-full border-b border-ivory/30 bg-transparent py-3 t-lead text-ivory placeholder:text-ivory/40 transition-colors focus:border-ivory focus:outline-none aria-[invalid=true]:border-signal";

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-9" aria-describedby="form-status">
      {/* Honeypot (hidden from people and assistive tech) */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
        <label>
          Company website
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="grid gap-9 sm:grid-cols-2">
        <Field label="Your name" error={errors.name} id="name">
          <input id="name" name="name" autoComplete="name" maxLength={120} className={field} placeholder="Ama Mensah" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
        </Field>
        <Field label="Email" error={errors.email} id="email">
          <input id="email" name="email" type="email" autoComplete="email" maxLength={200} className={field} placeholder="you@studio.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
        </Field>
      </div>
      <fieldset>
        <legend className="t-label text-ivory/60">What is it about?</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {projectTypes.map((t, i) => (
            <label key={t} className="cursor-pointer">
              <input type="radio" name="type" value={t} defaultChecked={i === 0} className="peer sr-only" />
              <span className="block rounded-full border border-ivory/25 px-4 py-2 t-small transition-colors peer-checked:border-ivory peer-checked:bg-ivory peer-checked:text-navy peer-focus-visible:outline-2 peer-focus-visible:outline-signal hover:border-ivory/60">
                {t}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <Field label="Tell me about your idea" error={errors.message} id="message">
        <textarea id="message" name="message" rows={4} maxLength={4000} className={cn(field, "resize-none")} placeholder="A new brand, a product launch, a campaign…" aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} />
      </Field>

      <div className="flex flex-wrap items-center gap-6">
        <motion.button
          type="submit"
          disabled={status.state === "sending"}
          whileTap={{ scale: 0.97 }}
          data-cursor="Send"
          className="group inline-flex h-14 items-center gap-3 rounded-full bg-signal pr-2 pl-7 text-[0.85rem] font-semibold tracking-[0.1em] text-ink uppercase transition-colors hover:bg-ivory disabled:opacity-60"
        >
          {status.state === "sending" ? "Sending" : "Send message"}
          <span className="grid size-10 place-items-center rounded-full bg-navy text-ivory">
            {status.state === "sending" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />}
          </span>
        </motion.button>
        <p id="form-status" role="status" aria-live="polite" className={cn("t-small", status.state === "error" ? "text-[#ff9a85]" : "text-ivory/80")}>
          {status.message}
        </p>
      </div>
    </form>
  );
}

function Field({ label, error, id, children }: { label: string; error?: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="t-label text-ivory/60">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 t-small text-[#ff9a85]">
          {error}
        </p>
      )}
    </div>
  );
}
