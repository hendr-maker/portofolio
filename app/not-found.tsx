import type { Metadata } from "next";
import { buttonVariants } from "@/components/ui/button";
import { SiteShell } from "@/components/SiteShell";
import { href, pagePath } from "@/content";

// Overrides the root canonical/OG, which would otherwise point this noindex page at the home page.
export const metadata: Metadata = {
  title: "404 · Page not found",
  description: "This page does not exist or has moved.",
  robots: { index: false },
  alternates: { canonical: null, languages: {} },
  openGraph: null,
};

export default function NotFound() {
  return (
    <SiteShell lang="en" alternate={pagePath("id")}>
      <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
        <p className="font-mono text-sm text-primary">404</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Page not found</h1>
        <p className="mt-3 text-muted-foreground">
          The page you are looking for does not exist or has moved. · Halaman yang Anda cari tidak ada atau sudah dipindahkan.
        </p>
        <div className="mt-8 flex gap-3">
          <a href={href(pagePath("en"))} className={buttonVariants({ size: "lg" })}>Back to home</a>
          <a href={href(pagePath("id"))} className={buttonVariants({ size: "lg", variant: "outline" })}>Ke beranda</a>
        </div>
      </main>
    </SiteShell>
  );
}
