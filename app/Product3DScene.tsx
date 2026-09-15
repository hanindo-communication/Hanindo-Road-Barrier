"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type Product3DSceneProps = {
  type: "barrier" | "cone" | "stick";
  variant?: string;
  environment?: "light" | "dark";
  fallbackImage: string;
  label: string;
};

const safetyRed = 0xf23a2f;
const safetyRedLight = 0xff5145;
const safetyRedDark = 0xb92024;
const reflector = 0xe7efef;

function material(color: number, roughness = 0.42, metalness = 0.02) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function mesh(
  geometry: THREE.BufferGeometry,
  meshMaterial: THREE.Material,
  position: [number, number, number] = [0, 0, 0],
  rotation: [number, number, number] = [0, 0, 0],
) {
  const item = new THREE.Mesh(geometry, meshMaterial);
  item.position.set(...position);
  item.rotation.set(...rotation);
  item.castShadow = true;
  item.receiveShadow = true;
  return item;
}

function addMesh(
  group: THREE.Group,
  geometry: THREE.BufferGeometry,
  meshMaterial: THREE.Material,
  position: [number, number, number] = [0, 0, 0],
  rotation: [number, number, number] = [0, 0, 0],
) {
  const item = mesh(geometry, meshMaterial, position, rotation);
  group.add(item);
  return item;
}

function roundedRectPath(width: number, height: number, radius: number) {
  const path = new THREE.Shape();
  const left = -width / 2;
  const right = width / 2;
  const bottom = -height / 2;
  const top = height / 2;
  const r = Math.min(radius, width / 2, height / 2);
  path.moveTo(left + r, bottom);
  path.lineTo(right - r, bottom);
  path.quadraticCurveTo(right, bottom, right, bottom + r);
  path.lineTo(right, top - r);
  path.quadraticCurveTo(right, top, right - r, top);
  path.lineTo(left + r, top);
  path.quadraticCurveTo(left, top, left, top - r);
  path.lineTo(left, bottom + r);
  path.quadraticCurveTo(left, bottom, left + r, bottom);
  return path;
}

function panelGeometry(
  width: number,
  height: number,
  depth: number,
  holes: Array<{ x: number; y: number; width: number; height: number }> = [],
) {
  const shape = roundedRectPath(width, height, Math.min(width, height) * 0.055);
  holes.forEach((hole) => {
    const cutout = new THREE.Path();
    const left = hole.x - hole.width / 2;
    const right = hole.x + hole.width / 2;
    const bottom = hole.y - hole.height / 2;
    const top = hole.y + hole.height / 2;
    const radius = Math.min(0.1, hole.width * 0.15, hole.height * 0.2);
    cutout.moveTo(left + radius, bottom);
    cutout.lineTo(right - radius, bottom);
    cutout.quadraticCurveTo(right, bottom, right, bottom + radius);
    cutout.lineTo(right, top - radius);
    cutout.quadraticCurveTo(right, top, right - radius, top);
    cutout.lineTo(left + radius, top);
    cutout.quadraticCurveTo(left, top, left, top - radius);
    cutout.lineTo(left, bottom + radius);
    cutout.quadraticCurveTo(left, bottom, left + radius, bottom);
    shape.holes.push(cutout);
  });
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.035,
    bevelThickness: 0.035,
  });
  geometry.translate(0, 0, -depth / 2);
  return geometry;
}

function taperedBodyGeometry(
  bottomWidth: number,
  topWidth: number,
  height: number,
  bottomDepth: number,
  topDepth: number,
) {
  const bw = bottomWidth / 2;
  const tw = topWidth / 2;
  const bd = bottomDepth / 2;
  const td = topDepth / 2;
  const vertices = new Float32Array([
    -bw, 0, -bd, bw, 0, -bd, bw, 0, bd, -bw, 0, bd,
    -tw, height, -td, tw, height, -td, tw, height, td, -tw, height, td,
  ]);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.setIndex([
    0, 2, 1, 0, 3, 2,
    4, 5, 6, 4, 6, 7,
    0, 1, 5, 0, 5, 4,
    3, 7, 6, 3, 6, 2,
    0, 4, 7, 0, 7, 3,
    1, 2, 6, 1, 6, 5,
  ]);
  geometry.computeVertexNormals();
  return geometry;
}

