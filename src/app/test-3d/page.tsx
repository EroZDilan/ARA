"use client";

import { useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function Bird({ path }: { path: string }) {
  const { scene } = useGLTF(path);
  const ref = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useEffect(() => {
    if (!ref.current) return;
    const box = new THREE.Box3().setFromObject(ref.current);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    ref.current.position.sub(center);
    const maxDim = Math.max(size.x, size.y, size.z);
    camera.position.set(0, 0, maxDim * 1.6);
    camera.lookAt(0, 0, 0);
  }, [scene, camera]);

  return <primitive ref={ref} object={scene} />;
}

export default function Test3D() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#071726" }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 40 }}>
        <ambientLight intensity={1.1} />
        <directionalLight position={[3, 4, 5]} intensity={2} />
        <directionalLight position={[-3, -2, -5]} intensity={0.8} />
        <Bird path="/models/test-recolor.glb" />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
