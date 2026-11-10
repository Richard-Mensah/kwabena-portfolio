import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { About, Education } from "@/components/About";
import { SkillTree } from "@/components/SkillTree";

export const metadata: Metadata = {
  title: "About",
  description:
    "Kwabena Acheampong, a graphic designer with a B.Tech in Graphic Design (Advertising and Packaging) and an HND in Commercial Arts from Takoradi Technical University.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        index="04"
        eyebrow="About Kwabena"
        title={[
          "Behind every visual",
          <>
            is an <span className="serif-accent text-navy">idea.</span>
          </>,
        ]}
      />
      <About />
      <Education />
      <SkillTree />
    </>
  );
}
