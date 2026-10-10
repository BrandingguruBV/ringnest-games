"use client";

import { useEffect, useRef } from "react";

type Orb = {
  x: number;
  y: number;
  z: number;
  r: number;
  vx: number;
  vy: number;
  hue: "gold" | "cyan" | "lime" | "magenta" | "ember";
  spin: number;
  ring: boolean;
};

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  hue: number;
};

const PALETTE = {
  gold: ["#fff4b0", "#ffd84a", "#e08a00"],
  cyan: ["#d9fbff", "#22d3ee", "#0284c7"],
  lime: ["#edffc9", "#84e85a", "#3f9b1e"],
  magenta: ["#ffd6f6", "#ff4fd8", "#a21caf"],
  ember: ["#ffe0c2", "#ff7a3d", "#c2410c"],
} as const;

function makeOrbs(w: number, h: number, count: number): Orb[] {
  return Array.from({ length: count }, (_, i) => {
    const hues: Orb["hue"][] = ["gold", "cyan", "lime", "magenta", "ember"];
    const speed = 0.55 + Math.random() * 0.9;
    const angle = Math.random() * Math.PI * 2;
    return {
      x: Math.random() * w,
      y: Math.random() * h * 0.68,
      z: 0.45 + Math.random() * 0.55,
      r: 12 + Math.random() * 26 + (i % 4 === 0 ? 16 : 0),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed * 0.55,
      hue: hues[i % hues.length],
      spin: Math.random() * Math.PI * 2,
      ring: i % 3 !== 2,
    };
  });
}

function makeSparks(w: number, h: number, count: number): Spark[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.55,
    vy: -0.2 - Math.random() * 0.55,
    life: Math.random(),
    max: 70 + Math.random() * 120,
    hue: 40 + Math.random() * 140,
  }));
}

