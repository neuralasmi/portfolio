"use client";

import { useEffect, useRef, type ReactNode } from "react";
import html2canvas from "html2canvas";

// Whole-hero rain-on-glass widget. Reference logic integrated verbatim
// (droplet/refraction math from the public Droplets rain-on-glass algorithm).
// React adaptations only: refs instead of getElementById/appendChild,
// unmount cleanup. Heavy storm on load -> eases clear over ~2.4s ->
// permanent clearly-visible ambient rain via rAF, forever.
// Anything fails (no container, reduced-motion, no html2canvas, no WebGL2,
// shader/capture errors): plain content stays, with a console message.
export default function DropletHero({
  children,
  enabled = true,
}: {
  children: ReactNode;
  enabled?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container) {
      console.warn("Droplets: #droplet-hero not found, nothing to do.");
      return;
    }
    if (!canvas) {
      console.warn("Droplets: canvas ref missing, nothing to do.");
      return;
    }

    const reduceMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      console.warn("Droplets: reduced-motion preferred, skipping.");
      return;
    }

    if (typeof html2canvas !== "function") {
      console.warn("Droplets: html2canvas did not load, skipping rain effect.");
      return;
    }

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
      depth: false,
      stencil: false,
    });
    if (!gl) {
      console.warn("Droplets: WebGL2 not supported, skipping rain effect.");
      return;
    }

    const VERT_SRC = `#version 300 es
    layout(location = 0) in vec2 aPos;
    out vec2 vUv;
    void main() {
      vUv = aPos * 0.5 + 0.5;
      gl_Position = vec4(aPos, 0.0, 1.0);
    }`;

    const FRAG_SRC = `#version 300 es
    precision highp float;
    in vec2 vUv;
    out vec4 outColor;

    uniform sampler2D uContent;
    uniform vec2 uResolution;
    uniform float uTime;
    uniform float uIntensity;
    uniform float uScale;
    uniform float uDropWidth;
    uniform float uDropLength;
    uniform float uRefraction;
    uniform float uBlur;
    uniform float uVignette;
    uniform float uFallSpeed;
    uniform float uWiggle;
    uniform float uStaticDrops;

    #define S(a, b, t) smoothstep(a, b, t)

    vec3 N13(float p) {
      vec3 p3 = fract(vec3(p) * vec3(0.1031, 0.11369, 0.13787));
      p3 += dot(p3, p3.yzx + 19.19);
      return fract(vec3((p3.x + p3.y) * p3.z, (p3.x + p3.z) * p3.y, (p3.y + p3.z) * p3.x));
    }
    float N(float t) { return fract(sin(t * 12345.564) * 7658.76); }
    float Saw(float b, float t) { return S(0.0, b, t) * S(1.0, b, t); }

    float sdEgg(vec2 p, float ra, float rb) {
      const float k = 1.7320508;
      p.x = abs(p.x);
      float r = ra - rb;
      return ((p.y < 0.0) ? length(vec2(p.x, p.y)) - r :
              (k * (p.x + r) < p.y) ? length(vec2(p.x, p.y - k * r)) :
              length(vec2(p.x + r, p.y)) - 2.0 * r) - rb;
    }

    vec2 DropLayer(vec2 uv, float t) {
      vec2 UV = uv;
      vec2 a = vec2(6.0, 1.0);
      vec2 grid = a * 2.0;
      vec2 id = floor(uv * grid);
      float gridFall = N(id.x) / 3.0 + 0.5;
      uv.y += t * gridFall / a.y;
      id = floor(uv * grid);
      uv.y += N(id.x);
      id = floor(uv * grid);
      vec2 st = fract(uv * grid) - vec2(0.5, 0.0);
      vec3 n = N13(id.x * 35.2 + id.y * 2376.1);
      float x = n.x - 0.5;
      float lambda = UV.y * 20.0;
      float wiggle = sin(lambda + sin(lambda));
      x += wiggle * (0.5 - abs(x)) * (n.z - 0.5) * uWiggle;
      x *= 0.6;
      float slowStart = 0.85;
      float ti = fract(t * (gridFall + 0.1) + n.z);
      float y = (Saw(slowStart, ti) - 0.5) * 0.9 + 0.5;
      vec2 p = vec2(x, y);
      float dropShape = (ti > slowStart) ? -sin(6.2831853 * ti / (1.0 - slowStart)) * 0.5 - 0.5 : 0.0;
      float d = sdEgg((st - p) * a.yx / vec2(uDropWidth, uDropLength), 0.0, dropShape);
      float diameter = N(id.x + id.y) / 7.0 + 0.2;
      float mainDrop = S(diameter / 1.5, 0.0, d);
      float r2 = S(1.0, y, st.y);
      float r = sqrt(r2);
      float cd = abs(st.x - x);
      float thickness = diameter * 0.95 * uDropWidth;
      float trail = S(thickness * r, 0.0, cd);
      float trailFront = S(-0.02, 0.02, st.y - y);
      trail *= r2 * trailFront * 0.5;
      y = UV.y;
      float trail2 = S((thickness - 0.15) * r, 0.0, cd);
      trail2 *= trailFront * n.z;
      float rndX = N(id.x) / 1.5 + 0.5;
      float rndY = N(st.y) / 40.0 + 0.05;
      y = fract(y * 11.0 * rndX) + (st.y - 0.5);
      float dd = length(st - vec2(x, y));
      float droplets = S(trail2 + rndY, 0.0, dd);
      float m = mainDrop + droplets * r * trailFront;
      return vec2(m, trail);
    }

    float StaticDrops(vec2 uv, float t) {
      uv *= 40.0;
      vec2 id = floor(uv);
      vec3 n = N13(id.x * 107.45 + id.y * 3543.654);
      vec2 p = (n.xy - 0.5) * 0.6;
      uv = fract(uv) - 0.5;
      float d = length(uv - p);
      float drop = S(0.3 * clamp(uDropWidth, 0.4, 1.4), 0.0, d);
      float fade = Saw(0.1, fract(t + n.y));
      float intensity = fract(n.x * 27.0);
      return drop * fade * intensity;
    }

    vec2 Drops(vec2 uv, float t, float tFall, float l0, float l1, float l2) {
      float s = StaticDrops(uv, t) * l0;
      vec2 m1 = DropLayer(uv, tFall) * l1;
      vec2 m2 = DropLayer(uv * 1.85, tFall) * l2;
      float c = s + m1.x + m2.x;
      c = S(0.3, 1.0, c);
      return vec2(c, m1.y + m2.y);
    }

    void main() {
      vec2 uv = vUv;
      vec2 aspectUv = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
      float t = uTime * 0.2;
      float dropScale = clamp(min(uResolution.x, uResolution.y) / 900.0, 0.75, 1.35) * uScale;
      vec2 scaledUv = aspectUv * dropScale;

      float rainAmount = clamp(uIntensity, 0.0, 1.25);
      float staticAmt = S(-0.5, 1.0, rainAmount) * 2.0 * uStaticDrops;
      float layer1 = S(0.25, 0.75, rainAmount);
      float layer2 = S(0.0, 0.5, rainAmount);
      float tFall = t * uFallSpeed;

      vec2 c = Drops(scaledUv, t, tFall, staticAmt, layer1, layer2);

      vec2 e = vec2(0.001, 0.0);
      float cx = Drops(scaledUv + e, t, tFall, staticAmt, layer1, layer2).x;
      float cy = Drops(scaledUv + e.yx, t, tFall, staticAmt, layer1, layer2).x;
      vec2 normal = vec2(cx - c.x, cy - c.x);

      vec2 refractedUv = clamp(uv + normal * uRefraction, vec2(0.001), vec2(0.999));

      float fog = clamp(uBlur, 0.0, 8.0) * mix(0.7, 1.0, rainAmount);
      float back = fog * (1.0 - clamp(c.y * 2.0, 0.0, 1.0));
      float focus = mix(back, 0.0, S(0.1, 0.2, c.x));

      vec4 content = textureLod(uContent, vec2(refractedUv.x, 1.0 - refractedUv.y), focus);
      vec3 col = content.rgb;

      // Glistening specular highlight — a bright glint where a droplet's surface
      // catches the light, layered on top of the refracted content underneath it.
      vec3 n3 = normalize(vec3(normal * 40.0, 1.0));
      vec3 L = normalize(vec3(-0.35, 0.75, 0.55));
      float spec = pow(max(dot(reflect(vec3(0.0, 0.0, -1.0), n3), L), 0.0), 28.0);
      float rim = clamp(length(normal) * 22.0, 0.0, 1.0);
      col += vec3(spec) * (0.85 + 0.35 * rim) * content.a;

      vec2 vUvC = uv - 0.5;
      col *= 1.0 - dot(vUvC, vUvC) * clamp(uVignette, 0.0, 1.0) * 2.0;

      outColor = vec4(clamp(col, 0.0, 1.0) * content.a, content.a);
    }`;

    function compile(type: number, src: string) {
      const shader = gl!.createShader(type);
      if (!shader) throw new Error("Droplets: unable to create shader");
      gl!.shaderSource(shader, src);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error("Droplets: shader compile error:", gl!.getShaderInfoLog(shader));
      }
      return shader;
    }

    const vertShader = compile(gl.VERTEX_SHADER, VERT_SRC);
    const fragShader = compile(gl.FRAGMENT_SHADER, FRAG_SRC);
    const program = gl.createProgram();
    if (!program) {
      console.error("Droplets: program creation failed");
      return;
    }
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Droplets: program link error:", gl.getProgramInfoLog(program));
      return;
    }

    const uniforms: Record<string, WebGLUniformLocation | null> = {};
    const uCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;
    for (let i = 0; i < uCount; i++) {
      const info = gl.getActiveUniform(program, i);
      if (info) uniforms[info.name] = gl.getUniformLocation(program, info.name);
    }

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const contentTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, contentTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    function uploadTexture(sourceCanvas: HTMLCanvasElement) {
      gl!.bindTexture(gl!.TEXTURE_2D, contentTexture);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, sourceCanvas);
      gl!.generateMipmap(gl!.TEXTURE_2D);
    }

    function syncCanvasSize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = container!.getBoundingClientRect();
      canvas!.width = Math.max(1, Math.round(rect.width * dpr));
      canvas!.height = Math.max(1, Math.round(rect.height * dpr));
    }

    let capturing = false;
    let ready = false;
    let raf = 0;
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;

    function capture() {
      if (capturing) return;
      capturing = true;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      html2canvas(container!, {
        backgroundColor: null,
        scale: dpr,
        ignoreElements: (el: Element) => el === canvas,
      })
        .then((snapshot) => {
          uploadTexture(snapshot);
          capturing = false;
          if (!ready) {
            ready = true;
            container!.classList.add("is-active");
            console.log("Droplets: rain effect running on #droplet-hero");
            raf = requestAnimationFrame(render);
          }
        })
        .catch((err: unknown) => {
          console.warn("Droplets: capture failed", err);
          capturing = false;
        });
    }

    const BROKEN = { intensity: 1.2, refraction: 0.55, blur: 2.5, scale: 0.55, dropWidth: 1.3, dropLength: 1.3, wiggle: 1, staticDrops: 0.5, fallSpeed: 1.6, vignette: 0.15 };
    const SETTLED = { intensity: 0.75, refraction: 0.22, blur: 0, scale: 0.55, dropWidth: 1.3, dropLength: 1.1, wiggle: 0.9, staticDrops: 0.1, fallSpeed: 1, vignette: 0.05 };
    const HOLD_MS = 300;
    const TWEEN_MS = 2400;
    const current: Record<keyof typeof BROKEN, number> = { ...BROKEN };
    let startTime: number | null = null;

    function easeOutCubic(t: number) {
      return 1 - Math.pow(1 - t, 3);
    }

    function updateTween(elapsedMs: number) {
      const t = Math.min(Math.max((elapsedMs - HOLD_MS) / TWEEN_MS, 0), 1);
      const e = easeOutCubic(t);
      (Object.keys(BROKEN) as (keyof typeof BROKEN)[]).forEach((key) => {
        current[key] = BROKEN[key] + (SETTLED[key] - BROKEN[key]) * e;
      });
    }

    function render(now: number) {
      if (startTime === null) startTime = now;
      const elapsedMs = now - startTime;
      updateTween(elapsedMs);

      gl!.useProgram(program);
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, contentTexture);
      gl!.uniform1i(uniforms.uContent, 0);
      gl!.uniform2f(uniforms.uResolution, canvas!.width, canvas!.height);
      gl!.uniform1f(uniforms.uTime, elapsedMs / 1000);
      gl!.uniform1f(uniforms.uIntensity, current.intensity);
      gl!.uniform1f(uniforms.uScale, current.scale);
      gl!.uniform1f(uniforms.uDropWidth, current.dropWidth);
      gl!.uniform1f(uniforms.uDropLength, current.dropLength);
      gl!.uniform1f(uniforms.uRefraction, current.refraction);
      gl!.uniform1f(uniforms.uBlur, current.blur);
      gl!.uniform1f(uniforms.uVignette, current.vignette);
      gl!.uniform1f(uniforms.uFallSpeed, current.fallSpeed);
      gl!.uniform1f(uniforms.uWiggle, current.wiggle);
      gl!.uniform1f(uniforms.uStaticDrops, current.staticDrops);

      gl!.viewport(0, 0, canvas!.width, canvas!.height);
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.enable(gl!.BLEND);
      gl!.blendFunc(gl!.ONE, gl!.ONE_MINUS_SRC_ALPHA);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);

      raf = requestAnimationFrame(render);
    }

    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        syncCanvasSize();
        capture();
      }, 150);
    };

    syncCanvasSize();
    capture();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      container.classList.remove("is-active");
    };
  }, [enabled]);

  return (
    <div id="droplet-hero" ref={containerRef}>
      {children}
      {enabled && <canvas ref={canvasRef} className="droplet-hero-canvas" />}
    </div>
  );
}
