import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play, Files, GitBranch, LayoutDashboard, Search, Server, Workflow } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Preview } from "@/components/views";
import { SiteShell } from "@/components/SiteShell";
import { abs, engagements, experience, href, pagePath, profile, services, skills, ui, ldJson, type Lang } from "@/lib/content";
import { groups, moreWork, type Project } from "@/lib/projects";
import { cn } from "cn";
import { skillIconId, skillIcons, spritePath } from "@/lib/skill-icons";
import { GitHubLogo, LinkedInLogo } from "@/components/social";

// Visual Studio Code token colors (Light+ / Dark+) and a tiny regex highlighter for the hero backdrop. The code is
// written for the backdrop, not taken from any project.
const tones = {
  kw: "text-[#0000ff] dark:text-[#569cd6]", ctl: "text-[#af00db] dark:text-[#c586c0]", ty: "text-[#267f99] dark:text-[#4ec9b0]",
  fn: "text-[#795e26] dark:text-[#dcdcaa]", str: "text-[#a31515] dark:text-[#ce9178]", cm: "text-[#008000] dark:text-[#6a9955]",
};
const keywords = new Set(["namespace", "public", "sealed", "class", "async", "var", "is", "null", "in", "out", "new", "string", "int"]);
const control = new Set(["await", "return", "if", "foreach"]);
const tone = (line: string, t: string, at: number) => {
  if (t.startsWith("//")) return tones.cm;
  if (t.endsWith('"')) return tones.str;
  if (keywords.has(t)) return tones.kw;
  if (control.has(t)) return tones.ctl;
  if (line[at + t.length] === "(") return tones.fn;
  if (/^[A-Z]/.test(t) && line[at - 1] !== ".") return tones.ty;
};
const code = `namespace Orders.Api.Features.Checkout;

public sealed class PlaceOrderHandler(AppDb db, IOutbox outbox, TimeProvider clock, ILogger<PlaceOrderHandler> log)
{
    public async Task<Result<OrderId>> Handle(PlaceOrder cmd, CancellationToken ct)
    {
        var cart = await db.Carts
            .Include(c => c.Lines)
            .SingleOrDefaultAsync(c => c.Id == cmd.CartId, ct);
        if (cart is null) return Result.NotFound("cart");

        var skus = cart.Lines.Select(l => l.Sku).ToArray();
        var stock = await db.Stock
            .Where(s => skus.Contains(s.Sku))
            .ToDictionaryAsync(s => s.Sku, ct);

        foreach (var line in cart.Lines)
        {
            if (!stock.TryGetValue(line.Sku, out var item) || item.Available < line.Qty)
                return Result.Conflict($"insufficient stock: {line.Sku}");
            item.Reserve(line.Qty);
        }

        var order = Order.Create(cart, clock.GetUtcNow());
        db.Orders.Add(order);
        outbox.Enqueue(new OrderPlaced(order.Id, order.Total));

        await db.SaveChangesAsync(ct);
        log.LogInformation("Order {OrderId} placed with {Count} lines", order.Id, cart.Lines.Count);
        return order.Id;
    }
}`.split("\n");