export function WorldBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0.5, y: 0.4, tx: 0.5, ty: 0.4 };
    let width = 0;
    let height = 0;
    let dpr = 1;
    let orbs: Orb[] = [];
    let sparks: Spark[] = [];
    let frame = 0;
    let running = true;
    let lastW = 0;
    let lastH = 0;
    let lastTs = 0;

    const resize = (force = false) => {
      const nextW = Math.max(320, window.innerWidth || document.documentElement.clientWidth);
      const nextH = Math.max(480, window.innerHeight || document.documentElement.clientHeight);
      // Mobile browser chrome toggles height often. Keep orbs unless size really changed.
      const sizeShift =
        Math.abs(nextW - lastW) > 48 || Math.abs(nextH - lastH) > 120 || force || orbs.length === 0;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = nextW;
      height = nextH;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (sizeShift) {
        lastW = nextW;
        lastH = nextH;
        const count = width < 700 ? 14 : 24;
        orbs = makeOrbs(width, height, count);
        sparks = makeSparks(width, height, width < 700 ? 48 : 100);
      }
    };

    const onPointer = (event: PointerEvent) => {
      pointer.tx = event.clientX / Math.max(width, 1);
      pointer.ty = event.clientY / Math.max(height, 1);
    };

    const onTouch = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      pointer.tx = touch.clientX / Math.max(width, 1);
      pointer.ty = touch.clientY / Math.max(height, 1);
    };

    const drawSphere = (orb: Orb, t: number) => {
      const parallax = (pointer.x - 0.5) * 48 * orb.z;
      const paray = (pointer.y - 0.4) * 28 * orb.z;
      const x = orb.x + parallax;
      const y = orb.y + paray + Math.sin(t * 0.0018 + orb.spin) * 14;
      const r = orb.r * orb.z;
      const [hi, mid, lo] = PALETTE[orb.hue];

      ctx.save();
      ctx.shadowColor = mid;
      ctx.shadowBlur = r * 1.8;
      const glow = ctx.createRadialGradient(x, y, r * 0.2, x, y, r * 2.5);
      glow.addColorStop(0, `${mid}66`);
      glow.addColorStop(1, `${mid}00`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, r * 2.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      const g = ctx.createRadialGradient(
        x - r * 0.35,
        y - r * 0.42,
        r * 0.08,
        x,
        y + r * 0.1,
        r,
      );
      g.addColorStop(0, hi);
      g.addColorStop(0.28, mid);
      g.addColorStop(0.78, lo);
      g.addColorStop(1, "#0b1220");
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(x - r * 0.28, y - r * 0.32, r * 0.28, r * 0.16, -0.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.fill();

      if (orb.ring) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(orb.spin + t * 0.0012);
        ctx.scale(1, 0.38);
        ctx.strokeStyle = orb.hue === "gold" ? "#84e85acc" : "#22d3eecc";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, r * 1.45, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = "#ffffff55";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(0, 0, r * 1.7, 0.2, 2.4);
        ctx.stroke();
        ctx.restore();
      }
    };

    const drawGrid = (t: number) => {
      const horizon = height * 0.58;
      const speed = (t * 0.04) % 1;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, horizon - 2, width, height - horizon + 2);
      ctx.clip();

      const fade = ctx.createLinearGradient(0, horizon, 0, height);
      fade.addColorStop(0, "rgba(5,8,20,0)");
      fade.addColorStop(0.12, "rgba(8,24,48,0.35)");
      fade.addColorStop(1, "rgba(2,6,18,0.9)");
      ctx.fillStyle = fade;
      ctx.fillRect(0, horizon, width, height - horizon);

      ctx.lineWidth = 1;
      const rows = 16;
      for (let i = 0; i < rows; i++) {
        const p = (i + speed) / rows;
        const y = horizon + p * p * (height - horizon);
        ctx.strokeStyle = `rgba(34, 211, 238, ${0.08 + p * 0.22})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const vpX = width * 0.5 + (pointer.x - 0.5) * 80;
      const cols = 22;
      for (let i = -cols; i <= cols; i++) {
        const x = vpX + i * (width / 11);
        ctx.strokeStyle = "rgba(132, 232, 90, 0.12)";
        ctx.beginPath();
        ctx.moveTo(vpX, horizon);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      ctx.restore();

      ctx.fillStyle = "rgba(0, 212, 255, 0.35)";
      ctx.beginPath();
      ctx.ellipse(width / 2, horizon + 8, 90, 10, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawSky = () => {
      const sky = ctx.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, "#07142c");
      sky.addColorStop(0.38, "#0a1c3d");
      sky.addColorStop(0.62, "#062033");
      sky.addColorStop(1, "#050814");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height);

      const nebula = ctx.createRadialGradient(
        width * 0.2,
        height * 0.18,
        20,
        width * 0.2,
        height * 0.18,
        width * 0.5,
      );
      nebula.addColorStop(0, "rgba(34, 211, 238, 0.22)");
      nebula.addColorStop(1, "rgba(34, 211, 238, 0)");
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, width, height);

      const sun = ctx.createRadialGradient(
        width * 0.78,
        height * 0.16,
        8,
        width * 0.78,
        height * 0.16,
        220,
      );
      sun.addColorStop(0, "rgba(255, 216, 74, 0.85)");
      sun.addColorStop(0.2, "rgba(255, 216, 74, 0.2)");
      sun.addColorStop(1, "rgba(255, 216, 74, 0)");
      ctx.fillStyle = sun;
      ctx.fillRect(0, 0, width, height);
    };

    const tick = (t: number) => {
      if (!running) return;
      const dt = lastTs ? Math.min(32, t - lastTs) / 16.67 : 1;
      lastTs = t;
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;

      drawSky();
      drawGrid(t);

      for (const spark of sparks) {
        spark.life += 1 * dt;
        spark.x += spark.vx * dt;
        spark.y += spark.vy * dt;
        if (spark.life > spark.max || spark.y < -10) {
          spark.x = Math.random() * width;
          spark.y = height * (0.2 + Math.random() * 0.5);
          spark.life = 0;
        }
        const a = 1 - spark.life / spark.max;
        ctx.fillStyle = `hsla(${spark.hue}, 90%, 70%, ${a * 0.7})`;
        ctx.fillRect(spark.x, spark.y, 2, 2);
      }

      for (const orb of orbs) {
        if (!reduce) {
          orb.x += (orb.vx + (pointer.x - 0.5) * 0.35) * dt;
          orb.y += (orb.vy + Math.sin(t * 0.0015 + orb.spin) * 0.12) * dt;
          orb.spin += 0.008 * dt;
          if (orb.x < -90) orb.x = width + 70;
          if (orb.x > width + 90) orb.x = -70;
          if (orb.y < -70) orb.y = height * 0.68;
          if (orb.y > height * 0.76) orb.y = 50;
        }
        drawSphere(orb, t);
      }

      frame = requestAnimationFrame(tick);
    };

    const onResize = () => resize(false);
    resize(true);
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
        return;
      }
      running = true;
      lastTs = 0;
      frame = requestAnimationFrame(tick);
    };
    document.addEventListener("visibilitychange", onVis);

    if (reduce) {
      drawSky();
      drawGrid(0);
      for (const orb of orbs) drawSphere(orb, 0);
    } else {
              // nexovix-perf-canvas-gate-paint: static backdrop ASAP after load; animate on browse
              const __nxKick = () => {
                frame = requestAnimationFrame(tick);
              };
              let __nxGo = false;
              const __nxArm = () => {
                if (__nxGo) return;
                __nxGo = true;
                __nxKick();
              };
              const __nxPaint = () => {
                try {
                  if (typeof drawSky === "function") {
                    drawSky();
                    if (typeof drawGrid === "function") drawGrid(0);
                    if (typeof orbs !== "undefined" && typeof drawSphere === "function") {
                      for (const __orb of orbs) drawSphere(__orb, 0);
                    }
                  } else if (typeof drawOnce === "function") drawOnce();
                  else if (typeof draw === "function") draw();
                } catch (__e) {}
              };
              const __nxAfterLoad = () => {
                requestAnimationFrame(() =>
                  requestAnimationFrame(() => {
                    __nxPaint();
                    for (const __e of ["pointermove", "scroll", "keydown"]) {
                      window.addEventListener(__e, __nxArm, { once: true, capture: true, passive: true });
                    }
                    window.setTimeout(__nxArm, 120000);
                  })
                );
              };
              if (document.readyState === "complete") __nxAfterLoad();
              else window.addEventListener("load", __nxAfterLoad, { once: true });
        }

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("touchmove", onTouch);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[#050814]" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* CSS fallback orbs so motion still reads if canvas is throttled */}
      <div className="absolute inset-0 overflow-hidden">
        <span className="orb orb-gold absolute top-[12%] left-[8%] size-16 animate-drift opacity-80 sm:size-24" />
        <span className="orb orb-cyan absolute top-[22%] right-[6%] size-20 animate-drift-delayed opacity-75 sm:size-28" />
        <span className="orb orb-lime absolute top-[48%] left-[18%] size-12 animate-drift opacity-70 sm:size-16" />
        <span className="orb orb-gold absolute top-[36%] right-[22%] size-10 animate-drift-delayed opacity-65 sm:hidden" />
      </div>
      <div className="readability-veil absolute inset-0" />
      <div className="scanlines absolute inset-0 opacity-[0.07] mix-blend-overlay" />
    </div>
  );
}
