import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Torus() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.1;
    meshRef.current.rotation.y = t * 0.15;
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1.2, 0.3, 128, 32]} />
      <meshBasicMaterial
        color="#4A90D9"
        wireframe
        transparent
        opacity={0.08}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function RotatingTorus() {
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
        right: '-10%',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '50%',
        height: '80%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.6,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
      >
        <Torus />
      </Canvas>
    </div>
  );
}
