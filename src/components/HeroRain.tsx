"use client";

import { useEffect, useRef } from "react";

// Sharp elongated rain overlay. Falls evenly everywhere, never touches the
// text beneath (text stays 100% clean by construction). Plain 2D canvas:
// works in every browser, obeys the Motion toggle (no OS veto).
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const RUNNERS = 70;

type Drop = { fx: number; y: number; len: number; w: number; sp: number; ph: number };

export default function HeroRain() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 2;
    let H = 2;
    let drops: Drop[] = [];

    const layout = () => {
      const r = canvas.getBoundingClientRect();
      W = Math.max(2, Math.floor(r.width * dpr));
      H = Math.max(2, Math.floor(r.height * dpr));
      canvas.width = W;
      canvas.height = H;
      const rnd = mulberry32(99);
      drops = Array.from({ length: RUNNERS }, () => ({
        fx: rnd(),
        y: rnd() * H,
        len: (18 + rnd() * 30) * dpr,
        w: (1 + rnd() * 1.2) * dpr,
        sp: (1.6 + rnd() * 2.2) * dpr,
        ph: rnd() * Math.PI * 2,
      }));
    };
    layout();
    window.addEventListener("resize", layout);

    let raf = 0;
    let last = 0;
    let t = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (now - last < 1000 / 30) return;
      last = now;
      if (document.visibilityState !== "visible") return;
      t += 1 / 30;
      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = "round";
      for (const d of drops) {
        d.y += d.sp;
        if (d.y - d.len > H) {
          d.y = -d.len;
          d.fx = Math.random();
        }
        const x = d.fx * W + Math.sin(t * 1.5 + d.ph) * 4 * dpr;
        const grad = ctx.createLinearGradient(0, d.y - d.len, 0, d.y);
        grad.addColorStop(0, "rgba(190,190,205,0)");
        grad.addColorStop(1, "rgba(190,190,205,0.5)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = d.w;
        ctx.beginPath();
        ctx.moveTo(x, d.y - d.len);
        ctx.lineTo(x, d.y);
        ctx.stroke();
        ctx.fillStyle = "rgba(215,215,228,0.55)";
        ctx.beginPath();
        ctx.arc(x, d.y, d.w * 0.9, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", layout);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
