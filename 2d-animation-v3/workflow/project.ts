import { z } from "zod";

export const projectTitleSchema = z.string().trim().min(1, "Enter a project title.").max(200);

// Production contracts remain independent of renderer selection.
export const projectManifestSchema = z.strictObject({
  schemaVersion: z.literal(1),
  id: z.uuid(),
  title: projectTitleSchema,
  createdAt: z.iso.datetime(),
});

export type ProjectManifest = z.infer<typeof projectManifestSchema>;

export const scriptContentSchema = z.string().transform((text) => text.replace(/\r\n?/g, "\n"))
  .pipe(z.string().max(50_000, "Keep scripts under 50,000 characters.")
    .refine((text) => text.trim().length > 0, "Enter script text before saving."));

export const scriptRevisionSchema = z.strictObject({
  schemaVersion: z.literal(1),
  id: z.uuid(),
  projectId: z.uuid(),
  revision: z.number().int().positive(),
  parentId: z.uuid().nullable(),
  createdAt: z.iso.datetime(),
  content: scriptContentSchema,
});

export type ScriptRevision = z.infer<typeof scriptRevisionSchema>;
