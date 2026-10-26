import { writeFileSync } from "node:fs";
import { creativeRulesMarkdown } from "../workflow/creative-rules.ts";

writeFileSync("docs/AI-CREATIVE-MISTAKES.md", creativeRulesMarkdown());
