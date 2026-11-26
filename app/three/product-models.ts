import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export type ProductModelId = "road-barrier-2" | "traffic-cone-mathes" | "stick-cone";

// These are photo-based exterior reconstructions, not manufacturing/CAD geometry.
// Front details follow the supplied RB 2.png, TC MATHE.png and STC.png references.
// Unseen rear surfaces use the minimum inferred continuation of the exterior shell.
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
        const z = depthAt(y) - (side === 1 ? frontRecess(x, y) : 0);
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

function arrowMaterial() {
  const canvas = document.createElement("canvas");
  canvas.width = 768; canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffc234"; ctx.fillRect(0, 0, 768, 256);
  ctx.fillStyle = "#151a19";
  // Three black right-facing chevrons on yellow, matching RB 2.png.
  for (let i = 0; i < 3; i++) {
    const x = 18 + i * 254;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 120, 0);
    ctx.lineTo(x + 248, 128); ctx.lineTo(x + 120, 256);
    ctx.lineTo(x, 256); ctx.lineTo(x + 128, 128); ctx.closePath(); ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return new THREE.MeshStandardMaterial({ map: texture, roughness: .33, metalness: .05 });
}

function roadBarrier2() {
  const group = new THREE.Group();
  const red = plastic(0xe82e22);
  const dark = plastic(0x262827);
  add(group, barrierShell(), red).name = "RB2 shell · three recessed channels and three feet";
  for (const side of [-1, 1]) {
    const heights = side < 0 ? [1.78, 2.98] : [1.44, 2.56];
    for (const y of heights) {
      box(group, [.59, .27, .38], red, [side * 2.65, y, 0], .05);
      if (side > 0) add(group, new THREE.CylinderGeometry(.075, .095, .21, 24), red, 2.88, y + .20, 0);
    }
  }
  add(group, new THREE.PlaneGeometry(1.50, .49), arrowMaterial(), 0, 3.19, .282).name = "RB2 front direction reflector";
  for (const x of [-2.16, 2.16]) add(group, new THREE.PlaneGeometry(.46, .27), reflective(0xf3ad27), x, 3.48, .264);
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

export function createProductModel(id: ProductModelId) {
  const model = id === "road-barrier-2" ? roadBarrier2() : id === "traffic-cone-mathes" ? trafficConeMathes() : stickCone();
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
