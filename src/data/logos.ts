export type Logo = {
  slug: string;
  name: string;
  /** Native presentation, exactly as designed (opaque). */
  src: string;
  width: number;
  height: number;
  /** Transparent mark used by the Logo Lab. */
  mark: string;
  markWidth: number;
  markHeight: number;
  /** The background the mark was designed for. */
  ground: string;
  /** True when the mark is light-on-dark and disappears on light grounds without inversion. */
  lightMark?: boolean;
  palette: string[];
  concept: string;
  alt: string;
  /** Case study that features this mark, when there is one. */
  caseSlug?: string;
};

const L = "/images/logos";

export const logos: Logo[] = [
  {
    slug: "chris-gold",
    name: "Chris Gold Buying Agent",
    src: "/images/client/chris-gold-logo.jpg",
    width: 1585,
    height: 792,
    mark: `${L}/chris-gold-mark.png`,
    markWidth: 1389,
    markHeight: 560,
    ground: "#000000",
    palette: ["#000000", "#ECCC70", "#CDAA57", "#A98238"],
    concept: "A segmented gold ring that is the 'C', a coin edge and a sunburst at once, framing a star and gold ingots.",
    alt: "Chris Gold Buying Agent logo in metallic gold.",
    caseSlug: "chris-gold-buying-agent",
  },
  {
    slug: "gather-and-grow",
    name: "Gather and Grow Assn.",
    src: `${L}/gather-and-grow.jpg`,
    width: 1501,
    height: 1501,
    mark: `${L}/gather-and-grow-mark.png`,
    markWidth: 1351,
    markHeight: 1367,
    ground: "#040404",
    palette: ["#040404", "#D3A31D", "#EAC133", "#FDE463"],
    concept: "An open 'G' wraps a circular seal. Inside, a tree of people with rising arrows shows a community growing together; 'Sharing Experience' completes the promise.",
    alt: "Gather and Grow Association logo: a gold G enclosing a circular emblem of a tree formed by people with upward arrows.",
  },
  {
    slug: "afia-noodles-hub",
    name: "Afia Noodles Hub",
    src: `${L}/afia-noodles-hub.jpg`,
    width: 1529,
    height: 1534,
    mark: `${L}/afia-noodles-hub-mark.png`,
    markWidth: 839,
    markHeight: 911,
    ground: "#330005",
    lightMark: true,
    palette: ["#330005", "#F8F6F7", "#EAA023", "#9C6228"],
    concept: "A chef's hat, fork and steaming noodle bowl drawn as one continuous line icon, paired with an elegant serif 'Afia' and a geometric 'Noodles Hub'.",
    alt: "Afia Noodles Hub logo: a white chef hat and fork over an orange noodle bowl with chopsticks, above the name.",
  },
  {
    slug: "fifth-anniversary",
    name: "5th Anniversary Celebration",
    src: `${L}/fifth-anniversary.jpg`,
    width: 1560,
    height: 1560,
    mark: `${L}/fifth-anniversary-mark.png`,
    markWidth: 1332,
    markHeight: 1296,
    ground: "#FFFFFF",
    palette: ["#00502B", "#E21B23", "#111111", "#FFFFFF"],
    concept: "A bold green '5' within a laurel wreath, crowned with stars and swept by red, black and green ribbons. A commemorative mark finished with a celebratory script.",
    alt: "5th Years Anniversary Celebration logo: a large green 5 inside a laurel wreath with red stars and a red, black and green swoosh.",
  },
  {
    slug: "dove-music",
    name: "Dove Music",
    src: `${L}/dove-music.jpg`,
    width: 1501,
    height: 1501,
    mark: `${L}/dove-music-mark.png`,
    markWidth: 1142,
    markHeight: 1277,
    ground: "#010C86",
    palette: ["#010C86", "#EED694", "#FFFFFF", "#D8A93C"],
    concept: "A golden dove holding a microphone rises from royal-blue flames. Peace, spirit and sound in one emblem, set in a curved badge.",
    alt: "Dove Music logo: a gold dove holding a microphone in front of blue flames, above the name in a curved blue band.",
  },
];
