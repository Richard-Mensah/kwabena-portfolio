import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/work", "/gallery", "/about", "/services", "/contact"];
  return [
    ...pages.map((p) => ({ url: `${profile.siteUrl}${p}`, priority: p ? 0.8 : 1 })),
    ...projects.map((p) => ({ url: `${profile.siteUrl}/work/${p.slug}`, priority: 0.7 })),
  ];
}
