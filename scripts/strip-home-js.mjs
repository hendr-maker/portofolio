// The home pages are plain server markup: links are <a>, and the carousel and language scripts are inline. Next still
// ships its runtime (~160 KB of JS) and the RSC payload (more than half of the HTML) to hydrate them, which only costs
// lab LCP/TBT. Strip both from the exported home pages; project pages keep JS for their tabs.
// ponytail: regex on built HTML, guarded below; if a Next upgrade changes the markup the build fails instead of
// shipping a half-stripped page. `pnpm dev` still hydrates home, hence suppressHydrationWarning on script-owned nodes.
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const pages = [join("out", "index.html"), join("out", "id", "index.html")];
const strip = [
  /<link\b[^>]*\bas="script"[^>]*>/g, // runtime preloads
  /<script\b[^>]*\bsrc="[^"]*\/_next\/[^"]*"[^>]*><\/script>/g, // runtime chunks
  /<script\b[^>]*>\(globalThis\["TURBOPACK"\][\s\S]*?<\/script>/g, // chunk bootstrap
  /<script>\(?self\.__next_f[\s\S]*?<\/script>/g, // RSC payload
];

for (const path of pages) {
  const html = await readFile(path, "utf8");
  let next = html;
  for (const re of strip) next = next.replace(re, "");
  if (/\/_next\/static\/chunks\/[^"]*\.js|__next_f|TURBOPACK/.test(next)) throw new Error(`strip-home-js: Next runtime left in ${path}`);
  if (!next.includes("scroll-marker") || !next.includes("application/ld+json")) throw new Error(`strip-home-js: inline scripts lost in ${path}`);
  await writeFile(path, next);
  console.log(`strip-home-js: ${path} ${Math.round(html.length / 1024)} KB -> ${Math.round(next.length / 1024)} KB`);
}
