// The App Router has one root layout, so every page ships <html lang="en">.
// After export, mark the Indonesian pages as lang="id" for crawlers and screen readers.
// ponytail: string replace on built HTML; switch to per-language root layouts if this ever needs more than lang.
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const dir = join("out", "id");
let count = 0;
for (const file of await readdir(dir, { recursive: true })) {
  if (!file.endsWith(".html")) continue;
  const path = join(dir, file);
  const html = await readFile(path, "utf8");
  const next = html.replace('<html lang="en"', '<html lang="id"');
  if (next !== html) {
    await writeFile(path, next);
    count++;
  }
}
if (count === 0) throw new Error("set-lang: no Indonesian pages updated, check the out/id layout");
console.log(`set-lang: ${count} Indonesian pages marked lang="id"`);
