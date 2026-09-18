// Creates the i18n skeletons of one pack (actors, items, rolltables or maps) from src/ (English), without overwriting existing files.
// Usage: npm run export:docs -- <pack>
import fs from "node:fs";
import path from "node:path";
import { ADVENTURE_KEY, FIELDS, ITEM_FIELDS, extract, getPath } from "./i18n-docs.mjs";

const root = path.resolve(import.meta.dirname, "..");
const [pack] = process.argv.slice(2);
if (!FIELDS[pack]) throw new Error(`Usage: export:docs -- <${Object.keys(FIELDS).join("|")}>`);

const read = (name) => fs.readdirSync(path.join(root, "src", name))
  .map((f) => ({ f, doc: JSON.parse(fs.readFileSync(path.join(root, "src", name, f), "utf8")) }))
  .filter(({ doc }) => !doc._key?.startsWith("!folders"));

// Embedded items identical to a compendium item are translated from it at build time.
const itemTexts = new Set(read("items").flatMap(({ doc }) => ITEM_FIELDS.map((p) => `${p}=${getPath(doc, p)}`)));
const isCopy = (item) => ITEM_FIELDS.every((p) => getPath(item, p) === undefined || itemTexts.has(`${p}=${getPath(item, p)}`));

// The alienrpg system finds creature attack and critical injury tables by name.
const tableRefs = new Set(read("actors").flatMap(({ doc }) => [doc.system?.rTables, doc.system?.cTables]));

// Documents that only exist inside the adventure get their own skeleton, prefixed "adventure_".
const packDocs = read(pack);
const packIds = new Set(packDocs.map(({ doc }) => doc._id));
const adventureOnly = read("adventure").flatMap(({ doc }) => doc[ADVENTURE_KEY[pack]] ?? [])
  .filter((d) => !packIds.has(d._id))
  .map((doc) => ({ f: `adventure_${doc.name.replace(/\W+/g, "_")}_${doc._id}.json`, doc }));

const out = path.join(root, "i18n", "fr", pack);
fs.mkdirSync(out, { recursive: true });
let written = 0;
for (const { f, doc } of [...packDocs, ...adventureOnly]) {
  const patch = { _id: doc._id, ...extract(doc, FIELDS[pack]) };
  if (pack === "actors") {
    const items = (doc.items ?? []).filter((i) => !isCopy(i)).map((i) => ({ _id: i._id, ...extract(i, ITEM_FIELDS) }));
    if (items.length) patch.items = items;
  }
  if (pack === "rolltables") {
    if (tableRefs.has(doc.name)) delete patch.name;
    patch.results = patch.results?.filter((r) => {
      if (doc.results.find((s) => s._id === r._id).documentUuid) delete r.name;
      return Object.keys(r).length > 1;
    });
    if (!patch.results?.length) delete patch.results;
  }
  const file = path.join(out, f);
  if (Object.keys(patch).length < 2 || fs.existsSync(file)) continue;
  fs.writeFileSync(file, JSON.stringify(patch, null, 2) + "\n");
  written++;
}
console.log(`${pack}: ${written} new skeletons -> i18n/fr/${pack}`);
