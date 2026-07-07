"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

const MODEL_SCALE = 0.22;
const BASE_ROTATION_Y = -0.35;
const HOP_DURATION = 0.55;
const HOP_HEIGHT = 0.4;

type Keyframe = [progress: number, value: number];

function sampleKeyframes(p: number, points: Keyframe[]): number {
  for (let i = 0; i < points.length - 1; i++) {
    const [t0, v0] = points[i];
    const [t1, v1] = points[i + 1];
    if (p >= t0 && p <= t1) {
      const localT = (p - t0) / (t1 - t0);
      const eased = localT * localT * (3 - 2 * localT);
      return v0 + (v1 - v0) * eased;
    }
  }
  return points[points.length - 1][1];
}

// Squash (anticipación) -> stretch (en el aire) -> squash (aterrizaje) -> reposo.
const HOP_SCALE_Y: Keyframe[] = [
  [0, 1],
  [0.12, 0.85],
  [0.35, 1.18],
  [0.55, 1.12],
  [0.78, 1.15],
  [0.92, 0.84],
  [1, 1],
];
const HOP_SCALE_XZ: Keyframe[] = [
  [0, 1],
  [0.12, 1.1],
  [0.35, 0.9],
  [0.55, 0.93],
  [0.78, 0.91],
  [0.92, 1.12],
  [1, 1],
];
const HOP_POS_Y: Keyframe[] = [
  [0, 0],
  [0.12, 0],
  [0.5, 1],
  [0.88, 0],
  [1, 0],
];

function playChirp(ctxRef: React.MutableRefObject<AudioContext | null>) {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!ctxRef.current) ctxRef.current = new AudioCtx();
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;

    function note(freqStart: number, freqEnd: number, start: number, duration: number, peak: number) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freqStart, now + start);
      osc.frequency.exponentialRampToValueAtTime(freqEnd, now + start + duration);
      gain.gain.setValueAtTime(0.0001, now + start);
      gain.gain.linearRampToValueAtTime(peak, now + start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + start);
      osc.stop(now + start + duration + 0.02);
    }

    note(2100, 2800, 0, 0.08, 0.14);
    note(2500, 1500, 0.09, 0.12, 0.12);
  } catch {
    // Web Audio unavailable — fail silently, sound is a non-critical enhancement.
  }
}

function BirdModel({ reduce }: { reduce: boolean }) {
  const { scene } = useGLTF("/models/macaw.glb");
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const flap = useRef<THREE.Group>(null);
  const centered = useRef(false);
  const modelHeight = useRef(0);

  const dragging = useRef(false);
  const lastX = useRef(0);
  const velocity = useRef(0);
  const hopProgress = useRef<number | null>(null);
  const didDrag = useRef(false);
  const audioCtx = useRef<AudioContext | null>(null);

  // Centra en X/Z pero deja el pivote de rotación a la altura de las patas,
  // así al rotar la cabeza se mueve mucho más que el cuerpo (efecto "mirar").
  useEffect(() => {
    if (centered.current || !inner.current) return;
    const box = new THREE.Box3().setFromObject(inner.current);
    const center = new THREE.Vector3();
    box.getCenter(center);
    inner.current.position.x -= center.x;
    inner.current.position.z -= center.z;
    inner.current.position.y -= box.min.y;
    modelHeight.current = box.max.y - box.min.y;
    centered.current = true;
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;

    const idleY = reduce ? 0 : Math.sin(t * 1.4) * 0.06;

    if (dragging.current) {
      // rotation.y se controla directo en el pointer move
    } else {
      group.current.rotation.y += velocity.current * delta;
      velocity.current *= 0.95;

      // Vaivén lento de cabeza "mirando" a los lados, más el seguimiento del cursor.
      const idleLook = reduce ? 0 : Math.sin(t * 0.55) * 0.16;
      const targetX = reduce ? 0 : state.pointer.y * 0.12;
      const targetZ = (reduce ? 0 : -state.pointer.x * 0.1) + idleLook;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, delta * 2);
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, targetZ, delta * 1.5);
    }

    // Pulso de aleteo: estira/comprime el cuerpo como un latido rápido de alas.
    if (flap.current) {
      if (reduce) {
        flap.current.scale.set(1, 1, 1);
      } else {
        const flapSpeed = 9;
        const wave = Math.sin(t * flapSpeed);
        flap.current.scale.set(1 + wave * 0.045, 1 - wave * 0.06, 1 + wave * 0.02);
      }
    }

    let hopPosY = 0;
    if (hopProgress.current !== null) {
      hopProgress.current += delta / HOP_DURATION;
      const p = Math.min(hopProgress.current, 1);
      const scaleY = sampleKeyframes(p, HOP_SCALE_Y);
      const scaleXZ = sampleKeyframes(p, HOP_SCALE_XZ);
      hopPosY = sampleKeyframes(p, HOP_POS_Y) * HOP_HEIGHT;
      group.current.scale.set(scaleXZ, scaleY, scaleXZ);
      if (hopProgress.current >= 1) {
        hopProgress.current = null;
        group.current.scale.set(1, 1, 1);
      }
    }

    group.current.position.y = idleY - modelHeight.current / 2 + hopPosY;
  });

  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!dragging.current || !group.current) return;
      const dx = e.clientX - lastX.current;
      if (Math.abs(dx) > 1) didDrag.current = true;
      lastX.current = e.clientX;
      group.current.rotation.y += dx * 0.012;
      velocity.current = dx * 0.02;
    }
    function onUp() {
      dragging.current = false;
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  const handlePointerDown: ThreeElements["group"]["onPointerDown"] = (e) => {
    e.stopPropagation();
    dragging.current = true;
    didDrag.current = false;
    lastX.current = e.clientX;
  };

  const handleClick = () => {
    if (didDrag.current) return;
    if (hopProgress.current === null) hopProgress.current = 0;
    playChirp(audioCtx);
  };

  return (
    <group
      ref={group}
      rotation={[0, BASE_ROTATION_Y, 0]}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
    >
      <group ref={inner} scale={MODEL_SCALE}>
        <group ref={flap}>
          <primitive object={scene} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/macaw.glb");

export default function AveInteractiva3D({ className }: { className?: string }) {
  const reduce = Boolean(useReducedMotion());

  return (
    <div className={`${className ?? ""} cursor-grab active:cursor-grabbing`}>
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 32 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[3, 4, 5]} intensity={1.8} />
        <directionalLight position={[-4, -2, -3]} intensity={0.5} />
        <Suspense fallback={null}>
          <BirdModel reduce={reduce} />
        </Suspense>
      </Canvas>
    </div>
  );
}
