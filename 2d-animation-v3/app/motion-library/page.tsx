import Link from "next/link";
import MotionLibrary from "./player";

export default function MotionLibraryPage() {
  return <main className="mx-auto max-w-5xl px-6 py-10">
    <nav className="flex gap-6"><Link href="/">Projects</Link><Link href="/text-motion">Text effects</Link><Link href="/connected-process">Connected process</Link></nav>
    <h1 className="mt-8 text-3xl font-semibold">Motion library</h1>
    <p className="mb-6 text-[var(--muted)]">Reusable capabilities for upcoming videos. These examples use synthetic content and do not change a production project.</p>
    <MotionLibrary />
  </main>;
}
