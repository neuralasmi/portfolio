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

const RUNNERS = 55;

type Drop = { fx: number; y: number; r: number; sp: number; ph: number; sway: number };

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
        r: (2 + rnd() * 2.5) * dpr,
        sp: (0.7 + rnd() * 1.3) * dpr,
        ph: rnd() * Math.PI * 2,
        sway: (1 + rnd() * 3) * dpr,
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
      for (const d of drops) {
        d.y += d.sp;
        if (d.y - d.r * 4 > H) {
          d.y = -d.r * 4;
          d.fx = Math.random();
        }
        const x = d.fx * W + Math.sin(t * 1.2 + d.ph) * d.sway;
        // trail above the bead
        const tl = d.r * 5;
        const tg = ctx.createLinearGradient(0, d.y - tl, 0, d.y);
        tg.addColorStop(0, "rgba(200,200,215,0)");
        tg.addColorStop(1, "rgba(200,200,215,0.3)");
        ctx.strokeStyle = tg;
        ctx.lineWidth = Math.max(1, d.r * 0.45);
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x, d.y - tl);
        ctx.lineTo(x, d.y - d.r * 0.5);
        ctx.stroke();
        // glass bead: bright core, soft rim
        const g = ctx.createRadialGradient(
          x - d.r * 0.35, d.y - d.r * 0.35, d.r * 0.1,
          x, d.y, d.r
        );
        g.addColorStop(0, "rgba(242,242,250,0.95)");
        g.addColorStop(0.45, "rgba(185,175,225,0.4)");
        g.addColorStop(1, "rgba(160,150,200,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, d.y, d.r, 0, Math.PI * 2);
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
