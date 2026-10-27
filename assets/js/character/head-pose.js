const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
const rad=Math.PI/180;
// CPU projection into Pixi's built-in textured mesh; no custom GPU shader.
export function projectHead(x,y,yaw,pitch,depth=0){
  const cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
  const xx=x*cy+depth*sy,zz=-x*sy+depth*cy;
  const yy=y*cp+zz*sp,z=-y*sp+zz*cp;
  const scale=900/(900-z);
  // Preserve the exact neutral pose, including layer depths.
  const neutralScale=900/(900-depth);
  return {x:xx*scale/neutralScale,y:yy*scale/neutralScale};
}
export function poseTarget(action,t,manual,dragging,px,py){
  let yaw=manual.yaw,pitch=manual.pitch,roll=manual.roll;
  if(action==='Idle'){
    yaw+=Math.sin(t*.43)*2.1;pitch+=Math.sin(t*.61)*1.3;roll+=Math.sin(t*.65)*.6;
  }else if(action==='Look'){
    yaw+=(dragging?px:Math.sin(t*.65)*.8)*12;
    pitch+=(dragging?py:Math.sin(t*.41)*.5)*10;
    roll+=(dragging?px:Math.sin(t*.65))*.9;
  }else if(action==='Typing'){
    pitch+=22+Math.sin(t*3.4)*.8;
    yaw+=Math.sin(t*.8)*2.4;
    roll+=Math.sin(t*1.6)*.45;
  }
  return {yaw:clamp(yaw,-14,14)*rad,pitch:clamp(pitch,-10,26)*rad,roll:clamp(roll,-8,8)*rad};
}
