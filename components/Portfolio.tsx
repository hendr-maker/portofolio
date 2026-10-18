import { ArrowRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Preview } from "@/components/views";
import { SiteShell } from "@/components/SiteShell";
import { abs, experience, href, pagePath, profile, skills, ui, ldJson, type Lang } from "@/lib/content";
import { groups, moreWork, type Project } from "@/lib/projects";
import { cn } from "cn";
import { skillIconId, skillIcons, spritePath } from "@/lib/skill-icons";

function ProjectCard({ p, lang, featured }: { p: Project; lang: Lang; featured: boolean }) {
  return (
    <Card className="reveal group/project relative min-w-0 pt-0 transition-shadow hover:shadow-lg has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring">
      <div aria-hidden className={cn("pointer-events-none overflow-hidden border-b bg-gradient-to-br from-accent/50 via-muted/40 to-background p-4", featured ? "aspect-[16/10]" : "aspect-[16/9]")}>
        <div className="transition-transform duration-500 group-hover/project:-translate-y-1" style={{ zoom: featured ? 0.62 : 0.55 }}>
          <Preview project={p} />
        </div>
      </div>
      <CardHeader>
        {p.client && <p className="text-xs font-medium text-muted-foreground">{p.client[lang]}</p>}
        <CardTitle className="text-lg">
          <h4><a href={href(pagePath(lang, p.slug))} className="outline-none after:absolute after:inset-0">{p.title[lang]}</a></h4>
        </CardTitle>
        <CardDescription>{p.summary[lang]}</CardDescription>
      </CardHeader>
      {featured && p.impact[0] && (
        <CardContent className="flex gap-2 text-sm">
          <Check className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>{p.impact[0][lang]}</span>
        </CardContent>
      )}
      <CardContent className="flex flex-wrap gap-1.5">
        {p.stack.slice(0, 5).map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
      </CardContent>
      <CardFooter className="mt-auto text-sm font-medium text-primary">
        {ui.viewProject[lang]} <ArrowRight className="ml-1 size-4 transition-transform group-hover/project:translate-x-1" />
      </CardFooter>
    </Card>
  );
}

export default function Portfolio({ lang }: { lang: Lang }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: profile.name,
        jobTitle: profile.role[lang],
        description: profile.summary[lang],
        url: abs(pagePath("en")),
        sameAs: [profile.linkedin, profile.github],
        knowsAbout: skills.flatMap((s) => s.items),
      },
      {
        "@type": "WebSite",
        name: profile.name,
        url: abs(pagePath(lang)),
        inLanguage: lang,
      },
    ],
  };

  return (
    <SiteShell lang={lang} alternate={pagePath(lang === "en" ? "id" : "en")}>
      <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(jsonLd)} />

      <section className="relative isolate overflow-hidden">
        <div aria-hidden className="hero-grid absolute inset-0 -z-10" />
        <div aria-hidden className="hero-glow absolute -top-40 left-1/2 -z-10 size-[26rem] -translate-x-1/2 rounded-full blur-2xl sm:size-[42rem] sm:blur-3xl" />
        <div className="mx-auto max-w-6xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-20">
          <Badge variant="outline" className="animate-in fade-in slide-in-from-bottom-2 duration-700">
            <span className="pulse-dot size-1.5 rounded-full bg-success" /> {profile.location[lang]}
          </Badge>
          <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight text-balance animate-in slide-in-from-bottom-4 duration-700 sm:text-7xl">
            {profile.name}
            <span className="mt-2 block bg-gradient-to-r from-primary to-foreground bg-clip-text text-2xl text-transparent sm:text-5xl">
              {profile.role[lang]}
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-pretty text-muted-foreground animate-in slide-in-from-bottom-4 duration-700">
            {profile.summary[lang]}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:300ms] [animation-fill-mode:both]">
            <a href="#projects" className={buttonVariants({ size: "lg" })}>
              {ui.seeWork[lang]} <ArrowRight data-icon="inline-end" />
            </a>
            <a href={profile.linkedin} className={buttonVariants({ size: "lg", variant: "outline" })}>LinkedIn</a>
            <a href={profile.github} className={buttonVariants({ size: "lg", variant: "outline" })}>GitHub</a>
          </div>
        </div>
      </section>

      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-4 pb-20 sm:gap-20 sm:px-6">
        <section id="projects" className="scroll-mt-20">
          <h2 className="text-sm font-semibold tracking-widest text-primary uppercase">{ui.projects[lang]}</h2>
          <div className="mt-6 flex flex-col gap-14">
            {groups.map((g) => (
              <div key={g.id}>
                <h3 className="text-2xl font-semibold tracking-tight">{g.title[lang]}</h3>
                <p className="mt-2 max-w-2xl text-muted-foreground">{g.intro[lang]}</p>
                <div className={cn("mt-8 grid gap-6", g.id === "current" ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3")}>
                  {g.projects.map((p) => <ProjectCard key={p.slug} p={p} lang={lang} featured={g.id === "current"} />)}
                </div>
                {g.id === "earlier" && (
                  <div className="reveal mt-6 rounded-xl border p-5">
                    <p className="font-medium">{ui.moreWork[lang]}</p>
                    <ul className="mt-3 grid gap-x-6 gap-y-2 text-sm text-muted-foreground md:grid-cols-2">
                      {moreWork.map((w) => (
                        <li key={w.en} className="flex gap-2"><span aria-hidden className="text-primary">▹</span>{w[lang]}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section id="experience" className="scroll-mt-20">
          <h2 className="text-sm font-semibold tracking-widest text-primary uppercase">{ui.experience[lang]}</h2>
          <ol className="mt-6 flex flex-col gap-8 border-l pl-6">
            {experience.map((e) => (
              <li key={e.company} className="reveal relative">
                <span aria-hidden className="absolute top-1.5 -left-[29px] size-2.5 rounded-full bg-primary ring-4 ring-background" />
                <p className="font-mono text-xs text-muted-foreground">{e.period}</p>
                <h3 className="font-semibold">{e.role} · {e.company}</h3>
                <p className="text-muted-foreground">{e.note[lang]}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="skills" className="scroll-mt-20">
          <h2 className="text-sm font-semibold tracking-widest text-primary uppercase">{ui.skills[lang]}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {skills.map((s, n) => (
              <div key={s.title.en} className={cn("skill-tile reveal flex flex-col gap-5 rounded-2xl border p-6", n < 2 ? "lg:col-span-3" : "lg:col-span-2")}>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-lg font-semibold tracking-tight">
                    <span className="mr-2 font-mono text-xs text-primary">{String(n + 1).padStart(2, "0")}</span>
                    {s.title[lang]}
                  </h3>
                  <span className="font-mono text-xs text-muted-foreground">{s.items.length}</span>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {s.items.filter((i) => skillIcons[i]).map((i) => (
                    <li key={i} className="group/logo relative">
                      <span className="flex size-11 items-center justify-center rounded-xl border bg-background/70 text-foreground/85 transition-all duration-300 group-hover/logo:-translate-y-0.5 group-hover/logo:border-primary/50">
                        <svg aria-hidden className="size-5 fill-current" style={{ color: skillIcons[i].color }}><use href={href(`${spritePath}#${skillIconId(i)}`)} /></svg>
                      </span>
                      <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-md bg-foreground px-2 py-1 text-xs whitespace-nowrap text-background opacity-0 transition-opacity group-hover/logo:opacity-100 max-sm:sr-only">
                        {i}
                      </span>
                    </li>
                  ))}
                  {s.items.filter((i) => !skillIcons[i]).map((i) => (
                    <li key={i} className="flex h-11 items-center rounded-xl border border-dashed bg-background/40 px-3 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground">
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="reveal scroll-mt-20 rounded-2xl border bg-accent/40 p-8 sm:p-12">
          <h2 className="text-3xl font-bold tracking-tight">{ui.contact[lang]}</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">{ui.contactBody[lang]}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={profile.linkedin} className={buttonVariants({ size: "lg" })}>LinkedIn</a>
            <a href={profile.github} className={buttonVariants({ size: "lg", variant: "outline" })}>GitHub</a>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
