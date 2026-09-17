"use client";

import { useEffect, useRef } from "react";

// Pointer-responsive "moss" dot field (sylva idea, zero three.js).
// Static violet grid; dots near the pointer glow brighter.
// Mount-gated by CanvasWrapper; pauses when tab hidden.
const GAP = 22;
const RADIUS = 140;

export default function MossCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const ptr = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      ptr.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => (ptr.current = { x: -9999, y: -9999 });
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    const size = () => {
      canvas.width = Math.max(2, Math.floor(canvas.clientWidth * 0.5));
      canvas.height = Math.max(2, Math.floor(canvas.clientHeight * 0.5));
    };
    size();
    window.addEventListener("resize", size);

    let raf = 0;
    let last = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (now - last < 1000 / 24) return;
      last = now;
      if (document.visibilityState !== "visible") return;
      const w = canvas.width;
      const h = canvas.height;
      const px = ptr.current.x * 0.5;
      const py = ptr.current.y * 0.5;
      ctx.clearRect(0, 0, w, h);
      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) {
          const d = Math.hypot(x - px, y - py);
          const near = d < RADIUS;
          const a = near ? 0.75 * (1 - d / RADIUS) + 0.08 : 0.08;
          ctx.fillStyle = `hsla(268, 85%, 72%, ${a.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(x, y, near ? 2 : 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
