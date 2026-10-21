import { useCurrentFrame } from "remotion";

const ease = (t: number) => { const p = Math.max(0, Math.min(1, t)); return p * p * (3 - 2 * p); };
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export function Film({ variant = false }: { variant?: boolean }) {
  const frame = useCurrentFrame();
  const morph = ease((frame - 60) / 29);
  const review = frame >= 270;
  return (
    <svg viewBox="0 0 1080 1920" width="1080" height="1920" style={{ background: frame < 180 ? "#121b21" : "#243036", fontFamily: "Arial" }}>
      <text x="120" y="260" fill="#b9d8c2" fontSize="30">V3 / SYNTHETIC BENCHMARK</text>
      {frame < 180 ? <>
        <text x="120" y="420" fill="#e8edf0" fontSize="64">{frame < 90 ? "Voice note" : "Transcript"}</text>
        {[0, 1, 2, 3, 4].map((i) => {
          const height = 150 + (i % 3) * 70 + (frame < 60 ? Math.sin(frame / 9 + i) * 35 : Math.sin(60 / 9 + i) * 35);
          return <rect key={i} x={mix(280 + i * 110, 180, morph)} y={mix(900 - height / 2, 700 + i * 90, morph)}
            width={mix(45, 720 - i * 50, morph)} height={mix(height, 18, morph)} rx="9" fill="#b9d8c2" />;
        })}
        {frame >= 90 && <rect x="150" y="668" width="790" height="78" rx="8" fill="none" stroke="#efc74e" strokeWidth="5" opacity={ease((frame - 90) / 30)} />}
      </> : <>
        <text x="120" y="420" fill="#e8edf0" fontSize="64">{review ? "Review" : "Newsletter"}</text>
        <rect x="160" y="550" width="760" height="900" rx="28" fill="#172026" stroke="#b9d8c2" strokeWidth="5" />
        {!review ? <>
          <rect x="220" y="640" width="640" height="180" rx="10" fill={variant ? "#d59b55" : "#55796c"} />
          {[0, 1, 2, 3].map((i) => <rect key={i} x="220" y={900 + i * 90} width={580 - i * 30} height="18" rx="9" fill="#b9c6c1" opacity={ease((frame - 180 - i * 7) / 24)} />)}
        </> : <>
          <text x="230" y="710" fill="#e8edf0" fontSize="46">Check the draft</text>
          {[0, 1, 2].map((i) => <g key={i} opacity={ease((frame - 270 - i * 12) / 24)}>
            <rect x="230" y={820 + i * 140} width="48" height="48" rx="8" fill="#b9d8c2" />
            <rect x="320" y={835 + i * 140} width="470" height="18" rx="9" fill="#b9c6c1" />
          </g>)}
        </>}
      </>}
    </svg>
  );
}
