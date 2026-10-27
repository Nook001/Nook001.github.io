// Mass-normalized damped spring, semi-implicit Euler at a fixed 1/120 s.
export const STEP=1/120;
export function springStep(s,target,frequency,dampingRatio,dt=STEP){
  const omega=2*Math.PI*frequency;
  s.v+=(omega*omega*(target-s.x)-2*dampingRatio*omega*s.v)*dt;
  s.x+=s.v*dt;
  return s;
}
export function clamp(value,min,max){return Math.min(max,Math.max(min,value));}
