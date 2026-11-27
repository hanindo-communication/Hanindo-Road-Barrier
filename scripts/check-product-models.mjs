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
const {createProductModel,disposeModel,productModelIds}=await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));
const catalogSource=await readFile(new URL('../app/catalog-data.ts',import.meta.url),'utf8');
const catalogCode=ts.transpileModule(catalogSource,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {catalogProducts}=await import('data:text/javascript;base64,'+Buffer.from(catalogCode).toString('base64'));
const models={};
const variantModels=[];
try {
 assert.deepEqual([...productModelIds].sort(),catalogProducts.map(p=>p.id).sort(),'Every catalog product has an explicit model');
 for(const id of productModelIds) {
  const model=createProductModel(id);models[id]=model;model.updateMatrixWorld(true);
  const size=new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3());
  assert.ok(size.x>0&&size.y>0&&size.z>0,id+' has volume');
  assert.ok(size.x<7&&size.y<7&&size.z<4,id+' has bounded dimensions');
  model.traverse(object=>{if(object.isMesh){for(const name of ['position','normal']) assert.ok([...object.geometry.getAttribute(name).array].every(Number.isFinite),id+' finite '+name);}});
 }
 for(const product of catalogProducts) {
  let firstSize;
  for(const variant of product.variants) {
   const model=createProductModel(product.id,variant.id);variantModels.push(model);model.updateMatrixWorld(true);
   const size=new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3());
   if(firstSize)assert.ok(size.distanceTo(firstSize)<1e-6,'Variant framing remains identical for '+product.id);
   firstSize=size;
   model.traverse(object=>{if(object.isMesh)assert.ok([...object.geometry.getAttribute('position').array].every(Number.isFinite),'Finite variant geometry');});
   if(variant.id==='white')assert.equal(model.children[0].material.color.getHex(),0xefeee6,'White variant uses white plastic');
  }
 }
 const ray=(model,x,y)=>new THREE.Raycaster(new THREE.Vector3(x,y,10),new THREE.Vector3(0,0,-1)).intersectObject(model,true);
 assert.ok(ray(models['road-barrier-2'],0,.12).length>0,'RB2 center foot is solid');
 for(const x of [-.98,.98])assert.equal(ray(models['road-barrier-2'],x,.12).length,0,'RB2 forklift openings remain open');
 assert.ok(ray(models['road-barrier-2'],.98,.6).length>0,'RB2 body above feet is solid');
 const barrier=models['road-barrier-2'];
 for(const [x,y] of [[0,2.3],[-1.18,2.5],[1.18,1.49]]) {
  const front=ray(barrier,x,y)[0];
  const back=new THREE.Raycaster(new THREE.Vector3(x,y,-10),new THREE.Vector3(0,0,1)).intersectObject(barrier,true)[0];
  assert.ok(front&&back&&Math.abs(front.point.z+back.point.z)<1e-5,'RB2 moulded recesses match on both faces');
 }
 for(const [side,z,direction] of [['front',10,-1],['back',-10,1]]) {
  const hit=new THREE.Raycaster(new THREE.Vector3(0,3.19,z),new THREE.Vector3(0,0,direction)).intersectObject(barrier,true)[0];
  assert.equal(hit.object.name,`RB2 ${side} direction reflector`,'Both outward-facing arrow reflectors are visible');
 }
 const coneHit=new THREE.Raycaster(new THREE.Vector3(0,10,0),new THREE.Vector3(0,-1,0)).intersectObject(models['traffic-cone-mathes'],true);
 assert.ok(!coneHit.length||coneHit[0].point.y<1,'Mathes head has a real hollow opening');
 assert.equal(ray(models['stick-cone'],0,6.14).length,0,'Stick top lug hole is open');
 assert.ok(ray(models['stick-cone'],0,6.23).length>0,'Stick lug material surrounds the hole');
 assert.equal(ray(models['road-barrier-5'],0,2.55).length,0,'RB5 center is a real through opening');
 assert.ok(ray(models['road-barrier-5'],1.25,2.55).length>0,'RB5 side wings remain solid');
 assert.equal(ray(models['stick-cone-2'],0,6.16).length,0,'Stick Cone 2 ring hole remains open');
 assert.ok(ray(models['stick-cone-2'],.18,6.16).length>0,'Stick Cone 2 ring surrounds the hole');
 assert.ok(ray(models['road-barrier-1'],0,2.62)[0].point.z < .2,'RB1 has a recessed circular center');
 assert.throws(()=>createProductModel('missing'),/Unknown product model/,'Unknown models do not silently become another product');
 console.log(`PASS: ${productModelIds.length} catalog models, ${variantModels.length} variants, unchanged framing between variants, matched RB2 faces, real RB5 opening and cone head holes.`);
} finally { [...Object.values(models),...variantModels].forEach(disposeModel);if(previousDocument===undefined)delete globalThis.document;else globalThis.document=previousDocument; }
