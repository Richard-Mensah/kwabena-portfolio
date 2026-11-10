/**
 * Evidence-based skill map. Every skill links to the portfolio pieces that
 * demonstrate it and the course units (by name) that trained it.
 * No self-rated levels or percentages are used.
 */
export type Skill = {
  id: string;
  name: string;
  description: string;
  projects: string[];
  courses: string[];
};

export type Branch = {
  id: string;
  name: string;
  glyph: string;
  skills: Skill[];
};

export const skillTree: Branch[] = [
  {
    id: "identity",
    name: "Identity & Typography",
    glyph: "Aa",
    skills: [
      {
        id: "wordmarks",
        name: "Logo & wordmark design",
        description: "Building memorable brand marks from letterforms and simple, ownable symbols.",
        projects: ["chris-gold-buying-agent", "clichy-gold-agent", "highlife-brownies", "cherrys-sobolo", "aj-lingerie-and-beads", "jeysicles-ice-cream"],
        courses: ["Corporate Identity", "Basic Lettering & Typography", "Advanced Lettering & Typography"],
      },
      {
        id: "brand-systems",
        name: "Brand systems & applications",
        description: "Extending a mark into a consistent system across stationery, signage, apparel and social.",
        projects: ["chris-gold-buying-agent", "clichy-gold-agent", "royal-chop-delicacies"],
        courses: ["Corporate Identity", "Studio Management"],
      },
      {
        id: "display-type",
        name: "Expressive display type",
        description: "Using scale, script and dimension so headlines carry mood as well as meaning.",
        projects: ["kelewele-fest-26", "independence-weekend", "ttu-src-week", "ghana-independence-day"],
        courses: ["Advanced Lettering & Typography", "Elements & Principles of Basic Design"],
      },
      {
        id: "hierarchy",
        name: "Typographic hierarchy",
        description: "Ordering information so the most important message is read first.",
        projects: ["royal-chop-delicacies", "wedding-naming-invitation", "independence-weekend", "cherrys-sobolo", "silver-package"],
        courses: ["Basic Lettering & Typography", "Communication Skills"],
      },
    ],
  },
  {
    id: "advertising",
    name: "Advertising & Campaigns",
    glyph: "↗",
    skills: [
      {
        id: "offers",
        name: "Offer & promotional messaging",
        description: "Turning a product, price or service into a clear, persuasive proposition.",
        projects: ["royal-chop-delicacies", "clichy-gold-agent", "silver-package", "aj-lingerie-and-beads", "cherrys-sobolo"],
        courses: ["Advertising Technology", "Applied Advertising Technology", "Advertising & Public Relations"],
      },
      {
        id: "events",
        name: "Event & campaign communication",
        description: "Designing programmes, dates and venues into scannable, shareable campaigns.",
        projects: ["kelewele-fest-26", "wedding-naming-invitation", "independence-weekend", "ttu-src-week"],
        courses: ["Media Planning & Direct Mail Advertising", "Advertising & Public Relations"],
      },
      {
        id: "tourism",
        name: "Destination promotion",
        description: "Curating place, culture and experience into travel-inspiring stories.",
        projects: ["ghana-independence-day"],
        courses: ["Media Planning & Direct Mail Advertising", "Advertising Technology"],
      },
    ],
  },
  {
    id: "packaging",
    name: "Packaging & Product",
    glyph: "□",
    skills: [
      {
        id: "label",
        name: "Label information architecture",
        description: "Structuring ingredients, instructions and claims the way packaging must.",
        projects: ["nhyira-flour", "fans-liquid-soap", "cherrys-sobolo"],
        courses: ["Fundamentals of Packaging", "Introduction to Package Design", "Package Design Processes"],
      },
      {
        id: "product",
        name: "Product presentation",
        description: "Staging products so they look appetising, desirable and true to the brand.",
        projects: ["nhyira-flour", "highlife-brownies", "jeysicles-ice-cream", "cherrys-sobolo", "aj-lingerie-and-beads"],
        courses: ["Package Design Processes", "Advanced Photography"],
      },
    ],
  },
  {
    id: "image",
    name: "Image & Production",
    glyph: "◐",
    skills: [
      {
        id: "compositing",
        name: "Photo compositing",
        description: "Combining photography, cut-outs and effects into a single, believable scene.",
        projects: ["gifty-beauty-salon", "highlife-brownies", "jeysicles-ice-cream", "independence-weekend", "cherrys-sobolo"],
        courses: ["Digital Imaging & Multimedia Graphics I & II", "Computer Graphics I–IV"],
      },
      {
        id: "curation",
        name: "Image curation & art direction",
        description: "Selecting and sequencing photographs so they tell one story together.",
        projects: ["royal-chop-delicacies", "ghana-independence-day", "silver-package", "aj-lingerie-and-beads"],
        courses: ["Introduction to Photography", "Camera Operations", "Advanced Photography"],
      },
      {
        id: "print",
        name: "Print production",
        description: "Designing for real-world reproduction: stationery, invitations, print finishing and brand merchandise.",
        projects: ["clichy-gold-agent", "wedding-naming-invitation", "chris-gold-buying-agent"],
        courses: ["Printing Processes", "Printing Technology", "Print Making", "Advanced Printing & Book Binding"],
      },
    ],
  },
];
