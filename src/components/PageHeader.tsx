import { Reveal, SplitLines } from "@/components/motion/Reveal";

/** Consistent opening for every inner page: eyebrow, numbered index, big title, intro. */
export function PageHeader({
  index,
  eyebrow,
  title,
  intro,
  children,
}: {
  index: string;
  eyebrow: string;
  title: React.ReactNode[];
  intro?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="relative overflow-hidden pt-32 pb-14 sm:pt-40 sm:pb-20">
      <div aria-hidden className="mesh-warm pointer-events-none absolute inset-0 opacity-70" />
      <span className="breeze pointer-events-none absolute top-24 -right-16 size-72 text-ochre/25 sm:size-96" aria-hidden />
      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between border-b border-ink/12 pb-5">
          <p className="t-label text-muted">
            <span className="mr-2 inline-block size-2 rounded-full bg-signal align-middle" aria-hidden />
            {eyebrow}
          </p>
          <p className="t-label text-muted">
            <span className="text-ink">{index}</span> / 06
          </p>
        </div>
        <SplitLines as="h1" onView={false} delay={0.1} lines={title} className="t-page mt-10 max-w-[16ch] sm:mt-14" />
        {(intro || children) && (
          <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-12">
            {intro && (
              <Reveal className="lg:col-span-6" delay={0.35}>
                <p className="t-lead measure text-ink/80">{intro}</p>
              </Reveal>
            )}
            {children && (
              <Reveal className="lg:col-span-5 lg:col-start-8 lg:self-end" delay={0.45}>
                {children}
              </Reveal>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
