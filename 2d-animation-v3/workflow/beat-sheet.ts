import { z } from "zod";

const note = z.string().trim().min(1).max(120);
export const beatSheetSchema = z.strictObject({
  timing: z.literal("estimated"),
  lines: z.array(z.strictObject({
    lineNumber: z.number().int().min(1).max(200),
    beats: z.array(z.strictObject({
      startFrame: z.number().int().min(0).max(5400), endFrame: z.number().int().min(1).max(5400),
      event: z.enum(["enter", "exit", "transform", "counter", "camera", "background", "hold"]),
      motionVerb: note, soundCue: z.enum(["none", "click", "pop", "whoosh", "impact", "chime"]),
      onScreenText: z.string().trim().min(1).max(60).nullable(),
    })).min(1).max(90),
  })).min(1).max(200),
}).superRefine((sheet, context) => {
  if (new Set(sheet.lines.map((line) => line.lineNumber)).size !== sheet.lines.length) context.addIssue({ code: "custom", message: "Beat-sheet line numbers must be unique." });
  for (const line of sheet.lines) for (const [index, beat] of line.beats.entries()) {
    if (beat.startFrame !== (line.beats[index - 1]?.endFrame ?? 0) || beat.endFrame - beat.startFrame < 30 || beat.endFrame - beat.startFrame > 60) context.addIssue({ code: "custom", message: "Each line needs contiguous estimated 1–2-second beats starting at frame zero (30fps)." });
  }
});

export const beatSheetGuidance = `Plan a beatSheet:{timing:"estimated",lines:[{lineNumber,beats:[{startFrame,endFrame,event,motionVerb,soundCue,onScreenText}]}]}. Cover each supplied narration line once, in order. Each line starts at frame 0 with contiguous 30..60-frame beats at 30fps. event is enter|exit|transform|counter|camera|background|hold; motionVerb names a concrete action; soundCue is none|click|pop|whoosh|impact|chime; onScreenText is null unless a short label teaches. Make one focal object cause a result or hand off into the next state. Use hold when comprehension needs it; do not invent activity. These timings are planning estimates, never word alignment or permission to speed narration. Sound cues are optional plans, not generated assets. Keep the beat sheet outside spoken text and the contiguous ## Line N / four-space-indented narration contract. Never insert beat instructions into TTS input or add audience-facing Illustrative, Demo or Test illustration labels. Use only registered motion capabilities; new custom effects require trusted authored components.`;
