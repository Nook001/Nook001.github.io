// Animation time, not wall time: offscreen/background time never advances a glance.
export function createAttention(random=Math.random){
  return {nextAt:6+random()*2,until:0,glances:0};
}
export function attentionAction(state,time,pointerKnown,random=Math.random){
  if(state.until){
    if(pointerKnown&&time<state.until)return 'Look';
    state.until=0;state.nextAt=time+12+random()*6;
    return 'Typing';
  }
  if(time>=state.nextAt){
    if(pointerKnown){state.until=time+2.4;state.glances++;return 'Look';}
    state.nextAt=time+3;
  }
  return 'Typing';
}
export function renderScale(dpr){return Math.min(3,Math.max(2,Number(dpr)||1));}
