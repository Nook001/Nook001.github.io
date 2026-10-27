// The whole widget is the interaction region; timing never cancels a hover.
export function attentionAction(pointerInside){return pointerInside?'Look':'Typing';}
export function pointerTarget(clientX,clientY,rect,padding=0){
  if(!rect.width||!rect.height)return {inside:false,x:0,y:0};
  const x=(clientX-rect.left)/rect.width*2-1,y=(clientY-rect.top)/rect.height*2-1;
  return {inside:clientX>=rect.left-padding&&clientX<=rect.left+rect.width+padding&&
    clientY>=rect.top-padding&&clientY<=rect.top+rect.height+padding,
    x:Math.min(1,Math.max(-1,x)),y:Math.min(1,Math.max(-1,y))};
}
export function renderScale(dpr){return Math.min(3,Math.max(2,Number(dpr)||1));}
