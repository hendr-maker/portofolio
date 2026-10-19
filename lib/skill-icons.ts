import { icons as devicon } from "@iconify-json/devicon-plain";
import type { SimpleIcon } from "simple-icons";
import {
  siDocker, siDotnet, siFastapi, siGooglebigquery, siGooglecloud, siInertia, siLaravel, siNextdotjs, siOpentelemetry,
  siPostgresql, siPython, siRabbitmq, siReact, siTanstack, siRedis, siRust, siStryker, siTailwindcss, siTypescript,
} from "simple-icons";

// Skills shown as a logo in brand color; the rest stay text. simple-icons dropped Microsoft/Amazon marks, so those
// come from devicon-plain. Server-only: never import this from content.ts, which app/error.tsx (a client component)
// pulls into the browser bundle. The paths ship once, as the static sprite app/skill-icons.svg/route.ts emits;
// pages reference it with <use>, so the markup is not repeated in every page's HTML and RSC payload.
type SkillIcon = { body: string; viewBox: string; color?: string };
// Brand color, unless it is near-black or near-white (Next.js, Rust...): those follow the theme via currentColor.
const brand = (hex: string) => {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance < 0.03 || luminance > 0.75 ? undefined : `#${hex}`;
};
const si = (i: SimpleIcon, hex = i.hex): SkillIcon => ({ body: `<path d="${i.path}"/>`, viewBox: "0 0 24 24", color: brand(hex) });
const dev = (name: string, hex: string): SkillIcon => {
  const icon = devicon.icons[name];
  if (!icon) throw new Error(`devicon-plain has no "${name}" icon`);
  const viewBox = `0 0 ${icon.width ?? devicon.width ?? 128} ${icon.height ?? devicon.height ?? 128}`;
  return { body: icon.body, viewBox, color: brand(hex) };
};

export const skillIcons: Record<string, SkillIcon> = {
  "C#": dev("csharp", "9B4F96"), ".NET 6–10": si(siDotnet), "EF Core": dev("entityframeworkcore", "512BD4"), Laravel: si(siLaravel), Python: si(siPython), FastAPI: si(siFastapi), "Rust / Axum": si(siRust),
  TypeScript: si(siTypescript), React: si(siReact), "Next.js": si(siNextdotjs), "TanStack Query": si(siTanstack), "Tailwind CSS": si(siTailwindcss), Inertia: si(siInertia),
  PostgreSQL: si(siPostgresql), "SQL Server": dev("microsoftsqlserver", "CC2927"), Redis: si(siRedis), RabbitMQ: si(siRabbitmq), Docker: si(siDocker), AWS: dev("amazonwebservices", "FF9900"), GCP: si(siGooglecloud), BigQuery: si(siGooglebigquery),
  Stryker: si(siStryker), Playwright: dev("playwright", "2EAD33"), OpenTelemetry: si(siOpentelemetry, "F5A800"),
};

export const spritePath = "/skill-icons.svg";
export const skillIconId = (name: string) => name.toLowerCase().replace(/#/g, "sharp").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const skillSprite = () =>
  `<svg xmlns="http://www.w3.org/2000/svg">${Object.entries(skillIcons)
    .map(([name, icon]) => `<symbol id="${skillIconId(name)}" viewBox="${icon.viewBox}">${icon.body}</symbol>`)
    .join("")}</svg>`;
