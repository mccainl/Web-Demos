import * as T from './assets/three.module.js';
import {OrbitControls} from './assets/OrbitControls.js';
import {COLOURS} from './catalogue.js?v=room72';

// Open acrylic profile in decimetres: 16.5 × 9 cm, with a connecting slit.
function profile(){
 const s=new T.Shape(),g=.017;
 s.moveTo(g,-.805);s.lineTo(.085,-.805);s.quadraticCurveTo(.43,-.805,.43,-.46);
 s.lineTo(.43,.46);s.quadraticCurveTo(.43,.805,.085,.805);s.lineTo(-.085,.805);
 s.quadraticCurveTo(-.43,.805,-.43,.46);s.lineTo(-.43,-.46);s.quadraticCurveTo(-.43,-.805,-.085,-.805);
 s.lineTo(-g,-.805);s.lineTo(-g,-.615);s.lineTo(-.035,-.615);s.quadraticCurveTo(-.26,-.615,-.26,-.39);
 s.lineTo(-.26,.39);s.quadraticCurveTo(-.26,.615,-.035,.615);s.lineTo(.035,.615);
 s.quadraticCurveTo(.26,.615,.26,.39);s.lineTo(.26,-.39);s.quadraticCurveTo(.26,-.615,.035,-.615);
 s.lineTo(g,-.615);s.closePath();return s;
}

