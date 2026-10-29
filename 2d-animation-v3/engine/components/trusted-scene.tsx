import { scenePose, type trustedSceneIds } from "../../workflow/trusted-scenes.ts";

const ink = "#203B3A", accent = "#D9633F", mint = "#C6DED3", paper = "#FFFDF8";
const documentPath = "M-115-150H65L115-100V150H-115ZM65-150V-100H115";
function Document({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}><path d={documentPath} fill={paper} stroke={ink} strokeWidth="12" strokeLinejoin="round"/><path d="M-70-40H65M-70 15H70M-70 70H30" fill="none" stroke={accent} strokeWidth="14" strokeLinecap="round"/></g>;
}
/** Authored registry only. The reserved motion layer's reveal value is normalized scene time. */
export function TrustedScene({ id, progress = 0, width, height, actorId }: { id: typeof trustedSceneIds[number]; progress?: number; width: number; height: number; actorId?: string }) {
  const pose = scenePose(id, progress), p = pose.p;
  return <svg width={width} height={height} viewBox="0 0 1000 1000" aria-hidden="true"><g data-actor={actorId ? `${actorId}.motion` : undefined}>
    {id === "message-transform@1" && <g transform="translate(500 500)">
      <path d={`M${-240 + pose.t * 125} ${-150}H${240 - pose.t * 125}V150H${-240 + pose.t * 125}Z`} fill={paper} stroke={ink} strokeWidth="15" strokeLinejoin="round"/>
      <path d={`M${-240 + pose.t * 125} -150L0 ${70 - pose.t * 140}L${240 - pose.t * 125} -150`} fill="none" stroke={accent} strokeWidth="18" opacity={1-pose.t}/>
      <path d="M-65-50H65M-65 10H65M-65 70H20" stroke={accent} strokeWidth="18" opacity={pose.t}/>
      <circle cx={310 - pose.t * 50} cy={-200 + pose.t * 60} r={35 + pose.t * 15} fill={mint}/>
    </g>}
    {id === "parallax-workspace@1" && <g transform={`translate(${500 + pose.cameraX} 500) scale(${pose.cameraScale}) translate(-500 -500)`}>
      <g opacity=".22" transform={`translate(${-pose.t * 30} 0)`}><path d="M160 260H840M160 500H840M160 740H840M260 160V840M500 160V840M740 160V840" stroke={ink} strokeWidth="4"/></g>
      <rect x="245" y="265" width="510" height="365" rx="45" fill={ink}/><rect x="273" y="293" width="454" height="288" rx="25" fill={paper}/>
      <path d="M500 630V710M370 720H630" stroke={ink} strokeWidth="25" strokeLinecap="round"/>
      <g transform={`translate(${pose.t * 65} ${-pose.t * 20})`}><Document x={525} y={425} scale={.55}/><circle cx="745" cy="650" r="100" fill={accent}/><path d="M700 650H790M750 610L790 650L750 690" fill="none" stroke={paper} strokeWidth="17" strokeLinecap="round"/></g>
    </g>}
    {id === "counted-documents@1" && <><path d="M180 700H820" stroke={ink} strokeWidth="12"/>{[0,1,2].map(i=><g key={i} opacity={p >= (i+1)/3 ? 1 : .18}><Document x={270+i*230} y={410} scale={.65}/></g>)}<text x="500" y="850" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="150" fontWeight="700" fill={ink}>{pose.count}</text></>}
    {id === "signal-burst@1" && <><circle cx="500" cy="500" r={120+pose.t*80} fill={ink}/><path d="M440 500L485 545L565 450" fill="none" stroke={paper} strokeWidth="22" strokeLinecap="round"/>{Array.from({length:12},(_,i)=>{const angle=i*Math.PI/6,r=175+pose.t*230;return <circle key={i} cx={500+Math.cos(angle)*r} cy={500+Math.sin(angle)*r} r={12+Math.sin(i*2+1)*4} fill={i%2?mint:accent} opacity={Math.sin(p*Math.PI)}/>;})}</>}
    {id === "elastic-token@1" && <><ellipse cx="500" cy="675" rx="240" ry="22" fill={ink} opacity=".1"/><g transform={`translate(500 510) scale(${pose.scaleX} ${pose.scaleY})`}><rect x="-320" y="-125" width="640" height="250" rx="60" fill={accent}/><text x="-55" y="35" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="110" fill={paper}>SEND</text><path d="M155 0H245M200-45L245 0L200 45" fill="none" stroke={paper} strokeWidth="17" strokeLinecap="round"/></g><path d="M0 0L0 155L42 118L78 185L110 169L72 104L125 96Z" transform={`translate(${815-pose.t*145} ${785-pose.t*200}) scale(.72)`} fill={ink} stroke={paper} strokeWidth="8" strokeLinejoin="round"/></>}
    {id === "loop-handoff@1" && <><path d="M220 500C220 140 780 140 780 500S220 860 220 500" fill="none" stroke={mint} strokeWidth="20" strokeDasharray="18 20"/>{[0,1,2].map(i=><g key={i} transform={`translate(${[230,770,500][i]} ${[360,360,780][i]})`}><rect x="-100" y="-75" width="200" height="150" rx="25" fill={paper} stroke={ink} strokeWidth="9"/>{i===0?<path d="M-65-35H65M-65 0H20M-65 35H50" stroke={accent} strokeWidth="10"/>:i===1?<path d="M-60-30L-20 0L-60 30M5 30H60" fill="none" stroke={accent} strokeWidth="12"/>:<path d="M-55 20Q-95-30-30-35Q0-90 45-30Q100-30 70 20Z" fill={mint} stroke={accent} strokeWidth="8"/>}</g>)}<g transform={`translate(${pose.x} ${500+Math.cos(p*Math.PI*2)*180})`}><circle r="55" fill={accent}/><path d="M-22 0H22M3-20L22 0L3 20" fill="none" stroke={paper} strokeWidth="9" strokeLinecap="round"/></g></>}
  </g></svg>;
}
