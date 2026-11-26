"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createProductModel, disposeModel, type ProductModelId } from "./three/product-models";
import { createRoadEnvironment } from "./three/road-environment";

export type ViewAction = "front" | "side" | "back" | "reset" | "zoom-in" | "zoom-out";
export type ViewCommand = { action: ViewAction; sequence: number };
type Props = {product:ProductModelId;label:string;fallbackImage:string;autoRotate:boolean;command:ViewCommand;onInteraction:()=>void};
type Runtime = {
  scene:THREE.Scene;camera:THREE.OrthographicCamera;renderer:THREE.WebGLRenderer;controls:OrbitControls;
  model:THREE.Group|null;resize:()=>void;invalidate:()=>void;setView:(action:ViewAction)=>void;autoRotate:boolean;
};

export default function Product3DScene({product,label,fallbackImage,autoRotate,command,onInteraction}:Props){
  const hostRef=useRef<HTMLDivElement>(null),runtimeRef=useRef<Runtime|null>(null),interactionRef=useRef(onInteraction);
  interactionRef.current=onInteraction;
  const [failed,setFailed]=useState(false),[ready,setReady]=useState(false);
  useEffect(()=>{
    const host=hostRef.current;if(!host)return;
    let cleanup:(()=>void)|undefined,renderer:THREE.WebGLRenderer|undefined;
    try{
      const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-5,5,5,-5,.1,60);
      scene.background=new THREE.Color(0xb9c8cd);scene.fog=new THREE.Fog(0xb9c8cd,24,56);
      renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:"low-power"});
      const surface=renderer.domElement;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.7));
      renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;
      renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;
      renderer.setClearColor(0x000000,0);surface.tabIndex=0;surface.setAttribute("role","img");host.appendChild(surface);
      scene.add(new THREE.HemisphereLight(0xffffff,0xa6b3bc,1.6));
      const key=new THREE.DirectionalLight(0xfff5e8,2.4);key.position.set(-4,9,7);key.castShadow=true;
      key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-6;key.shadow.camera.right=6;key.shadow.camera.top=9;key.shadow.camera.bottom=-3;key.shadow.normalBias=.025;scene.add(key);
      const rim=new THREE.DirectionalLight(0xd6e8ff,1.8);rim.position.set(4,5,-5);scene.add(rim);
      scene.add(createRoadEnvironment());
      const controls=new OrbitControls(camera,surface);
      controls.enablePan=false;controls.enableDamping=true;controls.dampingFactor=.10;controls.minZoom=.65;controls.maxZoom=2.4;
      controls.minPolarAngle=.25;controls.maxPolarAngle=Math.PI*.50;controls.rotateSpeed=.65;controls.zoomSpeed=.7;controls.autoRotateSpeed=.65;
      // Keep wheel scrolling available for the page. Pinch and explicit ± controls zoom.
      const passWheel=(event:WheelEvent)=>event.stopImmediatePropagation();
      surface.addEventListener("wheel",passWheel,{capture:true,passive:true});
      let frame=0,visible=false,dirty=true,lastTime=0,alive=true;
      const animate=(time:number)=>{
        frame=0;if(!alive||!visible||document.hidden)return;
        const delta=Math.min((time-lastTime)/1000,.05);lastTime=time;controls.autoRotate=runtime.autoRotate;
        const changed=controls.update(delta);
        if(dirty||changed){renderer!.render(scene,camera);dirty=false;surface.dataset.azimuth=controls.getAzimuthalAngle().toFixed(3);surface.dataset.zoom=camera.zoom.toFixed(2);}
        if(!frame)frame=requestAnimationFrame(animate);
      };
      const invalidate=()=>{dirty=true;if(!frame&&visible&&!document.hidden)frame=requestAnimationFrame(animate);};
      const setView=(action:ViewAction)=>{
        if(action==="zoom-in"||action==="zoom-out"){
          camera.zoom=THREE.MathUtils.clamp(camera.zoom*(action==="zoom-in"?1.18:1/1.18),.65,2.4);camera.updateProjectionMatrix();
        }else{
          camera.zoom=1;camera.updateProjectionMatrix();
          const offset=action==="front"?[0,3,14]:action==="side"?[14,3,0]:action==="back"?[0,3,-14]:[7,4.1,13];
          camera.position.copy(controls.target).add(new THREE.Vector3(...offset));camera.lookAt(controls.target);
        }
        controls.update();invalidate();
      };
      const resize=()=>{
        const width=Math.max(host.clientWidth,1),height=Math.max(host.clientHeight,1),aspect=width/height;
        const bounds=runtime.model?new THREE.Box3().setFromObject(runtime.model).getSize(new THREE.Vector3()):new THREE.Vector3(5.9,3.9,2.4);
        const halfHeight=Math.max(bounds.y*1.28,Math.hypot(bounds.x,bounds.z)/aspect*1.24)/2;
        camera.left=-halfHeight*aspect;camera.right=halfHeight*aspect;camera.top=halfHeight;camera.bottom=-halfHeight;
        camera.updateProjectionMatrix();renderer!.setSize(width,height,false);invalidate();
      };
      const runtime:Runtime={scene,camera,renderer,controls,model:null,resize,invalidate,setView,autoRotate:false};runtimeRef.current=runtime;
      const interaction=()=>{runtime.autoRotate=false;interactionRef.current();invalidate();};
      controls.addEventListener("start",interaction);controls.addEventListener("change",invalidate);
      const onKey=(event:KeyboardEvent)=>{
        if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","+","-","Home"].includes(event.key))return;
        event.preventDefault();interaction();
        if(event.key==="+"||event.key==="-"){setView(event.key==="+"?"zoom-in":"zoom-out");return;}
        if(event.key==="Home"){setView("reset");return;}
        const s=new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
        if(event.key==="ArrowLeft")s.theta-=.18;if(event.key==="ArrowRight")s.theta+=.18;
        if(event.key==="ArrowUp")s.phi=Math.max(.25,s.phi-.12);if(event.key==="ArrowDown")s.phi=Math.min(Math.PI*.50,s.phi+.12);
        camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(s));controls.update();invalidate();
      };
      surface.addEventListener("keydown",onKey);
      const onContextLost=(event:Event)=>{event.preventDefault();setFailed(true);};surface.addEventListener("webglcontextlost",onContextLost);
      const observer=new ResizeObserver(resize);observer.observe(host);
      const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)invalidate();else{cancelAnimationFrame(frame);frame=0;}},{rootMargin:"60px"});intersection.observe(host);
      const onVisibility=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else invalidate();};document.addEventListener("visibilitychange",onVisibility);
      resize();setReady(true);
      cleanup=()=>{
        alive=false;cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();document.removeEventListener("visibilitychange",onVisibility);
        controls.removeEventListener("start",interaction);controls.removeEventListener("change",invalidate);controls.dispose();
        surface.removeEventListener("wheel",passWheel,true);surface.removeEventListener("keydown",onKey);surface.removeEventListener("webglcontextlost",onContextLost);
        disposeModel(scene);surface.remove();renderer!.dispose();renderer!.forceContextLoss();runtimeRef.current=null;
      };
    }catch{renderer?.dispose();renderer?.domElement.remove();setFailed(true);}
    return()=>cleanup?.();
  },[]);
  useEffect(()=>{
    const runtime=runtimeRef.current;if(!runtime)return;
    try{
      if(runtime.model){runtime.scene.remove(runtime.model);disposeModel(runtime.model);}
      const model=createProductModel(product);runtime.model=model;runtime.scene.add(model);
      const bounds=new THREE.Box3().setFromObject(model);runtime.controls.target.set(0,(bounds.max.y+bounds.min.y)/2,0);
      runtime.renderer.domElement.setAttribute("aria-label",`Model 3D ${label}. Geser untuk memutar, tombol panah untuk melihat sudut lain.`);
      runtime.renderer.domElement.dataset.product=product;runtime.resize();runtime.setView("reset");
    }catch{setFailed(true);}
  },[product,label]);
  useEffect(()=>{const runtime=runtimeRef.current;if(runtime){runtime.autoRotate=autoRotate;runtime.invalidate();}},[autoRotate,product]);
  useEffect(()=>{runtimeRef.current?.setView(command.action);},[command]);
  return <div className="product-scene-host" ref={hostRef} data-status={failed?"fallback":ready?"ready":"loading"}>
    {(!ready||failed)&&<div className="product-scene-fallback"><img src={fallbackImage} alt={label}/><span>{failed?"Tampilan foto · 3D tidak tersedia di perangkat ini":"Menyiapkan model 3D…"}</span></div>}
  </div>;
}
