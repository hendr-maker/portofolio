import type { ReactNode } from "react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GitHubLogo, LinkedInLogo } from "@/components/social";
import { href, pagePath, profile, ui, type Lang } from "@/lib/content";

export function SiteShell({ lang, alternate, children }: { lang: Lang; alternate: string; children: ReactNode }) {
  const home = href(pagePath(lang));
  return (
    <div lang={lang} className="flex min-h-full flex-col">
      <header className="sticky top-0 z-20 border-b bg-background/75 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <a href={home} className="font-semibold tracking-tight">{profile.name}</a>
          <nav className="flex items-center gap-1 text-sm">
            <a href={`${home}#projects`} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden sm:inline-flex")}>{ui.projects[lang]}</a>
            <a href={`${home}#experience`} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden sm:inline-flex")}>{ui.experience[lang]}</a>
            <a href={href(alternate)} hrefLang={lang === "en" ? "id" : "en"} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
              {ui.switchLabel[lang]}
            </a>
          </nav>
        </div>
      </header>
      <div className="flex-1">{children}</div>
      <footer className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6">
        <Separator className="mb-6" />
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>© {profile.name}</span>
          <span className="flex items-center gap-4">
            <a href={profile.linkedin} title="LinkedIn" className="transition-opacity hover:opacity-80"><LinkedInLogo /><span className="sr-only">LinkedIn</span></a>
            <a href={profile.github} title="GitHub" className="text-foreground transition-opacity hover:opacity-80"><GitHubLogo /><span className="sr-only">GitHub</span></a>
          </span>
        </div>
      </footer>
    </div>
  );
}
