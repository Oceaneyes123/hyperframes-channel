// Small numeric contract check, plus a real-GSAP suppressed-seek regression.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import '../channel/motion.js';
import {sampleTimes} from './motion_capture.mjs';
const M=globalThis.ChannelMotion;
for(const profile of Object.keys(M.personalities)) {
  assert.equal(M.spring(-1,profile),0);
  assert(Math.abs(M.spring(3,profile)-1)<1e-8);
  assert(Math.max(...Array.from({length:100},(_,i)=>M.spring(i/100,profile)))<1.006);
}
const value=M.track(0,[[1,10,'FAST',1],[1.2,-4,'SOFT',1]]);
assert.equal(value(0),0);assert.equal(value(3),-4);
const ordered=[0,1,1.3,1.7,3].map(value);
assert.deepEqual([3,1.7,1.3,1,0].map(value).reverse(),ordered);
assert.throws(()=>M.track(0,[[2,1],[1,2]]));
assert.throws(()=>M.color('red',[]));
assert.equal(M.color('#000000',[[0,'#ffffff']])(2),'rgb(255,255,255)');
for(let t=0;t<2;t+=.01){const v=M.swap(t,1);assert(!(v.old.opacity>0&&v.next.opacity>0),'swap must not double-expose text');}
const line={getTotalLength:()=>100,getPointAtLength:d=>({x:d,y:0})};
const travel=M.path(line,M.travel(1,2));assert.equal(travel(0).x,0);assert.equal(travel(3).x,100);
assert.equal(M.path(line,M.travel(1,2,1,0))(2).x,0);
assert.deepEqual(M.geometry([[0,0]],[[10,20]],.5),[[5,10]]);
assert.throws(()=>M.geometry([[0,0]],[[0]],.5));
assert.deepEqual(M.camera(()=>({x:540,y:960,scale:1}))(0),{x:0,y:0,scale:1,origin:'0 0'});
assert.equal(M.transition('hard-cut',.9,1).opacity,0);
assert.equal(M.transition('directional-push',2,1,.5).x,0);
assert.equal(M.transition('zoom-reveal',2,1,.5).opacity,1);
assert.equal(M.transition('match-morph',2,1,.5,{from:{x:0},to:{x:4}}).x,4);
assert.equal(M.transition('iris',2,1,.5).clipPath,'circle(150% at 50% 50%)');
assert.deepEqual(sampleTimes(1,30,4,180),[.99375,.9979166666666667,1.0020833333333334,1.00625]);
assert(sampleTimes(0).every(t=>t>=0));assert.throws(()=>sampleTimes(0,0));
const sandbox={window:{},console,setTimeout,clearTimeout};vm.createContext(sandbox);
vm.runInContext(readFileSync(new URL('../videos/https-actually-works/public/vendor/gsap.min.js',import.meta.url),'utf8'),sandbox);
const gsap=sandbox.gsap||sandbox.window.gsap, tl=gsap.timeline({paused:true});
let drawn=-1;M.mount(tl,4,t=>{drawn=value(t);});
for(const t of [3,1.3,0,2,1.3]){tl.seek(t,true);assert(Math.abs(drawn-value(t))<1e-8,`suppressed seek at ${t}`);}
gsap.ticker.sleep();
console.log('Motion numeric, sampling and suppressed/backward GSAP seek checks passed.');
