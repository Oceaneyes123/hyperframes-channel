import { useId, type ReactNode } from "react";
import type { PartState } from "../../workflow/components.ts";

// Amounts are separate source-bound numeric actors; these surfaces never invent money.
export function FinanceSurface({ type, width, height, states, actorId }: {
  type: "payment-terminal@1" | "banking-balance@1";
  width: number; height: number; states: Record<string, PartState>; actorId?: string;
}) {
  const instance = useId();
  const part = (id: string, children: ReactNode) => {
    const s = states[id], clip = `${instance}-${id}`;
    return <g key={id}><defs><clipPath id={clip}><rect data-reveal={actorId ? `${actorId}.${id}` : undefined} width={width * (s.reveal ?? 1)} height={height} transform={`scale(${800 / width} ${1100 / height})`} /></clipPath></defs>
      <g data-actor={actorId ? `${actorId}.${id}` : undefined} data-part={id} opacity={s.opacity} color={s.color}
        transform={`translate(${s.x * 8} ${s.y * 11}) scale(${s.scale})`} clipPath={`url(#${clip})`}>
        {children}
      </g></g>;
  };
  return <svg data-shape width={width} height={height} viewBox="0 0 800 1100" fontFamily="Arial, sans-serif">
    <defs>
      <linearGradient id={`${instance}-metal`} x2="1" y2="1"><stop stopColor="#465361" /><stop offset=".32" stopColor="#1C2733" /><stop offset="1" stopColor="#0C1119" /></linearGradient>
      <linearGradient id={`${instance}-glass`} x2=".7" y2="1"><stop stopColor="#223748" /><stop offset="1" stopColor="#101A26" /></linearGradient>
    </defs>
    {type === "payment-terminal@1" ? <>
      <ellipse cx="400" cy="1025" rx="290" ry="45" fill="#000000" opacity=".35" />
      <rect x="70" y="52" width="660" height="955" rx="88" fill={`url(#${instance}-metal)`} stroke="#657282" strokeWidth="3" />
      <path d="M100 245V150Q100 80 175 80H625" fill="none" stroke="#92A2B3" strokeWidth="3" opacity=".6" />
      <rect x="121" y="148" width="558" height="478" rx="28" fill="#070E17" stroke="#4A596A" strokeWidth="3" />
      <rect x="142" y="170" width="516" height="434" rx="16" fill={`url(#${instance}-glass)`} />
      <text x="178" y="218" fill="#A8B7C8" fontSize="22" letterSpacing="5">ARC / PAYMENTS</text>
      <circle cx="615" cy="210" r="7" fill="#73D8BC" />
      <path d="M180 250H620" stroke="#3D4C60" />
      {part("tap", <><circle cx="400" cy="385" r="66" fill="none" stroke="currentColor" strokeWidth="3" /><path d="M385 344Q433 385 385 426M406 323Q479 385 406 447" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" /><text x="400" y="525" textAnchor="middle" fill="currentColor" fontSize="32">TAP CARD</text></>)}
      {part("processing", <><circle cx="400" cy="385" r="66" fill="none" stroke="currentColor" strokeWidth="9" strokeDasharray="65 24" /><text x="400" y="525" textAnchor="middle" fill="currentColor" fontSize="30">PROCESSING</text></>)}
      {part("declined", <><circle cx="400" cy="385" r="76" fill="#401F2B" /><path d="M372 357L428 413M428 357L372 413" stroke="currentColor" strokeWidth="13" strokeLinecap="round" /><text x="400" y="525" textAnchor="middle" fill="currentColor" fontWeight="700" fontSize="53">DECLINED</text></>)}
      {part("approved", <><circle cx="400" cy="385" r="76" fill="#173D37" /><path d="M360 384L390 414L445 354" fill="none" stroke="currentColor" strokeWidth="13" strokeLinecap="round" /><text x="400" y="525" textAnchor="middle" fill="currentColor" fontWeight="700" fontSize="48">APPROVED</text></>)}
      {Array.from({ length: 12 }, (_, i) => <g key={i}><rect x={151 + i % 3 * 173} y={665 + Math.floor(i / 3) * 70} width="151" height="54" rx="14" fill={i === 11 ? "#317D6A" : i === 9 ? "#853647" : "#344251"} stroke="#586674" /><text x={226 + i % 3 * 173} y={701 + Math.floor(i / 3) * 70} fill="#E2E9F0" textAnchor="middle" fontSize="25">{i < 9 ? i + 1 : i === 10 ? 0 : i === 9 ? "×" : "✓"}</text></g>)}
      <rect x="265" y="972" width="270" height="9" rx="4" fill="#070C13" />
    </> : <>
      <rect x="63" y="15" width="674" height="1060" rx="88" fill="#090F18" stroke="#697786" strokeWidth="4" />
      <rect x="82" y="34" width="636" height="1022" rx="70" fill="#102131" />
      <rect x="295" y="50" width="210" height="38" rx="19" fill="#060B12" />
      <text x="128" y="146" fill="#F0F4F7" fontSize="28" letterSpacing="5">ARC / BANK</text>
      <text x="128" y="198" fill="#9CAFC1" fontSize="23">Everyday debit</text>
      {part("current", <><rect x="115" y="237" width="570" height="209" rx="30" fill="#1D3347" stroke="#40596D" /><text x="148" y="285" fill="currentColor" fontSize="40">Current balance</text></>)}
      {part("available", <><rect x="115" y="470" width="570" height="209" rx="30" fill="#173B39" stroke="#3B7368" /><text x="148" y="519" fill="currentColor" fontSize="40">Available to spend</text></>)}
      {part("hold", <><rect x="115" y="715" width="570" height="179" rx="24" fill="#3A2C32" stroke="#785459" /><text x="148" y="760" fill="currentColor" fontSize="40">Pending hold</text></>)}
      <path d="M130 951H670" stroke="#344C60" /><text x="150" y="994" fill="#90A4B7" fontSize="20">HOME</text><text x="445" y="994" fill="#90A4B7" fontSize="20">CARD SETTINGS</text>
      <rect x="300" y="1030" width="200" height="6" rx="3" fill="#D2DCE5" />
    </>}
  </svg>;
}
