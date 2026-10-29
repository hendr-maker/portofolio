// CI gate: fail if a confidential term appears in any text file of the artifact that ships (out/).
// Same blocklist parsing and built-in terms as e2e/site.spec.ts, but over raw files, not rendered text.
// Fails closed: a missing/empty blocklist or an invalid pattern is an error, never a silent pass.
// Prints file names only, so a hit never echoes a term into the log.
import { readdir, readFile } from "node:fs/promises";

const lines = (await readFile("e2e/forbidden.local.txt", "utf8")).split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));
if (lines.length === 0) throw new Error("scan-out: blocklist is empty (is the FORBIDDEN_TERMS secret set?)");
const forbidden = new RegExp(["@gmail\\.com", "\\+62", ...lines].join("|"), "i");

const binary = /\.(png|jpe?g|gif|webp|ico|woff2?|ttf|otf)$/i;
const hits = [];
let scanned = 0;
for (const entry of await readdir("out", { recursive: true, withFileTypes: true })) {
  if (!entry.isFile() || binary.test(entry.name)) continue;
  scanned++;
  if (forbidden.test(await readFile(`${entry.parentPath}/${entry.name}`, "utf8"))) hits.push(`${entry.parentPath}/${entry.name}`);
}
if (scanned === 0) throw new Error("scan-out: no files scanned, check the out/ layout");
if (hits.length) {
  console.error(`scan-out: confidential term found in ${hits.length} file(s):\n${hits.join("\n")}`);
  process.exit(1);
}
console.log(`scan-out: ${scanned} files clean`);
