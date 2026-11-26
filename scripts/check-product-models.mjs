import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
import * as THREE from 'three';

// Exercise actual model geometry in Node without requiring a GPU. Canvas is only
// used for the chevron decal; these checks target silhouettes and real openings.
const source=await readFile(new URL('../app/three/product-models.ts',import.meta.url),'utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText
 .replace(/from "([^"]+)"/g,(_,name)=>`from "${import.meta.resolve(name)}"`);
const previousDocument=globalThis.document;
const context=Object.fromEntries(['fillRect','beginPath','moveTo','lineTo','closePath','fill'].map(name=>[name,()=>{}]));
globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>context})};
const {createProductModel,disposeModel}=await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));
const models={};
try {
 for(const id of ['road-barrier-2','traffic-cone-mathes','stick-cone']) {
  const model=createProductModel(id);models[id]=model;model.updateMatrixWorld(true);
  const size=new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3());
  assert.ok(size.x>0&&size.y>0&&size.z>0,id+' has volume');
  assert.ok(size.x<7&&size.y<7&&size.z<4,id+' has bounded dimensions');
  model.traverse(object=>{if(object.isMesh){for(const name of ['position','normal']) assert.ok([...object.geometry.getAttribute(name).array].every(Number.isFinite),id+' finite '+name);}});
 }
 const ray=(model,x,y)=>new THREE.Raycaster(new THREE.Vector3(x,y,10),new THREE.Vector3(0,0,-1)).intersectObject(model,true);
 assert.ok(ray(models['road-barrier-2'],0,.12).length>0,'RB2 center foot is solid');
 for(const x of [-.98,.98])assert.equal(ray(models['road-barrier-2'],x,.12).length,0,'RB2 forklift openings remain open');
 assert.ok(ray(models['road-barrier-2'],.98,.6).length>0,'RB2 body above feet is solid');
 const coneHit=new THREE.Raycaster(new THREE.Vector3(0,10,0),new THREE.Vector3(0,-1,0)).intersectObject(models['traffic-cone-mathes'],true);
 assert.ok(!coneHit.length||coneHit[0].point.y<1,'Mathes head has a real hollow opening');
 assert.equal(ray(models['stick-cone'],0,6.14).length,0,'Stick top lug hole is open');
 assert.ok(ray(models['stick-cone'],0,6.23).length>0,'Stick lug material surrounds the hole');
 console.log('PASS: three finite 3D models, RB2 feet and forklift openings, hollow Mathes neck, pierced Stick Cone lug.');
} finally { Object.values(models).forEach(disposeModel);if(previousDocument===undefined)delete globalThis.document;else globalThis.document=previousDocument; }
