import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";

export const metadata: Metadata = {
  title: "Services",
  description: "Brand identity, brand strategy and direction, graphic design and advertising, and packaging design.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        index="05"
        eyebrow="Creative services · areas of focus"
        title={[
          "What I can",
          <>
            help you <span className="serif-accent text-navy">build.</span>
          </>,
        ]}
        intro="Four connected disciplines, grounded in formal training in advertising, packaging and corporate identity. Each can stand alone or work together as one brand system."
      />
      <Services />
      <Process />
    </>
  );
}
