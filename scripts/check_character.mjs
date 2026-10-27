// Optional development check; no Node dependency in the Jekyll build.
import assert from 'node:assert/strict';
import {projectHead,poseTarget} from '../assets/js/character/head-pose.js';
import {springStep,STEP} from '../assets/js/character/spring.js';
let samples=0;
for(const z of [-14,0,24])for(let x=-256;x<=256;x+=64)for(let y=-290;y<=222;y+=64){
  const p=projectHead(x,y,0,0,z);assert(Math.abs(p.x-x)<1e-10&&Math.abs(p.y-y)<1e-10);
  for(const yaw of [-14,0,14])for(const pitch of [-10,0,26]){
    const q=projectHead(x,y,yaw*Math.PI/180,pitch*Math.PI/180,z);
    const r=projectHead(x+.1,y,yaw*Math.PI/180,pitch*Math.PI/180,z);
    const d=projectHead(x,y+.1,yaw*Math.PI/180,pitch*Math.PI/180,z);
    assert(Number.isFinite(q.x)&&Number.isFinite(q.y));
    assert((r.x-q.x)*(d.y-q.y)-(r.y-q.y)*(d.x-q.x)>0);samples++;
  }
}
for(const f of [1.55,1.8,2.2,2])for(const z of [.42,.48,.5,.46]){
  const s={x:0,v:0};springStep(s,.1,f,z);assert(s.x>0&&s.x<.1);
  for(let i=0;i<120*8;i++)springStep(s,0,f,z);
  assert(Math.abs(s.x)<1e-6&&Math.abs(s.v)<1e-5);
}
let pitch=[];for(let t=0;t<8;t+=STEP)pitch.push(poseTarget('Typing',t,{roll:0,yaw:0,pitch:0},false,0,0).pitch);
assert(Math.max(...pitch)>22*Math.PI/180&&Math.min(...pitch)>21*Math.PI/180);
console.log(`PASS: ${samples} production mesh projections, neutral identity, no flips, damped return and typing cycle.`);
