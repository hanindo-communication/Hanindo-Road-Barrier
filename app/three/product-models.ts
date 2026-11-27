import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export const productModelIds = ["road-barrier-2", "road-barrier-mathes", "road-barrier-1", "road-barrier-3", "road-barrier-4", "road-barrier-5", "traffic-cone-mathes", "traffic-cone-50", "traffic-cone-75", "stick-cone", "stick-cone-2"] as const;
export type ProductModelId = typeof productModelIds[number];

// These are photo-based exterior reconstructions, not manufacturing/CAD geometry.
// Front details follow the supplied RB 2.png, TC MATHE.png and STC.png references.
// The RB2 rear repeats the front moulding and reflectors as requested by the owner.
const plastic = (color: number) => new THREE.MeshStandardMaterial({ color, roughness: 0.46, metalness: 0 });
const reflective = (color = 0xe6e8dd) => new THREE.MeshStandardMaterial({ color, roughness: 0.29, metalness: 0.18 });

function add(group: THREE.Group, geometry: THREE.BufferGeometry, material: THREE.Material, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function lathe(group: THREE.Group, points: number[][], material: THREE.Material, segments = 64) {
  return add(group, new THREE.LatheGeometry(points.map(([r, y]) => new THREE.Vector2(r, y)), segments), material);
}

function box(group: THREE.Group, size: [number, number, number], mat: THREE.Material, position: [number, number, number], radius = 0.035) {
  return add(group, new RoundedBoxGeometry(...size, 3, radius), mat, ...position);
}

function depthAt(y: number) {
  const profile = [[0, 1.17], [.3, 1.2], [1.74, .38], [2.02, .28], [3.8, .25]];
  for (let i = 1; i < profile.length; i++) {
    if (y <= profile[i][0]) {
      const [a, b] = [profile[i - 1], profile[i]];
      return THREE.MathUtils.lerp(a[1], b[1], (y - a[0]) / (b[0] - a[0]));
    }
  }
  return .25;
}

function notchFloor(x: number) {
  const ax = Math.abs(x);
  // Two open forklift cut-outs make three integrated feet, as in the reference.
  if (ax >= .57 && ax <= 1.40) {
    return .025 + .27 * Math.min(1, (ax - .57) / .12, (1.40 - ax) / .12);
  }
  return .025 + Math.max(0, ax - 2.03) * .17;
}

function frontRecess(x: number, y: number) {
  let dent = 0;
  for (const [cx, top] of [[-1.18, 2.92], [0, 2.56], [1.18, 2.92]]) {
    const cross = Math.max(0, 1 - Math.abs(x - cx) / .29);
    const entrance = THREE.MathUtils.clamp((top - y) / .20, 0, 1);
    const exit = THREE.MathUtils.clamp((y - 1.24) / .37, 0, 1);
    if (y < top) dent += .17 * Math.min(cross, entrance, exit);
    const lowerX = Math.max(0, 1 - Math.abs(x - cx) / .36);
    const lowerY = Math.max(0, 1 - Math.abs(y - 1.49) / .25);
    dent += .075 * Math.min(lowerX, lowerY);
  }
  return dent;
}

function barrierShell() {
  // A continuous front/back shell with real depth and three moulded V channels.
  // Separate normals at the perimeter keep the injection-moulded edge readable.
  const nx = 120, ny = 100, positions: number[] = [], indices: number[] = [];
  const faceSize = (nx + 1) * (ny + 1);
  for (const side of [1, -1]) {
    for (let row = 0; row <= ny; row++) {
      for (let col = 0; col <= nx; col++) {
        const x = -2.4 + col / nx * 4.8;
        const low = notchFloor(x);
        const high = 3.78 - Math.max(0, Math.abs(x) - 2.32) * .8;
        const y = THREE.MathUtils.lerp(low, high, row / ny);
        const z = depthAt(y) - frontRecess(x, y);
        positions.push(x, y, side * z);
      }
    }
  }
  for (let side = 0; side < 2; side++) {
    const offset = side * faceSize;
    for (let row = 0; row < ny; row++) for (let col = 0; col < nx; col++) {
      const a = offset + row * (nx + 1) + col, b = a + 1, c = a + nx + 1, d = c + 1;
      if (side === 0) indices.push(a, b, d, a, d, c);
      else indices.push(a, d, b, a, c, d);
    }
  }
  const boundary: number[] = [];
  for (let col = 0; col <= nx; col++) boundary.push(col);
  for (let row = 1; row <= ny; row++) boundary.push(row * (nx + 1) + nx);
  for (let col = nx - 1; col >= 0; col--) boundary.push(ny * (nx + 1) + col);
  for (let row = ny - 1; row > 0; row--) boundary.push(row * (nx + 1));
  for (let i = 0; i < boundary.length; i++) {
    const a = boundary[i], b = boundary[(i + 1) % boundary.length];
    const start = positions.length / 3;
    for (const index of [a, a + faceSize, b + faceSize, b]) positions.push(...positions.slice(index * 3, index * 3 + 3));
    indices.push(start, start + 1, start + 2, start, start + 2, start + 3);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function arrowMaterial(direction: "right" | "left" | "double" = "right", count = 3) {
  const canvas = document.createElement("canvas");
  canvas.width = 768; canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffc234"; ctx.fillRect(0, 0, 768, 256);
  ctx.fillStyle = "#151a19";
  // Three black right-facing chevrons on yellow, matching RB 2.png.
  for (let i = 0; i < count; i++) {
    const x = 768 / count * i, width = 768 / count;
    const flip = direction === "left" || (direction === "double" && i < count / 2);
    const px = (value: number) => x + (flip ? 1 - value : value) * width;
    ctx.beginPath(); ctx.moveTo(px(.05), 0); ctx.lineTo(px(.50), 0);
    ctx.lineTo(px(.99), 128); ctx.lineTo(px(.50), 256);
    ctx.lineTo(px(.05), 256); ctx.lineTo(px(.54), 128); ctx.closePath(); ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return new THREE.MeshStandardMaterial({ map: texture, roughness: .33, metalness: .05 });
}

function roadBarrier2(variant: string) {
  const group = new THREE.Group();
  const red = plastic(variant === "white" ? 0xefeee6 : 0xe82e22);
  const dark = plastic(0x262827);
  add(group, barrierShell(), red).name = "RB2 shell · three recessed channels and three feet";
  for (const side of [-1, 1]) {
    const heights = side < 0 ? [1.78, 2.98] : [1.44, 2.56];
    for (const y of heights) {
      box(group, [.59, .27, .38], red, [side * 2.65, y, 0], .05);
      if (side > 0) add(group, new THREE.CylinderGeometry(.075, .095, .21, 24), red, 2.88, y + .20, 0);
    }
  }
  const arrows = arrowMaterial(), amber = reflective(0xf3ad27);
  for (const side of [1, -1]) {
    const direction = add(group, new THREE.PlaneGeometry(1.50, .49), arrows, 0, 3.19, side * .282);
    direction.rotation.y = side === 1 ? 0 : Math.PI;
    direction.name = `RB2 ${side === 1 ? "front" : "back"} direction reflector`;
    for (const x of [-2.16, 2.16]) {
      const corner = add(group, new THREE.PlaneGeometry(.46, .27), amber, x, 3.48, side * .264);
      corner.rotation.y = direction.rotation.y;
    }
  }
  add(group, new THREE.CylinderGeometry(.12, .13, .055, 32), dark, .05, 3.80, -.01).name = "Filler cap";
  return group;
}

function trafficConeMathes() {
  const group = new THREE.Group(), orange = plastic(0xf33c16), white = reflective();
  const baseShape = new THREE.Shape();
  const w = 1.39, r = .15;
  baseShape.moveTo(-w + r, -w); baseShape.lineTo(w - r, -w); baseShape.quadraticCurveTo(w, -w, w, -w + r);
  baseShape.lineTo(w, w - r); baseShape.quadraticCurveTo(w, w, w - r, w); baseShape.lineTo(-w + r, w);
  baseShape.quadraticCurveTo(-w, w, -w, w - r); baseShape.lineTo(-w, -w + r); baseShape.quadraticCurveTo(-w, -w, -w + r, -w);
  const base = new THREE.ExtrudeGeometry(baseShape, {depth:.17, bevelEnabled:true, bevelSize:.055, bevelThickness:.04, bevelSegments:3, curveSegments:12});
  base.rotateX(-Math.PI / 2); base.translate(0, .06, 0);
  add(group, base, orange).name = "Mathes rounded square base";
  lathe(group, [[.01,.22],[1.14,.22],[1.16,.28],[1.13,.34],[1.02,.40],[.98,.48]], orange);
  const radiusAt = (y: number) => THREE.MathUtils.lerp(.98, .22, (y - .48) / (5.48 - .48));
  const sections: Array<[number, number, THREE.Material]> = [[.48,2.89,orange],[2.89,3.73,white],[3.73,4.32,orange],[4.32,5.04,white],[5.04,5.48,orange]];
  sections.forEach(([bottom,top,mat], index) => {
    lathe(group, [[radiusAt(bottom),bottom],[radiusAt(top),top]], mat).name = `Mathes tapered section ${index + 1}`;
  });
  // Neck and hollow rim are distinct from the pointed TC50/TC75 head.
  lathe(group, [[.22,5.48],[.215,5.52],[.17,5.55],[.165,5.68],[.185,5.71],[.225,5.72],[.23,5.78],[.215,5.81],[.125,5.81],[.12,5.77],[.12,5.61]], orange).name = "Mathes hollow neck and lip";
  return group;
}

function stickCone() {
  const group = new THREE.Group(), orange = plastic(0xf33b17), white = reflective();
  const black = new THREE.MeshStandardMaterial({color:0x171c1d,roughness:.69});
  lathe(group, [[.01,.04],[.98,.04],[.98,.23],[.95,.29],[.83,.43],[.59,.56],[.30,.63],[.01,.63]], black, 8).name = "Stick cone octagonal black base";
  for (const [bottom, top, mat] of [[.59,4.34,orange],[4.34,4.77,white],[4.77,5.04,orange],[5.04,5.48,white],[5.48,6.08,orange]] as Array<[number,number,THREE.Material]>) {
    lathe(group, [[.256,bottom],[.256,top]], mat);
  }
  lathe(group, [[.256,6.08],[.25,6.10],[.22,6.12],[.01,6.12]], orange);
  const tab = new THREE.Shape();
  tab.moveTo(-.15,6.08); tab.lineTo(-.15,6.11); tab.absarc(0,6.11,.15,Math.PI,0,true); tab.lineTo(.15,6.08); tab.closePath();
  const hole = new THREE.Path(); hole.absarc(0,6.14,.035,0,Math.PI*2,false); tab.holes.push(hole);
  const lug = new THREE.ExtrudeGeometry(tab,{depth:.085,bevelEnabled:true,bevelSize:.012,bevelThickness:.012,bevelSegments:3,curveSegments:24});
  lug.translate(0,0,-.0425);
  add(group,lug,orange).name = "Small top attachment lug with real opening";
  return group;
}

function segmentDistance(x: number, y: number, ax: number, ay: number, bx: number, by: number) {
  const t = THREE.MathUtils.clamp(((x-ax)*(bx-ax)+(y-ay)*(by-ay))/((bx-ax)**2+(by-ay)**2),0,1);
  return Math.hypot(x-ax-t*(bx-ax),y-ay-t*(by-ay));
}

type BarrierKind = "road-barrier-mathes" | "road-barrier-1" | "road-barrier-3" | "road-barrier-4" | "road-barrier-5";
function barrierDepth(y: number) { return y < 1.75 ? THREE.MathUtils.lerp(.91,.29,y/1.75) : .29; }
function barrierDent(kind: BarrierKind, x: number, y: number) {
  const slot = (distance: number, width: number, depth = .15) => depth * THREE.MathUtils.clamp(1-distance/width,0,1);
  let dent = 0;
  if(kind === "road-barrier-1") {
    dent += .14 * THREE.MathUtils.clamp((.72-Math.hypot(x,y-2.62))/.08,0,1);
    for(const side of [-1,1]) for(const cx of [1.18,1.70]) {
      dent += slot(Math.min(segmentDistance(side*x,y,cx,2.62,cx-.4,3.28),segmentDistance(side*x,y,cx,2.62,cx-.4,1.96)),.16);
    }
  } else if(kind === "road-barrier-mathes") {
    for(const cx of [-1.76,-.88,0,.88,1.76]) {
      const slant=x-cx-(y-2.7)*.28;
      dent += .12 * THREE.MathUtils.clamp((.34-Math.abs(slant))/.08,0,1)*THREE.MathUtils.clamp(Math.min(y-2.12,3.30-y)/.07,0,1);
    }
    for(const cx of [-.92,.92]) dent += .16 * THREE.MathUtils.clamp((.27-Math.abs(x-cx))/.12,0,1)*THREE.MathUtils.clamp(Math.min(y-.56,1.62-y)/.15,0,1);
  } else if(kind === "road-barrier-3") {
    for(const side of [-1,1]) dent += slot(Math.min(segmentDistance(side*x,y,1.12,3.43,2.04,2.64),segmentDistance(side*x,y,2.04,2.64,1.12,1.94)),.20,.16);
    for(const cx of [-1.42,0,1.42]) dent += .17 * THREE.MathUtils.clamp((.24-Math.abs(x-cx))/.10,0,1)*THREE.MathUtils.clamp(Math.min(y-.5,1.5-y)/.12,0,1);
  } else if(kind === "road-barrier-4") {
    for(const cx of [-1.12,0,1.12]) dent += slot(segmentDistance(x,y,cx,1.02,cx,2.91),.20,.15);
  } else {
    for(const cx of [-1.26,1.26]) dent += slot(Math.min(segmentDistance(x,y,cx-.42,1.62,cx+.42,3.39),segmentDistance(x,y,cx+.42,1.62,cx-.42,3.39)),.17,.15);
  }
  return dent;
}

/** Continuous shells, with separately sewn walls around the RB5 through opening. */
function rangeBarrierShell(kind: BarrierKind) {
  const nx=144,ny=112,faceSize=(nx+1)*(ny+1),positions:number[]=[],indices:number[]=[];
  const height=kind === "road-barrier-mathes" ? 3.6 : 3.8;
  for(const side of [1,-1]) for(let row=0;row<=ny;row++) for(let col=0;col<=nx;col++) {
    const x=-2.4+4.8*col/nx;
    const floor=notchFloor(x)*(kind === "road-barrier-mathes" ? 1.65 : 1);
    let top=height-Math.max(0,Math.abs(x)-2.32)*.8;
    if(kind === "road-barrier-4") for(const cx of [-1.02,1.02]) top-=.25*THREE.MathUtils.clamp((.27-Math.abs(x-cx))/.08,0,1);
    if(kind === "road-barrier-1") top-=.16*THREE.MathUtils.clamp((.26-Math.abs(x-.9))/.07,0,1);
    if(kind === "road-barrier-5") for(const cx of [-1.27,1.27]) top-=.12*THREE.MathUtils.clamp((.61-Math.abs(x-cx))/.1,0,1);
    const y=THREE.MathUtils.lerp(floor,top,row/ny);
    positions.push(x,y,side*(barrierDepth(y)-barrierDent(kind,x,y)));
  }
  const edges=new Map<string,[number,number,number]>();
  const edge=(a:number,b:number)=>{const key=`${Math.min(a,b)},${Math.max(a,b)}`,old=edges.get(key);if(old)old[2]++;else edges.set(key,[a,b,1]);};
  for(let row=0;row<ny;row++) for(let col=0;col<nx;col++) {
    const a=row*(nx+1)+col,b=a+1,c=a+nx+1,d=c+1;
    const x=(positions[a*3]+positions[d*3])/2,y=(positions[a*3+1]+positions[d*3+1])/2;
    // Rounded rectangular void, not a black decal painted onto a solid wall.
    const hole=kind === "road-barrier-5" && Math.hypot(Math.max(Math.abs(x)-.18,0),Math.max(Math.abs(y-2.55)-.84,0))<.15;
    if(hole)continue;
    indices.push(a,b,d,a,d,c,a+faceSize,d+faceSize,b+faceSize,a+faceSize,c+faceSize,d+faceSize);
    edge(a,b);edge(b,d);edge(d,c);edge(c,a);
  }
  for(const [a,b,count] of edges.values()) if(count===1) {
    const start=positions.length/3;
    for(const index of [a,a+faceSize,b+faceSize,b]) positions.push(...positions.slice(index*3,index*3+3));
    indices.push(start,start+1,start+2,start,start+2,start+3);
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute("position",new THREE.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();return geometry;
}

function facePanel(group: THREE.Group, width: number, height: number, x: number, y: number, material: THREE.Material, depth = barrierDepth(y)+.008) {
  for(const side of [1,-1]) {
    const panel=add(group,new THREE.PlaneGeometry(width,height),material,x,y,side*depth);
    // Follow the sloping lower body so the reflector is flush to the plastic.
    const slope=y<1.75 ? -.62/1.75 : 0;
    panel.rotation.set(side*Math.atan(slope),side===1?0:Math.PI,0);
    panel.name=`${side===1?"Front":"Back"} reflector panel`;
  }
}

function rangeBarrier(kind: BarrierKind, variant: string) {
  const group=new THREE.Group(),color=variant==="white"?0xefeee6:kind==="road-barrier-5"?0xf45b13:0xe82e22;
  const body=plastic(color),black=plastic(0x242a29);
  add(group,rangeBarrierShell(kind),body).name=`${kind} moulded shell`;
  const twin=kind==="road-barrier-4"||kind==="road-barrier-5";
  for(const side of [-1,1]) for(const y of twin ? (side<0?[1.85,2.95]:[1.68,2.76]) : [1.46]) {
    box(group,[.52,.23,.36],body,[side*2.60,y,0],.035);
    if((twin&&side>0)||(!twin&&side<0)) add(group,new THREE.CylinderGeometry(.07,.085,.20,20),body,side*2.73,y+.18,0);
  }
  if(kind!=="road-barrier-5") {
    add(group,new THREE.CylinderGeometry(.11,.12,.06,24),black,kind==="road-barrier-1"?.9:0,kind==="road-barrier-mathes"?3.62:kind==="road-barrier-1"?3.66:3.82,0).name="Filler cap";
    const drain=add(group,new THREE.CylinderGeometry(.09,.09,.04,24),black,2.16,.20,barrierDepth(.20)+.02);drain.rotation.x=Math.PI/2;
  }
  if(kind==="road-barrier-mathes") {
    if(variant==="arrow"||variant==="double-arrow") facePanel(group,4.55,.27,0,1.92,arrowMaterial(variant==="double-arrow"?"double":"right",12));
    else for(const cx of [-1.76,1.76]) {
      const shape=new THREE.Shape();shape.moveTo(cx-.30,2.13);shape.lineTo(cx+.30,2.13);shape.lineTo(cx+.61,3.29);shape.lineTo(cx+.01,3.29);shape.closePath();
      for(const side of [1,-1]) {const reflector=add(group,new THREE.ShapeGeometry(shape),reflective(),0,0,side*.215);if(side<0)reflector.rotation.y=Math.PI;}
    }
  } else if(kind==="road-barrier-1") {
    const material=reflective(variant==="white"?0xdda427:0xe7e9df);
    for(const side of [1,-1]) for(const cx of [1.18,1.70]) {
      const shape=new THREE.Shape(),points=[[cx-.4,3.23],[cx-.33,3.23],[cx+.02,2.62],[cx-.33,2.01],[cx-.4,2.01],[cx-.05,2.62]];
      points.forEach(([x,y],i)=>i?shape.lineTo(side*x,y):shape.moveTo(side*x,y));shape.closePath();
      for(const face of [1,-1]) {const reflector=add(group,new THREE.ShapeGeometry(shape),material,0,0,face*.24);if(face<0)reflector.rotation.y=Math.PI;}
    }
  } else if(kind==="road-barrier-3") facePanel(group,1.72,.56,0,2.65,arrowMaterial("left",3));
  else if(kind==="road-barrier-4") facePanel(group,1.76,.43,0,3.40,arrowMaterial("right",5));
  else {
    facePanel(group,1.48,.58,-1.22,.97,arrowMaterial("left",3));
    facePanel(group,1.48,.58,1.22,.97,arrowMaterial("right",3));
  }
  return group;
}

function compactTrafficCone(tall: boolean) {
  const group=new THREE.Group(),orange=plastic(0xf33c16),silver=reflective();
  // Both source photographs use a thicker square plinth and one silver band.
  box(group,[2.68,.42,2.68],orange,[0,.24,0],.17).name="Thick rounded square plinth";
  const height=tall?5.45:4.70,top=height-.05;
  const radiusAt=(y:number)=>THREE.MathUtils.lerp(.98,.18,(y-.45)/(top-.45));
  const bandBottom=tall?3.78:3.24,bandTop=tall?4.66:4.08;
  for(const [bottom,end,material] of [[.45,bandBottom,orange],[bandBottom,bandTop,silver],[bandTop,top,orange]] as Array<[number,number,THREE.Material]>) lathe(group,[[radiusAt(bottom),bottom],[radiusAt(end),end]],material);
  lathe(group,[[.18,top],[.17,height],[.10,height],[.10,height-.17]],orange).name="Small hollow top";
  return group;
}

function ringStickCone() {
  const group=new THREE.Group(),orange=plastic(0xf33b17),silver=reflective(),yellow=reflective(0xefce24);
  lathe(group,[[.01,.04],[1.08,.04],[1.08,.28],[.96,.40],[.64,.55],[.28,.60],[.01,.60]],new THREE.MeshStandardMaterial({color:0x171c1d,roughness:.69}),8).name="Octagonal black base";
  for(const [bottom,top,material] of [[.55,3.62,orange],[3.62,4.04,yellow],[4.04,5.12,orange],[5.12,5.55,silver],[5.55,5.87,orange]] as Array<[number,number,THREE.Material]>) lathe(group,[[.237,bottom],[.237,top]],material);
  for(const y of [.60,3.61,4.05,5.10,5.87]) lathe(group,[[.237,y-.04],[.27,y],[.27,y+.04],[.237,y+.08]],orange);
  const ring=new THREE.Shape();ring.absarc(0,6.16,.245,0,Math.PI*2,false);
  const hole=new THREE.Path();hole.absarc(0,6.16,.075,0,Math.PI*2,true);ring.holes.push(hole);
  const geometry=new THREE.ExtrudeGeometry(ring,{depth:.12,bevelEnabled:true,bevelSize:.018,bevelThickness:.015,bevelSegments:3,curveSegments:40});geometry.translate(0,0,-.06);
  add(group,geometry,orange).name="Circular attachment head with through hole";
  return group;
}

export function createProductModel(id: ProductModelId, variant = "standard") {
  let model: THREE.Group;
  if(id==="road-barrier-2")model=roadBarrier2(variant);
  else if(id==="traffic-cone-mathes")model=trafficConeMathes();
  else if(id==="traffic-cone-50"||id==="traffic-cone-75")model=compactTrafficCone(id==="traffic-cone-75");
  else if(id==="stick-cone")model=stickCone();
  else if(id==="stick-cone-2")model=ringStickCone();
  else if(productModelIds.includes(id))model=rangeBarrier(id as BarrierKind,variant);
  else throw new Error(`Unknown product model: ${id}`);
  model.name = id;
  return model;
}

export function disposeModel(root: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>(), textures = new Set<THREE.Texture>();
  root.traverse(object => {
    if (!(object instanceof THREE.Mesh)) return;
    geometries.add(object.geometry);
    (Array.isArray(object.material) ? object.material : [object.material]).forEach(mat => {
      materials.add(mat);
      const map = (mat as THREE.MeshStandardMaterial).map;
      if (map) textures.add(map);
    });
  });
  geometries.forEach(geometry=>geometry.dispose()); textures.forEach(texture=>texture.dispose()); materials.forEach(mat=>mat.dispose());
}
