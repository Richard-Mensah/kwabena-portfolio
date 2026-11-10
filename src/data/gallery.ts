import { allPieces, projects } from "@/data/projects";
import { logos } from "@/data/logos";

export type GalleryKind = "Artwork" | "Detail" | "Logo" | "Portrait";
export type GalleryItem = {
  id: string;
  kind: GalleryKind;
  /** Client or academic origin, for filtering. */
  origin?: "Client" | "Academic";
  src: string;
  width: number;
  height: number;
  alt: string;
  title: string;
  caption: string;
  tone: string;
  slug?: string;
};

const portraits: GalleryItem[] = [
  {
    id: "portrait-navy",
    kind: "Portrait",
    src: "/images/portrait/kwabena-graduation-navy.jpg",
    width: 960,
    height: 1280,
    alt: "Kwabena Acheampong in a navy suit, red tie and graduation cap in front of a breeze-block wall.",
    title: "Kwabena Acheampong",
    caption: "Graduation portrait",
    tone: "#EAD9B6",
  },
  {
    id: "portrait-bw",
    kind: "Portrait",
    src: "/images/portrait/kwabena-graduation-bw.jpg",
    width: 960,
    height: 1280,
    alt: "Black-and-white portrait of Kwabena Acheampong in a suit and graduation cap, head bowed.",
    title: "Kwabena Acheampong",
    caption: "Graduation portrait, black and white",
    tone: "#E4E1DA",
  },
];

/** Every verified visual asset: each individual artwork, its detail crops, every logo and 2 portraits. */
export const galleryItems: GalleryItem[] = (() => {
  const items: GalleryItem[] = [];
  projects.forEach((p, pi) => {
    allPieces(p).forEach((piece, k) => {
      if (p.slug === "chris-gold-buying-agent" && k === 0) return; // the Chris Gold logo is shown with the logos
      items.push({
        id: k === 0 ? p.slug : `${p.slug}-piece-${k}`,
        kind: "Artwork",
        origin: p.kind,
        src: piece.src,
        width: piece.width,
        height: piece.height,
        alt: piece.alt,
        title: k === 0 ? p.title : `${p.title}: ${piece.title}`,
        caption: p.category,
        tone: p.tone,
        slug: p.slug,
      });
    });
    p.details.forEach((d, di) =>
      items.push({
        id: `${p.slug}-detail-${di}`,
        kind: "Detail",
        origin: p.kind,
        src: d.src,
        width: d.width,
        height: d.height,
        alt: d.alt,
        title: `${p.title}, detail ${String.fromCharCode(65 + di)}`,
        caption: d.caption,
        tone: p.tone,
        slug: p.slug,
      }),
    );
    if (pi === 2) items.push(portraits[0]);
    if (pi === 9) items.push(portraits[1]);
  });
  logos.forEach((l) =>
    items.push({
      id: `logo-${l.slug}`,
      kind: "Logo",
      origin: "Client",
      src: l.src,
      width: l.width,
      height: l.height,
      alt: l.alt,
      title: l.name,
      caption: l.concept,
      tone: l.ground,
      slug: l.caseSlug,
    }),
  );
  return items;
})();
