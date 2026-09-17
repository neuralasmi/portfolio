"use client";

// Vendored from @designcodeio/threeui (MIT) — LiquidFormBackground.
// Behavior identical to upstream; DPR cap raised 1.5 -> 2 for sharpness.
// Background is true black (see liquidFormShaders.ts).
import { useEffect, useRef } from "react";
import {
  VELOX_VERTEX_SHADER,
  VELOX_FRAGMENT_SHADER,
} from "./liquidFormShaders";

export type LiquidFormBackgroundProps = {
  speed?: number;
  morph?: number;
  noiseScale?: number;
  mouseAmount?: number;
  metal?: number;
  camera?: number;
  tintHue?: number;
  tintAmount?: number;
  className?: string;
};

export const LIQUID_FORM_DEFAULTS = {
  speed: 1,
  morph: 1,
  noiseScale: 1,
  mouseAmount: 0.15,
  metal: 1,
  camera: 5.5,
  tintHue: 220,
  tintAmount: 0,
} as const;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) throw new Error("Unable to create Velox shader");
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(sh) ?? "Velox shader compilation failed");
  }
  return sh;
}

export function LiquidFormBackground({
  className = "",
  ...props
}: LiquidFormBackgroundProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const optsRef = useRef({ ...LIQUID_FORM_DEFAULTS, ...props });
  optsRef.current = { ...LIQUID_FORM_DEFAULTS, ...props };

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VELOX_VERTEX_SHADER);
    const fs = compile(gl, gl.FRAGMENT_SHADER, VELOX_FRAGMENT_SHADER);
    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(prog) ?? "Velox program link failed");
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = {
      resolution: gl.getUniformLocation(prog, "u_res"),
      time: gl.getUniformLocation(prog, "u_time"),
      mouse: gl.getUniformLocation(prog, "u_mouse"),
      morph: gl.getUniformLocation(prog, "u_morph"),
      noiseScale: gl.getUniformLocation(prog, "u_noise_scale"),
      mouseAmount: gl.getUniformLocation(prog, "u_mouse_amount"),
      metal: gl.getUniformLocation(prog, "u_metal"),
      camera: gl.getUniformLocation(prog, "u_camera"),
    };

    let mx = 0;
    let my = 0;
    let gx = 0;
    let gy = 0;
    let raf = 0;
    let visible = true;
    const t0 = performance.now();

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = ((e.clientX - r.left) / Math.max(1, r.width)) * 2 - 1;
      my = -(((e.clientY - r.top) / Math.max(1, r.height)) * 2 - 1);
    };

    const frame = (now: number) => {
      const o = optsRef.current;
      gx += (mx - gx) * 0.05;
      gy += (my - gy) * 0.05;
      gl.uniform2f(u.resolution, canvas.width, canvas.height);
      gl.uniform1f(u.time, (now - t0) * 1e-3 * o.speed);
      gl.uniform2f(u.mouse, gx, gy);
      gl.uniform1f(u.morph, o.morph);
      gl.uniform1f(u.noiseScale, o.noiseScale);
      gl.uniform1f(u.mouseAmount, o.mouseAmount);
      gl.uniform1f(u.metal, o.metal);
      gl.uniform1f(u.camera, o.camera);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = visible && !document.hidden ? requestAnimationFrame(frame) : 0;
    };

    const ro = new ResizeObserver(resize);
    const io = new IntersectionObserver(([e]) => {
      visible = e?.isIntersecting ?? true;
      if (visible && !raf) raf = requestAnimationFrame(frame);
      if (!visible && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    ro.observe(wrap);
    io.observe(wrap);
    canvas.addEventListener("pointermove", onMove, { passive: true });
    resize();
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      gl.deleteBuffer(buf);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteProgram(prog);
    };
  }, []);

  const o = optsRef.current;
  const filter =
    o.tintAmount > 0
      ? `sepia(${o.tintAmount}) saturate(${1 + o.tintAmount * 5}) hue-rotate(${o.tintHue - 35}deg)`
      : undefined;

  return (
    <div ref={wrapRef} className={`threeui-background liquid-form${className ? ` ${className}` : ""}`}>
      <canvas ref={canvasRef} className="block h-full w-full" style={{ filter }} />
    </div>
  );
}
