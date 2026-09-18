// Translatable fields of the non-journal packs, shared by export-docs.mjs (skeletons) and build.mjs (application).
// A translation file is a sparse copy of a document: only these fields, arrays of sub-documents matched by _id.

export const ITEM_FIELDS = ["name", "system.attributes.comment.value", "system.general.comment.value", "system.notes.notes"];

export const FIELDS = {
  actors: ["name", "prototypeToken.name", "system.notes", "system.adhocitems", "system.attributes.comment.value",
    ...["appearance", "sigItem", "agenda", "relOne", "relTwo", "special"].map((k) => `system.general.${k}.value`)],
  items: ITEM_FIELDS,
  rolltables: ["name", "description", "results[].description", "results[].name"],
  // Region and behavior names stay: teleports and module automations (Monk's Active Tiles, Tagger) are technical.
  maps: ["name", "levels[].name", "drawings[].text", "notes[].text", "tokens[].name",
    "regions[].behaviors[].system.confirmPrompt", "regions[].behaviors[].system.confirmPromptGM"],
};

// Where each pack's documents are embedded in the adventure document.
export const ADVENTURE_KEY = { actors: "actors", items: "items", rolltables: "tables", maps: "scenes" };

const isText = (v) => typeof v === "string" && /\p{L}{2}/u.test(v);

export function extract(doc, paths) {
  const out = {};
  for (const p of paths) pick(doc, out, p.split("."));
  return out;
}

function pick(src, dst, [key, ...rest]) {
  if (key.endsWith("[]")) {
    const k = key.slice(0, -2);
    for (const el of src?.[k] ?? []) {
      const sub = {};
      pick(el, sub, rest);
      if (!Object.keys(sub).length) continue;
      const arr = (dst[k] ??= []);
      const found = arr.find((e) => e._id === el._id);
      if (found) merge(found, sub);
      else arr.push({ _id: el._id, ...sub });
    }
    return;
  }
  if (!rest.length) {
    if (isText(src?.[key])) dst[key] = src[key];
    return;
  }
  const sub = {};
  pick(src?.[key], sub, rest);
  if (Object.keys(sub).length) merge((dst[key] ??= {}), sub);
}

export function merge(target, patch) {
  for (const [k, v] of Object.entries(patch)) {
    if (Array.isArray(v)) {
      for (const el of v) {
        const t = target[k]?.find((e) => e._id === el._id);
        if (t) merge(t, el);
      }
    } else if (v && typeof v === "object") merge((target[k] ??= {}), v);
    else if (k !== "_id") target[k] = v;
  }
}

export const getPath = (o, p) => p.split(".").reduce((a, k) => a?.[k], o);

export function setPath(o, p, v) {
  const keys = p.split(".");
  const last = keys.pop();
  keys.reduce((a, k) => (a[k] ??= {}), o)[last] = v;
}

// Pairs every source string with the translation found at the same place in the patch.
export function collectPairs(source, patch, dict) {
  for (const [k, v] of Object.entries(patch)) {
    if (k === "_id") continue;
    if (Array.isArray(v)) for (const el of v) collectPairs(source?.[k]?.find((e) => e._id === el._id), el, dict);
    else if (v && typeof v === "object") collectPairs(source?.[k], v, dict);
    else if (typeof source?.[k] === "string" && source[k] !== v) dict.set(source[k], v);
  }
}
