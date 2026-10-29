import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { audioLayerSchema, synthesizeLayer } from "../workflow/audio-layer.ts";
import { inspectWav } from "./wav.ts";

const run=promisify(execFile), hash=(bytes:Buffer)=>createHash("sha256").update(bytes).digest("hex");
export async function mixAudioLayer(narration: Buffer, input: unknown, output: string) {
  const settings=audioLayerSchema.parse(input), measured=inspectWav(narration);
  if(!settings.enabled) return {bytes:narration,report:{enabled:false as const,sourceAudioHash:hash(narration),audioHash:hash(narration),durationFrames:measured.durationFrames,settings}};
  mkdirSync(output,{recursive:false});
  const voice=join(output,"narration.wav"),bed=join(output,"music.wav"),effects=join(output,"sfx.wav"),raw=join(output,"raw.wav"),final=join(output,"mix.wav");
  writeFileSync(voice,narration,{flag:"wx"});
  writeFileSync(bed,synthesizeLayer(measured.durationSeconds,settings,"music"),{flag:"wx"});
  writeFileSync(effects,synthesizeLayer(measured.durationSeconds,settings,"sfx"),{flag:"wx"});
  const ffmpeg=process.env.V3_FFMPEG_PATH??"ffmpeg";
  await run(ffmpeg,["-v","error","-i",voice,"-i",bed,"-i",effects,"-filter_complex",`[0:a]asplit=2[voice][key];[1:a][key]sidechaincompress=threshold=0.025:ratio=6:attack=15:release=220[bed];[voice][bed][2:a]amix=inputs=3:normalize=0,atrim=duration=${measured.durationSeconds}[mix]`,"-map","[mix]","-ar",String(measured.sampleRate),"-ac","1","-c:a","pcm_s16le",raw]);
  const analyze=await run(ffmpeg,["-hide_banner","-i",raw,"-af",`loudnorm=I=${settings.targetLufs}:TP=-1.5:LRA=9:print_format=json`,"-f","null","-"],{maxBuffer:1_000_000});
  const first=JSON.parse(analyze.stderr.slice(analyze.stderr.lastIndexOf("{"),analyze.stderr.lastIndexOf("}")+1));
  if(!Number.isFinite(Number(first.input_i)))throw new Error("Cannot normalize a silent audio mix.");
  const filter=`loudnorm=I=${settings.targetLufs}:TP=-1.5:LRA=9:measured_I=${first.input_i}:measured_TP=${first.input_tp}:measured_LRA=${first.input_lra}:measured_thresh=${first.input_thresh}:offset=${first.target_offset}:linear=true`;
  await run(ffmpeg,["-v","error","-i",raw,"-af",filter,"-ar",String(measured.sampleRate),"-ac","1","-c:a","pcm_s16le",final]);
  const bytes=readFileSync(final),mixed=inspectWav(bytes);
  if(mixed.durationFrames!==measured.durationFrames)throw new Error("Audio mix changed narration duration.");
  const last=await run(ffmpeg,["-hide_banner","-i",final,"-af",`loudnorm=I=${settings.targetLufs}:TP=-1.5:print_format=json`,"-f","null","-"],{maxBuffer:1_000_000});
  const levels=JSON.parse(last.stderr.slice(last.stderr.lastIndexOf("{"),last.stderr.lastIndexOf("}")+1));
  if(Math.abs(Number(levels.input_i)-settings.targetLufs)>1||Number(levels.input_tp)>-1)throw new Error("Mixed audio missed the documented loudness/peak target.");
  const report={enabled:true as const,sourceAudioHash:hash(narration),audioHash:hash(bytes),durationFrames:mixed.durationFrames,settings,integratedLufs:Number(levels.input_i),truePeakDbtp:Number(levels.input_tp),license:"CC0-1.0",provenance:"Original locally synthesized tones/noise; no external media",pronunciationApproved:false};
  writeFileSync(join(output,"report.json"),JSON.stringify(report,null,2),{flag:"wx"});
  return {bytes,report};
}
