import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Orb({ position, speed, radius }: { position: [number, number, number]; speed: number; radius: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialPos = useMemo(() => new THREE.Vector3(...position), [position]);
  const timeOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.position.x = initialPos.x + Math.sin(t * speed + timeOffset) * 1.5;
    meshRef.current.position.y = initialPos.y + Math.cos(t * speed * 0.7 + timeOffset) * 0.8;
    meshRef.current.position.z = initialPos.z + Math.sin(t * speed * 0.5 + timeOffset) * 0.5;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshBasicMaterial
        color="#4A90D9"
        transparent
        opacity={0.2}
        wireframe
        depthWrite={false}
      />
    </mesh>
  );
}

function OrbsGroup() {
  const orbs = useMemo(() => {
    const skills = ['Ps', 'Ai', 'Pr', 'Ae', 'Wp', 'Cp', 'AI'];
    return skills.map((_, i) => ({
      position: [
        Math.cos((i / 7) * Math.PI * 2) * 3,
        Math.sin((i / 7) * Math.PI * 2) * 1.5,
        -2 - Math.random() * 2,
      ] as [number, number, number],
      speed: 0.15 + Math.random() * 0.2,
      radius: 0.25 + Math.random() * 0.15,
    }));
  }, []);

  return (
    <group>
      {orbs.map((orb, i) => (
        <Orb key={i} position={orb.position} speed={orb.speed} radius={orb.radius} />
      ))}
    </group>
  );
}

export default function FloatingOrbs() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (isMobile) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.3,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
      >
        <OrbsGroup />
      </Canvas>
    </div>
  );
}
