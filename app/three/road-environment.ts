import * as THREE from "three";

/** A stationary outdoor road around the product; excluded from model framing. */
export function createRoadEnvironment() {
  const environment = new THREE.Group();
  environment.name = "Asphalt road with lane markings and shoulders";
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  const context = canvas.getContext("2d")!;
  const pixels = context.createImageData(512, 512);
  let seed = 2731;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < pixels.data.length; i += 4) {
    const aggregate = random();
    const value = 62 + random() * 23 + (aggregate > .94 ? 22 : 0);
    pixels.data[i] = value; pixels.data[i + 1] = value + 2;
    pixels.data[i + 2] = value + 3; pixels.data[i + 3] = 255;
  }
  context.putImageData(pixels, 0, 0);
  const asphalt = new THREE.CanvasTexture(canvas);
  asphalt.colorSpace = THREE.SRGBColorSpace;
  asphalt.wrapS = asphalt.wrapT = THREE.RepeatWrapping;
  asphalt.repeat.set(18, 30); asphalt.anisotropy = 4;
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(15, 120), new THREE.MeshStandardMaterial({
    map: asphalt, bumpMap: asphalt, bumpScale: .025, roughness: .96, metalness: 0,
  }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -.015; ground.receiveShadow = true;
  environment.add(ground);
  const white = new THREE.MeshStandardMaterial({color: 0xe1dfcf, roughness: .9});
  const yellow = new THREE.MeshStandardMaterial({color: 0xe8b951, roughness: .88});
  const strip = (x: number, z: number, width: number, length: number, material: THREE.Material) => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, length), material);
    mesh.rotation.x = -Math.PI / 2; mesh.position.set(x, -.007, z); mesh.receiveShadow = true;
    environment.add(mesh);
  };
  strip(6.4, 0, .13, 120, white); strip(-6.4, 0, .13, 120, white);
  for (let z = -58; z < 60; z += 6) strip(-3.9, z, .13, 2.7, yellow);
  const shoulder = new THREE.MeshStandardMaterial({color: 0x89877a, roughness: 1});
  const verge = new THREE.MeshStandardMaterial({color: 0x616e4b, roughness: 1});
  for (const side of [-1, 1]) {
    strip(side * 7.9, 0, .8, 120, shoulder);
    strip(side * 26.3, 0, 36, 120, verge);
  }
  return environment;
}
