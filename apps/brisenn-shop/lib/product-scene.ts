import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {colours,HOME,Product,Variant,ModelLink} from './catalogue';
export type SceneControls={dispose:()=>void;reset:()=>void;zoom:(factor:number)=>void;spin:(enabled:boolean)=>void};

function linkProfile(){
 const s=new T.Shape(),g=.018;
 s.moveTo(g,-.78);s.lineTo(.085,-.78);s.quadraticCurveTo(.405,-.78,.405,-.46);
 s.lineTo(.405,.46);s.quadraticCurveTo(.405,.78,.085,.78);s.lineTo(-.085,.78);
 s.quadraticCurveTo(-.405,.78,-.405,.46);s.lineTo(-.405,-.46);s.quadraticCurveTo(-.405,-.78,-.085,-.78);
 s.lineTo(-g,-.78);s.lineTo(-g,-.64);s.lineTo(-.035,-.64);s.quadraticCurveTo(-.285,-.64,-.285,-.39);
 s.lineTo(-.285,.39);s.quadraticCurveTo(-.285,.64,-.035,.64);s.lineTo(.035,.64);
 s.quadraticCurveTo(.285,.64,.285,.39);s.lineTo(.285,-.39);s.quadraticCurveTo(.285,-.64,.035,-.64);
 s.lineTo(g,-.64);s.closePath();return s;
}
function plaster(){
 const c=document.createElement('canvas');c.width=c.height=1024;const ctx=c.getContext('2d')!;
 const gradient=ctx.createLinearGradient(0,0,1024,900);gradient.addColorStop(0,'#e1d1ba');gradient.addColorStop(.45,'#f3e7d4');gradient.addColorStop(1,'#cbb395');ctx.fillStyle=gradient;ctx.fillRect(0,0,1024,1024);
 let seed=17;for(let i=0;i<65000;i++){seed=(seed*16807)%2147483647;const x=seed%1024;seed=(seed*16807)%2147483647;const y=seed%1024;ctx.fillStyle=i%2?'#fff9ef0a':'#66503b07';ctx.fillRect(x,y,1.5,1.5)}
 const glow=ctx.createRadialGradient(390,310,10,390,310,730);glow.addColorStop(0,'#fffaf22a');glow.addColorStop(1,'#66503b0a');ctx.fillStyle=glow;ctx.fillRect(0,0,1024,1024);
 const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;return texture;
}
export function createProductScene(canvas:HTMLCanvasElement,product:Product,variant:Variant,room:boolean,onReady:()=>void):SceneControls{
 const renderer=new T.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.98;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(30,1,.05,250),object=new T.Group();scene.add(object);
 const environmentScene=new T.Scene();environmentScene.background=new T.Color('#8b8172');
 const extraGeometries:T.BufferGeometry[]=[],extraMaterials:T.Material[]=[];
 function softbox(w:number,h:number,x:number,y:number,z:number,color:string,intensity:number){const geometry=new T.PlaneGeometry(w,h),material=new T.MeshBasicMaterial({color:new T.Color(color).multiplyScalar(intensity),side:T.DoubleSide});const mesh=new T.Mesh(geometry,material);mesh.position.set(x,y,z);mesh.lookAt(0,0,0);environmentScene.add(mesh);extraGeometries.push(geometry);extraMaterials.push(material)}
 softbox(2.4,12,-4,2,5,'#ffffff',4.8);softbox(.8,11,-1,1,7,'#fffaf0',3.1);
 for(let i=0;i<3;i++)softbox(1.3,10,4+i,3,3,'#fff4df',3.5);
 softbox(3.4,5,1,0,10,'#ffffff',2.2);softbox(8,3,0,7,0,'#ffffff',2.7);softbox(5,8,-6,0,-4,'#1b292a',.3);softbox(8,4,0,-6,0,'#b7a086',.4);
 const pmrem=new T.PMREMGenerator(renderer),environment=pmrem.fromScene(environmentScene,.025);scene.environment=environment.texture;pmrem.dispose();
 const wallTexture=plaster();scene.background=wallTexture;
 const wallGeometry=new T.PlaneGeometry(1,1),wallMaterial=new T.MeshBasicMaterial({map:wallTexture,toneMapped:false});const wall=new T.Mesh(wallGeometry,wallMaterial);scene.add(wall);
 const shadowMaterial=new T.ShadowMaterial({color:'#5c432b',opacity:.13}),shadow=new T.Mesh(wallGeometry,shadowMaterial);shadow.receiveShadow=true;scene.add(shadow);
 let roomTexture:T.Texture|null=null,disposed=false;
 new T.TextureLoader().load(HOME+'assets/living-room-empty.jpg',t=>{if(disposed){t.dispose();return}t.colorSpace=T.SRGBColorSpace;roomTexture=t;wallMaterial.map=t;wallMaterial.needsUpdate=true;canvas.dataset.room='ready';canvas.dataset.backdrop='ready';wake()},undefined,()=>{canvas.dataset.room='unavailable'});
 scene.add(new T.HemisphereLight('#fff9ef','#8c7960',.65));const key=new T.DirectionalLight('#fff3dc',2.5);key.position.set(8,10,10);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-28,right:28,top:30,bottom:-30,near:.1,far:90});key.shadow.bias=-.0003;key.shadow.normalBias=.015;key.shadow.radius=4;scene.add(key);
 const fill=new T.DirectionalLight('#ebf3f5',.7);fill.position.set(-6,3,6);scene.add(fill);
 const geometry=new T.ExtrudeGeometry(linkProfile(),{depth:.08,bevelEnabled:true,bevelSize:.045,bevelThickness:.06,bevelSegments:8,curveSegments:28});geometry.center();
 const mats=new Map<string,T.MeshPhysicalMaterial>();
 function acrylic(colour:number,matte:boolean){
  const id=colour+':'+matte;if(mats.has(id))return mats.get(id)!;const c=new T.Color(colours[colour]?.css||'#e7e4d6'),clear=colours[colour]?.name==='Clear',black=colours[colour]?.name==='Black';
  const mat=new T.MeshPhysicalMaterial({color:matte||black?c:0xffffff,metalness:0,roughness:matte?.32:.022,transmission:black?.035:matte?.58:1,thickness:.22,ior:1.49,attenuationColor:c,attenuationDistance:clear?4:matte?.32:.095,clearcoat:matte?.05:.2,clearcoatRoughness:matte?.3:.02,envMapIntensity:.8,specularIntensity:1});mats.set(id,mat);return mat;
 }
 function addLink(l:ModelLink,x:number,y:number,z:number,index:number){const m=new T.Mesh(geometry,acrylic(l.colour,l.matte));m.position.set(x,y,z);m.rotation.y=index%2?Math.PI/2-.1:.07;m.castShadow=true;m.receiveShadow=true;object.add(m);return m}
 function roundedCylinder(radius:number,height:number,bevel:number){return new T.LatheGeometry([new T.Vector2(0,-height/2),new T.Vector2(radius-bevel,-height/2),new T.Vector2(radius,-height/2+bevel),new T.Vector2(radius,height/2-bevel),new T.Vector2(radius-bevel,height/2),new T.Vector2(0,height/2)],96)}
 function addMesh(g:T.BufferGeometry,m:T.Material,x=0,y=0,z=0){const mesh=new T.Mesh(g,m);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;object.add(mesh);extraGeometries.push(g);return mesh}
 if(product.kind==='wall'||product.kind==='ceiling'){
  const gold=product.name.includes('Gold'),black=product.name.includes('Black');const material=new T.MeshStandardMaterial({color:gold?'#cba04e':black?'#171c1b':product.name.includes('White')?'#f3f0e9':'#c4c9ca',metalness:product.name.includes('White')?.1:1,roughness:gold?.24:black?.32:.2,envMapIntensity:1.3});extraMaterials.push(material);
  if(product.kind==='wall'){
   const base=addMesh(roundedCylinder(.38,.07,.012),material,0,0,-.53);base.rotation.x=Math.PI/2;
   const stem=addMesh(roundedCylinder(.135,1.12,.008),material,0,0,.03);stem.rotation.x=Math.PI/2;
   const cap=addMesh(roundedCylinder(.24,.06,.012),material,0,0,.6);cap.rotation.x=Math.PI/2;object.rotation.y=-.65;object.rotation.x=.22;
  }else{
   addMesh(roundedCylinder(.58,.04,.008),material,0,.8,0);
   const path=new T.CatmullRomCurve3([new T.Vector3(0,.8,0),new T.Vector3(0,.2,0),new T.Vector3(.15,.05,0),new T.Vector3(.34,-.2,0),new T.Vector3(.28,-.52,0),new T.Vector3(0,-.66,0),new T.Vector3(-.3,-.5,0),new T.Vector3(-.36,-.26,0)]);
   addMesh(new T.TubeGeometry(path,80,.034,12,false),material);
   const holes=new T.MeshStandardMaterial({color:'#665136',metalness:1,roughness:.28});extraMaterials.push(holes);for(let i=0;i<3;i++){const a=i*Math.PI*2/3;addMesh(new T.CylinderGeometry(.035,.035,.043,20),holes,Math.cos(a)*.44,.8,Math.sin(a)*.44)}
  }
 }else if(product.kind==='hook'){
  const name=variant.name.replace(' - Matte',''),index=Math.max(0,colours.findIndex(c=>c.name===name)),matte=variant.name.endsWith(' - Matte');
  const curve=new T.CatmullRomCurve3([new T.Vector3(0,.4,-.3),new T.Vector3(0,.4,.05),new T.Vector3(0,.25,.29),new T.Vector3(0,-.2,.29),new T.Vector3(0,-.36,.08),new T.Vector3(0,-.36,-.3)]);
  addMesh(new T.TubeGeometry(curve,80,.105,20,false),acrylic(index,matte));const screwMat=new T.MeshStandardMaterial({color:'#44413a',metalness:.9,roughness:.3});extraMaterials.push(screwMat);for(const y of [.4,-.36]){const a=addMesh(new T.CylinderGeometry(.035,.035,.01,20),screwMat,0,y,.1);a.rotation.x=Math.PI/2;}object.rotation.y=-.6;
 }else{
  const links=product.modelLinks;
  if(product.rows===5){const rows=Math.ceil(links.length/5);links.forEach((l,i)=>addLink(l,(i%5-2)*1.82,((rows-1)/2-Math.floor(i/5))*1.15,0,Math.floor(i/5)));}
  else if(product.rows===2){const left=Math.round(links.length*.57);links.forEach((l,i)=>{const r=i<left?i:i-left;addLink(l,i<left?-1.1:1.1,(left-1)/2*1.15-r*1.15,0,r)});}
  else if(product.category==='Floor to ceiling'&&room){const hanging=Math.min(24,links.length);links.forEach((l,i)=>{if(i<hanging)addLink(l,0,((hanging-1)/2-i)*1.15,0,i);else{const tail=i-hanging,mesh=addLink(l,.5+tail*.68,-(hanging-1)/2*1.15-.5,tail*.24, i);mesh.rotation.z=Math.PI/2;mesh.rotation.x=.3;}});}
  else links.forEach((l,i)=>addLink(l,0,((links.length-1)/2-i)*1.15,0,i));
  if(product.kind==='link'){object.rotation.set(.09,-.3,-.13);}
 }
 const controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.12;controls.enablePan=false;controls.rotateSpeed=.55;controls.zoomSpeed=.65;controls.autoRotateSpeed=.6;controls.touches.ONE=T.TOUCH.ROTATE;controls.touches.TWO=T.TOUCH.DOLLY_PAN;
 const box=new T.Box3().setFromObject(object),size=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3());
 const shadowSpan=Math.max(size.length()*.8,3);Object.assign(key.shadow.camera,{left:-shadowSpan,right:shadowSpan,top:shadowSpan,bottom:-shadowSpan});key.shadow.camera.updateProjectionMatrix();
 let frame=0,visible=true,spinning=false,ready=false,width=1,height=1;
 const direction=new T.Vector3(),right=new T.Vector3(),up=new T.Vector3();
 function wallFrame(){
  const inRoom=room&&roomTexture;const aspect=width/height;let offset=0;
  if(inRoom){const cropW=Math.min(1,aspect/(16/9)),cropH=Math.min(1,(16/9)/aspect),cropX=(1-cropW)*.42;roomTexture!.repeat.set(cropW,cropH);roomTexture!.offset.set(cropX,(1-cropH)*.8);offset=.5-T.MathUtils.clamp((.355-cropX)/cropW,.2,.43);camera.setViewOffset(width,height,width*offset,height*.04,width,height);}else {camera.clearViewOffset();if(roomTexture){const cropH=.62,cropW=Math.min(.65,cropH*aspect/(16/9));roomTexture.repeat.set(cropW,cropH);roomTexture.offset.set(.42-cropW/2,.24)}};
  camera.getWorldDirection(direction);right.set(1,0,0).applyQuaternion(camera.quaternion);up.set(0,1,0).applyQuaternion(camera.quaternion);
  const distance=camera.position.distanceTo(controls.target)+Math.abs(size.y*direction.y)/2+Math.abs(size.x*direction.x)/2+1.1;
  const ph=2*Math.tan(T.MathUtils.degToRad(camera.fov/2))*distance,pw=ph*aspect;
  wall.position.copy(camera.position).addScaledVector(direction,distance).addScaledVector(right,pw*offset).addScaledVector(up,inRoom?-ph*.04:0);wall.quaternion.copy(camera.quaternion);wall.scale.set(pw,ph,1);
  shadow.position.copy(wall.position).addScaledVector(direction,-.03);shadow.quaternion.copy(wall.quaternion);shadow.scale.copy(wall.scale);
 }
 function draw(){if(disposed)return;wallFrame();renderer.render(scene,camera);canvas.dataset.ready='true';canvas.dataset.kind=product.kind;canvas.dataset.links=String(product.modelLinks.length);canvas.dataset.rotation=camera.position.toArray().map(n=>n.toFixed(3)).join(',');canvas.dataset.revision=String(Number(canvas.dataset.revision||0)+1);canvas.dataset.apparentHeight=String(size.y/(2*Math.tan(T.MathUtils.degToRad(camera.fov/2))*camera.position.distanceTo(controls.target)));if(!ready){ready=true;onReady()}}
 function tick(){frame=-1;if(disposed||!visible){frame=0;return}const changed=controls.update();draw();frame=0;if(changed||spinning)frame=requestAnimationFrame(tick)}
 function wake(){if(!frame&&visible&&!disposed)frame=requestAnimationFrame(tick)}
 controls.addEventListener('change',wake);
 function fit(){const half=Math.tan(T.MathUtils.degToRad(camera.fov/2)),distance=Math.max(Math.max(size.y/half,size.x/(half*camera.aspect),size.z/half)*(room?.7:.68),room?31/(2*half):0);controls.target.copy(center);camera.position.copy(center).add(new T.Vector3(room?.02:.3,.035,1).normalize().multiplyScalar(Math.max(3,distance)));controls.minDistance=Math.max(.9,distance*.12);controls.maxDistance=Math.max(8,distance*1.8);controls.update();wake()}
 function resize(){const r=canvas.getBoundingClientRect();width=Math.max(1,r.width);height=Math.max(1,r.height);renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();fit()}
 const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(canvas);const observer=new IntersectionObserver(es=>{visible=es[0].isIntersecting;if(visible)wake()},{rootMargin:'100px'});observer.observe(canvas);
 const keydown=(e:KeyboardEvent)=>{const a=e.key==='ArrowLeft'?-.14:e.key==='ArrowRight'?.14:0;if(a){e.preventDefault();camera.position.sub(controls.target).applyAxisAngle(new T.Vector3(0,1,0),a).add(controls.target);controls.update();wake()}};canvas.addEventListener('keydown',keydown);
 resize();
 return {reset:fit,zoom(factor){const vector=camera.position.clone().sub(controls.target);vector.setLength(T.MathUtils.clamp(vector.length()*factor,controls.minDistance,controls.maxDistance));camera.position.copy(controls.target).add(vector);controls.update();wake()},spin(enabled){spinning=enabled;controls.autoRotate=enabled;wake()},dispose(){disposed=true;if(frame>0)cancelAnimationFrame(frame);resizeObserver.disconnect();observer.disconnect();canvas.removeEventListener('keydown',keydown);controls.dispose();geometry.dispose();wallGeometry.dispose();wallMaterial.dispose();shadowMaterial.dispose();wallTexture.dispose();roomTexture?.dispose();environment.dispose();mats.forEach(m=>m.dispose());extraGeometries.forEach(g=>g.dispose());extraMaterials.forEach(m=>m.dispose());renderer.dispose()}};
}
