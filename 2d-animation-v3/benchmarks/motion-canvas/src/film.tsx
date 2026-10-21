import { makeScene2D, Node, Rect, Txt } from "@motion-canvas/2d";
import { createSignal, tween, useScene } from "@motion-canvas/core";

const ease = (t: number) => { const p = Math.max(0, Math.min(1, t)); return p * p * (3 - 2 * p); };
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export default makeScene2D(function* (view) {
  const frame = createSignal(0);
  const variant = useScene().variables.get("variant", false);
  const morph = () => ease((frame() - 60) / 29);
  const text = (value: string | (() => string), x: number, y: number, size: number, fill = "#e8edf0") =>
    <Txt text={value} x={x} y={y - size * .35} offset={[-1, 0]} fontFamily="Arial" fontSize={size} fill={fill} />;
  const waveHeight = (i: number) => 150 + (i % 3) * 70 + Math.sin(Math.min(frame(), 60) / 9 + i) * 35;
  view.fill(() => frame() < 180 ? "#121b21" : "#243036");
  view.add(<Node position={[-540, -960]}>
    {text("V3 / SYNTHETIC BENCHMARK", 120, 260, 30, "#b9d8c2")}
    <Node opacity={() => frame() < 180 ? 1 : 0}>
      {text(() => frame() < 90 ? "Voice note" : "Transcript", 120, 420, 64)}
      {[0, 1, 2, 3, 4].map((i) => <Rect key={`wave-${i}`} offset={[-1, -1]}
        x={() => mix(280 + i * 110, 180, morph())} y={() => mix(900 - waveHeight(i) / 2, 700 + i * 90, morph())}
        width={() => mix(45, 720 - i * 50, morph())} height={() => mix(waveHeight(i), 18, morph())} radius={9} fill="#b9d8c2" />)}
      <Rect offset={[-1, -1]} x={150} y={668} width={790} height={78} radius={8} stroke="#efc74e" lineWidth={5} opacity={() => frame() >= 90 ? ease((frame() - 90) / 30) : 0} />
    </Node>
    <Node opacity={() => frame() >= 180 ? 1 : 0}>
      {text(() => frame() >= 270 ? "Review" : "Newsletter", 120, 420, 64)}
      <Rect offset={[-1, -1]} x={160} y={550} width={760} height={900} radius={28} fill="#172026" stroke="#b9d8c2" lineWidth={5} />
      <Node opacity={() => frame() < 270 ? 1 : 0}>
        <Rect offset={[-1, -1]} x={220} y={640} width={640} height={180} radius={10} fill={() => variant() ? "#d59b55" : "#55796c"} />
        {[0, 1, 2, 3].map((i) => <Rect key={`line-${i}`} offset={[-1, -1]} x={220} y={900 + i * 90} width={580 - i * 30} height={18} radius={9} fill="#b9c6c1" opacity={() => ease((frame() - 180 - i * 7) / 24)} />)}
      </Node>
      <Node opacity={() => frame() >= 270 ? 1 : 0}>
        {text("Check the draft", 230, 710, 46)}
        {[0, 1, 2].map((i) => <Node key={`check-${i}`} opacity={() => ease((frame() - 270 - i * 12) / 24)}>
          <Rect offset={[-1, -1]} x={230} y={820 + i * 140} width={48} height={48} radius={8} fill="#b9d8c2" />
          <Rect offset={[-1, -1]} x={320} y={835 + i * 140} width={470} height={18} radius={9} fill="#b9c6c1" />
        </Node>)}
      </Node>
    </Node>
  </Node>);
  yield* tween(12, (value) => frame(Math.min(359, Math.round(value * 360))));
});
