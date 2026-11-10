import type { Metadata, Viewport } from "next";
import { Geist_Mono, Instrument_Serif, Inter_Tight } from "next/font/google";
import "./globals.css";
import { profile } from "@/data/profile";
import { GameProvider } from "@/components/game/GameProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Cursor } from "@/components/magic/Cursor";
import { Loader, loaderScript } from "@/components/magic/Loader";
import { ArchiveHud } from "@/components/game/ArchiveHud";
import { CommandPalette } from "@/components/innovations/CommandPalette";
import { Presentation } from "@/components/innovations/Presentation";

const sans = Inter_Tight({ variable: "--font-inter-tight", subsets: ["latin"] });
const serif = Instrument_Serif({ variable: "--font-instrument-serif", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const description =
  "Portfolio of Kwabena Acheampong, a Ghana-based graphic designer trained in advertising and packaging design. Visual identity, advertising, packaging and campaign design.";

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: { default: `${profile.name} | ${profile.title}`, template: `%s | ${profile.name}` },
  description,
  keywords: ["Kwabena Acheampong", "graphic designer", "Ghana", "brand identity", "packaging design", "advertising design", "portfolio"],
  authors: [{ name: profile.name }],
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    siteName: profile.name,
    title: `${profile.name} | ${profile.title}`,
    description,
    locale: "en",
  },
  twitter: { card: "summary_large_image", title: `${profile.name} | ${profile.title}`, description },
};

export const viewport: Viewport = { themeColor: "#1B2540", colorScheme: "light" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  url: profile.siteUrl,
  address: { "@type": "PostalAddress", addressCountry: "GH" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Takoradi Technical University" },
  knowsAbout: ["Graphic design", "Brand identity", "Advertising design", "Packaging design", "Typography"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: loaderScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {/* If JavaScript fails, never leave animated content invisible. */}
        <noscript>
          <style>{`[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important;transform:none!important;clip-path:none!important}.loader{display:none}`}</style>
        </noscript>
      </head>
      <body id="top" className="grain min-h-screen bg-ivory text-ink">
        <Loader />
        <a
          data-chrome
          href="#main"
          className="fixed top-3 left-3 z-[95] -translate-y-20 rounded-full bg-navy px-4 py-2 t-small text-ivory transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <GameProvider>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <ArchiveHud />
          <CommandPalette />
          <Presentation />
          <Cursor />
        </GameProvider>
      </body>
    </html>
  );
}
