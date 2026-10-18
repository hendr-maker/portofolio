import type { ReactNode } from "react";
import { ChevronDown, Lock, Search } from "lucide-react";
import { renderMermaidSVG } from "beautiful-mermaid";
import { Badge } from "@/components/ui/badge";
import { cn } from "cn";
import type { ApiView, AppView, Block, CliView, FlowView, Method, Project, Screen } from "@/lib/projects";

// Renders the illustrative views defined in projects.ts. Data there is invented. Layout responds to the view's own
// width (container queries), so the same markup reads as a phone screen inside a home-page tile.
// Plain server markup on purpose: no client components, so nothing is hydrated or serialized twice.

function Chrome({ url, children, className }: { url: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("@container flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm", className)}>
      <div className="flex items-center gap-1.5 border-b bg-muted/60 px-3 py-2">
        <span className="size-2.5 rounded-full bg-destructive/70" />
        <span className="size-2.5 rounded-full bg-warning/80" />
        <span className="size-2.5 rounded-full bg-success/80" />
        <span className="ml-3 truncate rounded-md bg-background px-2 py-0.5 font-mono text-[11px] text-muted-foreground">{url}</span>
      </div>
      {children}
    </div>
  );
}

// Status words used in projects.ts. Anything not listed renders as a neutral outline badge.
const tone: Record<string, "secondary" | "destructive"> = Object.fromEntries([
  ...["Paid", "Done", "Delivered", "Active", "OK", "Approved", "Closed", "Extracted", "Normalised", "Matched", "On track", "Allocated", "Packed", "200"].map((s) => [s, "secondary" as const]),
  ...["Over", "Ended", "Review", "Waiting", "High", "Amount differs", "409", "503"].map((s) => [s, "destructive" as const]),
]);
function StatusBadge({ value }: { value: string }) {
  return <Badge variant={tone[value] ?? "outline"}>{value}</Badge>;
}

