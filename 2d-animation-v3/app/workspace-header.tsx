export default function WorkspaceHeader({ projectId, title, stage }: {
  projectId: string; title: string; stage: "writing" | "script" | "visuals";
}) {
  return <header className="workspace-header">
    {/* Full navigation preserves the editor's unsaved-draft unload protection. */}
    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
    <a href="/" className="studio-brand">HyperFrames <span>Studio</span></a>
    <h1>{title}</h1>
    <nav aria-label="Workflow" className="stage-nav">
      {([ ["writing", "Writing", "/writing"], ["script", "Script", ""], ["visuals", "Storyboard", "/visuals"] ] as const).map(([key, label, path], index) =>
        <a key={key} href={`/projects/${projectId}${path}`} aria-current={stage === key ? "page" : undefined}><span aria-hidden="true">0{index + 1}</span>{label}</a>)}
    </nav>
  </header>;
}
