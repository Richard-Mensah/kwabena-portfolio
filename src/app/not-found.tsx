import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[80vh] max-w-[1600px] flex-col justify-center px-5 pt-24 sm:px-8 lg:px-12">
      <p className="t-label text-muted">Error 404</p>
      <h1 className="t-page mt-5">
        This page is <em className="serif-accent text-navy">off the grid.</em>
      </h1>
      <Link href="/" className="mt-10 inline-flex h-12 w-fit items-center rounded-full bg-navy px-7 t-small font-semibold text-ivory hover:bg-signal hover:text-ink">
        Back to the studio
      </Link>
    </section>
  );
}
