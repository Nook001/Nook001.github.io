// Homepage-only progressive enhancement. No Pixi/atlas request on mobile or RM.
const host=document.querySelector('[data-sidebar-character]');
if(host){
  const desktop=matchMedia('(min-width:901px)'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const bubble=host.querySelector('[data-character-bubble]');
  const profile=host.closest('.profile-sidebar'),contacts=profile.querySelector('.contact-links');
  const footer=document.querySelector('.site-footer');
  let engine=null,loading=false,failed=false,inView=false,printing=false;
  let pointer=null;
  const eligible=()=>desktop.matches&&!reduced.matches&&!document.hidden&&inView&&!printing;
  function state(){
    const active=eligible()&&engine&&!failed;
    host.dataset.characterReady=String(Boolean(active));
    bubble.hidden=true;
    if(active){engine.play();host.dataset.characterState='playing';}
    else{engine?.pause();host.dataset.characterState=failed?'unavailable':'inactive';}
  }
  async function load(){
    if(engine||loading||failed||!eligible())return;
    loading=true;
    try{
      if(!window.PIXI)await new Promise((resolve,reject)=>{
        const script=document.createElement('script');script.src=new URL('../vendor/pixi-8.22.0.min.js',import.meta.url).href;
        script.async=true;script.onload=resolve;script.onerror=()=>reject(Error('Character runtime unavailable'));document.head.appendChild(script);
      });
      // Download may finish after a resize/background transition; postpone GPU setup.
      if(!eligible())return;
      const rendererURL=new URL('./character/renderer.js',import.meta.url);
      rendererURL.search=new URL(import.meta.url).search;
      const {createCharacter}=await import(rendererURL.href);
      if(!eligible())return;
      engine=await createCharacter(host,{assetBase:new URL('../character/',import.meta.url),maxFPS:30,
        onBubble:visible=>{bubble.hidden=!visible||!eligible();}});
      updatePointer();
      host.querySelector('canvas').addEventListener('webglcontextlost',()=>{failed=true;state();},{once:true});
      state();
    }catch(error){failed=true;engine?.destroy();engine=null;state();console.warn('Character unavailable:',error.message);}
    finally{loading=false;}
  }
  function positionWidget(){
    if(!desktop.matches){delete host.dataset.characterDocked;return;}
    const r=profile.getBoundingClientRect(),style=getComputedStyle(profile);
    const width=profile.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight);
    const footerTop=footer?.getBoundingClientRect().top??innerHeight;
    const bottom=Math.max(48,innerHeight-footerTop+48),height=width*570/680;
    const fits=profile.scrollTop<1&&innerHeight-bottom-height>=contacts.getBoundingClientRect().bottom+28;
    if(fits){
      host.style.setProperty('--character-left',`${r.left+parseFloat(style.paddingLeft)}px`);
      host.style.setProperty('--character-width',`${width}px`);
      host.style.setProperty('--character-bottom',`${bottom}px`);
      host.dataset.characterDocked='true';
    }else delete host.dataset.characterDocked;
  }
  function update(){positionWidget();state();void load();}
  Object.defineProperty(host,'characterState',{get:()=>({mode:host.dataset.characterState,
    reduced:reduced.matches,desktop:desktop.matches,inView,loading,failed,...engine?.getState()}),configurable:true});
  function updatePointer(){
    if(!engine)return;
    if(!pointer){engine.clearLook();return;}
    engine.lookAt(pointer.x,pointer.y);
  }
  function observePointer(event){
    if(event.pointerType==='touch')return;
    pointer={x:event.clientX,y:event.clientY};updatePointer();
  }
  // Geometry-only 48px halo: no larger element, overlay or intercepted clicks.
  document.addEventListener('pointermove',observePointer);
  document.documentElement.addEventListener('pointerleave',()=>{pointer=null;updatePointer();});
  document.addEventListener('pointercancel',()=>{pointer=null;updatePointer();});
  window.addEventListener('blur',()=>{pointer=null;updatePointer();});
  window.addEventListener('scroll',()=>{positionWidget();updatePointer();},{passive:true,capture:true});
  window.addEventListener('resize',()=>{positionWidget();engine?.resize();updatePointer();});
  desktop.addEventListener('change',update);reduced.addEventListener('change',update);
  document.addEventListener('visibilitychange',update);
  window.addEventListener('pagehide',()=>engine?.pause());
  window.addEventListener('pageshow',update);
  window.addEventListener('beforeprint',()=>{printing=true;update();});
  window.addEventListener('afterprint',()=>{printing=false;update();});
  const resize=new ResizeObserver(()=>{positionWidget();engine?.resize();updatePointer();});
  resize.observe(host);resize.observe(profile);
  const visibility=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;update();},{threshold:.05});visibility.observe(host);
  update();
}
