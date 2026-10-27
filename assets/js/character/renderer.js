// Carry the homepage build revision through the module graph, avoiding stale poses.
const revision=new URL(import.meta.url).searchParams.get('v')||'1';
const localModule=name=>import(new URL(`${name}?v=${encodeURIComponent(revision)}`,import.meta.url).href);
const [{springStep,clamp,STEP},{projectHead,poseTarget},{attentionAction,pointerTarget,renderScale}]=
  await Promise.all([localModule('./spring.js'),localModule('./head-pose.js'),localModule('./attention.js')]);

// Approved prototype rig, without its debug UI. All drawing stays transparent.
export async function createCharacter(host,{assetBase,maxFPS=30,onBubble=()=>{}}){
  const P=window.PIXI;
  const response=await fetch(new URL('rig.json',assetBase));
  if(!response.ok)throw Error('Character rig unavailable');
  const rig=await response.json();
  const sheet=await P.Assets.load(new URL('atlas.json',assetBase).href);
  const app=new P.Application();
  const layers=[],springs=[];
  let destroyed=false;
  try{
    await app.init({backgroundAlpha:0,antialias:true,autoStart:false,sharedTicker:false,
      preference:'webgl',resolution:renderScale(devicePixelRatio),autoDensity:true});
    app.ticker.maxFPS=maxFPS;
    app.canvas.setAttribute('aria-hidden','true');host.appendChild(app.canvas);
    const root=new P.Container(),model=new P.Container(),body=new P.Container();
    app.stage.addChild(root);root.addChild(model);
    const state={time:0,accumulator:0,head:0,yaw:0,pitch:0,frames:0,action:'Typing',
      pointerKnown:false,px:0,py:0,nextBlink:2.8,blinkEnd:0,nextClick:1.5,bubbleEnd:0};
    function sprite(name,parent,x,y,width,height){
      const s=new P.Sprite(sheet.textures[name]);s.anchor.set(0);s.position.set(x,y);
      if(width!==undefined){s.width=width;s.height=height;}parent.addChild(s);return s;
    }
    function part(name,parent){
      const p=rig.parts[name],s=sprite(name,parent,p.x,p.y,p.width,p.height);
      if(p.scale)s.scale.set(p.scale);return s;
    }
    function hair(group,parent){
      const base=rig.parts['hair_'+group];
      for(const spec of rig.springs.filter(s=>s.base==='hair_'+group)){
        const joint=new P.Container();joint.position.set(base.x+spec.pivot[0],base.y+spec.pivot[1]);
        parent.addChild(joint);sprite(spec.part,joint,-spec.pivot[0],-spec.pivot[1]);
        springs.push({...spec,joint,x:0,v:0});
      }
      sprite('hair_'+group+'_crown',parent,base.x,base.y);
    }
    function layer(content,depth){
      const capture=new P.Container();content.position.set(256,290);capture.addChild(content);
      const texture=P.RenderTexture.create({width:512,height:512,resolution:2});
      const mesh=new P.MeshPlane({texture,verticesX:9,verticesY:9});mesh.autoResize=false;
      const buffer=mesh.geometry.getAttribute('aPosition').buffer;
      layers.push({capture,texture,mesh,buffer,original:buffer.data.slice(),depth});model.addChild(mesh);
    }
    const rear=new P.Container();hair('back',rear);layer(rear,-14);
    model.addChild(body);part('outfit_with_arms',body);
    const faceLayer=new P.Container(),face=part('face_open',faceLayer);
    part('glasses',faceLayer);layer(faceLayer,24);
    const front=new P.Container();hair('front',front);part('headband',front);layer(front,0);
    const props=new P.Container();root.addChild(props);
    for(const p of rig.props)sprite(p.part,props,p.x,p.y,p.width,p.height);
    function drawPose(){
      face.texture=sheet.textures[state.time<state.blinkEnd?'face_closed':'face_open'];
      face.width=206;face.height=190;
      model.y=270+Math.sin(state.time*1.8)*.7+(state.action==='Typing'?Math.sin(state.time*12)*.45:0);
      body.rotation=state.action==='Typing'?Math.sin(state.time*7)*.0015:0;
      body.scale.y=state.action==='Typing'?.993:1;
      for(const l of layers){
        app.renderer.render({container:l.capture,target:l.texture,clear:true});
        for(let i=0;i<l.original.length;i+=2){
          const p=projectHead(l.original[i]-256,l.original[i+1]-290,state.yaw,state.pitch,l.depth);
          l.buffer.data[i]=p.x;l.buffer.data[i+1]=p.y;
        }
        l.buffer.update();l.mesh.rotation=state.head;
      }
      onBubble(state.action==='Typing'&&state.time<state.bubbleEnd);
    }
    function tick(ticker){
      state.accumulator+=Math.min(ticker.deltaMS/1000,.05);
      while(state.accumulator>=STEP){
        state.accumulator-=STEP;state.time+=STEP;
        state.action=attentionAction(state.pointerKnown);
        const target=poseTarget(state.action,state.time,{yaw:0,pitch:0,roll:0},state.action==='Look',state.px,state.py);
        state.head+=(target.roll-state.head)*(1-Math.exp(-STEP*9));
        state.yaw+=(target.yaw-state.yaw)*(1-Math.exp(-STEP*7));
        state.pitch+=(target.pitch-state.pitch)*(1-Math.exp(-STEP*6));
        for(const s of springs){
          const drive=state.head+state.yaw*.25+state.pitch*(s.name.endsWith('left')?.12:-.12);
          springStep(s,drive,s.frequency,s.dampingRatio);
          s.joint.rotation=clamp((s.x-drive)*s.inertia,-.045,.045);
        }
        if(state.time>=state.nextBlink){state.blinkEnd=state.time+.14;state.nextBlink=state.time+3.2+Math.random()*1.8;}
        if(state.time>=state.nextClick){state.bubbleEnd=state.time+.3;state.nextClick=state.time+3+Math.random()*2;}
      }
      drawPose();state.frames++;
    }
    function resize(){
      if(destroyed)return;
      const w=host.clientWidth,h=host.clientHeight;
      if(!w||!h)return;
      app.renderer.resize(w,h);const scale=Math.min(w/680,h/570);
      root.scale.set(scale);root.position.set(w/2,h/2-270*scale);app.render();
    }
    app.ticker.add(tick);drawPose();resize();
    return {
      play(){if(!destroyed){state.accumulator=0;app.start();}},
      pause(){if(!destroyed){state.accumulator=0;app.stop();onBubble(false);}},
      lookAt(clientX,clientY){const p=pointerTarget(clientX,clientY,host.getBoundingClientRect(),48);
        state.pointerKnown=p.inside;state.px=p.x;state.py=p.y;},
      clearLook(){state.pointerKnown=false;},resize,
      getState(){return Object.freeze({running:app.ticker.started,frames:state.frames,action:state.action,
        yaw:state.yaw,pitch:state.pitch,time:state.time,meshLayers:layers.length,pointerKnown:state.pointerKnown,
        pointer:[state.px,state.py],
        resolution:app.renderer.resolution,headTexturePixels:512*2});},
      destroy(){if(destroyed)return;destroyed=true;app.stop();onBubble(false);
        for(const l of layers){l.capture.destroy({children:true});l.texture.destroy(true);}
        app.destroy(true,{children:true,texture:false,textureSource:false});}
    };
  }catch(error){
    for(const l of layers){l.capture.destroy({children:true});l.texture.destroy(true);}
    if(app.renderer)app.destroy(true,{children:true,texture:false,textureSource:false});
    throw error;
  }
}
