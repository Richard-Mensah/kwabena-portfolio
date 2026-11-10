import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SelectedWork } from "@/components/SelectedWork";
import { LogoLab } from "@/components/innovations/LogoLab";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Selected Work",
  description: "Client and academic case studies by Kwabena Acheampong: brand identities, packaging, advertising, event campaigns and logos.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        index="02"
        eyebrow="Selected Work"
        title={[
          "Selected",
          <>
            <span className="serif-accent text-navy">work.</span>
          </>,
        ]}
        intro={`${projects.length} case studies: client identities, packaging, campaigns and stationery, plus academic work. Each one is a study in hierarchy, colour and persuasion. Filter by type, discipline, or even by colour.`}
      />
      <SelectedWork />
      <LogoLab />
    </>
  );
}
