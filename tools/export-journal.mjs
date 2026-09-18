// Creates the i18n skeleton of one journal from src/ (English), without overwriting existing files.
// Usage: npm run export:journal -- "<journal name>" <folder-slug>
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const [journalName, slug] = process.argv.slice(2);
if (!journalName || !slug) throw new Error('Usage: export:journal -- "<journal name>" <folder-slug>');

const dir = path.join(root, "src", "journals");
const journal = fs.readdirSync(dir)
  .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")))
  .find((d) => d.name === journalName && d.pages);
if (!journal) throw new Error(`Journal not found in src/journals: ${journalName}`);

// One block element per line, so translations diff and review line by line.
const pretty = (html) => html.replace(/(<\/(p|h[1-6]|li|ul|ol|table|tr|blockquote|div)>|<hr\s*\/?>)/g, "$1\n").trim() + "\n";

const out = path.join(root, "i18n", "fr", "journal", slug);
fs.mkdirSync(out, { recursive: true });
const pages = [...journal.pages].sort((a, b) => a.sort - b.sort).map((p, i) => {
  const file = p.type === "text" ? `${String(i + 1).padStart(2, "0")}-${p._id}.html` : undefined;
  if (file && !fs.existsSync(path.join(out, file))) fs.writeFileSync(path.join(out, file), pretty(p.text?.content ?? ""));
  return { _id: p._id, name: p.name, ...(file && { file }) };
});
const metaPath = path.join(out, "meta.json");
if (!fs.existsSync(metaPath)) fs.writeFileSync(metaPath, JSON.stringify({ _id: journal._id, name: journal.name, pages }, null, 2) + "\n");
console.log(`${journal.name}: ${pages.length} pages -> i18n/fr/journal/${slug}`);