// Blurred Visual Studio Code editor in the hero: full-bleed and strongly dimmed on small screens, the empty right half on lg.
// Text and icons only (panel fills drew hard horizontal bands); faded by its mask, not a gradient overlay (an alpha
// gradient that wide bands into visible vertical lines); static filter, no backdrop-filter, so it rasterizes once.
// data-nosnippet keeps the sample code out of search snippets; aria-hidden only hides it from screen readers.
function EditorBackdrop() {
  return (
    <div aria-hidden data-nosnippet className="absolute inset-0 -z-10 flex overflow-hidden text-foreground blur-[1px] select-none [mask-composite:intersect] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_65%,transparent),linear-gradient(to_right,rgb(0_0_0/0.05),rgb(0_0_0/0.12)_50%,rgb(0_0_0/0.2))] lg:left-[55%] lg:[mask-image:linear-gradient(to_bottom,transparent,black_20%,black_65%,transparent),linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
      <div className="flex flex-col gap-5 px-3 pt-20 text-foreground/40">
        <Files className="size-5 text-foreground/70" /><Search className="size-5" /><GitBranch className="size-5" />
      </div>
      <div className="min-w-0 flex-1 pt-16">
        <div className="flex text-xs text-foreground/50">
          <span className="border-t-2 border-t-[#007acc] px-4 py-2 text-foreground/80">PlaceOrderHandler.cs</span>
          <span className="px-4 py-2">Order.cs</span>
        </div>
        {/* Line numbers come from a CSS counter, so they are not DOM text for contrast audits to flag. */}
        <pre className="py-4 font-mono text-sm leading-7 [counter-reset:ln]">
          {code.map((line, i) => (
            <div key={i} className="whitespace-pre before:inline-block before:w-12 before:pr-4 before:text-right before:text-foreground/30 before:content-[counter(ln)] before:[counter-increment:ln]">
              {[...line.matchAll(/\/\/.*|\$?"[^"]*"|\w+|[^\w"$]+|./g)].map((m, j) => {
                const c = tone(line, m[0], m.index);
                return c ? <span key={j} className={c}>{m[0]}</span> : m[0];
              })}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

// Carousel behavior, as a plain inline script (CSP allows inline): the exported home ships no React at all (see
// scripts/strip-home-js.mjs). It runs while the page parses and changes hidden/style/aria-pressed; those elements are
// marked suppressHydrationWarning because `pnpm dev` still hydrates the home page:
// - Browsers without CSS ::scroll-button (Safari, Firefox) get the real prev/next buttons revealed.
// - [data-autoplay] drifts slowly with snap off. Hover/focus and off-screen pause it; touch, wheel, click or key stop
//   it and restore snap; the visible pause/resume button controls it too (WCAG 2.2.2). Never under reduced motion.
const carouselScript = `(() => {
  const native = CSS.supports("selector(::scroll-marker)");
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  for (const el of document.querySelectorAll(".carousel")) {
    const ctl = (name) => document.querySelector("[data-" + name + "='" + el.id + "']");
    let x = 0, seen = false, on = false;
    const toggle = ctl("autoplay");
    const set = (v) => {
      on = v;
      x = el.scrollLeft;
      el.style.scrollSnapType = v ? "none" : "";
      el.style.scrollBehavior = v ? "auto" : "";
      toggle?.setAttribute("aria-pressed", String(!v));
    };
    const nav = ctl("nav");
    if (!native && nav) {
      nav.hidden = false;
      for (const b of nav.querySelectorAll("button")) b.addEventListener("click", () => {
        set(false);
        el.scrollBy({ left: Number(b.dataset.dir) * el.clientWidth * 0.8, behavior: "smooth" });
      });
    }
    if (!toggle || calm) continue;
    toggle.hidden = false;
    toggle.addEventListener("click", () => set(!on));
    for (const e of ["pointerdown", "wheel", "touchstart", "keydown"]) el.addEventListener(e, () => set(false), { passive: true });
    new IntersectionObserver(([e]) => { seen = e.isIntersecting; }).observe(el);
    set(true);
    const step = () => {
      // Hover/focus pauses: follow wherever the user leaves it.
      if (on && seen && el.matches(":hover, :focus-within")) x = el.scrollLeft;
      else if (on && seen) {
        x += 0.4;
        if (x >= el.scrollWidth - el.clientWidth) x = 0;
        el.scrollLeft = x;
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
})();`;

// Portrait 9:16 tile, like a short-video thumbnail: the mockup preview fills it and a solid strip carries the title,
// so a carousel page shows several projects. The case study itself lives on the detail page.
function ProjectCard({ p, lang }: { p: Project; lang: Lang }) {
  return (
    <Card className="reveal group/project relative aspect-[9/16] w-full min-w-0 gap-0 py-0 transition-shadow hover:shadow-lg has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring">
      {/* The preview renders at phone width (360px) and scales to the tile: tan(atan2(a, b)) is a unitless a / b. Every
          window is stretched past the tile and clipped, so all tiles look equally full whatever the mockup's height. */}
      <div aria-hidden className="cv @container pointer-events-none min-h-0 flex-1 overflow-hidden bg-gradient-to-br from-accent/50 via-muted/40 to-background px-3 pt-3">
        <div className="w-[360px] origin-top-left transition-transform duration-500 [scale:tan(atan2(100cqw,360px))] group-hover/project:-translate-y-1 *:min-h-[760px] [&>*>:last-child]:flex-1">
          <Preview project={p} />
        </div>
      </div>
      <div className="flex items-end gap-2 border-t bg-card px-3 py-3">
        <div className="min-w-0 flex-1">
          <h4 className="line-clamp-2 min-h-[2lh] text-sm font-semibold">
            <a href={href(pagePath(lang, p.slug))} className="outline-none after:absolute after:inset-0">{p.title[lang]}</a>
          </h4>
          <p className="mt-0.5 line-clamp-2 min-h-[2lh] text-xs text-muted-foreground">{p.summary[lang]}</p>
        </div>
        <ArrowRight aria-hidden className="size-4 shrink-0 text-primary transition-transform group-hover/project:translate-x-1" />
      </div>
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

      <main>
      <section className="relative isolate overflow-hidden">
        <EditorBackdrop />
        <div aria-hidden className="hero-glow absolute -top-40 left-1/2 -z-10 size-[26rem] -translate-x-1/2 rounded-full blur-2xl sm:size-[42rem] sm:blur-3xl" />
        <div className="mx-auto max-w-6xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-20">
          <Badge variant="outline" className="rise-fade">
            <span className="pulse-dot size-1.5 rounded-full bg-success" /> {profile.location[lang]}
          </Badge>
          <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight text-balance rise sm:text-7xl">
            {profile.name}
            <span className="mt-2 block bg-gradient-to-r from-primary to-foreground bg-clip-text text-2xl text-transparent sm:text-5xl">
              {profile.role[lang]}
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-pretty text-muted-foreground rise">
            {profile.summary[lang]}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 rise-fade [animation-delay:300ms]">
            <a href="#projects" className={buttonVariants({ size: "lg" })}>
              {ui.seeWork[lang]} <ArrowRight data-icon="inline-end" />
            </a>
            <a href={profile.linkedin} title="LinkedIn" className={cn(buttonVariants({ size: "icon-lg", variant: "outline" }))}>
              <LinkedInLogo /><span className="sr-only">LinkedIn</span>
            </a>
            <a href={profile.github} title="GitHub" className={cn(buttonVariants({ size: "icon-lg", variant: "outline" }))}>
              <GitHubLogo /><span className="sr-only">GitHub</span>
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 pb-20 sm:gap-20 sm:px-6">
        <section id="projects" className="scroll-mt-20">
          <h2 className="text-sm font-semibold tracking-widest text-primary uppercase">{ui.projects[lang]}</h2>
          <div className="mt-6 flex flex-col gap-14">
            {groups.map((g) => (
              <div key={g.id}>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-2xl font-semibold tracking-tight">{g.title[lang]}</h3>
                  {g.id === "current" && (
                    <button type="button" hidden suppressHydrationWarning data-autoplay={`carousel-${g.id}`} aria-controls={`carousel-${g.id}`} aria-pressed="false" aria-label={ui.pause[lang]} className={cn(buttonVariants({ variant: "outline", size: "icon" }), "group/toggle")}>
                      <Pause aria-hidden className="group-aria-pressed/toggle:hidden" /><Play aria-hidden className="hidden group-aria-pressed/toggle:block" />
                    </button>
                  )}
                </div>
                <p className="mt-2 max-w-2xl text-muted-foreground">{g.intro[lang]}</p>
                <div className="relative mt-8">
                  <ul suppressHydrationWarning id={`carousel-${g.id}`} aria-label={g.title[lang]} className="carousel" data-autoplay={g.id === "current" ? "" : undefined}>
                    {g.projects.map((p) => (
                      <li key={p.slug} className="flex min-w-0 items-start">
                        <ProjectCard p={p} lang={lang} />
                      </li>
                    ))}
                  </ul>
                  {/* Real buttons for browsers without CSS ::scroll-button; the script reveals them there. */}
                  <div hidden suppressHydrationWarning data-nav={`carousel-${g.id}`} className="mt-4 flex justify-between">
                    <button type="button" data-dir="-1" aria-controls={`carousel-${g.id}`} aria-label={ui.prevSlide[lang]} className={cn(buttonVariants({ variant: "outline", size: "icon-lg" }))}><ArrowLeft aria-hidden /></button>
                    <button type="button" data-dir="1" aria-controls={`carousel-${g.id}`} aria-label={ui.nextSlide[lang]} className={cn(buttonVariants({ variant: "outline", size: "icon-lg" }))}><ArrowRight aria-hidden /></button>
                  </div>
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

        {/* After the carousels, so the inline script finds them while the page parses. */}
        <script dangerouslySetInnerHTML={{ __html: carouselScript }} />

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
                      <span className="flex size-11 items-center justify-center rounded-xl border bg-background/70 text-foreground/85 transition-[translate,border-color,color] duration-300 group-hover/logo:-translate-y-0.5 group-hover/logo:border-primary/50">
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

        <section id="contact" className="reveal grid scroll-mt-20 overflow-hidden rounded-2xl border bg-accent/40 lg:grid-cols-5">
          <div className="p-8 sm:p-12 lg:col-span-3">
            <h2 className="text-3xl font-bold tracking-tight">{ui.contact[lang]}</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">{ui.contactBody[lang]}</p>
            <h3 className="mt-8 text-sm font-semibold tracking-widest text-primary uppercase">{ui.helpTitle[lang]}</h3>
            <ul className="mt-4 grid gap-5">
              {services.map((s, n) => {
                const Icon = [Server, Workflow, LayoutDashboard][n];
                return (
                  <li key={s.title.en} className="flex gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border bg-background/70 text-primary"><Icon className="size-5" /></span>
                    <div>
                      <p className="font-medium">{s.title[lang]}</p>
                      <p className="text-sm text-muted-foreground">{s.body[lang]}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="flex flex-col gap-4 border-t bg-card/60 p-8 sm:p-12 lg:col-span-2 lg:border-t-0 lg:border-l">
            <h3 className="text-sm font-semibold tracking-widest text-primary uppercase">{ui.reachTitle[lang]}</h3>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="pulse-dot size-1.5 rounded-full bg-success" /> {profile.location[lang]}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted-foreground">{ui.openTo[lang]}</span>
              {engagements.map((e) => <Badge key={e.en} variant="secondary">{e[lang]}</Badge>)}
            </div>
            {[
              { name: "LinkedIn", Logo: LinkedInLogo, url: profile.linkedin, note: ui.linkedinNote[lang], primary: true },
              { name: "GitHub", Logo: GitHubLogo, url: profile.github, note: ui.githubNote[lang], primary: false },
            ].map((c) => (
              <a
                key={c.name}
                href={c.url}
                className={cn(
                  "group/channel flex items-center justify-between gap-4 rounded-xl border p-4 transition-colors",
                  c.primary ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90" : "bg-background/70 hover:border-primary/50",
                )}
              >
                <span className="flex items-center gap-3">
                  {/* White tile keeps both marks in their own colors on the teal primary card too. */}
                  <span className="rounded-lg bg-white p-1.5 text-[#181717] shadow-sm"><c.Logo className="size-6" /></span>
                  <span className="sr-only">{c.name}</span>
                  <span className={cn("text-sm", c.primary ? "text-primary-foreground/90" : "text-muted-foreground")}>{c.note}</span>
                </span>
                <ArrowUpRight className="size-5 shrink-0 transition-transform group-hover/channel:translate-x-0.5 group-hover/channel:-translate-y-0.5" />
              </a>
            ))}
          </div>
        </section>
      </div>
      </main>
    </SiteShell>
  );
}
