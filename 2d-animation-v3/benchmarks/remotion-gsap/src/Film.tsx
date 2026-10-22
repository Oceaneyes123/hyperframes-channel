// Adapted from ../remotion/src/Film.tsx; the frozen original remains untouched.
import { Sequence, useCurrentFrame } from "remotion";
import { useGsapTimeline } from "@remotion/gsap";

export type FilmProps = { engine: "native" | "gsap"; variant: boolean };
export const ease = (t: number) => { const p = Math.max(0, Math.min(1, t)); return p * p * (3 - 2 * p); };
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const heightAt = (i: number, frame: number) => 150 + (i % 3) * 70 + Math.sin(frame / 9 + i) * 35;

function Wave() {
  const frame = useCurrentFrame();
  return <>{[0, 1, 2, 3, 4].map((i) => <rect key={i} x={280 + i * 110} y={900 - heightAt(i, frame) / 2} width="45" height={heightAt(i, frame)} rx="9" fill="#b9d8c2" />)}</>;
}

function NativeTranscript() {
  const frame = useCurrentFrame(); const morph = ease(frame / 29);
  return <g>{[0, 1, 2, 3, 4].map((i) => <rect key={i} x={mix(280 + i * 110, 180, morph)} y={mix(900 - heightAt(i, 60) / 2, 700 + i * 90, morph)}
    width={mix(45, 720 - i * 50, morph)} height={mix(heightAt(i, 60), 18, morph)} rx="9" fill="#b9d8c2" />)}
    <rect x="150" y="668" width="790" height="78" rx="8" fill="none" stroke="#efc74e" strokeWidth="5" opacity={ease((frame - 30) / 30)} />
  </g>;
}

function GsapTranscript() {
  const scope = useGsapTimeline<SVGGElement>(({ timeline, selector }) => {
    for (let i = 0; i < 5; i++) timeline.fromTo(selector(`[data-bar="${i}"]`),
      { attr: { x: 280 + i * 110, y: 900 - heightAt(i, 60) / 2, width: 45, height: heightAt(i, 60) } },
      { attr: { x: 180, y: 700 + i * 90, width: 720 - i * 50, height: 18 }, duration: 29 / 30, ease }, 0);
    timeline.fromTo(selector("[data-highlight]"), { opacity: 0 }, { opacity: 1, duration: 1, ease }, 1);
  });
  return <g ref={scope}>{[0, 1, 2, 3, 4].map((i) => <rect key={i} data-bar={i} x={280 + i * 110} y={900 - heightAt(i, 60) / 2} width="45" height={heightAt(i, 60)} rx="9" fill="#b9d8c2" />)}
    <rect data-highlight x="150" y="668" width="790" height="78" rx="8" fill="none" stroke="#efc74e" strokeWidth="5" opacity="0" />
  </g>;
}

function Paper({ review, variant, animated }: { review: boolean; variant: boolean; animated: boolean }) {
  const frame = useCurrentFrame();
  return <>
    <rect x="160" y="550" width="760" height="900" rx="28" fill="#172026" stroke="#b9d8c2" strokeWidth="5" />
    {review ? <><text x="230" y="710" fill="#e8edf0" fontSize="46">Check the draft</text>
      {[0, 1, 2].map((i) => <g data-reveal key={i} opacity={animated ? 0 : ease((frame - i * 12) / 24)}>
        <rect x="230" y={820 + i * 140} width="48" height="48" rx="8" fill="#b9d8c2" />
        <rect x="320" y={835 + i * 140} width="470" height="18" rx="9" fill="#b9c6c1" />
      </g>)}</> : <>
      <rect x="220" y="640" width="640" height="180" rx="10" fill={variant ? "#d59b55" : "#55796c"} />
      {[0, 1, 2, 3].map((i) => <rect data-reveal key={i} x="220" y={900 + i * 90} width={580 - i * 30} height="18" rx="9" fill="#b9c6c1" opacity={animated ? 0 : ease((frame - i * 7) / 24)} />)}
    </>}
  </>;
}

function NativePaper({ review, variant }: { review: boolean; variant: boolean }) {
  const frame = useCurrentFrame(); const camera = review ? 1 : ease(frame / 29);
  return <g style={{ transform: `translate(${mix(0, -16, camera)}px, ${mix(0, -20, camera)}px) scale(${mix(1, 1.04, camera)})`, transformOrigin: "0px 0px" }}>
    <Paper review={review} variant={variant} animated={false} />
  </g>;
}

function GsapPaper({ review, variant }: { review: boolean; variant: boolean }) {
  const scope = useGsapTimeline<SVGGElement>(({ timeline, selector }) => {
    timeline.fromTo(selector("[data-camera]"), { x: review ? -16 : 0, y: review ? -20 : 0, scale: review ? 1.04 : 1, svgOrigin: "0 0" },
      { x: -16, y: -20, scale: 1.04, duration: review ? 0 : 29 / 30, ease }, 0);
    timeline.fromTo(selector("[data-reveal]"), { opacity: 0 }, { opacity: 1, duration: 24 / 30, stagger: (review ? 12 : 7) / 30, ease }, 0);
  }, { dependencies: [review, variant] });
  return <g ref={scope}><g data-camera><Paper review={review} variant={variant} animated /></g></g>;
}

export function Film({ engine, variant }: FilmProps) {
  const frame = useCurrentFrame();
  return <svg data-frame={frame} data-engine={engine} viewBox="0 0 1080 1920" width="1080" height="1920" style={{ background: frame < 180 ? "#121b21" : "#243036", fontFamily: "Arial" }}>
    <text x="120" y="260" fill="#b9d8c2" fontSize="30">V3 / SYNTHETIC BENCHMARK</text>
    <text x="120" y="420" fill="#e8edf0" fontSize="64">{frame < 90 ? "Voice note" : frame < 180 ? "Transcript" : frame < 270 ? "Newsletter" : "Review"}</text>
    <Sequence from={0} durationInFrames={60} layout="none"><Wave /></Sequence>
    <Sequence from={60} durationInFrames={120} layout="none">{engine === "gsap" ? <GsapTranscript /> : <NativeTranscript />}</Sequence>
    <Sequence from={180} durationInFrames={90} layout="none">{engine === "gsap" ? <GsapPaper review={false} variant={variant} /> : <NativePaper review={false} variant={variant} />}</Sequence>
    <Sequence from={270} durationInFrames={90} layout="none">{engine === "gsap" ? <GsapPaper review variant={false} /> : <NativePaper review variant={false} />}</Sequence>
  </svg>;
}