function makeWarningMaterial(direction: "left" | "right" = "left") {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 160;
  const context = canvas.getContext("2d");
  if (context) {
    context.fillStyle = "#111719";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#ffd52b";
    for (let index = -1; index < 6; index += 1) {
      const offset = index * 112;
      context.beginPath();
      if (direction === "left") {
        context.moveTo(offset + 24, 80);
        context.lineTo(offset + 78, 5);
        context.lineTo(offset + 124, 5);
        context.lineTo(offset + 70, 80);
        context.lineTo(offset + 124, 155);
        context.lineTo(offset + 78, 155);
      } else {
        context.moveTo(offset + 124, 80);
        context.lineTo(offset + 70, 5);
        context.lineTo(offset + 24, 5);
        context.lineTo(offset + 78, 80);
        context.lineTo(offset + 24, 155);
        context.lineTo(offset + 70, 155);
      }
      context.closePath();
      context.fill();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return new THREE.MeshStandardMaterial({ map: texture, roughness: 0.4 });
}

function addSticker(group: THREE.Group, width: number, height: number, y: number, z: number, direction: "left" | "right" = "left") {
  addMesh(group, new THREE.BoxGeometry(width, height, 0.055), makeWarningMaterial(direction), [0, y, z]);
}

function addDetailBar(
  group: THREE.Group,
  barMaterial: THREE.Material,
  x: number,
  y: number,
  z: number,
  width: number,
  height: number,
  rotation = 0,
) {
  addMesh(group, new THREE.BoxGeometry(width, height, 0.085), barMaterial, [x, y, z], [0, 0, rotation]);
}

function addEmbossedChevron(group: THREE.Group, barMaterial: THREE.Material, x: number, y: number, z: number, direction: -1 | 1, scale = 1) {
  addDetailBar(group, barMaterial, x - direction * 0.13 * scale, y + 0.17 * scale, z, 0.12 * scale, 0.55 * scale, direction * 0.72);
  addDetailBar(group, barMaterial, x - direction * 0.13 * scale, y - 0.17 * scale, z, 0.12 * scale, 0.55 * scale, -direction * 0.72);
}

type BarrierConfig = {
  width: number;
  height: number;
  depth: number;
  upperHeight: number;
  lowerHeight: number;
  feet: number;
  connectors: number;
};

const barrierConfigs: Record<string, BarrierConfig> = {
  "road-barrier-1": { width: 5.7, height: 3.4, depth: 1.75, upperHeight: 1.4, lowerHeight: 1.8, feet: 3, connectors: 1 },
  "road-barrier-2": { width: 5.65, height: 3.28, depth: 1.72, upperHeight: 1.12, lowerHeight: 1.94, feet: 3, connectors: 2 },
  "road-barrier-3": { width: 5.62, height: 3.38, depth: 1.7, upperHeight: 1.35, lowerHeight: 1.78, feet: 3, connectors: 1 },
  "road-barrier-4": { width: 6.45, height: 3.55, depth: 1.85, upperHeight: 1.15, lowerHeight: 2.16, feet: 4, connectors: 2 },
  "road-barrier-5": { width: 5.75, height: 3.38, depth: 1.78, upperHeight: 1.32, lowerHeight: 1.82, feet: 4, connectors: 2 },
  "road-barrier-mathes": { width: 5.68, height: 3.38, depth: 1.7, upperHeight: 1.2, lowerHeight: 1.92, feet: 3, connectors: 1 },
};

function addBarrierHardware(group: THREE.Group, config: BarrierConfig, topY: number, frontZ: number) {
  const red = material(safetyRed, 0.4);
  const dark = material(0x171b1c, 0.65);
  const halfWidth = config.width / 2;
  for (const side of [-1, 1]) {
    for (let index = 0; index < config.connectors; index += 1) {
      const y = config.connectors === 2 ? 0.92 + index * 1.28 : 1.04;
      addMesh(group, new THREE.BoxGeometry(0.48, 0.26, 0.48), red, [side * (halfWidth + 0.2), y, 0]);
      if (side === 1) addMesh(group, new THREE.CylinderGeometry(0.1, 0.12, 0.26, 18), red, [side * (halfWidth + 0.44), y + 0.18, 0]);
    }
  }
  addMesh(group, new THREE.CylinderGeometry(0.12, 0.15, 0.11, 20), dark, [0.08, topY + 0.055, 0]);
  addDetailBar(group, material(safetyRedLight, 0.35), 0, config.lowerHeight, frontZ, config.width * 0.84, 0.08);
}

function addFeet(group: THREE.Group, config: BarrierConfig) {
  const footMaterial = material(safetyRedDark, 0.52);
  const usableWidth = config.width * 0.78;
  for (let index = 0; index < config.feet; index += 1) {
    const x = config.feet === 1 ? 0 : -usableWidth / 2 + (usableWidth / (config.feet - 1)) * index;
    addMesh(group, new THREE.BoxGeometry(config.feet >= 4 ? 0.58 : 0.76, 0.26, config.depth + 0.2), footMaterial, [x, 0.13, 0]);
  }
}

function makeRoadBarrier(variant = "road-barrier-3") {
  const config = barrierConfigs[variant] ?? barrierConfigs["road-barrier-3"];
  const group = new THREE.Group();
  const red = material(safetyRed, 0.38);
  const highlight = material(safetyRedLight, 0.34);
  const shadow = material(safetyRedDark, 0.5);
  const upperCenterY = config.lowerHeight + config.upperHeight / 2 - 0.03;
  const frontZ = config.depth * 0.28 + 0.075;
  const lowerWidthTop = variant === "road-barrier-4" ? config.width * 0.96 : config.width * 0.84;

  addMesh(group, taperedBodyGeometry(config.width, lowerWidthTop, config.lowerHeight, config.depth, config.depth * 0.5), red, [0, 0.24, 0]);

  let upperGeometry: THREE.BufferGeometry;
  if (variant === "road-barrier-5") {
    upperGeometry = panelGeometry(config.width * 0.88, config.upperHeight, config.depth * 0.43, [
      { x: 0, y: 0.1, width: 0.78, height: 0.68 },
    ]);
  } else if (variant === "road-barrier-mathes") {
    upperGeometry = panelGeometry(config.width * 0.9, config.upperHeight, config.depth * 0.42, [
      { x: -1.62, y: 0.03, width: 0.58, height: 0.62 },
      { x: -0.55, y: 0.03, width: 0.58, height: 0.62 },
      { x: 0.55, y: 0.03, width: 0.58, height: 0.62 },
      { x: 1.62, y: 0.03, width: 0.58, height: 0.62 },
    ]);
  } else {
    upperGeometry = panelGeometry((variant === "road-barrier-4" ? 0.96 : 0.9) * config.width, config.upperHeight, config.depth * 0.43);
  }
  addMesh(group, upperGeometry, red, [0, upperCenterY + 0.24, 0]);
  addFeet(group, config);
  addBarrierHardware(group, config, config.lowerHeight + config.upperHeight + 0.18, frontZ);

  if (variant === "road-barrier-1") {
    group.add(mesh(new THREE.TorusGeometry(0.45, 0.07, 12, 40), shadow, [0, upperCenterY + 0.25, frontZ]));
    [-1.68, -1.18].forEach((x) => addEmbossedChevron(group, shadow, x, upperCenterY + 0.25, frontZ, -1, 0.9));
    [1.18, 1.68].forEach((x) => addEmbossedChevron(group, shadow, x, upperCenterY + 0.25, frontZ, 1, 0.9));
  }
  if (variant === "road-barrier-2") {
    addSticker(group, 1.42, 0.42, upperCenterY + 0.26, frontZ, "right");
    [-1.64, -0.55, 0.55, 1.64].forEach((x) => addDetailBar(group, shadow, x, 1.02, frontZ, 0.4, 1.02, x < 0 ? -0.04 : 0.04));
  }
  if (variant === "road-barrier-3") {
    addSticker(group, 1.55, 0.44, upperCenterY + 0.24, frontZ, "left");
    [-1.75, -1.25].forEach((x) => addEmbossedChevron(group, shadow, x, upperCenterY + 0.24, frontZ, -1, 0.88));
    [1.25, 1.75].forEach((x) => addEmbossedChevron(group, shadow, x, upperCenterY + 0.24, frontZ, 1, 0.88));
    [-1.52, 0, 1.52].forEach((x) => addDetailBar(group, shadow, x, 0.98, frontZ, 0.42, 0.82));
  }
  if (variant === "road-barrier-4") {
    addSticker(group, 1.5, 0.42, upperCenterY + 0.26, frontZ, "left");
    [-1.68, 0, 1.68].forEach((x) => addDetailBar(group, shadow, x, 1.18, frontZ, 0.38, 1.3));
    [-2.62, 2.62].forEach((x) => addMesh(group, new THREE.BoxGeometry(0.55, 0.35, config.depth * 0.48), red, [x, config.height - 0.04, 0]));
  }
  if (variant === "road-barrier-5") {
    [-1.62, 1.62].forEach((x) => {
      addDetailBar(group, shadow, x, upperCenterY + 0.25, frontZ, 0.16, 0.85, x < 0 ? 0.68 : -0.68);
      addDetailBar(group, shadow, x, upperCenterY + 0.25, frontZ, 0.16, 0.85, x < 0 ? -0.68 : 0.68);
    });
    [-1.36, 1.36].forEach((x) => {
      group.add(mesh(new THREE.BoxGeometry(1.45, 0.42, 0.055), makeWarningMaterial(x < 0 ? "left" : "right"), [x, 1.06, frontZ], [0, 0, x < 0 ? -0.2 : 0.2]));
    });
  }
  if (variant === "road-barrier-mathes") {
    [-1.46, 0, 1.46].forEach((x) => addDetailBar(group, shadow, x, 1.05, frontZ, 0.48, 0.92));
    [-2.1, 2.1].forEach((x) => addDetailBar(group, highlight, x, upperCenterY + 0.24, frontZ, 0.14, 0.72, x < 0 ? -0.16 : 0.16));
  }
  return group;
}

function makeTrafficCone(variant = "traffic-cone-75") {
  const group = new THREE.Group();
  const red = material(safetyRed, 0.34);
  const white = material(reflector, 0.2, 0.1);
  const dark = material(0x171a1c, 0.7);
  const is50 = variant === "traffic-cone-50";
  const isMathes = variant === "traffic-cone-mathes";
  const totalHeight = is50 ? 3.7 : isMathes ? 5.45 : 5.25;
  const baseWidth = is50 ? 3.25 : isMathes ? 3.15 : 3.65;

  group.add(mesh(new THREE.CylinderGeometry(baseWidth * 0.47, baseWidth * 0.54, 0.34, 4), red, [0, 0.17, 0], [0, Math.PI / 4, 0]));
  addMesh(group, new THREE.CylinderGeometry(1.23, 1.42, 0.18, 32), red, [0, 0.43, 0]);
  const coneStart = 0.49;

  if (isMathes) {
    const segments = [
      { height: 1.38, bottom: 1.18, top: 0.86, material: red },
      { height: 0.62, bottom: 0.86, top: 0.71, material: white },
      { height: 0.68, bottom: 0.71, top: 0.56, material: red },
      { height: 0.62, bottom: 0.56, top: 0.42, material: white },
      { height: 1.66, bottom: 0.42, top: 0.12, material: red },
    ];
    let cursor = coneStart;
    segments.forEach((segment) => {
      addMesh(group, new THREE.CylinderGeometry(segment.top, segment.bottom, segment.height, 48), segment.material, [0, cursor + segment.height / 2, 0]);
      cursor += segment.height;
    });
  } else {
    const bodyHeight = totalHeight - coneStart;
    const lowerHeight = bodyHeight * 0.48;
    const bandHeight = bodyHeight * 0.17;
    const upperHeight = bodyHeight - lowerHeight - bandHeight;
    let cursor = coneStart;
    addMesh(group, new THREE.CylinderGeometry(0.72, 1.22, lowerHeight, 48), red, [0, cursor + lowerHeight / 2, 0]);
    cursor += lowerHeight;
    addMesh(group, new THREE.CylinderGeometry(0.58, 0.72, bandHeight, 48), white, [0, cursor + bandHeight / 2, 0]);
    cursor += bandHeight;
    addMesh(group, new THREE.CylinderGeometry(0.1, 0.58, upperHeight, 48), red, [0, cursor + upperHeight / 2, 0]);
  }
  group.add(mesh(new THREE.TorusGeometry(0.11, 0.035, 8, 24), dark, [0, totalHeight - 0.04, 0.02], [Math.PI / 2, 0, 0]));
  return group;
}

function makeStickCone(variant = "stick-cone") {
  const group = new THREE.Group();
  const red = material(safetyRed, 0.36);
  const redDark = material(safetyRedDark, 0.5);
  const white = material(reflector, 0.21, 0.08);
  const yellow = material(0xffcf24, 0.23, 0.04);
  const black = material(0x16191b, 0.7);
  const isRing = variant === "stick-cone-2";
  const baseWidth = isRing ? 2.35 : 1.95;

  addMesh(group, new THREE.CylinderGeometry(baseWidth * 0.72, baseWidth, 0.48, isRing ? 6 : 8), black, [0, 0.24, 0]);
  addMesh(group, new THREE.CylinderGeometry(0.43, 0.58, 0.22, 32), isRing ? redDark : red, [0, 0.57, 0]);
  addMesh(group, new THREE.CylinderGeometry(0.27, 0.32, 4.5, 32), red, [0, 2.88, 0]);
  if (isRing) {
    addMesh(group, new THREE.CylinderGeometry(0.285, 0.29, 0.52, 32), yellow, [0, 3.5, 0]);
    addMesh(group, new THREE.CylinderGeometry(0.29, 0.3, 0.58, 32), white, [0, 4.28, 0]);
    addMesh(group, new THREE.CylinderGeometry(0.38, 0.42, 0.18, 32), red, [0, 5.14, 0]);
    group.add(mesh(new THREE.TorusGeometry(0.36, 0.14, 16, 40), red, [0, 5.55, 0]));
  } else {
    addMesh(group, new THREE.CylinderGeometry(0.285, 0.3, 0.5, 32), white, [0, 4.18, 0]);
    addMesh(group, new THREE.CylinderGeometry(0.28, 0.285, 0.48, 32), white, [0, 4.84, 0]);
    addMesh(group, new THREE.CapsuleGeometry(0.31, 0.28, 8, 24), red, [0, 5.42, 0]);
    group.add(mesh(new THREE.TorusGeometry(0.085, 0.035, 8, 24), black, [0, 5.53, 0.29]));
  }
  return group;
}

const barrierVariants = ["road-barrier-1", "road-barrier-2", "road-barrier-3", "road-barrier-4", "road-barrier-5", "road-barrier-mathes"];
const coneVariants = ["traffic-cone-mathes", "traffic-cone-50", "traffic-cone-75"];
const stickVariants = ["stick-cone", "stick-cone-2"];

function selectedFirst(allVariants: string[], selected?: string) {
  if (!selected || !allVariants.includes(selected)) return allVariants;
  return [selected, ...allVariants.filter((item) => item !== selected)];
}

function addDisplayPlatform(group: THREE.Group, type: Product3DSceneProps["type"], environment: "light" | "dark") {
  const dimensions = type === "barrier" ? [12.4, 0.34, 7.4] : [10.2, 0.34, 7.2];
  addMesh(group, new THREE.BoxGeometry(...dimensions), material(environment === "dark" ? 0x526169 : 0xaeb7b7, 0.74), [0, -0.17, 0]);
  addMesh(group, new THREE.BoxGeometry(dimensions[0] + 0.08, 0.12, dimensions[2] + 0.08), material(environment === "dark" ? 0x26373f : 0x778184, 0.8), [0, -0.38, 0]);
}

function makeProductDisplay(type: Product3DSceneProps["type"], variant: string | undefined, environment: "light" | "dark") {
  const display = new THREE.Group();
  addDisplayPlatform(display, type, environment);
  if (type === "barrier") {
    const variants = selectedFirst(barrierVariants, variant).slice(0, 4);
    const layout = [
      { x: -1.5, z: 1.05, rotation: 0.08, scale: 0.58 },
      { x: -4.35, z: -0.65, rotation: 0.42, scale: 0.5 },
      { x: 1.45, z: 0.45, rotation: -0.08, scale: 0.52 },
      { x: 4.25, z: -0.72, rotation: -0.42, scale: 0.5 },
    ];
    variants.forEach((item, index) => {
      const product = makeRoadBarrier(item);
      const placement = layout[index];
      product.position.set(placement.x, 0, placement.z);
      product.rotation.y = placement.rotation;
      product.scale.setScalar(placement.scale);
      display.add(product);
    });
  } else if (type === "cone") {
    const variants = selectedFirst(coneVariants, variant);
    [
      { x: 0, z: 1.25, rotation: -0.08, scale: 0.82, variant: variants[0] },
      { x: -2.8, z: -0.55, rotation: 0.24, scale: 0.64, variant: variants[1] },
      { x: 2.75, z: -0.55, rotation: -0.22, scale: 0.64, variant: variants[2] },
      { x: -1.2, z: -1.8, rotation: 0.08, scale: 0.52, variant: variants[2] },
      { x: 1.25, z: -1.85, rotation: -0.08, scale: 0.5, variant: variants[1] },
    ].forEach((placement) => {
      const product = makeTrafficCone(placement.variant);
      product.position.set(placement.x, 0, placement.z);
      product.rotation.y = placement.rotation;
      product.scale.setScalar(placement.scale);
      display.add(product);
    });
  } else {
    const variants = selectedFirst(stickVariants, variant);
    [
      { x: 0, z: 1.2, rotation: 0, scale: 0.82, variant: variants[0] },
      { x: -2.7, z: -0.5, rotation: 0.22, scale: 0.64, variant: variants[1] },
      { x: 2.7, z: -0.5, rotation: -0.22, scale: 0.64, variant: variants[0] },
      { x: -1.05, z: -1.8, rotation: 0.08, scale: 0.52, variant: variants[0] },
      { x: 1.15, z: -1.8, rotation: -0.08, scale: 0.52, variant: variants[1] },
    ].forEach((placement) => {
      const product = makeStickCone(placement.variant);
      product.position.set(placement.x, 0, placement.z);
      product.rotation.y = placement.rotation;
      product.scale.setScalar(placement.scale);
      display.add(product);
    });
  }
  return display;
}

function disposeObject(root: THREE.Object3D) {
  const disposedMaterials = new Set<THREE.Material>();
  const disposedGeometries = new Set<THREE.BufferGeometry>();
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    if (!disposedGeometries.has(object.geometry)) {
      object.geometry.dispose();
      disposedGeometries.add(object.geometry);
    }
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach((entry) => {
      if (disposedMaterials.has(entry)) return;
      (entry as THREE.MeshStandardMaterial).map?.dispose();
      entry.dispose();
      disposedMaterials.add(entry);
    });
  });
}

