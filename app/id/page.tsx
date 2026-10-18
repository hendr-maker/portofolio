import type { Metadata } from "next";
import Portfolio from "@/components/Portfolio";
import { abs, ogImage, pagePath, profile, seo } from "@/lib/content";

export const metadata: Metadata = {
  title: seo.title.id,
  description: seo.description.id,
  alternates: { canonical: abs(pagePath("id")), languages: { en: abs(pagePath("en")), id: abs(pagePath("id")), "x-default": abs(pagePath("en")) } },
  openGraph: { type: "profile", locale: "id_ID", alternateLocale: "en_US", siteName: profile.name, title: seo.title.id, description: seo.description.id, url: abs(pagePath("id")), images: [ogImage] },
};

export default function Page() {
  return <Portfolio lang="id" />;
}
