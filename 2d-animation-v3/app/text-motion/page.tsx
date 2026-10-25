import Link from "next/link";
import TextMotionGallery from "./text-motion-gallery";

export default function TextMotionPage() {
  return <main className="mx-auto max-w-5xl px-6 py-10 sm:px-12">
    <Link href="/">← Projects</Link>
    <h1 className="mt-8 text-3xl font-semibold">Text motion library</h1>
    <p className="mb-8 text-[var(--muted)]">Ten treatments for upcoming videos. Choose a purpose, preview the motion, then leave time to read.</p>
    <TextMotionGallery />
  </main>;
}
