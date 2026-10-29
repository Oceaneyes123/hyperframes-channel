import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { parseVectorAsset } from "../workflow/vector-assets.ts";
import { trustedSceneIds } from "../workflow/trusted-scenes.ts";

// Original geometric symbols, authored here; no third-party artwork or fetched SVG.
const paths: Record<string, string> = {
  "send-button": "M90 150H210V210H90ZM115 180H185M165 165L185 180L165 195",
  cursor: "M90 65L220 165L160 180L140 235Z", shield: "M150 40L235 80V160Q235 220 150 260Q65 220 65 160V80Z",
  lock: "M90 130V95A60 60 0 0 1 210 95V130M70 130H230V250H70ZM150 170V210",
  key: "M130 120A50 50 0 1 1 80 70A50 50 0 0 1 130 120L245 235M205 195L185 215M225 215L205 235",
  clock: "M150 40A110 110 0 1 1 149 40ZM150 75V150L210 185",
  checklist: "M70 40H230V260H70ZM100 95L110 105L130 80M150 95H200M100 160L110 170L130 145M150 160H200M100 225H200",
  filter: "M40 60H260L180 155V240L120 260V155Z", search: "M130 45A85 85 0 1 1 129 45ZM190 195L265 270",
  spark: "M150 35L175 120L260 150L175 180L150 265L125 180L40 150L125 120Z",
  folder: "M35 80H125L150 105H265V245H35Z", envelope: "M35 70H265V230H35ZM35 70L150 165L265 70",
  terminal: "M35 55H265V245H35ZM70 105L110 145L70 185M140 185H220", link: "M130 90L160 60Q210 20 250 60Q290 100 245 145L205 185M170 210L140 240Q90 280 50 240Q10 200 55 155L95 115M100 200L200 100",
  tray: "M60 80H240L275 220H190L175 245H125L110 220H25ZM80 80V165H220V80",
  check: "M55 155L120 220L250 80", warning: "M150 35L275 260H25ZM150 105V185M150 215V230",
  "split-route": "M150 255V160L70 85M150 160L230 85M70 130V85H115M185 85H230V130",
  "price-tag": "M50 65H170L265 160L160 265L50 155ZM90 100A10 10 0 1 1 89 100Z",
  "human-review": "M150 35A50 50 0 1 1 149 35ZM60 250V210Q150 125 240 210V250M110 215L145 245L210 175",
};
const entries = [...Object.entries(paths), ...trustedSceneIds.map(id => [id.split("@")[0], paths.envelope])];
const out = "public/media/motion-kit"; mkdirSync(out, { recursive: true });
const pack = entries.map(([name, d]) => {
  const id = name.includes("-") && trustedSceneIds.some(scene => scene === `${name}@1`) ? `${name}@1` : `${name}-motion@1`;
  const asset = parseVectorAsset({ schemaVersion: 1, id, source: "Original HyperFrames motion-kit symbols and authored scene source", license: "CC0-1.0", attribution: "Original artwork authored for HyperFrames V3; dedicated to CC0.", width: 300, height: 300, purpose: `Reusable ${name.replaceAll("-", " ")} teaching object.`, tags: ["motion-kit", name], compositions: ["illustrated-workflow", "visual-metaphor"], layers: [{ id: trustedSceneIds.some(scene => scene === id) ? "motion" : "subject", role: "subject", nodes: [{ kind: "path", d, fill: "none", stroke: "ink", strokeWidth: 8, opacity: 1 }] }] });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><path d="${d}" fill="none" stroke="#203B3A" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>\n`;
  writeFileSync(`${out}/${id.replace("@", "-")}.svg`, svg);
  return { contentHash: createHash("sha256").update(JSON.stringify(asset)).digest("hex"), asset };
});
writeFileSync("workflow/motion-kit.json", JSON.stringify(pack, null, 2) + "\n");
writeFileSync(`${out}/LICENSE.md`, "# Original motion kit\n\nAll SVGs in this directory are original project artwork, dedicated to CC0-1.0. Provenance and geometry: scripts/build-motion-assets.ts. The six scene-named SVGs are registry icons; animated artwork is authored in engine/components/trusted-scene.tsx. No third-party media is included.\n");
console.log(`Wrote ${pack.length} original registered assets and local SVGs.`);