function Bar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case "stats":
      return (
        <div className="col-span-full grid grid-cols-2 gap-2 @xl:grid-cols-4">
          {block.items.map(([label, value, delta]) => (
            <div key={label} className="rounded-lg border bg-background p-3">
              <p className="truncate text-[11px] text-muted-foreground">{label}</p>
              <p className="mt-1 text-base font-semibold">{value}</p>
              {delta && <p className="text-[11px] text-success">{delta}</p>}
            </div>
          ))}
        </div>
      );
    case "table":
      return (
        <div className={cn("min-w-0 rounded-lg border bg-background", block.wide && "col-span-full")}>
          {block.title && <p className="border-b px-3 py-2 font-medium">{block.title}</p>}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="text-muted-foreground">
                <tr className="border-b">{block.columns.map((c) => <th key={c} className="px-3 py-2 font-medium">{c}</th>)}</tr>
              </thead>
              <tbody>
                {block.rows.map((r, i) => (
                  <tr key={i} className="border-b last:border-0">
                    {r.map((cell, j) => (
                      <td key={j} className={cn("px-3 py-1.5", j === 0 && "font-mono")}>
                        {j === block.badge ? <StatusBadge value={cell} /> : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    case "bars": {
      const max = Math.max(...block.values);
      return (
        <div className="flex min-w-0 flex-col rounded-lg border bg-background p-3">
          <p className="font-medium">{block.title}</p>
          <div className="mt-3 flex h-28 items-end gap-1.5">
            {block.values.map((v, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <div className="grow-bar w-full rounded-t bg-primary/80" style={{ height: `${(v / max) * 100}%`, animationDelay: `${i * 60}ms` }} />
                <span className="text-[10px] text-muted-foreground">{block.labels[i]}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    case "kanban":
      return (
        <div className="col-span-full grid grid-cols-2 gap-2 @xl:grid-cols-4">
          {block.columns.map((c) => (
            <div key={c.title} className="flex flex-col gap-2 rounded-lg bg-muted/60 p-2">
              <p className="flex items-center justify-between font-medium">{c.title}<span className="text-muted-foreground">{c.cards.length}</span></p>
              {c.cards.map((card) => <div key={card} className="rounded-md border bg-card p-2 text-[11px] shadow-xs">{card}</div>)}
            </div>
          ))}
        </div>
      );
    case "form":
      return (
        <div className="min-w-0 rounded-lg border bg-background p-3">
          <p className="font-medium">{block.title}</p>
          <dl className="mt-3 flex flex-col gap-2">
            {block.fields.map(([label, value]) => (
              <div key={label} className="grid grid-cols-[7rem_1fr] gap-2">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="truncate rounded-md border bg-card px-2 py-1">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-3 flex justify-end gap-2">
            {block.actions.map((a, i) => (
              <span key={a} className={cn("rounded-md px-2.5 py-1 font-medium", i === block.actions.length - 1 ? "bg-primary text-primary-foreground" : "border")}>{a}</span>
            ))}
          </div>
        </div>
      );
    case "timeline":
      return (
        <div className="min-w-0 rounded-lg border bg-background p-3">
          <p className="font-medium">{block.title}</p>
          <ol className="mt-3 flex flex-col gap-2.5">
            {block.items.map(([time, text, done], i) => (
              <li key={i} className="flex items-center gap-2.5">
                <span className={cn("size-2.5 shrink-0 rounded-full", done ? "bg-primary" : "pulse-dot border-2 border-primary bg-background")} />
                <span className="w-10 shrink-0 font-mono text-[11px] text-muted-foreground">{time}</span>
                <span className={cn(!done && "text-muted-foreground")}>{text}</span>
              </li>
            ))}
          </ol>
        </div>
      );
    case "progress":
      return (
        <div className="flex min-w-0 flex-col gap-2.5 rounded-lg border bg-background p-3">
          <p className="font-medium">{block.title}</p>
          {block.items.map(([label, v]) => (
            <div key={label}>
              <div className="mb-1 flex justify-between"><span>{label}</span><span className="text-muted-foreground">{v}%</span></div>
              <Bar value={v} />
            </div>
          ))}
        </div>
      );
  }
}

function ScreenView({ screen, limit }: { screen: Screen; limit?: number }) {
  return (
    <div className="grid gap-3 @xl:grid-cols-2">
      {screen.blocks.slice(0, limit).map((b, i) => <BlockView key={i} block={b} />)}
    </div>
  );
}

// Sidebar item for a screen: the nav entry sharing its first word ("Campaign board" → "Campaigns"), else the first one.
const firstWord = (s: string) => s.toLowerCase().split(" ")[0];
const activeNav = (app: AppView, screen: Screen) =>
  app.nav.find((n) => firstWord(n).startsWith(firstWord(screen.name)) || firstWord(screen.name).startsWith(firstWord(n))) ?? app.nav[0];

export function AppScreen({ app, screen, slug, limit }: { app: AppView; screen: Screen; slug: string; limit?: number }) {
  const active = activeNav(app, screen);
  return (
    <Chrome url={`${slug}.example/${screen.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
      <div className="flex min-h-72 text-xs">
        <aside className="hidden w-40 shrink-0 flex-col gap-0.5 border-r bg-muted/30 p-2 @xl:flex">
          <p className="mb-2 flex items-center gap-2 px-2 py-1 font-semibold">
            <span className="size-4 rounded bg-primary" /> {app.name}
          </p>
          {app.nav.map((n) => (
            <span key={n} className={cn("rounded-md px-2 py-1.5", n === active ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground")}>{n}</span>
          ))}
        </aside>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2 border-b px-4 py-2">
            <p className="truncate text-sm font-semibold">{screen.name}</p>
            <span className="flex items-center gap-1.5 rounded-md border px-2 py-1 text-muted-foreground"><Search className="size-3" /> Search</span>
          </div>
          <div className="p-4"><ScreenView screen={screen} limit={limit} /></div>
        </div>
      </div>
    </Chrome>
  );
}

const methodColor: Record<Method, string> = {
  GET: "bg-sky-700",
  POST: "bg-emerald-700",
  PUT: "bg-amber-700",
  PATCH: "bg-violet-700",
  DELETE: "bg-rose-700",
};

export function ApiExplorer({ api, compact }: { api: ApiView; compact?: boolean }) {
  const first = api.groups[0]?.endpoints.find((e) => e.body || e.response);
  return (
    <Chrome url={`${api.baseUrl}/swagger`}>
      <div className="flex flex-col gap-4 p-4 text-xs">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-base font-semibold">{api.title}<Badge variant="secondary">{api.version}</Badge><Badge variant="outline">OAS 3.0</Badge></p>
            <p className="mt-1 font-mono text-muted-foreground">{api.baseUrl}</p>
          </div>
          <span className="flex items-center gap-1.5 rounded-md border border-success px-2.5 py-1 font-medium text-success"><Lock className="size-3" /> Authorize</span>
        </div>
        <p className="rounded-md bg-muted px-3 py-2 text-muted-foreground"><span className="font-medium text-foreground">Auth:</span> {api.auth}</p>
        {api.groups.slice(0, compact ? 2 : undefined).map((g) => (
          <div key={g.tag}>
            <p className="flex items-center justify-between border-b pb-1.5 text-sm font-semibold">{g.tag}<ChevronDown className="size-4 text-muted-foreground" /></p>
            <div className="mt-2 flex flex-col gap-1.5">
              {g.endpoints.map((e) => {
                const open = !compact && e === first;
                return (
                  <div key={e.method + e.path} className="overflow-hidden rounded-md border">
                    <div className="flex items-center gap-2 bg-muted/40 px-2 py-1.5">
                      <span className={cn("w-14 shrink-0 rounded px-1.5 py-0.5 text-center text-[10px] font-bold text-white", methodColor[e.method])}>{e.method}</span>
                      <span className="truncate font-mono font-medium">{e.path}</span>
                      <span className="ml-auto hidden truncate text-muted-foreground @xl:block">{e.summary}</span>
                    </div>
                    {open && (
                      <div className="grid gap-2 border-t p-2 @xl:grid-cols-2">
                        {e.body && <Code label="Request body · application/json" code={e.body} />}
                        {e.response && <Code label="200 · Response" code={e.response} />}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Chrome>
  );
}

function Code({ label, code }: { label: string; code: string }) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-[11px] text-muted-foreground">{label}</p>
      <pre className="overflow-x-auto rounded-md bg-[oklch(0.18_0.02_265)] p-2 font-mono text-[11px] leading-relaxed text-[oklch(0.9_0.05_180)]">{code}</pre>
    </div>
  );
}

// Mermaid flowchart rendered to SVG at build time, so no diagram library reaches the browser. Colors are page
// tokens (dark mode follows). The renderer's <style> is global once inlined, so its selectors are scoped to the
// diagram, and its Google Fonts @import is dropped (CSP, no third-party requests) in favor of the page font.
function mermaidFlow(flow: FlowView, direction: "LR" | "TD") {
  const label = (s: FlowView["steps"][number]) => [s.label, s.note].filter(Boolean).join("<br/>").replaceAll('"', "#quot;");
  const code = [
    `flowchart ${direction}`,
    ...flow.steps.map((s, i) => `  s${i}["${label(s)}"]`),
    `  ${flow.steps.map((_, i) => `s${i}`).join(" --> ")}`,
  ].join("\n");
  return renderMermaidSVG(code, { bg: "var(--card)", fg: "var(--foreground)", accent: "var(--primary)", muted: "var(--muted-foreground)", transparent: true, padding: 8 })
    .replace(/@import url\([^)]*\);/, "")
    .replace(/text \{ font-family:[^}]*\}/, ".flow-svg text { font-family: var(--font-geist-sans), system-ui, sans-serif; }")
    .replace(/\n {2}svg \{/, "\n  svg.flow-svg {")
    .replace("<svg ", '<svg class="flow-svg" ');
}

export function FlowDiagram({ flow }: { flow: FlowView }) {
  return (
    <div className="@container rounded-xl border bg-card p-4 text-xs shadow-sm sm:p-6">
      <p className="mb-4 text-sm font-semibold">{flow.title}</p>
      <div className="hidden @4xl:block [&_svg]:h-auto [&_svg]:max-w-full" dangerouslySetInnerHTML={{ __html: mermaidFlow(flow, "LR") }} />
      <div className="mx-auto max-w-xs @4xl:hidden [&_svg]:h-auto [&_svg]:max-w-full" dangerouslySetInnerHTML={{ __html: mermaidFlow(flow, "TD") }} />
    </div>
  );
}

const lineTone = { ok: "text-[oklch(0.8_0.15_150)]", warn: "text-[oklch(0.85_0.12_80)]", dim: "opacity-60", accent: "text-[oklch(0.82_0.12_182)]" };

export function Console({ cli }: { cli: CliView }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-[oklch(0.18_0.02_265)] text-[oklch(0.92_0.01_250)] shadow-sm">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
        <span className="size-2.5 rounded-full bg-destructive/70" />
        <span className="size-2.5 rounded-full bg-warning/80" />
        <span className="size-2.5 rounded-full bg-success/80" />
        <span className="ml-3 truncate font-mono text-[11px] opacity-60">{cli.title}</span>
      </div>
      <pre className="min-h-48 overflow-x-auto p-4 font-mono text-[11px] leading-relaxed">
        {cli.lines.map(([text, t], i) => <div key={i} className={t && lineTone[t]}>{text}</div>)}
      </pre>
    </div>
  );
}

// Card thumbnail: the most representative view, trimmed to keep the home page light.
export function Preview({ project }: { project: Project }) {
  const { app, api, cli, flow } = project.view;
  if (app) return <AppScreen app={app} screen={app.screens[0]} slug={project.slug} limit={2} />;
  if (api) return <ApiExplorer api={api} compact />;
  if (cli) return <Console cli={cli} />;
  return flow ? <FlowDiagram flow={flow} /> : null;
}
