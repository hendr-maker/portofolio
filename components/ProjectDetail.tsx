import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiExplorer, AppScreen, Console, FlowDiagram } from "@/components/views";
import { SiteShell } from "@/components/SiteShell";
import { abs, href, ogImage, pagePath, profile, siteUrl, ui, ldJson, type Lang } from "@/content";
import { allProjects, type Project } from "@/projects";

const find = (slug: string) => allProjects.findIndex((x) => x.slug === slug);

export const projectParams = () => allProjects.map((p) => ({ slug: p.slug }));

// Shortens to max chars on a word boundary; hard-cuts when the first word alone is too long.
const clip = (text: string, max: number) => {
  if (text.length <= max) return text;
  const space = text.lastIndexOf(" ", max - 1);
  return `${text.slice(0, space > 0 ? space : max - 1)}…`;
};

export function projectMetadata(lang: Lang, slug: string): Metadata {
  const p = allProjects[find(slug)];
  if (!p) return {};
  const title = clip(`${p.title[lang]} · ${profile.name}`, 60);
  const built = lang === "en" ? "Built with" : "Dibangun dengan";
  const description = clip(`${p.summary[lang]} ${built} ${p.stack.slice(0, 4).join(", ")}.`, 160);
  return {
    title,
    description,
    alternates: {
      canonical: abs(pagePath(lang, slug)),
      languages: { en: abs(pagePath("en", slug)), id: abs(pagePath("id", slug)), "x-default": abs(pagePath("en", slug)) },
    },
    openGraph: { title, description, type: "article", url: abs(pagePath(lang, slug)), images: [ogImage], locale: lang === "en" ? "en_US" : "id_ID" },
  };
}

function views(p: Project, lang: Lang): { id: string; label: string; node: ReactNode }[] {
  const { app, api, flow, cli } = p.view;
  return [
    ...(app?.screens.map((s, i) => ({ id: `app-${i}`, label: app.screens.length > 1 ? s.name : ui.tabApp[lang], node: <AppScreen app={app} screen={s} slug={p.slug} /> })) ?? []),
    ...(api ? [{ id: "api", label: ui.tabApi[lang], node: <ApiExplorer api={api} /> }] : []),
    ...(flow ? [{ id: "flow", label: ui.tabFlow[lang], node: <FlowDiagram flow={flow} /> }] : []),
    ...(cli ? [{ id: "cli", label: ui.tabCli[lang], node: <Console cli={cli} /> }] : []),
  ];
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="reveal">
      <h2 className="text-sm font-semibold tracking-widest text-primary uppercase">{title}</h2>
      <div className="mt-3 text-pretty">{children}</div>
    </section>
  );
}

export default function ProjectDetail({ lang, slug }: { lang: Lang; slug: string }) {
  const i = find(slug);
  if (i < 0) notFound();
  const p = allProjects[i];
  const next = allProjects[(i + 1) % allProjects.length];
  const tabs = views(p, lang);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.title.en,
    description: p.summary.en,
    keywords: p.stack.join(", "),
    author: { "@type": "Person", name: profile.name, url: `${siteUrl}/` },
    url: abs(pagePath("en", p.slug)),
  };

  return (
    <SiteShell lang={lang} alternate={pagePath(lang === "en" ? "id" : "en", slug)}>
      <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(jsonLd)} />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <a href={`${href(pagePath(lang))}#projects`} className={buttonVariants({ variant: "ghost", size: "sm", className: "-ml-2.5" })}>
          <ArrowLeft data-icon="inline-start" /> {ui.back[lang]}
        </a>

        <header className="mt-6 animate-in slide-in-from-bottom-4 duration-500">
          <p className="text-sm font-semibold tracking-widest text-primary uppercase">{p.group.title[lang]}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-balance sm:text-5xl">{p.title[lang]}</h1>
          {p.client && <p className="mt-2 text-muted-foreground">{ui.client[lang]}: {p.client[lang]}</p>}
          <p className="mt-4 max-w-3xl text-lg text-pretty text-muted-foreground">{p.summary[lang]}</p>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {p.stack.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
          </div>
        </header>

        <figure className="mt-10">
          <div className="rounded-2xl border bg-gradient-to-br from-accent/60 via-muted/40 to-background p-3 sm:p-6">
            <Tabs defaultValue={tabs[0].id}>
              {tabs.length > 1 && (
                <TabsList className="mb-4 max-w-full overflow-x-auto">
                  {tabs.map((t) => <TabsTrigger key={t.id} value={t.id}>{t.label}</TabsTrigger>)}
                </TabsList>
              )}
              {tabs.map((t) => (
                <TabsContent key={t.id} value={t.id} keepMounted className="min-w-0 data-[hidden]:hidden">
                  {t.node}
                </TabsContent>
              ))}
            </Tabs>
          </div>
          {p.group.internal && <figcaption className="mt-3 text-center text-xs text-muted-foreground">{ui.mockupNote[lang]}</figcaption>}
        </figure>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          <Section title={ui.context[lang]}><p>{p.context[lang]}</p></Section>
          <Section title={ui.role[lang]}><p>{p.role[lang]}</p></Section>
          <Section title={ui.solution[lang]}><p>{p.solution[lang]}</p></Section>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-[3fr_2fr]">
          <Section title={ui.features[lang]}>
            <ul className="flex flex-col gap-3">
              {p.features.map((f) => (
                <li key={f.en} className="flex gap-3"><Check className="mt-0.5 size-5 shrink-0 text-primary" /><span>{f[lang]}</span></li>
              ))}
            </ul>
          </Section>
          {p.impact.length > 0 && (
            <Section title={ui.impact[lang]}>
              <ul className="flex flex-col gap-3 rounded-xl border bg-accent/40 p-5">
                {p.impact.map((m) => (
                  <li key={m.en} className="flex gap-3 font-medium"><TrendingUp className="mt-0.5 size-5 shrink-0 text-primary" /><span>{m[lang]}</span></li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        <Separator className="my-12" />
        <a href={href(pagePath(lang, next.slug))} className="group flex items-center justify-between rounded-xl border p-6 transition-colors hover:bg-muted/50">
          <span>
            <span className="block text-sm text-muted-foreground">{ui.next[lang]}</span>
            <span className="text-lg font-semibold">{next.title[lang]}</span>
          </span>
          <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
        </a>
      </main>
    </SiteShell>
  );
}
