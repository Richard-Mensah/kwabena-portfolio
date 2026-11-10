export type Discipline = "Identity" | "Packaging" | "Advertising" | "Events & Print" | "Tourism";
export type Kind = "Client" | "Academic";
export type MockupKind = "poster" | "social" | "card" | "packaging" | "identity";

export type Img = { src: string; width: number; height: number };
export type Detail = Img & { caption: string; alt: string };
export type Piece = Img & { title: string; alt: string; mockup: MockupKind };
export type XRayPin = { x: number; y: number; title: string; note: string };

export type RawProject = {
  slug: string;
  kind: Kind;
  title: string;
  brand: string;
  category: string;
  filters: Discipline[];
  /** Scene used by the In-Context Mockup Studio for the hero image. */
  mockup: MockupKind;
  image: Img;
  alt: string;
  /** Additional, separately shown artworks for multi-piece brands. */
  pieces?: Piece[];
  /** Mat colour behind the artwork in grids. */
  tone: string;
  palette: string[];
  details: Detail[];
  /** Design X-Ray annotation pins, positioned in % of the hero image. */
  xray: XRayPin[];
  summary: string;
  overview: string;
  objective: string;
  approach: string[];
  visualDirection: { label: string; text: string }[];
  deliverables: string[];
  disciplines: string[];
};

export type Project = RawProject & { index: string };
