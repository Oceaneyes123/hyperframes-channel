import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import * as brands from "@fortawesome/free-brands-svg-icons";
import * as regular from "@fortawesome/free-regular-svg-icons";
import * as solid from "@fortawesome/free-solid-svg-icons";

const args = process.argv.slice(2);
const value = (flag, fallback) => args.includes(flag) ? args[args.indexOf(flag) + 1] : fallback;
const name = value("--name");
const project = resolve(value("--project", "."));
const out = resolve(project, value("--out", "public/icons"));
const force = args.includes("--force");

if (!name) throw new Error("Usage: npm run fontawesome-icon -- --name <icon-name> --project videos/<project>");
const target = resolve(out, `${name}.svg`);
if (existsSync(target) && !force) {
  console.log(`Using local icon: ${target}`);
  process.exit(0);
}

const definition = Object.values({ ...solid, ...regular, ...brands }).find((item) => item?.iconName === name);
if (!definition) throw new Error(`Font Awesome Free does not include "${name}".`);
const [width, height, , , pathData] = definition.icon;
const paths = (Array.isArray(pathData) ? pathData : [pathData]).map((path) => `<path d="${path}"/>`).join("");
await mkdir(out, { recursive: true });
await writeFile(target, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" aria-hidden="true">${paths}</svg>\n`);
console.log(`Exported Font Awesome icon: ${target}`);
