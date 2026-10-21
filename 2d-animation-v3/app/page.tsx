import Link from "next/link";
import { withStudio } from "../server/workspace.ts";
import ProjectForm from "./project-form";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function Home() {
  const projects = withStudio((studio) => studio.listProjects());
  return (
    <main className="mx-auto max-w-4xl px-6 py-12 sm:px-12 sm:py-20">
      <header className="border-b border-white/15 pb-10">
        <p className="mb-5 text-sm uppercase tracking-widest text-[#b9d8c2]">HyperFrames / V3</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Your projects</h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#aeb4b0]">
          Keep a project and its script drafts together. Save revisions and return to them when you need to.
        </p>
      </header>
      <section aria-labelledby="create-heading" className="border-b border-white/15 py-10">
        <h2 id="create-heading" className="mb-6 text-xl font-semibold">Start a project</h2>
        <ProjectForm />
      </section>
      <section aria-labelledby="projects-heading" className="py-10">
        <h2 id="projects-heading" className="mb-6 text-xl font-semibold">Saved projects <span className="text-[#aeb4b0]">({projects.length})</span></h2>
        {projects.length === 0 ? <p className="text-[#aeb4b0]">No projects yet. Create one above to start writing.</p> : (
          <ul className="divide-y divide-white/10">
            {projects.map((project) => (
              <li key={project.id} className="py-5">
                <Link href={`/projects/${project.id}`} className="break-words text-lg">{project.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <footer className="border-t border-white/15 pt-6 text-sm leading-relaxed text-[#aeb4b0]">
        <p>Save and review scripts, compare visual concepts, and plan shots from an accepted script. Production gates and video rendering remain disabled.</p>
        <p className="mt-3"><a href="/api/health">Application health</a> · Local development · V1 and V2 remain independent</p>
      </footer>
    </main>
  );
}
