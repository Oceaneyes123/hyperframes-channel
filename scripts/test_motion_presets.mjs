import assert from 'node:assert/strict';
import '../channel/motion.js';
import '../channel/motion-presets.js';

const P = globalThis.ChannelMotionPresets;
const close = (a, b) => assert(Math.abs(a - b) < 1e-9, `${a} != ${b}`);
const sample = fn => [0, .12, .4, 1.2, .8, .12, 0].map(fn);

const enter = P.entrance({at: .2, duration: .3, from: {x: -80, y: 20}});
assert.deepEqual(enter(0), {x: -80, y: 20, scale: 1, opacity: 0});
assert.deepEqual(enter(1), {x: 0, y: 0, scale: 1, opacity: 1});
assert.deepEqual(sample(enter), [0, .12, .4, 1.2, .8, .12, 0].map(enter));
assert(enter(.35).x < 0 && enter(.35).x > -80);

const leave = P.exit({at: .2, duration: .18, to: {x: 100, y: 0}, kind: 'transfer'});
assert.deepEqual(leave(0), {x: 0, y: 0, scale: 1, opacity: 1});
assert.deepEqual(leave(1), {x: 100, y: 0, scale: .96, opacity: 0});
assert(leave(.29).x < 50, 'exit accelerates');

for (const order of ['sequential', 'reverse', 'center-out', 'wave', 'organic']) {
  const times = P.stagger({count: 7, at: .1, gap: .04, order, seed: 3});
  assert.equal(times.length, 7); assert.deepEqual([...times].sort((a, b) => a - b),
    Array.from({length: 7}, (_, i) => .1 + i * .04));
  assert.deepEqual(times, P.stagger({count: 7, at: .1, gap: .04, order, seed: 3}));
}
assert.deepEqual(P.stagger({count: 5, at: 0, order: 'center-out'}).map((t, i) => [t, i]).sort((a, b) => a[0] - b[0]).map(([, i]) => i), [2, 1, 3, 0, 4]);

const line = {getTotalLength: () => 100, getPointAtLength: d => ({x: d, y: 0})};
const journey = P.transfer({path: line, at: .2, duration: .4, receiverAt: .6});
assert.equal(journey(0).packet.x, 0);
assert.equal(journey(1).packet.x, 100);
assert.deepEqual(journey(0).route, {start: 0, end: 0});
assert.deepEqual(journey(1).route, {start: 0, end: 1});
close(journey(.5).receiver.scale, 1);
assert(journey(.68).receiver.scale < 1);
const reply = P.route({path: line, at: .8, duration: .3, from: 1, to: 0});
assert.equal(reply(.8).packet.x, journey(1).packet.x);
assert.equal(reply(2).packet.x, 0);
const roundTrip = P.requestResponse({path: line, requestAt: .2, responseAt: .7});
close(roundTrip(.6).request.packet.x, 100);
close(roundTrip(.7).response.packet.x, roundTrip(.6).request.packet.x);
assert.equal(roundTrip(2).response.packet.x, 0);
const branches = P.broadcast({paths: [line, line, line], at: .2, gap: .04});
assert.deepEqual(branches(.2).map(leg => leg.packet.x), [0, 0, 0]);
assert(branches(.42)[0].packet.x > branches(.42)[2].packet.x);

const focus = P.camera({at: .2, duration: .4, from: {x: 540, y: 960, scale: 1}, to: {x: 740, y: 960, scale: 1.2}});
assert.deepEqual(focus(0), {x: 0, y: 0, scale: 1, origin: '0 0'});
assert.deepEqual(focus(1), {x: -348, y: -192, scale: 1.2, origin: '0 0'});
const counter = P.counter({hero: enter, ratio: -.2});
close(counter(0).x, 16); close(counter(1).x, 0);

const changed = P.stateChange({at: .2, duration: .3, from: {x: 0, scale: 1}, to: {x: 12, scale: 1.02}});
assert.deepEqual(changed(0), {x: 0, scale: 1});
assert.deepEqual(changed(1), {x: 12, scale: 1.02});
const composed = P.compose({hero: enter, nested: P.compose({receiver: P.emphasis({at: .6, kind: 'receive'})})});
assert.deepEqual(composed(0).hero, enter(0));
assert.equal(composed(1).nested.receiver.scale, P.emphasis({at: .6, kind: 'receive'})(1).scale);

for (const kind of ['pulse', 'impact', 'success', 'warning', 'receive', 'ripple', 'shake', 'glow', 'highlight']) {
  const accent = P.emphasis({at: .2, duration: .3, kind});
  for (const t of [0, .2, .35, .5, 1]) {
    const pose = accent(t);
    if ('opacity' in pose) assert(pose.opacity >= 0 && pose.opacity <= 1);
    if ('scale' in pose) assert(pose.scale >= .9 && pose.scale <= 1.1);
  }
}
const iris = P.transition({kind: 'iris', at: .2, duration: .3});
assert.equal(iris(0).clipPath, 'circle(0% at 50% 50%)');
assert.equal(iris(1).clipPath, 'circle(150% at 50% 50%)');
assert.deepEqual(sample(iris), [0, .12, .4, 1.2, .8, .12, 0].map(iris));

assert.throws(() => P.entrance({at: -1}));
assert.throws(() => P.exit({at: 0, duration: 0}));
assert.throws(() => P.stagger({count: -1, at: 0}));
assert.throws(() => P.stagger({count: 2, at: 0, order: 'bad'}));
assert.throws(() => P.emphasis({at: 0, amount: .2}));
assert.throws(() => P.route({path: line, at: 0, from: -1}));
assert.throws(() => P.requestResponse({path: line, requestAt: .2, responseAt: .3}));
assert.throws(() => P.broadcast({paths: [], at: 0}));
assert.throws(() => P.camera({at: 0, from: {x: 0, y: 0, scale: 0}, to: {x: 1, y: 1}}));
assert.throws(() => P.stateChange({at: 0, from: {x: 0}, to: {y: 1}}));
assert.throws(() => P.transition({at: 0, kind: 'fade'}));
assert.throws(() => P.transition({at: 0, kind: 'match-morph', from: {x: 0}, to: {y: 1}}));
assert.throws(() => P.transition({at: 0, kind: 'route-continuation'}));
assert.throws(() => P.transition({at: 0, kind: 'directional-push', direction: 0}));
assert.throws(() => P.compose({bad: 1}));
console.log('Motion preset seek, bounds, continuity and validation checks passed.');
