import Link from "next/link";
import { withStudio } from "../server/workspace.ts";
import ProjectForm from "./project-form";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function Home() {
  const projects = withStudio((studio) => studio.listProjects());
  return <main className="mx-auto max-w-5xl px-6 py-10 sm:px-12 sm:py-14">
    <header className="section-toolbar mb-12">
      <p className="studio-brand">HyperFrames <span>Studio</span></p>
      <Link href="/text-motion" className="text-xs text-[var(--muted)]">Text motion library</Link>
    </header>
    <section aria-labelledby="projects-heading">
      <div className="section-toolbar mb-8">
        <h1 id="projects-heading" className="text-3xl font-semibold">Projects <span className="ml-2 text-base font-normal text-[var(--muted)]">{projects.length}</span></h1>
        <a href="#new-project" className="button">New project</a>
      </div>
      {projects.length === 0 ? <p className="py-8 text-[var(--muted)]">No projects yet.</p> : (
        <ul className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {projects.map((project) => <li key={project.id}>
            <Link href={`/projects/${project.id}`} className="project-row"><span>{project.title}</span><span>Open <span aria-hidden="true">↗</span></span></Link>
          </li>)}
        </ul>
      )}
    </section>
    <section id="new-project" aria-labelledby="create-heading" className="mt-12 scroll-mt-8">
      <h2 id="create-heading" className="mb-5 text-lg font-semibold">New project</h2>
      <ProjectForm />
    </section>
  </main>;
}
