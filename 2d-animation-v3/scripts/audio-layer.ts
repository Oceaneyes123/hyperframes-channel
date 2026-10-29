import { readFileSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { readConfig } from "../server/config.ts";
import { openProduction } from "../server/production-store.ts";
import { mixAudioLayer } from "../server/audio-layer.ts";

const [projectId,narrationId,file]=process.argv.slice(2);
if(!projectId||!narrationId||!file)throw new Error("Usage: node --env-file-if-exists=.env scripts/audio-layer.ts <projectId> <narrationId> <settings.json>");
const config=readConfig(),store=openProduction(config.dataDirectory,config.videosDirectory);
try {
  const source=store.audio(projectId,narrationId),settings=JSON.parse(readFileSync(file,"utf8"));
  const result=await mixAudioLayer(source.bytes,settings,join(config.dataDirectory,`audio-mix-${randomUUID()}`));
  if(!result.report.enabled)console.log(JSON.stringify({enabled:false,narrationId,preserved:true}));
  else console.log(JSON.stringify({narrationId:store.importSoundtrack(projectId,narrationId,result.bytes,result.report),report:result.report,productionApproval:false}));
}finally{store.close();}
