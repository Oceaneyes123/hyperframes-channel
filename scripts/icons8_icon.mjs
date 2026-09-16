import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const value = (flag) => args.includes(flag) ? args[args.indexOf(flag) + 1] : undefined;
const name = value("--name");
const url = value("--url");
const project = resolve(value("--project") ?? ".");
const attribution = value("--attribution");

if (!name || !url || !attribution) throw new Error("Usage: npm run icons8-icon -- --name <name> --url <Icons8 SVG URL> --attribution <Icons8 page URL> --project videos/<project>");
if (!/^https:\/\/(?:[^/]+\.)?icons8\.com\//.test(url) || !/^https:\/\/(?:[^/]+\.)?icons8\.com\//.test(attribution)) throw new Error("Icons8 URLs must use https://*.icons8.com/");

const response = await fetch(url);
if (!response.ok) throw new Error(`Icons8 download failed: ${response.status} ${response.statusText}`);
const svg = await response.text();
if (!svg.includes("<svg")) throw new Error("Icons8 response is not SVG");

const out = resolve(project, "public/icons8");
await mkdir(out, { recursive: true });
await writeFile(resolve(out, `${name}.svg`), svg);
await writeFile(resolve(out, `${name}.source.txt`), `${attribution}\n`);
console.log(`Downloaded Icons8 SVG: ${resolve(out, `${name}.svg`)}`);
