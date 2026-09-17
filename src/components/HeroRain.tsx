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
const TAGLINE_ID = "hero-tagline";

type Drop = { fx: number; y: number; r: number; sp: number; ph: number; sway: number };
type TRect = { x: number; y: number; w: number; h: number };

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
    let textCv: HTMLCanvasElement | null = null;
    let tx: TRect = { x: 0, y: 0, w: 0, h: 0 };

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

    const layoutText = () => {
      textCv = null;
      const el = document.getElementById(TAGLINE_ID);
      if (!el) return;
      const cr = canvas.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const w = Math.max(2, Math.floor(r.width * dpr));
      const h = Math.max(2, Math.floor(r.height * dpr));
      tx = {
        x: (r.left - cr.left) * dpr,
        y: (r.top - cr.top) * dpr,
        w,
        h,
      };
      const tc = document.createElement("canvas");
      tc.width = w;
      tc.height = h;
      const tctx = tc.getContext("2d");
      if (!tctx) return;
      tctx.font = `${16 * dpr}px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
      tctx.fillStyle = "#8a8a96";
      tctx.textBaseline = "top";
      const words = el.textContent?.split(" ") ?? [];
      const lines: string[] = [];
      let line = "";
      for (const word of words) {
        const trial = line ? line + " " + word : word;
        if (tctx.measureText(trial).width > w && line) {
          lines.push(line);
          line = word;
        } else {
          line = trial;
        }
      }
      if (line) lines.push(line);
      lines.forEach((l, i) => tctx.fillText(l, 0, i * 24 * dpr));
      textCv = tc;
    };
    layoutText();
    window.addEventListener("resize", layoutText);

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
        // lens: where a drop crosses the tagline, shift a 1:1 copy a few
        // pixels so glyphs wobble, then settle as it passes
        if (
          textCv &&
          x + d.r > tx.x &&
          x - d.r < tx.x + tx.w &&
          d.y + d.r > tx.y &&
          d.y - d.r < tx.y + tx.h
        ) {
          const shx = Math.sin(t * 3 + d.ph) * 2 * dpr;
          const shy = Math.cos(t * 2.3 + d.ph) * 1.5 * dpr;
          ctx.save();
          ctx.beginPath();
          ctx.arc(x, d.y, d.r * 1.3, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(textCv, tx.x + shx, tx.y + shy);
          ctx.restore();
        }
      }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", layout);
      window.removeEventListener("resize", layoutText);
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
