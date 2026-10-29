import { z } from "zod";

export const audioLayerSchema = z.strictObject({
  enabled: z.boolean().default(false), music: z.boolean().default(false),
  seed: z.number().int().min(0).max(2147483647).default(17),
  targetLufs: z.number().min(-24).max(-12).default(-16),
  cues: z.array(z.strictObject({ frame: z.number().int().min(0).max(5399), sound: z.enum(["click", "pop", "whoosh", "impact", "chime"]) })).max(300).default([]),
});
export type AudioLayer = z.infer<typeof audioLayerSchema>;

export function synthesizeLayer(durationSeconds: number, input: unknown, layer: "music" | "sfx") {
  const settings = audioLayerSchema.parse(input), rate = 48000;
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0 || durationSeconds > 180) throw new Error("Audio layer duration must be 0..180 seconds.");
  const count = Math.round(durationSeconds * rate), samples = new Float64Array(count);
  if (settings.cues.some(cue => cue.frame / 30 >= durationSeconds)) throw new Error("Sound cue lies outside narration.");
  let seed = settings.seed;
  const noise = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296 * 2 - 1; };
  if (settings.enabled && layer === "music" && settings.music) for (let i=0;i<count;i++) {
    const t=i/rate, chord=Math.floor(t/3)%3, notes=[[110,130.8128,164.8138],[87.3071,110,130.8128],[97.9989,123.4708,146.8324]][chord];
    const envelope=Math.min(1,t/.4,(durationSeconds-t)/.6)*( .7+.3*Math.sin(t*Math.PI)**2 );
    samples[i]=notes.reduce((sum,f)=>sum+Math.sin(2*Math.PI*f*t),0)*.012*envelope;
  }
  if (settings.enabled && layer === "sfx") for (const cue of settings.cues) {
    const length=cue.sound==="chime"?.55:cue.sound==="whoosh"?.32:cue.sound==="impact"?.24:.12;
    // Center the envelope peak on the requested visual hit, not on sample zero.
    const peak=cue.sound==="whoosh"?.16:.008, start=Math.round((cue.frame/30-peak)*rate);
    for(let i=0;i<length*rate;i++) {
      const t=i/rate, at=start+i; if(at<0||at>=count) continue;
      const envelope=cue.sound==="whoosh"?Math.sin(Math.PI*t/length)**2:Math.min(1,t/.008)*Math.exp(-t/(length/5));
      const tone=cue.sound==="whoosh"?noise()*.6:cue.sound==="impact"?Math.sin(2*Math.PI*90*t)+noise()*.25:cue.sound==="chime"?(Math.sin(2*Math.PI*523.251*t)+Math.sin(2*Math.PI*659.255*t))*.5:Math.sin(2*Math.PI*(cue.sound==="click"?1800:650)*t);
      samples[at]+=tone*envelope*.11;
    }
  }
  const wav=Buffer.alloc(44+count*2); wav.write("RIFF");wav.writeUInt32LE(wav.length-8,4);wav.write("WAVEfmt ",8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(rate,24);wav.writeUInt32LE(rate*2,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write("data",36);wav.writeUInt32LE(count*2,40);
  for(let i=0;i<count;i++)wav.writeInt16LE(Math.round(Math.max(-1,Math.min(1,samples[i]))*32767),44+i*2);
  return wav;
}
