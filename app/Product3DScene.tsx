"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type Product3DSceneProps = {
  type: "barrier" | "cone" | "stick";
  fallbackImage: string;
  label: string;
};

const orange = 0xf13d27;
const reflector = 0xe4ebea;

function material(color: number, roughness = 0.42, metalness = 0.02) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function makeTrafficCone() {
  const group = new THREE.Group();
  const orangeMaterial = material(orange, 0.32);
  const reflectorMaterial = material(reflector, 0.2, 0.12);

  const base = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.28, 3.5), orangeMaterial);
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

  group.rotation.y = -0.35;
  return group;
}

function makeStickCone() {
  const group = new THREE.Group();
  const orangeMaterial = material(orange, 0.36);
  const reflectorMaterial = material(reflector, 0.2, 0.12);
  const baseMaterial = material(0x181b1e, 0.65);

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

  const cap = new THREE.Mesh(new THREE.CapsuleGeometry(0.37, 0.34, 8, 24), orangeMaterial);
  cap.position.y = 5.36;
  cap.castShadow = true;
  group.add(cap);

  group.rotation.y = 0.28;
  return group;
}

function makeRoadBarrier() {
  const group = new THREE.Group();
  const redMaterial = material(orange, 0.38);
  const darkMaterial = material(0x151819, 0.62);

  const profile = new THREE.Shape();
  profile.moveTo(-2.78, 0.42);
  profile.lineTo(-2.62, 2.55);
  profile.quadraticCurveTo(-2.6, 2.72, -2.42, 2.72);
  profile.lineTo(2.42, 2.72);
  profile.quadraticCurveTo(2.6, 2.72, 2.62, 2.55);
  profile.lineTo(2.78, 0.42);
  profile.lineTo(2.36, 0.42);
  profile.lineTo(2.25, 0.02);
  profile.lineTo(1.2, 0.02);
  profile.lineTo(1.08, 0.42);
  profile.lineTo(-1.08, 0.42);
  profile.lineTo(-1.2, 0.02);
  profile.lineTo(-2.25, 0.02);
  profile.lineTo(-2.36, 0.42);
  profile.closePath();

  const bodyGeometry = new THREE.ExtrudeGeometry(profile, {
    depth: 1.28,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.06,
    bevelThickness: 0.06,
  });
  bodyGeometry.translate(0, 0, -0.64);
  const body = new THREE.Mesh(bodyGeometry, redMaterial);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  const connectorLeft = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.36, 0.58), redMaterial);
  connectorLeft.position.set(-3.03, 0.76, 0);
  connectorLeft.castShadow = true;
  group.add(connectorLeft);

  const connectorRight = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.3, 0.48), redMaterial);
  connectorRight.position.set(3.03, 0.84, 0);
  connectorRight.castShadow = true;
  group.add(connectorRight);

  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.17, 0.12, 24), darkMaterial);
  cap.position.set(0, 2.82, 0);
  cap.castShadow = true;
  group.add(cap);

  const warningCanvas = document.createElement("canvas");
  warningCanvas.width = 512;
  warningCanvas.height = 160;
  const context = warningCanvas.getContext("2d");
  if (context) {
    context.fillStyle = "#121516";
    context.fillRect(0, 0, warningCanvas.width, warningCanvas.height);
    context.fillStyle = "#ffc31c";
    for (let index = -1; index < 5; index += 1) {
      const offset = index * 128;
      context.beginPath();
      context.moveTo(offset + 28, 80);
      context.lineTo(offset + 88, 4);
      context.lineTo(offset + 142, 4);
      context.lineTo(offset + 82, 80);
      context.lineTo(offset + 142, 156);
      context.lineTo(offset + 88, 156);
      context.closePath();
      context.fill();
    }
  }
  const warningTexture = new THREE.CanvasTexture(warningCanvas);
  warningTexture.colorSpace = THREE.SRGBColorSpace;
  const sign = new THREE.Mesh(
    new THREE.BoxGeometry(2.45, 0.72, 0.08),
    new THREE.MeshStandardMaterial({ map: warningTexture, roughness: 0.45 }),
  );
  sign.position.set(0, 1.75, 0.71);
  sign.castShadow = true;
  group.add(sign);

  const ribs = [
    { x: -1.8, y: 2.16, rotation: -0.65 },
    { x: 1.8, y: 2.16, rotation: 0.65 },
    { x: -1.65, y: 0.72, rotation: -0.1 },
    { x: 0, y: 0.65, rotation: 0 },
    { x: 1.65, y: 0.72, rotation: 0.1 },
  ];
  ribs.forEach((rib, index) => {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(index < 2 ? 0.22 : 0.42, index < 2 ? 0.9 : 0.72, 0.14),
      redMaterial,
    );
    mesh.position.set(rib.x, rib.y, 0.72);
    mesh.rotation.z = rib.rotation;
    mesh.castShadow = true;
    group.add(mesh);
  });

  group.rotation.y = -0.24;
  return group;
}

export default function Product3DScene({ type, fallbackImage, label }: Product3DSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let animationFrame = 0;

    try {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xe9eeeb);
      scene.fog = new THREE.Fog(0xe9eeeb, 13, 25);

      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
      camera.position.set(type === "barrier" ? 7.8 : 7.2, type === "stick" ? 4.9 : 4.2, type === "barrier" ? 8.8 : 8.2);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      renderer.domElement.setAttribute("aria-label", `${label}, model 3D interaktif`);
      host.appendChild(renderer.domElement);

      const product = type === "barrier" ? makeRoadBarrier() : type === "cone" ? makeTrafficCone() : makeStickCone();
      scene.add(product);

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
      controls.target.set(0, type === "stick" ? 2.65 : type === "barrier" ? 1.35 : 2.25, 0);

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

      const animate = () => {
        controls.update();
        renderer.render(scene, camera);
        animationFrame = window.requestAnimationFrame(animate);
      };
      animate();

      return () => {
        window.cancelAnimationFrame(animationFrame);
        observer.disconnect();
        controls.dispose();
        scene.traverse((object) => {
          if (!(object instanceof THREE.Mesh)) return;
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((entry) => entry.dispose());
        });
        renderer.dispose();
        renderer.domElement.remove();
      };
    } catch {
      setFailed(true);
    }
  }, [label, type]);

  if (failed) {
    return <div className="three-viewer-fallback"><img src={fallbackImage} alt={label} /><span>Preview produk</span></div>;
  }

  return <div className="three-viewer" ref={hostRef}><span className="three-viewer-badge">LIVE 3D · DRAG TO ROTATE</span></div>;
}
