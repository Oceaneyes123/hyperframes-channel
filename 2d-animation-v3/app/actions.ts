"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isLocalRequest } from "../server/local-request.ts";
import { ConflictError, MissingProjectError } from "../server/studio.ts";
import { withStudio } from "../server/workspace.ts";
import { readConfig } from "../server/config.ts";
import { openScriptwriting, WritingConflictError } from "../server/scriptwriting-store.ts";
import { openVisuals } from "../server/visual-store.ts";

export type CreateState = { error: string };
export type ScriptState = { parentId: string | null; savedContent: string; error: string; message: string };

async function requireLocalRequest() {
  const request = await headers();
  if (!isLocalRequest(request.get("host"), request.get("origin"))) {
    throw new Error("Local request required");
  }
}

function publicError(error: unknown) {
  if (error instanceof z.ZodError) return error.issues[0]?.message ?? "Invalid input.";
  if (error instanceof ConflictError) return error.message;
  if (error instanceof WritingConflictError) return error.message;
  if (error instanceof MissingProjectError) return "Project not found.";
  return "Could not save. Your draft is still here. Check local storage and try again.";
}

export async function createProject(_previous: CreateState, form: FormData): Promise<CreateState> {
  let id: string;
  try {
    await requireLocalRequest();
    id = withStudio((studio) => studio.createProject(form.get("title"))).id;
  } catch (error) { return { error: publicError(error) }; }
  revalidatePath("/");
  redirect(`/projects/${id}`);
}

export async function saveScript(projectId: string, previous: ScriptState, form: FormData): Promise<ScriptState> {
  let revision;
  try {
    await requireLocalRequest();
    revision = withStudio((studio) => studio.saveScript(projectId, form.get("content"), previous.parentId));
  } catch (error) { return { ...previous, error: publicError(error), message: "" }; }
  revalidatePath(`/projects/${projectId}`);
  return { parentId: revision.id, savedContent: revision.content, error: "", message: `Revision ${revision.revision} saved.` };
}

export async function acceptScript(projectId: string, _previous: CreateState, form: FormData): Promise<CreateState> {
  try {
    await requireLocalRequest();
    withStudio((studio) => studio.acceptScript(projectId, z.uuid().parse(form.get("revisionId"))));
  } catch (error) { return { error: publicError(error) }; }
  revalidatePath(`/projects/${projectId}`);
  return { error: "" };
}

export async function decideProposal(projectId: string, proposalId: string, _previous: CreateState, form: FormData): Promise<CreateState> {
  try {
    await requireLocalRequest();
    const decision = z.enum(["accept", "reject"]).parse(form.get("decision"));
    withStudio((studio) => studio.decideProposal(projectId, proposalId, decision));
  } catch (error) { return { error: publicError(error) }; }
  revalidatePath(`/projects/${projectId}`);
  return { error: "" };
}

export async function saveResearchBrief(projectId: string, _previous: CreateState, form: FormData): Promise<CreateState> {
  let runId: string;
  try {
    await requireLocalRequest();
    const config = readConfig(); const store = openScriptwriting(config.dataDirectory, config.videosDirectory);
    try {
      runId = store.saveBrief(projectId, JSON.parse(z.string().max(200_000).parse(form.get("brief"))),
        z.uuid().nullable().parse(form.get("expectedBriefId") || null));
    } finally { store.close(); }
  } catch (error) { return { error: publicError(error) }; }
  revalidatePath(`/projects/${projectId}/writing`);
  redirect(`/projects/${projectId}/writing?run=${runId}`);
}

export async function importWritingDraft(projectId: string, _previous: CreateState, form: FormData): Promise<CreateState> {
  try {
    await requireLocalRequest();
    withStudio((studio) => studio.importReviewedDraft(projectId, z.uuid().parse(form.get("runId"))));
  } catch (error) { return { error: publicError(error) }; }
  revalidatePath(`/projects/${projectId}`);
  revalidatePath(`/projects/${projectId}/writing`);
  redirect(`/projects/${projectId}`);
}

export async function decideVisual(projectId: string, _previous: CreateState, form: FormData): Promise<CreateState> {
  try {
    await requireLocalRequest();
    const config = readConfig(); const store = openVisuals(config.dataDirectory, config.videosDirectory);
    try {
      const id = z.uuid().parse(form.get("runId"));
      if (form.get("decision") === "choose") store.choose(projectId, id, z.coerce.number().int().min(0).max(2).parse(form.get("optionIndex")), z.uuid().nullable().parse(form.get("selectionId") || null));
      else if (form.get("decision") === "accept") store.accept(projectId, id);
      else throw new Error("Invalid decision.");
    } finally { store.close(); }
  } catch (error) { return { error: publicError(error) }; }
  revalidatePath(`/projects/${projectId}/visuals`);
  return { error: "" };
}
