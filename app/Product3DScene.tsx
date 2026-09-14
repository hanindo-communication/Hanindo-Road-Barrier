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

const orange = 0xf13d27;
const reflector = 0xe4ebea;

function material(color: number, roughness = 0.42, metalness = 0.02) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function makeTrafficCone(variant = "traffic-cone-75") {
  const group = new THREE.Group();
  const orangeMaterial = material(orange, 0.32);
  const reflectorMaterial = material(reflector, 0.2, 0.12);
  const baseMaterial = variant === "traffic-cone-mathes" ? material(0x181b1e, 0.68) : orangeMaterial;

  const base = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.28, 3.5), baseMaterial);
  base.position.y = 0.14;
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  const segments = [
    { height: 1.45, bottom: 1.2, top: 0.89, color: orangeMaterial },
    { height: 0.66, bottom: 0.89, top: 0.74, color: reflectorMaterial },
    { height: 0.62, bottom: 0.74, top: 0.6, color: orangeMaterial },
    { height: 0.66, bottom: 0.6, top: 0.44, color: reflectorMaterial },
    { height: 1.34, bottom: 0.44, top: 0.14, color: orangeMaterial },
  ];

  let cursor = 0.28;
  segments.forEach((segment) => {
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(segment.top, segment.bottom, segment.height, 48, 1, false),
      segment.color,
    );
    mesh.position.y = cursor + segment.height / 2;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    cursor += segment.height;
  });

  if (variant === "traffic-cone-50") group.scale.set(0.88, 0.78, 0.88);
  if (variant === "traffic-cone-mathes") group.scale.set(0.83, 1, 0.83);
  group.rotation.y = -0.35;
  return group;
}

function makeStickCone(variant = "stick-cone") {
  const group = new THREE.Group();
  const orangeMaterial = material(orange, 0.36);
  const reflectorMaterial = material(reflector, 0.2, 0.12);
  const baseMaterial = material(variant === "stick-cone-2" ? 0xe33428 : 0x181b1e, 0.65);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.72, 2.04, 0.5, 8), baseMaterial);
  base.position.y = 0.25;
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.54, 0.7, 0.22, 32), orangeMaterial);
  foot.position.y = 0.57;
  foot.castShadow = true;
  group.add(foot);

  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.36, 4.55, 40), orangeMaterial);
  pole.position.y = 2.88;
  pole.castShadow = true;
  group.add(pole);

  const lowerReflector = new THREE.Mesh(new THREE.CylinderGeometry(0.315, 0.325, 0.52, 40), reflectorMaterial);
  lowerReflector.position.y = 3.78;
  lowerReflector.castShadow = true;
  group.add(lowerReflector);

  const upperReflector = new THREE.Mesh(new THREE.CylinderGeometry(0.305, 0.315, 0.58, 40), reflectorMaterial);
  upperReflector.position.y = 4.62;
  upperReflector.castShadow = true;
  group.add(upperReflector);

  if (variant === "stick-cone-2") {
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.39, 0.08, 12, 36), reflectorMaterial);
    collar.rotation.x = Math.PI / 2;
    collar.position.y = 1.52;
    collar.castShadow = true;
    group.add(collar);
  }

  const cap = new THREE.Mesh(new THREE.CapsuleGeometry(0.37, 0.34, 8, 24), orangeMaterial);
  cap.position.y = 5.36;
  cap.castShadow = true;
  group.add(cap);

  group.rotation.y = 0.28;
  return group;
}

type BarrierModelConfig = {
  width: number;
  height: number;
  depth: number;
  topInset: number;
  midInset: number;
  feet: number;
  connectors: number;
};

const barrierConfigs: Record<string, BarrierModelConfig> = {
  "road-barrier-1": { width: 5.55, height: 2.75, depth: 1.18, topInset: .1, midInset: .08, feet: 3, connectors: 1 },
  "road-barrier-2": { width: 5.9, height: 2.9, depth: 1.34, topInset: .14, midInset: .42, feet: 3, connectors: 2 },
  "road-barrier-3": { width: 5.65, height: 2.95, depth: 1.3, topInset: .12, midInset: .36, feet: 3, connectors: 1 },
  "road-barrier-mathes": { width: 5.95, height: 3.08, depth: 1.28, topInset: .34, midInset: .5, feet: 3, connectors: 1 },
  "road-barrier-4": { width: 6.15, height: 2.55, depth: 1.42, topInset: .05, midInset: .3, feet: 2, connectors: 1 },
  "road-barrier-5": { width: 5.6, height: 3.2, depth: 1.48, topInset: .42, midInset: .55, feet: 2, connectors: 1 },
};

