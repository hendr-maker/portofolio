import type { MetadataRoute } from "next";
import { abs, pagePath } from "@/content";
import { allProjects } from "@/projects";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [undefined, ...allProjects.map((p) => p.slug)].map((slug) => ({
    url: abs(pagePath("en", slug)),
    alternates: { languages: { en: abs(pagePath("en", slug)), id: abs(pagePath("id", slug)) } },
  }));
}
