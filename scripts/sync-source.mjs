import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const source = resolve(root, "..", "kickgent");
const destination = resolve(root, "public", "source");

if (!existsSync(source)) throw new Error("Expected the source Kickgent directory beside kickgent-next.");
rmSync(destination, { recursive: true, force: true });
mkdirSync(resolve(root, "public"), { recursive: true });
cpSync(source, destination, { recursive: true, filter: (path) => !path.endsWith("CLAUDE.md") && !path.endsWith("DESIGN.md") && !path.endsWith("design-audit.xml") });
console.log("Synced the approved Kickgent source into public/source.");
