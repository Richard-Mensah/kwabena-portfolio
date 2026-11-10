import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Contact } from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a conversation with Kwabena Acheampong about a brand, product, campaign or opportunity.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        index="06"
        eyebrow="Contact"
        title={[
          "Have an idea?",
          <>
            Let&apos;s make it <span className="serif-accent text-navy">visual.</span>
          </>,
        ]}
      />
      <Contact />
    </>
  );
}
