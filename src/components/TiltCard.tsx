"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  hoverScale?: number;
};

export default function TiltCard({
  children,
  className,
  maxTilt = 7,
  hoverScale = 1.02,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);
  const scaleRaw = useMotionValue(1);

  const springConfig = { stiffness: 160, damping: 16, mass: 0.5 };
  const rotateX = useSpring(rotateXRaw, springConfig);
  const rotateY = useSpring(rotateYRaw, springConfig);
  const scale = useSpring(scaleRaw, { stiffness: 160, damping: 18 });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateYRaw.set(px * maxTilt * 2);
    rotateXRaw.set(-py * maxTilt * 2);
  }

  function handleMouseEnter() {
    if (reduce) return;
    scaleRaw.set(hoverScale);
  }

  function handleMouseLeave() {
    rotateXRaw.set(0);
    rotateYRaw.set(0);
    scaleRaw.set(1);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: reduce ? 0 : rotateX,
        rotateY: reduce ? 0 : rotateY,
        scale: reduce ? 1 : scale,
        transformPerspective: 900,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
