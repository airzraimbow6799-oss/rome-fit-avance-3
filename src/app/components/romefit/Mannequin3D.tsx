import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, Center } from '@react-three/drei';
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
  const colorRef = useRef(color);

  if (!cloned.current) {
    cloned.current = scene.clone(true);
  }

  useEffect(() => {
    if (!cloned.current) return;
    colorRef.current = color;
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
  const scaleZ = scaleX;

  return <primitive object={cloned.current} scale={[scaleX, scaleY, scaleZ]} />;
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshBasicMaterial color="#444" />
    </mesh>
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
  const bg = dark ? '#1e1e1e' : '#f0f0f0';

  return (
    <div
      className={className}
      style={{ width: '100%', height: '100%', background: bg, borderRadius: 'inherit', ...style }}
    >
      <Canvas
        camera={{ position: [0, 1.1, 3.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={dark ? 0.6 : 0.8} />
        <directionalLight position={[2, 4, 3]} intensity={1.2} castShadow />
        <directionalLight position={[-2, 2, -1]} intensity={0.4} />

        {dark ? (
          <Environment preset="night" />
        ) : (
          <Environment preset="apartment" />
        )}

        <Suspense fallback={<LoadingFallback />}>
          <Center>
            <HumanModel />
            <ShirtModel size={size} color={shirtColor} />
          </Center>
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.8}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