type ViewerRuntime = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  observer: ResizeObserver;
  product: THREE.Group | null;
  animationFrame: number;
};

export default function Product3DScene({ type, variant, environment = "light", fallbackImage, label }: Product3DSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const runtimeRef = useRef<ViewerRuntime | null>(null);
  const [failed, setFailed] = useState(false);
  const renderKey = `${environment}:${type}:${variant ?? "default"}`;
  const [readyKey, setReadyKey] = useState("");

  useEffect(() => {
    const host = hostRef.current;
    if (!host || host.clientWidth === 0 || host.clientHeight === 0) return;
    try {
      const scene = new THREE.Scene();
      const backgroundColor = environment === "dark" ? 0x142a35 : 0xf3f5f2;
      scene.background = new THREE.Color(backgroundColor);
      scene.fog = new THREE.Fog(backgroundColor, 18, 32);
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
      camera.position.set(8.8, 6.7, 13.6);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = environment === "dark" ? 1.25 : 1.08;
      scene.add(new THREE.HemisphereLight(0xffffff, environment === "dark" ? 0x1d3540 : 0x6a7778, 2.5));
      const keyLight = new THREE.DirectionalLight(0xffffff, 4.2);
      keyLight.position.set(5, 10, 7);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1536, 1536);
      keyLight.shadow.camera.left = -10;
      keyLight.shadow.camera.right = 10;
      keyLight.shadow.camera.top = 10;
      keyLight.shadow.camera.bottom = -10;
      scene.add(keyLight);
      const fillLight = new THREE.DirectionalLight(0xff8074, 2.1);
      fillLight.position.set(-7, 5, 2);
      scene.add(fillLight);
      const rimLight = new THREE.DirectionalLight(0xb6e4ee, 1.5);
      rimLight.position.set(3, 5, -8);
      scene.add(rimLight);
      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(36, 36),
        new THREE.ShadowMaterial({ color: 0x0a1b22, opacity: environment === "dark" ? 0.28 : 0.15 }),
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -0.42;
      floor.receiveShadow = true;
      scene.add(floor);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.065;
      controls.enablePan = false;
      controls.minDistance = 8;
      controls.maxDistance = 24;
      controls.minPolarAngle = Math.PI * 0.18;
      controls.maxPolarAngle = Math.PI * 0.48;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.62;
      const resize = () => {
        const width = Math.max(host.clientWidth, 1);
        const height = Math.max(host.clientHeight, 1);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      const observer = new ResizeObserver(resize);
      observer.observe(host);
      resize();
      host.appendChild(renderer.domElement);
      const runtime: ViewerRuntime = { scene, camera, renderer, controls, observer, product: null, animationFrame: 0 };
      runtimeRef.current = runtime;
      const animate = () => {
        controls.update();
        renderer.render(scene, camera);
        runtime.animationFrame = window.requestAnimationFrame(animate);
      };
      animate();
      return () => {
        window.cancelAnimationFrame(runtime.animationFrame);
        observer.disconnect();
        controls.dispose();
        disposeObject(scene);
        renderer.domElement.remove();
        renderer.forceContextLoss();
        renderer.dispose();
        runtimeRef.current = null;
      };
    } catch {
      setFailed(true);
    }
  }, [environment]);

  useEffect(() => {
    const runtime = runtimeRef.current;
    if (!runtime) return;
    try {
      if (runtime.product) {
        runtime.scene.remove(runtime.product);
        disposeObject(runtime.product);
      }
      const product = makeProductDisplay(type, variant, environment);
      runtime.product = product;
      runtime.scene.add(product);
      const viewerAspect = runtime.renderer.domElement.clientWidth / Math.max(runtime.renderer.domElement.clientHeight, 1);
      const narrowViewer = viewerAspect < 1.05;
      runtime.camera.fov = narrowViewer ? 38 : 32;
      runtime.camera.position.set(
        narrowViewer ? 6.5 : type === "barrier" ? 8.8 : 7.8,
        narrowViewer ? 7 : type === "barrier" ? 6.7 : 6.4,
        narrowViewer ? 18.5 : type === "barrier" ? 13.6 : 11.7,
      );
      runtime.camera.updateProjectionMatrix();
      runtime.controls.target.set(0, type === "barrier" ? 1.15 : 1.45, 0);
      runtime.controls.update();
      runtime.renderer.domElement.setAttribute("aria-label", `${label}, display model 3D interaktif`);
      runtime.renderer.render(runtime.scene, runtime.camera);
      setReadyKey(renderKey);
    } catch {
      setFailed(true);
    }
  }, [environment, label, renderKey, type, variant]);

  if (failed) {
    return <div className="three-viewer-fallback"><img src={fallbackImage} alt={label} /><span>Preview produk</span></div>;
  }
  return <div className={`three-viewer theme-${environment}${readyKey === renderKey ? "" : " is-loading"}`} ref={hostRef}><span className="three-viewer-badge">LIVE 3D · PRODUCT DISPLAY · DRAG TO ROTATE</span></div>;
}