export function createAtelier(canvas,state,onSelect){
 const renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=T.SRGBColorSpace;
 renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(32,1,.05,220),group=new T.Group();scene.add(group);
 const env=new T.Scene();env.background=new T.Color('#9a9287');
 function softbox(w,h,x,y,z,colour,intensity){
  const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:new T.Color(colour).multiplyScalar(intensity),side:T.DoubleSide}));
  m.position.set(x,y,z);m.lookAt(0,0,0);env.add(m);
 }
 for(let i=0;i<3;i++)softbox(1.2,9,4+i*.85,2,3,'#fff9ef',3.5);
 softbox(1,11,-4,2,5,'#ffffff',4);softbox(8,4,0,6,0,'#fffcf4',2.5);
 softbox(7,4,0,-5,3,'#b58b60',.65);softbox(3,9,-5,1,-3,'#343b39',.25);
 const pmrem=new T.PMREMGenerator(renderer),environment=pmrem.fromScene(env,.025);scene.environment=environment.texture;pmrem.dispose();
 const sweep=document.createElement('canvas');sweep.width=sweep.height=1024;
 const sc=sweep.getContext('2d'),gradient=sc.createLinearGradient(0,0,1024,1024);
 gradient.addColorStop(0,'#fff7e9');gradient.addColorStop(.5,'#e8d3b5');gradient.addColorStop(1,'#baa083');sc.fillStyle=gradient;sc.fillRect(0,0,1024,1024);
 const glow=sc.createRadialGradient(340,330,10,430,440,700);glow.addColorStop(0,'#fff9ed');glow.addColorStop(1,'#fff9ed00');sc.fillStyle=glow;sc.fillRect(0,0,1024,1024);
 const studioTexture=new T.CanvasTexture(sweep);studioTexture.colorSpace=T.SRGBColorSpace;scene.background=studioTexture;

 // The room is inside the render: acrylic transmits and refracts its photograph.
 const plateGeometry=new T.PlaneGeometry(1,1),plateMaterial=new T.MeshBasicMaterial({toneMapped:false,depthWrite:true});
 const plate=new T.Mesh(plateGeometry,plateMaterial);plate.visible=false;scene.add(plate);
 const shadow=new T.Mesh(plateGeometry,new T.ShadowMaterial({color:'#473b2b',opacity:.25}));shadow.receiveShadow=true;shadow.visible=false;scene.add(shadow);
 let roomTexture=null;
 new T.TextureLoader().load('assets/living-room-empty.jpg',texture=>{
  texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
  roomTexture=texture;plateMaterial.map=texture;plateMaterial.needsUpdate=true;canvas.dataset.roomReady='true';wake();
 },undefined,()=>{canvas.dataset.roomReady='false';});
 scene.add(new T.HemisphereLight('#fffbf2','#8b7560',.65));
 const key=new T.DirectionalLight('#fff2d8',2.8);key.position.set(7,8,8);key.castShadow=true;
 key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-17,right:17,top:17,bottom:-17,near:.1,far:70});
 key.shadow.bias=-.0004;key.shadow.normalBias=.018;key.shadow.radius=4;scene.add(key);scene.add(key.target);
 const fill=new T.DirectionalLight('#e9f4ff',.65);fill.position.set(-5,2,4);scene.add(fill);

 const geometry=new T.ExtrudeGeometry(profile(),{depth:.14,bevelEnabled:true,bevelSize:.02,bevelThickness:.035,bevelSegments:8,curveSegments:28});geometry.center();
 const materials=new Map();
 function material(link){
  const id=link.colour+':'+link.matte;if(materials.has(id))return materials.get(id);
  const c=COLOURS[link.colour],colour=new T.Color(c.css),clear=c.name==='Clear',black=c.name==='Black';
  const m=new T.MeshPhysicalMaterial({
   color:link.matte?colour.clone().lerp(new T.Color('#ffffff'),.18):new T.Color('#ffffff'),
   metalness:0,roughness:link.matte?.36:.055,transmission:black?.04:(link.matte?.52:.96),
   thickness:.21,ior:1.49,attenuationColor:colour,attenuationDistance:clear?3.2:(link.matte?.32:.19),
   clearcoat:link.matte?.12:1,clearcoatRoughness:link.matte?.3:.035,envMapIntensity:1.05,side:T.DoubleSide,specularIntensity:1
  });
  if(black)m.color.set(c.css);materials.set(id,m);return m;
 }
 const controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.1;
 controls.enablePan=false;controls.enableZoom=true;controls.rotateSpeed=.6;controls.zoomSpeed=.65;
 controls.minPolarAngle=.35;controls.maxPolarAngle=Math.PI-.35;controls.touches.ONE=T.TOUCH.ROTATE;controls.touches.TWO=T.TOUCH.DOLLY_PAN;
 let meshes=[],signature='',layout='',raf=0,visible=true,width=1,height=1;
 const ray=new T.Raycaster(),pointer=new T.Vector2(),forward=new T.Vector3(),right=new T.Vector3(),up=new T.Vector3();
 function roomFrame(){
  const inRoom=state.view==='room'&&roomTexture;plate.visible=shadow.visible=!!inRoom;
  if(!inRoom){scene.background=studioTexture;camera.clearViewOffset();return;}
  scene.background=new T.Color('#e8d5b9');
  const aspect=width/height,imageAspect=16/9;
  const cropW=Math.min(1,aspect/imageAspect),cropH=Math.min(1,imageAspect/aspect),cropX=(1-cropW)*.42,cropY=(1-cropH)*.2;
  roomTexture.repeat.set(cropW,cropH);roomTexture.offset.set(cropX,1-cropY-cropH);
  const anchor=T.MathUtils.clamp((.355-cropX)/cropW,.22,.43),offsetX=.5-anchor,offsetY=.075;
  camera.setViewOffset(width,height,width*offsetX,height*offsetY,width,height);
  camera.getWorldDirection(forward);
  const extent=meshes.reduce((n,m)=>Math.max(n,Math.abs(m.position.y*forward.y)),0);
  const distance=camera.position.distanceTo(controls.target)+extent+1.1,ph=2*Math.tan(T.MathUtils.degToRad(camera.fov/2))*distance,pw=ph*aspect;
  camera.getWorldDirection(forward);right.set(1,0,0).applyQuaternion(camera.quaternion);up.set(0,1,0).applyQuaternion(camera.quaternion);
  plate.position.copy(camera.position).addScaledVector(forward,distance).addScaledVector(right,pw*offsetX).addScaledVector(up,-ph*offsetY);
  plate.quaternion.copy(camera.quaternion);plate.scale.set(pw,ph,1);
  shadow.position.copy(plate.position).addScaledVector(forward,-.025);shadow.quaternion.copy(plate.quaternion);shadow.scale.copy(plate.scale);
 }
 function draw(){
  roomFrame();renderer.render(scene,camera);canvas.dataset.ready='true';canvas.dataset.renderer='webgl';canvas.dataset.scene=state.view;
  const chosen=meshes.find(m=>m.userData.linkIndex===state.selected),badge=document.getElementById('selected-marker');
  if(chosen&&badge){const p=chosen.localToWorld(new T.Vector3(.57,0,0)).project(camera);badge.style.left=((p.x+1)*50)+'%';badge.style.top=((1-p.y)*50)+'%';badge.textContent=String(state.selected+1).padStart(2,'0');badge.hidden=p.z>1||Math.abs(p.x)>1||Math.abs(p.y)>1;}
  canvas.dataset.revision=String(Number(canvas.dataset.revision||0)+1);
 }
 function tick(){raf=-1;if(!visible){raf=0;return;}const changed=controls.update();draw();raf=0;if(changed)raf=requestAnimationFrame(tick);}
 function wake(){if(!raf&&visible)raf=requestAnimationFrame(tick);}
 controls.addEventListener('change',()=>{if(!raf)wake();});
 function fit(){
  const box=new T.Box3().setFromObject(group),size=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3()),half=Math.tan(T.MathUtils.degToRad(camera.fov/2));
  const distance=Math.max(size.y/half,size.x/(half*camera.aspect))*(state.view==='room'?.72:.62);
  controls.target.copy(center);camera.position.copy(center).add(new T.Vector3(state.view==='room'?.025:.3,.035,1).normalize().multiplyScalar(Math.max(3,distance)));
  controls.minDistance=Math.max(1.4,distance*.15);controls.maxDistance=Math.max(8,distance*1.8);camera.updateProjectionMatrix();controls.update();controls.saveState();wake();
 }
 function resize(){const r=canvas.getBoundingClientRect();width=Math.max(1,r.width);height=Math.max(1,r.height);renderer.setSize(width,height,false);camera.aspect=width/height;fit();}
 function update(){
  const next=JSON.stringify(state.links),newLayout=state.view+':'+(state.view==='detail'?state.selected:state.links.length);
  if(next!==signature||newLayout!==layout){
   group.clear();meshes=[];
   const indices=state.view==='detail'?[state.selected,state.selected+1<state.links.length?state.selected+1:state.selected-1]:state.links.map((_,i)=>i);
   indices.forEach((index,j)=>{const mesh=new T.Mesh(geometry,material(state.links[index]));mesh.position.y=((indices.length-1)/2-j)*1.15;mesh.rotation.y=j%2?Math.PI/2-.12:.08;mesh.castShadow=true;mesh.receiveShadow=true;mesh.userData.linkIndex=index;group.add(mesh);meshes.push(mesh);});
   group.rotation.z=state.view==='detail'?-.13:0;
   if(newLayout!==layout){layout=newLayout;fit();}signature=next;
  }
  draw();
 }
 const activePointers=new Set();let down=null,multiTouch=false;
 canvas.addEventListener('pointerdown',e=>{activePointers.add(e.pointerId);if(activePointers.size>1)multiTouch=true;down={x:e.clientX,y:e.clientY,id:e.pointerId};canvas.classList.add('turning');});
 canvas.addEventListener('pointerup',e=>{
  activePointers.delete(e.pointerId);canvas.classList.remove('turning');
  const tap=down&&down.id===e.pointerId&&!multiTouch&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<7;
  down=null;if(!activePointers.size)multiTouch=false;if(!tap)return;
  const r=canvas.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,1-(e.clientY-r.top)/r.height*2);
  ray.setFromCamera(pointer,camera);const hit=ray.intersectObjects(meshes)[0];if(hit)onSelect(hit.object.userData.linkIndex);
 });
 canvas.addEventListener('pointercancel',e=>{activePointers.delete(e.pointerId);down=null;multiTouch=false;canvas.classList.remove('turning');});
 canvas.addEventListener('keydown',e=>{const angle=e.key==='ArrowLeft'?-.12:e.key==='ArrowRight'?.12:0;if(angle){e.preventDefault();const v=camera.position.clone().sub(controls.target).applyAxisAngle(new T.Vector3(0,1,0),angle);camera.position.copy(controls.target).add(v);controls.update();wake();}});
 new ResizeObserver(resize).observe(canvas.parentElement);new IntersectionObserver(es=>{visible=es[0].isIntersecting;if(visible)wake();},{rootMargin:'150px'}).observe(canvas);
 update();resize();
 return {update,reset:fit,zoom(factor){const v=camera.position.clone().sub(controls.target);v.setLength(T.MathUtils.clamp(v.length()*factor,controls.minDistance,controls.maxDistance));camera.position.copy(controls.target).add(v);controls.update();wake();},get rotation(){return camera.position.toArray();},project(index){const mesh=meshes.find(m=>m.userData.linkIndex===index);if(!mesh)return null;const p=mesh.localToWorld(new T.Vector3(.34,0,.12)).project(camera),r=canvas.getBoundingClientRect();return {x:r.x+(p.x+1)*r.width/2,y:r.y+(1-p.y)*r.height/2};}};
}

