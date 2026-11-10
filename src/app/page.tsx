import type { Metadata } from "next";
import { HomeHero } from "@/components/home/HomeHero";
import { AboutTeaser, BrandsMarquee, CtaBand, FeaturedRail, ServicesTeaser, Statement, StatsBand } from "@/components/home/HomeSections";
import { PaletteMatch } from "@/components/game/PaletteMatch";
import { Showreel } from "@/components/home/Showreel";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <>
      <HomeHero />
      <BrandsMarquee />
      <Showreel />
      <Statement />
      <StatsBand />
      <FeaturedRail />
      <PaletteMatch />
      <ServicesTeaser />
      <AboutTeaser />
      <CtaBand />
    </>
  );
}
