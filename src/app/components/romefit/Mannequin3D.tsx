import React, { Suspense, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Bounds, Center } from '@react-three/drei';
import * as THREE from 'three';
import { SIZE_DATA, SizeName } from './tokens';

useGLTF.preload('/models/male_human_a_pose.glb');
useGLTF.preload('/models/oversized_t-shirt.glb');

function cloneWithMaterials(scene: THREE.Group): THREE.Group {
  const clone = scene.clone(true);
  clone.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.isMesh && mesh.material) {
      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map((m: THREE.Material) => m.clone())
        : (mesh.material as THREE.Material).clone();
    }
  });
  return clone;
}

function applyColor(group: THREE.Group, color: string) {
  group.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.isMesh && mesh.material) {
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((mat) => {
        const std = mat as THREE.MeshStandardMaterial;
        if (std.color) {
          std.color.set(color);
          std.map = null;
          std.needsUpdate = true;
        }
      });
    }
  });
}

function Models({ size, shirtColor }: { size: SizeName; shirtColor: string }) {
  const humanGltf = useGLTF('/models/male_human_a_pose.glb');
  const shirtGltf = useGLTF('/models/oversized_t-shirt.glb');

  const humanClone = useMemo(
    () => cloneWithMaterials(humanGltf.scene as unknown as THREE.Group),
    [humanGltf.scene],
  );

  const shirtClone = useMemo(
    () => cloneWithMaterials(shirtGltf.scene as unknown as THREE.Group),
    [shirtGltf.scene],
  );

  useEffect(() => {
    applyColor(shirtClone, shirtColor);
  }, [shirtClone, shirtColor]);

  const data = SIZE_DATA[size];
  const sx = 1.0 + (data.wm - 0.38) * 0.18;
  const sy = 1.0 + (data.lm - 0.35) * 0.14;

  return (
    <Center>
      <primitive object={humanClone} />
      <primitive object={shirtClone} scale={[sx, sy, sx]} />
    </Center>
  );
}

interface Mannequin3DProps {
  size?: SizeName;
  shirtColor?: string;
  dark?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Mannequin3D({
  size = 'M',
  shirtColor = '#ffffff',
  dark = false,
  className = '',
  style,
}: Mannequin3DProps) {
  return (
    <div className={className} style={{ width: '100%', height: '100%', ...style }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <color attach="background" args={[dark ? '#1e1e1e' : '#f0f0f0']} />

        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 10, 5]} intensity={2} />
        <directionalLight position={[-3, 5, -2]} intensity={0.6} />
        <directionalLight position={[0, -2, 5]} intensity={0.4} />

        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.2}>
            <Models size={size} shirtColor={shirtColor} />
          </Bounds>
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
