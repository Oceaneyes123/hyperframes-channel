import { z } from "zod";

export const trustedSceneIds = ["message-transform@1", "parallax-workspace@1", "counted-documents@1", "signal-burst@1", "elastic-token@1", "loop-handoff@1"] as const;
export const trustedSceneIdSchema = z.enum(trustedSceneIds);
export const isTrustedScene = (id?: string): id is typeof trustedSceneIds[number] => trustedSceneIdSchema.safeParse(id).success;
const clamp = (x: number) => Math.max(0, Math.min(1, x));
export const settle = (x: number) => { const t = clamp(x); return 1 - (1 - t) ** 3; };
/** Closed-form poses: no mutable simulation or clock; local scene units are 1000 × 1000. */
export function scenePose(id: typeof trustedSceneIds[number], progress: number) {
  trustedSceneIdSchema.parse(id);
  if (!Number.isFinite(progress)) throw new Error("Scene progress must be finite.");
  const p = clamp(progress), t = settle(p);
  const anticipation = p < .18 ? -Math.sin(p / .18 * Math.PI) * .12 : 0;
  return { p, t, x: id === "loop-handoff@1" ? 500 + Math.sin(p * Math.PI * 2) * 270 : 500,
    y: id === "elastic-token@1" ? 510 - Math.sin(Math.max(0, p - .18) / .82 * Math.PI) * 240 : 500,
    scaleX: 1 + anticipation + Math.sin(p * Math.PI * 2) * (1 - p) * .18,
    scaleY: 1 - anticipation - Math.sin(p * Math.PI * 2) * (1 - p) * .12,
    cameraScale: 1 + Math.sin(p * Math.PI) * .22, cameraX: Math.sin(p * Math.PI) * 35,
    count: Math.min(3, Math.floor(p * 3 + .000001)),
  };
}
