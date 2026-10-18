import type { MetadataRoute } from "next";
import { abs, pagePath } from "@/lib/content";
import { allProjects } from "@/lib/projects";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // Every language version gets its own <url>, each repeating the full alternate set (Google's recommended form).
  return [undefined, ...allProjects.map((p) => p.slug)].flatMap((slug) =>
    (["en", "id"] as const).map((lang) => ({
      url: abs(pagePath(lang, slug)),
      alternates: { languages: { en: abs(pagePath("en", slug)), id: abs(pagePath("id", slug)), "x-default": abs(pagePath("en", slug)) } },
    })),
  );
}
