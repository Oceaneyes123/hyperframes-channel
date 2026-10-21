"use client";

export default function WorkspaceError({ retry }: { retry: () => void }) {
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-6 py-20">
      <h1 className="text-3xl font-semibold">The workspace could not be loaded</h1>
      <p className="leading-relaxed text-[#aeb4b0]">Check local storage and server configuration. Saved revisions have not been replaced.</p>
      <button onClick={retry}>Try again</button>
    </main>
  );
}
