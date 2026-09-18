// Applies i18n/fr onto the English sources in src/ and compiles them into packs/.
// Documents exist twice (their pack + embedded in the adventure), so translations are applied by _id to both.
// Close the world (or disable the module) in Foundry first: it keeps the LevelDB packs locked.
import { compilePack } from "@foundryvtt/foundryvtt-cli";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ADVENTURE_KEY, FIELDS, ITEM_FIELDS, collectPairs, getPath, merge, setPath } from "./i18n-docs.mjs";

const root = path.resolve(import.meta.dirname, "..");
const readJson = (f) => JSON.parse(fs.readFileSync(f, "utf8"));
const readDir = (d) => (fs.existsSync(d) ? fs.readdirSync(d).map((f) => readJson(path.join(d, f))) : []);

const docFr = new Map(Object.keys(FIELDS).map((pack) =>
  [pack, new Map(readDir(path.join(root, "i18n", "fr", pack)).map((p) => [p._id, p]))]));

// Items embedded in actors are copies of compendium items with other _ids: translate them by their English text.
const itemDict = new Map();
for (const item of readDir(path.join(root, "src", "items"))) {
  const patch = docFr.get("items").get(item._id);
  if (patch) collectPairs(item, patch, itemDict);
}

const counts = Object.fromEntries(Object.keys(FIELDS).map((p) => [p, new Set()]));
function translateDoc(pack, doc) {
  if (pack === "actors") {
    for (const item of doc.items ?? []) for (const p of ITEM_FIELDS) {
      const fr = itemDict.get(getPath(item, p));
      if (fr !== undefined) setPath(item, p, fr);
    }
  }
  const patch = docFr.get(pack).get(doc._id);
  if (!patch) return;
  merge(doc, patch);
  counts[pack].add(doc._id);
}

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
    if (FIELDS[name] && !doc._key?.startsWith("!folders")) translateDoc(name, doc);
    if (name === "adventure") {
      for (const j of doc.journal ?? []) translateJournal(j);
      for (const [pack, key] of Object.entries(ADVENTURE_KEY)) for (const d of doc[key] ?? []) translateDoc(pack, d);
    }
    fs.writeFileSync(path.join(tmp, f), JSON.stringify(doc));
  }
  await compilePack(tmp, path.join(root, "packs", name), { recursive: false, log: false });
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`packs/${name} compiled`);
}
console.log(`${total} journal pages translated`);
for (const [pack, ids] of Object.entries(counts)) console.log(`${ids.size} ${pack} translated`);
