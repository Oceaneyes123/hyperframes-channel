import Link from "next/link";
import ConnectedProcessPlayer from "./player";

export default function ConnectedProcessPage() {
  return <main className="mx-auto max-w-4xl px-6 py-10">
    <Link href="/text-motion">← Motion examples</Link>
    <h1 className="mt-8 text-3xl font-semibold">Follow the inquiry</h1>
    <p className="mb-6 text-[var(--muted)]">Draw the connector, follow the information, then watch its destination react. Synthetic example; no external service is called.</p>
    <ConnectedProcessPlayer />
    <p className="mt-6">Use <code>edge-draw@1</code> before <code>edge-trace@1</code> on a registered diagram edge. Finish with a reading hold.</p>
  </main>;
}
