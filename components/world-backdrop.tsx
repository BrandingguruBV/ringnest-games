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
    return {
      x: Math.random() * w,
      y: Math.random() * h * 0.72,
      z: 0.4 + Math.random() * 0.6,
      r: 10 + Math.random() * 28 + (i % 5 === 0 ? 18 : 0),
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.22,
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
    vx: (Math.random() - 0.5) * 0.4,
    vy: -0.15 - Math.random() * 0.45,
    life: Math.random(),
    max: 80 + Math.random() * 140,
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

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = width < 700 ? 12 : 22;
      orbs = makeOrbs(width, height, count);
      sparks = makeSparks(width, height, width < 700 ? 40 : 90);
    };

    const onMove = (event: PointerEvent) => {
      pointer.tx = event.clientX / Math.max(width, 1);
      pointer.ty = event.clientY / Math.max(height, 1);
    };

    const drawSphere = (orb: Orb, t: number) => {
      const parallax = (pointer.x - 0.5) * 40 * orb.z;
      const paray = (pointer.y - 0.4) * 24 * orb.z;
      const x = orb.x + parallax;
      const y = orb.y + paray + Math.sin(t * 0.0012 + orb.spin) * 10;
      const r = orb.r * orb.z;
      const [hi, mid, lo] = PALETTE[orb.hue];

      ctx.save();
      ctx.shadowColor = mid;
      ctx.shadowBlur = r * 1.6;
      const glow = ctx.createRadialGradient(x, y, r * 0.2, x, y, r * 2.4);
      glow.addColorStop(0, `${mid}55`);
      glow.addColorStop(1, `${mid}00`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, r * 2.2, 0, Math.PI * 2);
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
        ctx.rotate(orb.spin + t * 0.0008);
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
      const speed = (t * 0.03) % 1;
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
      nebula.addColorStop(0, "rgba(168, 85, 247, 0.28)");
      nebula.addColorStop(1, "rgba(168, 85, 247, 0)");
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
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;

      drawSky();
      drawGrid(t);

      for (const spark of sparks) {
        spark.life += 1;
        spark.x += spark.vx;
        spark.y += spark.vy;
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
          orb.x += orb.vx + (pointer.x - 0.5) * 0.15;
          orb.y += orb.vy + Math.sin(t * 0.001 + orb.spin) * 0.05;
          orb.spin += 0.004;
          if (orb.x < -80) orb.x = width + 60;
          if (orb.x > width + 80) orb.x = -60;
          if (orb.y < -60) orb.y = height * 0.7;
          if (orb.y > height * 0.78) orb.y = 40;
        }
        drawSphere(orb, t);
      }

      frame = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    const onVis = () => {
      running = !document.hidden;
      if (running) frame = requestAnimationFrame(tick);
    };
    document.addEventListener("visibilitychange", onVis);

    if (reduce) {
      drawSky();
      drawGrid(0);
      for (const orb of orbs) drawSphere(orb, 0);
    } else {
      frame = requestAnimationFrame(tick);
    }

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[#050814]" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,transparent_0%,rgba(5,8,20,0.35)_70%,rgba(5,8,20,0.72)_100%)]" />
      <div className="scanlines absolute inset-0 opacity-20 mix-blend-overlay" />
    </div>
  );
}
