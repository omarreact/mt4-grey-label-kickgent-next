import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const source = resolve(root, "wordpress/kickgent-fse");
const output = resolve(root, "dist/kickgent-fse");
if (!existsSync(source)) throw new Error("WordPress theme source is missing.");
rmSync(output, { recursive: true, force: true });
mkdirSync(resolve(root, "dist"), { recursive: true });
cpSync(source, output, { recursive: true });
writeFileSync(resolve(output, "BUILD.txt"), "Generated from the Kickgent Next.js source. Install this folder as a block theme.\n");
console.log(`Generated WordPress theme at ${output}`);
