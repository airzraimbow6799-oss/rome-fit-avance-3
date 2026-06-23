import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Stage, Bounds, Center } from '@react-three/drei';
import * as THREE from 'three';
import { SIZE_DATA, SizeName } from './tokens';

useGLTF.preload('/models/male_human_a_pose.glb');
useGLTF.preload('/models/oversized_t-shirt.glb');

function HumanModel() {
  const { scene } = useGLTF('/models/male_human_a_pose.glb');
  const cloned = useRef<THREE.Group | null>(null);
  if (!cloned.current) {
    cloned.current = scene.clone(true);
  }
  return <primitive object={cloned.current} />;
}

function ShirtModel({ size, color }: { size: SizeName; color: string }) {
  const { scene } = useGLTF('/models/oversized_t-shirt.glb');
  const cloned = useRef<THREE.Group | null>(null);

  if (!cloned.current) {
    cloned.current = scene.clone(true);
  }

  useEffect(() => {
    if (!cloned.current) return;
    cloned.current.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh && mesh.material) {
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((mat) => {
          const std = mat as THREE.MeshStandardMaterial;
          if (std.color) {
            std.color.set(color);
            std.needsUpdate = true;
          }
        });
      }
    });
  }, [color]);

  const data = SIZE_DATA[size];
  const scaleX = 1.0 + (data.wm - 0.38) * 0.18;
  const scaleY = 1.0 + (data.lm - 0.35) * 0.14;

  return <primitive object={cloned.current} scale={[scaleX, scaleY, scaleX]} />;
}

function SceneContent({ size, color }: { size: SizeName; color: string }) {
  return (
    <Bounds fit clip observe margin={1.3}>
      <Center>
        <HumanModel />
        <ShirtModel size={size} color={color} />
      </Center>
    </Bounds>
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
    <div
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <color attach="background" args={[dark ? '#1e1e1e' : '#f0f0f0']} />

        <ambientLight intensity={dark ? 1.0 : 1.4} />
        <directionalLight position={[3, 10, 5]} intensity={dark ? 1.0 : 1.5} castShadow />
        <directionalLight position={[-3, 5, -2]} intensity={0.4} />
        <directionalLight position={[0, -3, 5]} intensity={0.2} />

        <Suspense fallback={null}>
          <SceneContent size={size} color={shirtColor} />
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
