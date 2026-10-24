"use client";

import { useActionState, useState } from "react";
import { createProject } from "./actions";

export default function ProjectForm() {
  const [state, action, pending] = useActionState(createProject, { error: "" });
  const [title, setTitle] = useState("");
  return (
    <form action={action} className="space-y-4">
      <label htmlFor="title" className="sr-only">Project title</label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input id="title" name="title" value={title} onChange={(event) => setTitle(event.target.value)}
          placeholder="Project title" required maxLength={200} disabled={pending} aria-describedby={state.error ? "project-error" : undefined}
          className="min-w-0 flex-1" />
        <button type="submit" disabled={pending}>{pending ? "Creating…" : "Create"}</button>
      </div>
      {state.error && <p id="project-error" role="alert" className="text-[var(--error)]">{state.error}</p>}
    </form>
  );
}
