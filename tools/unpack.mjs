// Extracts packs/ (LevelDB) into src/ (one JSON file per document): the English source of truth.
import { extractPack } from "@foundryvtt/foundryvtt-cli";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const packs = JSON.parse(fs.readFileSync(path.join(root, "module.json"), "utf8")).packs;

for (const { name } of packs) {
  // Work on a copy without LOCK so this also runs while Foundry has the pack open.
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `add-${name}-`));
  fs.cpSync(path.join(root, "packs", name), tmp, { recursive: true });
  fs.rmSync(path.join(tmp, "LOCK"), { force: true });
  const dest = path.join(root, "src", name);
  await extractPack(tmp, dest, { clean: true, log: false });
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`${name}: ${fs.readdirSync(dest).length} files`);
}