function addBarrierMesh(group: THREE.Group, geometry: THREE.BufferGeometry, meshMaterial: THREE.Material, position: [number, number, number], rotation = 0) {
  const mesh = new THREE.Mesh(geometry, meshMaterial);
  mesh.position.set(...position);
  mesh.rotation.z = rotation;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function makeWarningMaterial(direction: "left" | "right" = "left") {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 160;
  const context = canvas.getContext("2d");
  if (context) {
    context.fillStyle = "#111719";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#ffc928";
    for (let index = -1; index < 5; index += 1) {
      const offset = index * 128;
      context.beginPath();
      if (direction === "left") {
        context.moveTo(offset + 28, 80);
        context.lineTo(offset + 88, 4);
        context.lineTo(offset + 142, 4);
        context.lineTo(offset + 82, 80);
        context.lineTo(offset + 142, 156);
        context.lineTo(offset + 88, 156);
      } else {
        context.moveTo(offset + 142, 80);
        context.lineTo(offset + 82, 4);
        context.lineTo(offset + 28, 4);
        context.lineTo(offset + 88, 80);
        context.lineTo(offset + 28, 156);
        context.lineTo(offset + 82, 156);
      }
      context.closePath();
      context.fill();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return new THREE.MeshStandardMaterial({ map: texture, roughness: .4 });
}

function addWarningSign(group: THREE.Group, width: number, height: number, y: number, z: number, direction: "left" | "right" = "left") {
  addBarrierMesh(group, new THREE.BoxGeometry(width, height, .08), makeWarningMaterial(direction), [0, y, z]);
}

function addRaisedBar(group: THREE.Group, redMaterial: THREE.Material, x: number, y: number, z: number, width: number, height: number, rotation = 0) {
  addBarrierMesh(group, new THREE.BoxGeometry(width, height, .13), redMaterial, [x, y, z], rotation);
}

function makeRoadBarrier(variant = "road-barrier-mathes") {
  const config = barrierConfigs[variant] ?? barrierConfigs["road-barrier-mathes"];
  const group = new THREE.Group();
  const redMaterial = material(orange, .38);
  const redHighlight = material(0xff5548, .35);
  const redShadow = material(0xbc2027, .48);
  const darkMaterial = material(0x151819, .62);
  const reflectorMaterial = material(reflector, .22, .08);

  const halfWidth = config.width / 2;
  const profile = new THREE.Shape();
  profile.moveTo(-halfWidth + .08, .28);
  profile.lineTo(-halfWidth + config.midInset, config.height * .48);
  profile.lineTo(-halfWidth + config.topInset, config.height - .12);
  profile.quadraticCurveTo(-halfWidth + config.topInset, config.height, -halfWidth + config.topInset + .14, config.height);
  profile.lineTo(halfWidth - config.topInset - .14, config.height);
  profile.quadraticCurveTo(halfWidth - config.topInset, config.height, halfWidth - config.topInset, config.height - .12);
  profile.lineTo(halfWidth - config.midInset, config.height * .48);
  profile.lineTo(halfWidth - .08, .28);
  profile.closePath();

  const bodyGeometry = new THREE.ExtrudeGeometry(profile, {
    depth: config.depth,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: .055,
    bevelThickness: .055,
  });
  bodyGeometry.translate(0, 0, -config.depth / 2);
  addBarrierMesh(group, bodyGeometry, redMaterial, [0, 0, 0]);

  const footSpacing = config.width / (config.feet + .5);
  for (let index = 0; index < config.feet; index += 1) {
    const x = (index - (config.feet - 1) / 2) * footSpacing;
    addBarrierMesh(group, new THREE.BoxGeometry(config.feet === 2 ? 1.02 : .84, .34, config.depth + .18), redShadow, [x, .17, 0]);
  }

  for (const side of [-1, 1]) {
    for (let index = 0; index < config.connectors; index += 1) {
      const y = config.connectors === 2 ? .8 + index * 1.28 : .78;
      addBarrierMesh(group, new THREE.BoxGeometry(.68, .3, .54), redMaterial, [side * (halfWidth + .28), y, 0]);
      if (side > 0) addBarrierMesh(group, new THREE.CylinderGeometry(.11, .13, .32, 20), redMaterial, [side * (halfWidth + .53), y + .23, 0]);
    }
  }

  addBarrierMesh(group, new THREE.CylinderGeometry(.13, .16, .12, 24), darkMaterial, [0, config.height + .08, 0]);
  const frontZ = config.depth / 2 + .08;

  if (variant === "road-barrier-1") {
    const circle = new THREE.Mesh(new THREE.TorusGeometry(.45, .075, 12, 42), redShadow);
    circle.position.set(0, 2.02, frontZ);
    circle.castShadow = true;
    group.add(circle);
    [-1.72, -1.28].forEach((x) => {
      addRaisedBar(group, redShadow, x, 2.03, frontZ, .16, .73, -.63);
      addRaisedBar(group, redHighlight, x + .32, 2.03, frontZ, .16, .73, .63);
    });
    [1.28, 1.72].forEach((x) => {
      addRaisedBar(group, redHighlight, x, 2.03, frontZ, .16, .73, .63);
      addRaisedBar(group, redShadow, x - .32, 2.03, frontZ, .16, .73, -.63);
    });
    addRaisedBar(group, redHighlight, 0, 1.18, frontZ, config.width - .55, .12);
  } else if (variant === "road-barrier-2") {
    addWarningSign(group, 1.95, .5, 2.34, frontZ, "right");
    [-1.55, 0, 1.55].forEach((x) => addRaisedBar(group, redShadow, x, 1.18, frontZ, .48, 1.03));
    [-1.6, 0, 1.6].forEach((x) => addBarrierMesh(group, new THREE.ConeGeometry(.18, .28, 3), redShadow, [x, 2.06, frontZ]));
  } else if (variant === "road-barrier-3") {
    addWarningSign(group, 1.92, .55, 2.18, frontZ, "left");
    [-1.82, 1.82].forEach((x, index) => {
      const direction = index === 0 ? -1 : 1;
      addRaisedBar(group, redShadow, x, 2.16, frontZ, .2, 1.08, direction * .66);
      addRaisedBar(group, redHighlight, x + direction * .5, 2.16, frontZ, .2, 1.08, -direction * .66);
    });
    [-1.62, 0, 1.62].forEach((x) => addRaisedBar(group, redShadow, x, .83, frontZ, .43, .76));
  } else if (variant === "road-barrier-mathes") {
    [-2, -1, 0, 1, 2].forEach((x, index) => {
      const panelMaterial = index === 0 || index === 4 ? reflectorMaterial : redShadow;
      addRaisedBar(group, panelMaterial, x, 2.46, frontZ, .72, .82, index < 2 ? -.08 : index > 2 ? .08 : 0);
    });
    [-1.35, 1.35].forEach((x) => addRaisedBar(group, redShadow, x, 1.12, frontZ, .45, .82));
  } else if (variant === "road-barrier-4") {
    addWarningSign(group, 4.12, .48, 1.65, frontZ, "right");
    addRaisedBar(group, redHighlight, 0, 2.42, frontZ, 4.9, .16);
    [-2.28, 2.28].forEach((x) => addRaisedBar(group, redShadow, x, .85, frontZ, .38, .67));
  } else {
    addWarningSign(group, 3.35, .57, 2.18, frontZ, "left");
    [-1.72, 1.72].forEach((x, index) => addRaisedBar(group, redHighlight, x, 2.76, frontZ, .22, .9, index === 0 ? -.58 : .58));
    [-1.45, 0, 1.45].forEach((x) => addRaisedBar(group, redShadow, x, .92, frontZ, .42, .78));
  }

  group.rotation.y = -.24;
  return group;
}

function disposeObject(root: THREE.Object3D) {
  const disposedMaterials = new Set<THREE.Material>();
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    object.geometry.dispose();
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
      const backgroundColor = environment === "dark" ? 0x142a35 : 0xe9eeeb;
      scene.background = new THREE.Color(backgroundColor);
      scene.fog = new THREE.Fog(backgroundColor, 13, 25);

      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
      camera.position.set(4.8, 4.2, 10.6);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;

      const hemisphere = new THREE.HemisphereLight(0xffffff, 0x304653, 2.35);
      scene.add(hemisphere);

      const keyLight = new THREE.DirectionalLight(0xffffff, 3.7);
      keyLight.position.set(5, 9, 6);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0xff7467, 2.1);
      rimLight.position.set(-6, 4, -5);
      scene.add(rimLight);

      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(28, 28),
        new THREE.ShadowMaterial({ color: 0x10242d, opacity: 0.2 }),
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -0.01;
      floor.receiveShadow = true;
      scene.add(floor);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.07;
      controls.enablePan = false;
      controls.minDistance = 6.5;
      controls.maxDistance = 15;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.15;

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
      renderer.render(scene, camera);
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

      const product = type === "barrier" ? makeRoadBarrier(variant) : type === "cone" ? makeTrafficCone(variant) : makeStickCone(variant);
      runtime.product = product;
      runtime.scene.add(product);
      runtime.camera.position.set(type === "barrier" ? 4.8 : 7.2, type === "stick" ? 4.9 : 4.2, type === "barrier" ? 10.6 : 8.2);
      runtime.controls.target.set(0, type === "stick" ? 2.65 : type === "barrier" ? 1.35 : 2.25, 0);
      runtime.controls.update();
      runtime.renderer.domElement.setAttribute("aria-label", `${label}, model 3D interaktif`);
      runtime.renderer.render(runtime.scene, runtime.camera);
      setReadyKey(renderKey);
    } catch {
      setFailed(true);
    }
  }, [label, renderKey, type, variant]);

  if (failed) {
    return <div className="three-viewer-fallback"><img src={fallbackImage} alt={label} /><span>Preview produk</span></div>;
  }

  return <div className={`three-viewer theme-${environment}${readyKey === renderKey ? "" : " is-loading"}`} ref={hostRef}><span className="three-viewer-badge">LIVE 3D · DRAG TO ROTATE</span></div>;
}
