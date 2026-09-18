// Applies i18n/fr onto the English sources in src/ and compiles them into packs/.
// Journals exist twice (journals pack + embedded in the adventure), so translations are applied by _id to both.
// Close the world (or disable the module) in Foundry first: it keeps the LevelDB packs locked.
import { compilePack } from "@foundryvtt/foundryvtt-cli";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const readJson = (f) => JSON.parse(fs.readFileSync(f, "utf8"));

const journalFr = new Map();
const journalDir = path.join(root, "i18n", "fr", "journal");
for (const slug of fs.existsSync(journalDir) ? fs.readdirSync(journalDir) : []) {
  const meta = readJson(path.join(journalDir, slug, "meta.json"));
  const pages = new Map(meta.pages.map((p) => [p._id, {
    name: p.name,
    content: p.file && fs.readFileSync(path.join(journalDir, slug, p.file), "utf8").trim(),
  }]));
  journalFr.set(meta._id, { name: meta.name, pages });
}

function translateJournal(journal) {
  const fr = journalFr.get(journal._id);
  if (!fr) return 0;
  journal.name = fr.name;
  let n = 0;
  for (const page of journal.pages) {
    const p = fr.pages.get(page._id);
    if (!p) continue;
    page.name = p.name;
    if (p.content !== undefined) { page.text.content = p.content; n++; }
  }
  return n;
}

const packs = readJson(path.join(root, "module.json")).packs;
let total = 0;
for (const { name } of packs) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `add-src-${name}-`));
  for (const f of fs.readdirSync(path.join(root, "src", name))) {
    const doc = readJson(path.join(root, "src", name, f));
    if (name === "journals" && doc.pages) total += translateJournal(doc);
    if (name === "adventure") for (const j of doc.journal ?? []) translateJournal(j);
    fs.writeFileSync(path.join(tmp, f), JSON.stringify(doc));
  }
  await compilePack(tmp, path.join(root, "packs", name), { recursive: false, log: false });
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`packs/${name} compiled`);
}
console.log(`${total} journal pages translated`);
