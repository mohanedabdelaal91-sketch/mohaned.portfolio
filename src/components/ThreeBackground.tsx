import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function GeometricShapes() {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  const shapes = useMemo(() => {
    return [
      { geometry: 'icosahedron', position: [-3, 1, -2], scale: 0.6, speed: 0.3 },
      { geometry: 'torusKnot', position: [3, -1, -3], scale: 0.4, speed: 0.2 },
      { geometry: 'octahedron', position: [-1, -2, -1], scale: 0.5, speed: 0.4 },
      { geometry: 'icosahedron', position: [2, 2, -4], scale: 0.3, speed: 0.25 },
      { geometry: 'torusKnot', position: [-2, 0, -2.5], scale: 0.35, speed: 0.35 },
    ];
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    groupRef.current.children.forEach((child, i) => {
      child.rotation.x = t * shapes[i].speed * 0.5;
      child.rotation.y = t * shapes[i].speed * 0.3;
      child.position.y = shapes[i].position[1] + Math.sin(t * 0.3 + i) * 0.15;
    });

    // Parallax on mouse move
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      mouse.x * 0.3,
      0.05
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      mouse.y * 0.2,
      0.05
    );
  });

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <mesh key={i} position={shape.position as [number, number, number]} scale={shape.scale}>
          {shape.geometry === 'icosahedron' && <icosahedronGeometry args={[1, 0]} />}
          {shape.geometry === 'torusKnot' && <torusKnotGeometry args={[0.6, 0.2, 64, 16]} />}
          {shape.geometry === 'octahedron' && <octahedronGeometry args={[1, 0]} />}
          <meshBasicMaterial
            color="#4A90D9"
            wireframe
            transparent
            opacity={0.15}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function ThreeBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(
        window.innerWidth < 768 ||
        (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency < 4)
      );
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (isMobile) {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, var(--color-bg-primary) 0%, var(--color-bg-gradient-end) 100%)',
          zIndex: -1,
        }}
      />
    );
  }

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <GeometricShapes />
      </Canvas>
    </div>
  );
}
