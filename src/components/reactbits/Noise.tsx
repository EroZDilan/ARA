"use client";

import React, { useRef, useEffect } from "react";
import { useReducedMotion } from "framer-motion";

interface NoiseProps {
  patternRefreshInterval?: number;
  patternAlpha?: number;
}

const Noise: React.FC<NoiseProps> = ({ patternRefreshInterval = 4, patternAlpha = 9 }) => {
  const reduce = useReducedMotion();
  const grainRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Small buffer, CSS-scaled up — grain doesn't need real resolution and
    // this keeps the per-frame ImageData work cheap.
    const canvasSize = 256;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    const drawGrain = () => {
      const imageData = ctx.createImageData(canvasSize, canvasSize);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = patternAlpha;
      }
      ctx.putImageData(imageData, 0, 0);
    };

    if (reduce) {
      drawGrain();
      return;
    }

    let frame = 0;
    let animationId: number;
    let running = true;

    const loop = () => {
      if (!running) return;
      if (frame % patternRefreshInterval === 0) {
        drawGrain();
      }
      frame++;
      animationId = window.requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      running = document.visibilityState === "visible";
      if (running) {
        animationId = window.requestAnimationFrame(loop);
      } else {
        window.cancelAnimationFrame(animationId);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    loop();

    return () => {
      running = false;
      document.removeEventListener("visibilitychange", onVisibility);
      window.cancelAnimationFrame(animationId);
    };
  }, [patternRefreshInterval, patternAlpha, reduce]);

  return (
    <canvas
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[999] h-screen w-screen"
      ref={grainRef}
      style={{ imageRendering: "pixelated" }}
    />
  );
};

export default Noise;
