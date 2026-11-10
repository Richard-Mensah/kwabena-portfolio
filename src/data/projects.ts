import type { Discipline, Project, RawProject } from "@/data/project-types";
import { CLIENT } from "@/data/projects-client";

export type { Discipline, Project, Kind, MockupKind, Piece, XRayPin } from "@/data/project-types";
/** @deprecated kept for older imports; use Discipline */
export type Filter = Discipline;

export const disciplines: ("All" | Discipline)[] = ["All", "Identity", "Packaging", "Advertising", "Events & Print", "Tourism"];
export const kinds = ["All", "Client", "Academic"] as const;

const ACADEMIC: RawProject[] = [
  {
    slug: "cherrys-sobolo",
    kind: "Academic",
    mockup: "social",
    xray: [
      { x: 50, y: 17, title: "Wordmark leads", note: "A friendly script over heavy outlined capitals, with a cherry motif, makes the brand the first thing read." },
      { x: 25, y: 31, title: "Label-style facts", note: "Ingredients and instructions in a condensed face mirror how packaging organises information." },
      { x: 13, y: 64, title: "Trust badge", note: "'100% natural' sits in its own flower-shaped badge so it registers instantly." },
      { x: 62, y: 60, title: "Product in use", note: "Tilted photo cards show the drink poured and served." },
      { x: 72, y: 83, title: "Order route", note: "An orange sweep carries the bulk-purchase call to action." },
    ],
    title: "Cherry's Sobolo",
    brand: "Cherry's Sobolo",
    category: "Packaging / Product Advertising",
    filters: ["Packaging", "Advertising"],
    image: { src: "/images/projects/cherrys-sobolo.jpg", width: 1240, height: 1240 },
    alt: "Cherry's Sobolo advertisement: a bold red-and-white Sobolo wordmark with a cherry illustration above ingredients, usage instructions, a '100% natural' badge and photographs of the deep-red hibiscus drink being poured over orange slices.",
    tone: "#F1E3DF",
    palette: ["#920908", "#C63425", "#F3B363", "#E9E6D5", "#FDFDFA"],
    details: [
      {
        src: "/images/details/cherrys-sobolo-wordmark.jpg",
        width: 860,
        height: 360,
        caption: "Wordmark: a lowercase script 'cherry's' over a heavy, outlined 'SOBOLO'",
        alt: "Close-up of the Cherry's Sobolo wordmark with cherry and leaf illustrations.",
      },
      {
        src: "/images/details/cherrys-sobolo-photos.jpg",
        width: 770,
        height: 440,
        caption: "Layered photo cards build appetite and show the product in use",
        alt: "Overlapping photographs of Sobolo being poured and served in a glass with lime.",
      },
    ],
    summary:
      "A product advertisement for a natural hibiscus drink, combining a vivid wordmark with label-style product information.",
    overview:
      "Cherry's Sobolo presents a locally loved hibiscus drink as a fresh, natural product. The layout reads like an advertisement and a product label at the same time. A bold wordmark announces the brand, structured ingredient and instruction panels give label-level information, and layered photographs show the drink being poured and served.",
    objective:
      "Make a traditional drink feel fresh and trustworthy: show it is natural, explain what it contains and how to keep it, and give buyers a clear route to bulk orders.",
    approach: [
      "The wordmark leads the hierarchy. A friendly script 'cherry's' sits above a heavy, outlined 'SOBOLO' set in brand red, with a cherry motif that makes the name memorable.",
      "Product information is split into scannable blocks (Ingredients, Instructions) using a condensed typeface, mirroring how information is organised on packaging.",
      "Trust signals ('100% natural', 'No preservatives') are given their own shapes and colour so they register at a glance.",
      "A sweeping orange band divides the composition and carries the bulk-purchase call to action, closing the reading path.",
    ],
    visualDirection: [
      { label: "Colour", text: "Hibiscus red as the dominant field, warm orange accents and white for clean information panels." },
      { label: "Typography", text: "Expressive display lettering for the brand, condensed sans-serif for product facts." },
      { label: "Imagery", text: "Tilted photo cards add movement and realism, showing the product in real serving moments." },
    ],
    deliverables: ["Product advertisement", "Brand wordmark treatment", "Label-style information layout"],
    disciplines: ["Packaging communication", "Wordmark", "Information hierarchy", "Photo compositing"],
  },
  {
    slug: "aj-lingerie-and-beads",
    kind: "Academic",
    mockup: "social",
    xray: [
      { x: 38, y: 22, title: "Monogram with product", note: "A strung line of beads grows out of the 'AJ' monogram, so the product becomes the identity." },
      { x: 52, y: 53, title: "Catalogue strip", note: "Circular windows give each product its own frame in a steady rhythm." },
      { x: 20, y: 82, title: "Offer list", note: "'We deal in' turns the range into a quick checklist." },
      { x: 83, y: 81, title: "Value badge", note: "A starburst carries 'Quality & Affordable' as a retail cue." },
    ],
    title: "AJ Lingerie & Beads",
    brand: "AJ Lingerie and Beads",
    category: "Advertising / Promotional Design",
    filters: ["Advertising"],
    image: { src: "/images/projects/aj-lingerie-and-beads.jpg", width: 1240, height: 1158 },
    alt: "AJ Lingerie and Beads promotional flyer: a large AJ monogram with a string of colourful beads on a saffron background, a row of circular product photos, and a list reading Waist Bead, Anklet, Customised Wrist Bead and Panties beside a 'Quality & Affordable' starburst.",
    tone: "#F6E3B8",
    palette: ["#FEAC01", "#370502", "#FEBD37", "#915D42", "#C1B092"],
    details: [
      {
        src: "/images/details/aj-lingerie-and-beads-logo.jpg",
        width: 700,
        height: 410,
        caption: "The logo lockup: a strung bead line ties the monogram to the product",
        alt: "AJ Lingerie and Beads logo with a curved string of coloured beads.",
      },
      {
        src: "/images/details/aj-lingerie-and-beads-products.jpg",
        width: 1240,
        height: 350,
        caption: "Circular product windows form a rhythmic catalogue strip",
        alt: "A row of circular frames showing waist beads, anklets and lingerie products.",
      },
    ],
    summary:
      "A promotional flyer that turns a small product range into a confident, catalogue-like announcement.",
    overview:
      "AJ Lingerie & Beads combines a strong brand mark, a visual product catalogue and a simple 'We Deal In' list into one promotional composition. The piece needs to say what the business sells and why to choose it, quickly and warmly.",
    objective:
      "Introduce the product range (waist beads, anklets, customised wrist beads and panties) and position the brand as offering quality at an affordable price.",
    approach: [
      "The 'AJ' monogram is set large and heavy, with a curved string of beads running from the letters. The brand's product becomes part of its identity.",
      "A sequence of circular image windows works like a catalogue strip, giving each product its own frame while keeping a consistent rhythm.",
      "The colour field splits from saffron into a deep chocolate brown, separating 'brand' from 'offer' and lifting the white list typography.",
      "A starburst badge carries the value proposition, 'Quality & Affordable', as a classic retail cue.",
    ],
    visualDirection: [
      { label: "Colour", text: "Saffron and deep chocolate: warm, rich and feminine without relying on pink clichés." },
      { label: "Typography", text: "A heavy slab-style monogram paired with clean, uppercase list type for clarity." },
      { label: "Composition", text: "Top-to-bottom flow: brand → products → offer → value badge." },
    ],
    deliverables: ["Promotional flyer / social graphic", "Logo lockup treatment"],
    disciplines: ["Logo lockup", "Promotional layout", "Product presentation", "Colour composition"],
  },
  {
    slug: "silver-package",
    kind: "Academic",
    mockup: "social",
    xray: [
      { x: 50, y: 22, title: "Metallic headline", note: "A silver-gradient serif makes the tier name look like silver." },
      { x: 48, y: 56, title: "Gallery triptych", note: "Three portraits in one heavy frame show range like an exhibition." },
      { x: 84, y: 75, title: "Single loud element", note: "The magenta price badge breaks the grid on purpose." },
      { x: 48, y: 87, title: "Emotional line", note: "A pull-quote reframes a price list as preserving memories." },
    ],
    title: "Silver Package",
    brand: "BS Photography",
    category: "Editorial / Advertising Design",
    filters: ["Advertising"],
    image: { src: "/images/projects/silver-package.jpg", width: 1240, height: 1030 },
    alt: "Silver Package photography offer: a metallic serif 'Silver Package' headline under a BS monogram, three framed portrait photographs in a black gallery frame, a magenta price badge reading Ghc150 for 7 pictures, and the quote 'Taking an image, freezing a moment, reveals how rich reality truly is.'",
    tone: "#ECEAE6",
    palette: ["#11120F", "#802E56", "#8C796B", "#D8CDB6", "#F3F3F3"],
    details: [
      {
        src: "/images/details/silver-package-title.jpg",
        width: 840,
        height: 260,
        caption: "Metallic serif type literally makes the word 'Silver' look like silver",
        alt: "The BS monogram above a silver-gradient serif 'Silver Package' headline.",
      },
      {
        src: "/images/details/silver-package-frame.jpg",
        width: 890,
        height: 620,
        caption: "A gallery-style triptych frames the photographer's work as exhibition pieces",
        alt: "Three portrait photographs arranged inside a black picture frame.",
      },
    ],
    summary:
      "A pricing advertisement for a photography package, presented with the restraint of an editorial spread.",
    overview:
      "Silver Package advertises a photography service tier for a studio identified by its 'BS' monogram. Instead of a busy price list, it uses an editorial approach: a gallery frame of portraits, a refined headline and a single price badge. It was created for an advertising course.",
    objective:
      "Communicate a clear offer (7 pictures for Ghc150) while showing the quality of the photography and making the package feel premium.",
    approach: [
      "A textured off-white background and generous margins give the layout a calm, gallery-like quality.",
      "The headline is set in a high-contrast serif with a metallic gradient, so the tier name 'Silver' reads visually as well as verbally.",
      "Three contrasting portraits sit in one heavy black frame, creating a triptych that shows range: outdoor, studio and lifestyle.",
      "The magenta price badge overlaps the frame, breaking the grid on purpose so the offer is the one loud element.",
    ],
    visualDirection: [
      { label: "Colour", text: "Neutral greys and black, with a single saturated magenta accent reserved for the price." },
      { label: "Typography", text: "Editorial serif headline, italic serif pull-quote, bold sans for the offer." },
      { label: "Storytelling", text: "The pull-quote frames photography as preserving moments, which adds emotion to a commercial offer." },
    ],
    deliverables: ["Service / pricing advertisement", "Social media promotional graphic"],
    disciplines: ["Editorial layout", "Typography", "Offer communication", "Image curation"],
  },
  {
    slug: "independence-weekend",
    kind: "Academic",
    mockup: "poster",
    xray: [
      { x: 22, y: 30, title: "Stacked display type", note: "Condensed capitals with a brush-script overlay: structure plus celebration." },
      { x: 22, y: 52, title: "Dates first", note: "A gradient pill answers 'when' immediately under the title." },
      { x: 35, y: 70, title: "Schedule rows", note: "Date, arrow, event. One repeated structure keeps a dense programme readable." },
      { x: 86, y: 76, title: "Final push", note: "A 'Free Entry' stamp removes the last barrier to attending." },
      { x: 50, y: 92, title: "Practical bar", note: "Venue and start time close the reading path." },
    ],
    title: "Independence Weekend",
    brand: "Calenders",
    category: "Event Campaign / Promotional Graphics",
    filters: ["Events & Print"],
    image: { src: "/images/projects/independence-weekend.jpg", width: 1240, height: 1158 },
    alt: "Independence Weekend event poster for Calenders: tall white 'INDEPENDENCE' lettering with a yellow script 'Weekend', the dates 3rd–6th March, a four-night line-up (Calabash Jams, Calenders Nostalgia, Kwame Nkrumah Vibes, 66th Independence Party), a strawberry cocktail with an umbrella, a 'Free Entry' stamp and the venue details.",
    tone: "#E9D9D2",
    palette: ["#4E0F03", "#7C1F07", "#D2623E", "#D5CA89", "#FFFFF8"],
    details: [
      {
        src: "/images/details/independence-weekend-type.jpg",
        width: 580,
        height: 510,
        caption: "Stacked condensed capitals with a hand-script overlay",
        alt: "Close-up of the stacked 'INDEPENDENCE' lettering with the yellow script 'Weekend'.",
      },
      {
        src: "/images/details/independence-weekend-schedule.jpg",
        width: 760,
        height: 370,
        caption: "A four-night line-up arranged as a scannable schedule",
        alt: "Event schedule listing four themed nights from 3rd to 6th March.",
      },
    ],
    summary:
      "A multi-night event campaign for a Takoradi venue, built around Ghana's Independence celebrations.",
    overview:
      "Independence Weekend promotes four themed nights at Calenders, a venue on Beach Road, Takoradi, timed around Ghana's Independence Day. The poster has to hold a lot of information (four events, dates, host, venue, start time and free entry) and still feel like a party.",
    objective:
      "Build excitement for a four-day programme and make every practical detail easy to find at a glance.",
    approach: [
      "'INDEPENDENCE' is broken across two lines in tall, condensed capitals, and a yellow brush script adds 'Weekend'. Structure and celebration in one lockup.",
      "The dates are pulled into a gradient pill directly under the title, so 'when' is answered immediately.",
      "Each night is a row: date, arrow, event name. The repeated structure turns a dense programme into a clean list.",
      "A Ghana flag drape, warm bokeh lighting and a cocktail image set the nightlife mood. The 'Free Entry' stamp gives a final push to attend.",
    ],
    visualDirection: [
      { label: "Colour", text: "Deep maroon and ember tones with flag accents of red, gold and green." },
      { label: "Typography", text: "Condensed display capitals, a brush script accent and geometric sans for schedule data." },
      { label: "Hierarchy", text: "Title → dates → line-up → host → venue and time: the order an attendee asks questions in." },
    ],
    deliverables: ["Event poster / social flyer", "Event schedule layout"],
    disciplines: ["Event branding", "Information hierarchy", "Display typography", "Photo compositing"],
  },
  {
    slug: "ghana-independence-day",
    kind: "Academic",
    mockup: "social",
    xray: [
      { x: 30, y: 50, title: "National colours in type", note: "Red, gold and green lettering with the Black Star inside 'Independence'." },
      { x: 78, y: 40, title: "Story mosaic", note: "Twelve photos cover sights, stay, taste, culture and thrill." },
      { x: 30, y: 72, title: "Campaign line", note: "'Dream | Explore | Discover Ghana' and #VisitAkosombo give a repeatable hook." },
      { x: 26, y: 88, title: "Co-branding", note: "Two partner logos sit side by side on neutral ground." },
    ],
    title: "Ghana Independence Day",
    brand: "Volta Hotel Akosombo × DodiWorld",
    category: "Tourism Advertising / Campaign Design",
    filters: ["Tourism", "Events & Print"],
    image: { src: "/images/projects/ghana-independence-day.jpg", width: 1240, height: 1240 },
    alt: "Happy Independence Day tourism advertisement: red, yellow and green lettering with a black star beside a photo mosaic of the Adomi Bridge, Akosombo Dam, a cruise boat, a hotel room with kente, drummers, a tilapia meal, jet-skiing, the hotel pool and wildlife, with the line 'Dream | Explore | Discover Ghana' and #VisitAkosombo.",
    tone: "#E6E9E4",
    palette: ["#C31712", "#F9D311", "#086215", "#151A17", "#F2F2ED"],
    details: [
      {
        src: "/images/details/ghana-independence-day-type.jpg",
        width: 680,
        height: 390,
        caption: "National colours carried straight into the typography, with the Black Star as a pivot",
        alt: "'Happy Independence Day' lettering in red, yellow and green with a black star.",
      },
      {
        src: "/images/details/ghana-independence-day-grid.jpg",
        width: 540,
        height: 1150,
        caption: "A photo mosaic curating the full Akosombo experience",
        alt: "A vertical grid of tourism photographs from Akosombo and the Volta Hotel.",
      },
    ],
    summary:
      "A national-day greeting that doubles as destination marketing for Akosombo.",
    overview:
      "This piece pairs an Independence Day greeting with tourism promotion for Akosombo, co-branded for Volta Hotel and DodiWorld. A mosaic of destination photography shows the experience, from landmarks and the lake to food, culture and leisure, while the greeting ties the campaign to the national moment.",
    objective:
      "Use a celebratory national moment to inspire travel: show the range of experiences around Akosombo and drive bookings and enquiries.",
    approach: [
      "The greeting is set in a decorative serif using Ghana's red, gold and green, with the Black Star placed inside the word 'Independence'.",
      "Twelve photographs run in an L-shaped grid along the top and right edge, framing the message like a travel journal.",
      "Image selection works as a story: landmarks (Adomi Bridge, Akosombo Dam), lake cruise, accommodation, culture, cuisine, adventure and wildlife.",
      "'Dream | Explore | Discover Ghana' and #VisitAkosombo give the campaign a repeatable line and a social hook. A black footer bar holds booking details.",
    ],
    visualDirection: [
      { label: "Colour", text: "National colours for the message, natural photography for the place, white space between them." },
      { label: "Imagery", text: "Curated to cover every travel motive: sights, stay, taste, culture, thrill." },
      { label: "Brand", text: "Two partner logos sit side by side on neutral ground so neither dominates." },
    ],
    deliverables: ["Tourism campaign advertisement", "Social media greeting graphic", "Campaign hashtag lockup"],
    disciplines: ["Destination promotion", "Image curation", "Co-branding layout", "Campaign messaging"],
  },
  {
    slug: "ttu-src-week",
    kind: "Academic",
    mockup: "poster",
    xray: [
      { x: 24, y: 48, title: "Emotional half", note: "A 3D celebratory wordmark with drums and leaves sells the mood." },
      { x: 72, y: 47, title: "Functional half", note: "Numbered days and consistent columns make the timetable scannable." },
      { x: 24, y: 88, title: "Theme line", note: "The week's theme anchors the identity." },
      { x: 72, y: 90, title: "Date range", note: "Start and end dates close the schedule." },
    ],
    title: "TTU SRC Week Celebration",
    brand: "Takoradi Technical University SRC",
    category: "Event Communication / Campaign Design",
    filters: ["Events & Print"],
    image: { src: "/images/projects/ttu-src-week.jpg", width: 1240, height: 664 },
    alt: "TTU-SRC Week '21 Celebration banner on a bright yellow background: a 3D red 'TTU-SRC WEEK CELEBRATION' wordmark with drums, tropical leaves and the hashtag #EKORSO on the left, and an 'Outline of Activities' table listing four days of events, venues and times from Thursday 15th to Sunday 18th July 2021 on the right.",
    tone: "#F6EDC4",
    palette: ["#F9B40E", "#FEEA3D", "#982317", "#BD882C", "#FEFBA4"],
    details: [
      {
        src: "/images/details/ttu-src-week-wordmark.jpg",
        width: 540,
        height: 470,
        caption: "A dimensional, celebratory event wordmark with the #EKORSO campaign hook",
        alt: "3D red 'TTU-SRC Week Celebration' lettering surrounded by drums and leaves.",
      },
      {
        src: "/images/details/ttu-src-week-schedule.jpg",
        width: 590,
        height: 410,
        caption: "A four-day programme designed as a clear, colour-coded timetable",
        alt: "Outline of activities table with day, activity, venue and time columns.",
      },
    ],
    summary:
      "A landscape campaign banner and timetable for a four-day university celebration week.",
    overview:
      "Created for the Takoradi Technical University Students' Representative Council's 2021 SRC Week, this banner combines a festive event identity with a full programme of activities. The theme is 'Understanding the times and seasons through entertainment.' The landscape format lets the left half sell the mood and the right half inform.",
    objective:
      "Create an energetic identity for the week that students would share, and give them one place to find every activity, venue and time.",
    approach: [
      "A split layout: emotional wordmark on the left, functional timetable on the right. The two jobs never compete.",
      "The 'TTU-SRC WEEK CELEBRATION' lettering is extruded in 3D red with playful shapes, drums and leaves, and the hashtag #EKORSO gives the campaign a social identity.",
      "The timetable uses numbered day blocks (01–04), consistent columns (Activity, Venue, Time) and alternating chevrons, so a dense schedule is easy to scan.",
      "A bright yellow field with tropical foliage keeps the whole banner warm and celebratory.",
    ],
    visualDirection: [
      { label: "Colour", text: "Sunlit yellow ground, deep red for the identity and day markers, green for the table header." },
      { label: "Typography", text: "Chunky 3D display type for the event, a geometric sans for tabular information." },
      { label: "Format", text: "Landscape composition suited to screens, banners and social headers." },
    ],
    deliverables: ["Event campaign banner", "Programme / timetable design", "Campaign hashtag identity"],
    disciplines: ["Event identity", "Information design", "Timetable layout", "Campaign communication"],
  },
  {
    slug: "jeysicles-ice-cream",
    kind: "Academic",
    mockup: "social",
    xray: [
      { x: 50, y: 10, title: "Brand panel", note: "The logo sits in a clean white panel at the top." },
      { x: 50, y: 38, title: "Radial energy", note: "A turquoise burst pulls the eye to the centre." },
      { x: 50, y: 60, title: "Product fan", note: "Tallest cones at the centre for abundance and celebration." },
      { x: 50, y: 91, title: "One-line flavours", note: "Four flavours between chevrons, readable in a second." },
    ],
    title: "Ice Cream Advertising",
    brand: "Jeysicles",
    category: "Product Advertising",
    filters: ["Advertising"],
    image: { src: "/images/projects/jeysicles-ice-cream.jpg", width: 1240, height: 1146 },
    alt: "Jeysicles ice cream advertisement: a turquoise radial-burst background with a white logo panel at the top, a fan of ice cream cones, soft-serve and sundaes in the centre, and the flavours Strawberry, Vanilla, Chocolate and Banana along the bottom.",
    tone: "#D7EEF0",
    palette: ["#08AEC3", "#20C6D7", "#51DBE8", "#885B50", "#F9F2EC"],
    details: [
      {
        src: "/images/details/jeysicles-ice-cream-logo.jpg",
        width: 380,
        height: 275,
        caption: "A soft-serve swirl icon paired with a flowing script wordmark",
        alt: "The Jeysicles logo: a pink soft-serve swirl in a brown cone with script lettering.",
      },
      {
        src: "/images/details/jeysicles-ice-cream-product.jpg",
        width: 950,
        height: 500,
        caption: "Product hero: a fan of cones arranged for appetite and abundance",
        alt: "A close-up of several ice cream cones and sundaes arranged together.",
      },
    ],
    summary:
      "A product advertisement where the product is the hero and the background does the selling.",
    overview:
      "This advertisement for Jeysicles puts the product front and centre. A fan of cones, soft-serve and sundaes rises out of a turquoise radial burst, with the brand mark at the top and the flavour range at the bottom: a simple, poster-like structure that reads instantly.",
    objective:
      "Make the product look irresistible and communicate the flavour range with almost no copy.",
    approach: [
      "The cool turquoise ground contrasts with the warm tones of waffle and chocolate, making the products pop.",
      "A radial burst behind the cones creates energy and leads the eye to the centre of the composition.",
      "Products are composited into a fanned arrangement, with tallest cones at the centre, for a sense of abundance and celebration.",
      "Flavours are listed in one line between chevrons: Strawberry | Vanilla | Chocolate | Banana. Short enough to read in a second.",
    ],
    visualDirection: [
      { label: "Colour", text: "Fresh turquoise and white, chosen to feel cold, clean and summery." },
      { label: "Imagery", text: "Cut-out product photography with motion marks that suggest freshness and fun." },
      { label: "Copy", text: "Minimal: brand at the top, flavours at the bottom, product in between." },
    ],
    deliverables: ["Product advertisement", "Social media product graphic"],
    disciplines: ["Product advertising", "Photo compositing", "Colour contrast", "Logo placement"],
  },
];

const ACADEMIC_ORDER = [
  "cherrys-sobolo",
  "aj-lingerie-and-beads",
  "silver-package",
  "independence-weekend",
  "ghana-independence-day",
  "jeysicles-ice-cream",
  "ttu-src-week",
];

/** All case studies: client work first, then academic work. `index` is derived from order. */
export const projects: Project[] = [
  ...CLIENT,
  ...ACADEMIC_ORDER.map((slug) => ACADEMIC.find((p) => p.slug === slug)!),
].map((p, i) => ({ ...p, index: String(i + 1).padStart(2, "0") }));

export const TOTAL_PROJECTS = projects.length;

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacent(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return {
    prev: projects[(i - 1 + projects.length) % projects.length],
    next: projects[(i + 1) % projects.length],
  };
}

/** Every individual artwork of a project: the hero image plus any extra pieces. */
export function allPieces(p: Project) {
  return [{ src: p.image.src, width: p.image.width, height: p.image.height, title: p.title, alt: p.alt, mockup: p.mockup }, ...(p.pieces ?? [])];
}
