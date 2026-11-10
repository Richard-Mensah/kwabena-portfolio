import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Gallery } from "@/components/gallery/Gallery";
import { galleryItems } from "@/data/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description: "The full visual archive of Kwabena Acheampong: artworks, close-up details and portraits.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        index="03"
        eyebrow={`Gallery · ${galleryItems.length} pieces`}
        title={[
          "The visual",
          <>
            <span className="serif-accent text-navy">archive.</span>
          </>,
        ]}
        intro="Every artwork, every close-up detail, side by side. Open any piece to study it full screen. Use the arrow keys or swipe to move through the wall."
      />
      <Gallery />
    </>
  );
}
