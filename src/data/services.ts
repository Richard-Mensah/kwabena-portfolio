export const services = [
  {
    index: "01",
    title: "Brand Identity Design",
    lede: "Distinct, ownable visual identities, from the first mark to the full system.",
    items: ["Logo exploration", "Visual identity systems", "Colour systems", "Typography direction", "Brand applications"],
  },
  {
    index: "02",
    title: "Brand Strategy & Direction",
    lede: "Finding what a brand should say, then shaping how it should look and feel.",
    items: [
      "Brand positioning exploration",
      "Visual brand direction",
      "Brand communication",
      "Creative concept development",
      "Visual storytelling",
    ],
  },
  {
    index: "03",
    title: "Graphic Design & Advertising",
    lede: "Campaign graphics that are clear at a glance and memorable after.",
    items: [
      "Campaign graphics",
      "Promotional materials",
      "Social media creatives",
      "Advertising layouts",
      "Marketing collateral",
    ],
  },
  {
    index: "04",
    title: "Packaging Design",
    lede: "Packaging that informs, persuades and earns its place on the shelf.",
    items: ["Product packaging concepts", "Packaging layouts", "Product presentation", "Label design"],
  },
] as const;

export const process = [
  { index: "01", title: "Discover", text: "Understand the idea, audience and communication objectives." },
  { index: "02", title: "Define", text: "Establish the creative direction, concept and visual language." },
  { index: "03", title: "Design", text: "Explore typography, colour, composition and visual systems." },
  { index: "04", title: "Deliver", text: "Refine and prepare the final creative output for its intended application." },
] as const;
