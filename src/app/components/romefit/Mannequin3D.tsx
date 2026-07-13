import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SizeName } from './tokens';

/*
 * Avatar 3D unificado (cuerpo + polo en un solo GLB con morph targets
 * horneados en Blender). El polo fue esculpido SOBRE el cuerpo (shrinkwrap)
 * y sus morphs tienen amplitud mayor que los del cuerpo, por lo que la
 * prenda nunca se traspasa con el maniquí en ninguna combinación.
 *
 * Morphs cuerpo:  ancho, altura, hombros, abdomen, caidos
 * Morphs polo:    los mismos + holgura, largo (solo prenda)
 */

export interface WizardMorphInput {
  altura?: string;     // cm
  peso?: string;       // kg
  pecho?: string;      // cm
  complexion?: string; // 'Delgado' | 'Atlético' | 'Robusto'
  fitStyle?: string;   // 'Muy Justo' | 'Regular' | 'Oversize Moderado' | 'Oversize Extremo'
}

interface Mannequin3DProps {
  size?: SizeName;
  shirtColor?: string;
  wizard?: WizardMorphInput;
  className?: string;
  style?: React.CSSProperties;
  /** true => permite rotar con el mouse (default true) */
  interactive?: boolean;
}

type Morphs = {
  ancho: number; altura: number; hombros: number; abdomen: number;
  caidos: number; holgura: number; largo: number;
};

const NEUTRAL_BODY = { ancho: 0.35, altura: 0.3, hombros: 0.1, abdomen: 0.2, caidos: 0 };

// Influencias de la PRENDA por talla (el cuerpo no cambia con la talla estándar)
const SIZE_TO_FIT: Record<string, { holgura: number; largo: number }> = {
  XS: { holgura: 0.0, largo: 0.0 },
  S: { holgura: 0.22, largo: 0.15 },
  M: { holgura: 0.45, largo: 0.32 },
  L: { holgura: 0.7, largo: 0.52 },
  XL: { holgura: 0.95, largo: 0.72 },
  XXL: { holgura: 1.15, largo: 0.85 },
  XXXL: { holgura: 1.3, largo: 1.0 },
};

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

function computeMorphs(size: SizeName, wizard?: WizardMorphInput): Morphs {
  const fit = SIZE_TO_FIT[size] ?? SIZE_TO_FIT.M;
  const m: Morphs = { ...NEUTRAL_BODY, holgura: fit.holgura, largo: fit.largo };
  if (!wizard) return m;

  const peso = parseInt(wizard.peso || '', 10);
  const alturaCm = parseInt(wizard.altura || '', 10);
  const pecho = parseInt(wizard.pecho || '', 10);

  if (!isNaN(peso)) m.ancho = clamp01((peso - 55) / 50);          // 55kg=0 .. 105kg=1
  if (!isNaN(alturaCm)) m.altura = clamp01((alturaCm - 158) / 34); // 158cm=0 .. 192cm=1
  if (!isNaN(pecho)) m.hombros = clamp01((pecho - 85) / 35);       // 85cm=0 .. 120cm=1

  if (wizard.complexion === 'Delgado') { m.abdomen = 0; m.ancho = Math.max(0, m.ancho - 0.1); }
  if (wizard.complexion === 'Atlético') { m.abdomen = 0.1; m.hombros = Math.max(m.hombros, 0.5); }
  if (wizard.complexion === 'Robusto') { m.abdomen = 1; m.ancho = Math.min(1, m.ancho + 0.1); }

  if (wizard.fitStyle === 'Muy Justo') { m.holgura = 0.05; m.largo = 0.1; }
  else if (wizard.fitStyle === 'Regular') { m.holgura = 0.45; m.largo = 0.32; }
  else if (wizard.fitStyle === 'Oversize Moderado') { m.holgura = 0.85; m.largo = 0.62; }
  else if (wizard.fitStyle === 'Oversize Extremo') { m.holgura = 1.25; m.largo = 0.95; }

  return m;
}

export function Mannequin3D({
  size = 'M',
  shirtColor = '#ffffff',
  wizard,
  className = '',
  style,
  interactive = true,
}: Mannequin3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Refs mutables consultadas por el loop de animación
  const targetsRef = useRef<Morphs>(computeMorphs(size, wizard));
  const colorRef = useRef<string>(shirtColor);
  const meshesRef = useRef<{ body: THREE.Mesh | null; shirt: THREE.Mesh | null }>({ body: null, shirt: null });

  // Actualiza objetivos cuando cambian props (el loop interpola => tiempo real suave)
  targetsRef.current = computeMorphs(size, wizard);
  colorRef.current = shirtColor;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 1.05, 3.4);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enabled = interactive;
    controls.target.set(0, 0.95, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(2, 3, 3);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x90b0d0, 0.7);
    fill.position.set(-2, 1, -2);
    scene.add(fill);

    const loader = new GLTFLoader();
    loader.load('/avatar_fit.glb', (gltf) => {
      gltf.scene.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.isMesh && mesh.morphTargetDictionary) {
          mesh.frustumCulled = false;
          if ('holgura' in mesh.morphTargetDictionary) {
            meshesRef.current.shirt = mesh;
            (mesh.material as THREE.MeshStandardMaterial).side = THREE.DoubleSide;
          } else {
            meshesRef.current.body = mesh;
          }
        }
      });
      scene.add(gltf.scene);
      applyMorphs(true);
    }, undefined, (err) => console.error('Error cargando avatar_fit.glb:', err));

    function applyToMesh(mesh: THREE.Mesh | null, immediate: boolean) {
      if (!mesh || !mesh.morphTargetInfluences || !mesh.morphTargetDictionary) return;
      const dict = mesh.morphTargetDictionary;
      const t = targetsRef.current;
      (Object.keys(t) as (keyof Morphs)[]).forEach((name) => {
        if (!(name in dict)) return;
        const idx = dict[name];
        const cur = mesh.morphTargetInfluences![idx];
        mesh.morphTargetInfluences![idx] = immediate ? t[name] : cur + (t[name] - cur) * 0.14;
      });
    }

    function applyMorphs(immediate: boolean) {
      applyToMesh(meshesRef.current.body, immediate);
      applyToMesh(meshesRef.current.shirt, immediate);
      const shirt = meshesRef.current.shirt;
      if (shirt) (shirt.material as THREE.MeshStandardMaterial).color.set(colorRef.current);
    }

    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      controls.update();
      applyMorphs(false);
      renderer.render(scene, camera);
    };
    animate();

    const resize = () => {
      const w = container.clientWidth, h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) container.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: '100%', height: '100%', cursor: interactive ? 'grab' : 'default', ...style }}
    />
  );
}
