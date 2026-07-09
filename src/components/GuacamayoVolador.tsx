"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

const BASE_ROTATION_Y = -0.35;

function BirdModel({
  reduce,
  modelPath,
  clipName,
  fitMultiplier,
  playOnce = false,
  ambientSway = true,
  speed = 1,
}: {
  reduce: boolean;
  modelPath: string;
  clipName: string;
  fitMultiplier: number;
  playOnce?: boolean;
  ambientSway?: boolean;
  speed?: number;
}) {
  const { scene, animations } = useGLTF(modelPath);
  // Cada instancia (Hero, Protección y footer conviven en la misma página)
  // necesita su propio esqueleto clonado.
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const { actions, mixer } = useAnimations(animations, group);
  const { camera } = useThree();

  useEffect(() => {
    const action = actions[clipName];
    if (!action) return;
    // Three.js AnimationAction is an imperative, mutable object by design (R3F pattern).
    /* eslint-disable react-hooks/immutability */
    action.reset();
    if (playOnce) {
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
    } else {
      action.setLoop(THREE.LoopRepeat, Infinity);
    }
    action.play();
    action.paused = reduce;
    /* eslint-enable react-hooks/immutability */
    return () => {
      action.stop();
    };
  }, [actions, clipName, reduce, playOnce]);

  useEffect(() => {
    if (!inner.current) return;
    // Igual que /test-3d (probado y funcional): se mide la caja en la pose
    // de reposo (antes de que el mixer avance ningún frame) y se centra el
    // objeto sin reescalarlo; en vez de adivinar una escala fija, se aleja
    // la CÁMARA lo necesario para que quepa el diámetro mayor. Evita el
    // bug de encadenar centrado+escala que rompía el encuadre.
    const box = new THREE.Box3().setFromObject(inner.current);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    inner.current.position.sub(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    camera.position.set(0, 0, maxDim * fitMultiplier);
    camera.lookAt(0, 0, 0);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.updateProjectionMatrix();
    }

    // Los meshes animados (skinning) pueden desplazarse más allá del
    // boundingSphere calculado en pose de reposo; desactivar el frustum
    // culling evita que tres.js los oculte de forma prematura.
    inner.current.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) mesh.frustumCulled = false;
    });
  }, [camera, fitMultiplier]);

  // Three.js AnimationMixer/AnimationAction are imperative, mutable objects by design;
  // mutating them every frame is the standard R3F animation pattern.
  // eslint-disable-next-line react-hooks/immutability
  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;

    if (mixer) {
      const wobble = ambientSway ? 0.92 + 0.12 * Math.sin(t * 0.23) : 1;
      // eslint-disable-next-line react-hooks/immutability
      mixer.timeScale = reduce ? 0 : speed * wobble;
    }

    if (!ambientSway) return;

    const driftX = reduce ? 0 : Math.sin(t * 0.18) * 0.16 + Math.sin(t * 0.41) * 0.06;
    const driftY = reduce ? 0 : Math.cos(t * 0.15) * 0.07;
    const bankVelocity = reduce ? 0 : Math.cos(t * 0.18) * 0.18 + Math.cos(t * 0.41) * 0.06;

    group.current.position.x = driftX;
    group.current.position.y = driftY;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      BASE_ROTATION_Y + (reduce ? 0 : Math.sin(t * 0.09) * 0.18),
      delta * 1.5,
    );
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      -bankVelocity * 0.35,
      delta * 2,
    );
  });

  return (
    <group ref={group} rotation={[0, BASE_ROTATION_Y, 0]}>
      <group ref={inner}>
        <primitive object={clonedScene} />
      </group>
    </group>
  );
}

export default function GuacamayoVolador({
  className,
  modelPath,
  clipName,
  fov = 32,
  fitMultiplier = 1.6,
  playOnce = false,
  ambientSway = true,
  speed = 1,
}: {
  className?: string;
  modelPath: string;
  clipName: string;
  fov?: number;
  fitMultiplier?: number;
  playOnce?: boolean;
  ambientSway?: boolean;
  speed?: number;
}) {
  const reduce = Boolean(useReducedMotion());

  return (
    <div className={`${className ?? ""} pointer-events-none`}>
      <Canvas
        camera={{ position: [0, 0, 6], fov }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[3, 4, 5]} intensity={1.8} />
        <directionalLight position={[-4, -2, -3]} intensity={0.5} />
        <Suspense fallback={null}>
          <BirdModel
            reduce={reduce}
            modelPath={modelPath}
            clipName={clipName}
            fitMultiplier={fitMultiplier}
            playOnce={playOnce}
            ambientSway={ambientSway}
            speed={speed}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
