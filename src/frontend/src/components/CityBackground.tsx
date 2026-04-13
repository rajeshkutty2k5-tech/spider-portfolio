import { memo, useEffect, useRef } from "react";
import { useMousePosition } from "../hooks/useMousePosition";

interface BuildingConfig {
  x: number;
  width: number;
  height: number;
  windows: Array<{
    x: number;
    y: number;
    w: number;
    h: number;
    blinkRate: number;
    phase: number;
  }>;
}

function generateBuildings(count: number, seed: number): BuildingConfig[] {
  const buildings: BuildingConfig[] = [];
  let cursor = -50;
  for (let i = 0; i < count; i++) {
    const width = 40 + ((seed * (i + 1) * 7919) % 80);
    const height = 80 + ((seed * (i + 1) * 6271) % 280);
    const gap = 2 + ((seed * i * 3571) % 20);
    const windows: BuildingConfig["windows"] = [];
    const cols = Math.floor(width / 12);
    const rows = Math.floor(height / 14);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (Math.random() > 0.35) {
          windows.push({
            x: c * 12 + 4,
            y: r * 14 + 6,
            w: 6,
            h: 8,
            blinkRate: 0.3 + Math.random() * 2,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    }
    buildings.push({ x: cursor, width, height, windows });
    cursor += width + gap;
  }
  return buildings;
}

const LAYER_FAR = generateBuildings(30, 42);
const LAYER_MID = generateBuildings(22, 137);
const LAYER_NEAR = generateBuildings(16, 89);

function drawLayer(
  ctx: CanvasRenderingContext2D,
  buildings: BuildingConfig[],
  groundY: number,
  offsetX: number,
  fillColor: string,
  windowColorOn: string,
  time: number,
) {
  for (const b of buildings) {
    const x = ((b.x + offsetX) % (ctx.canvas.width + 200)) - 50;
    const y = groundY - b.height;
    ctx.fillStyle = fillColor;
    ctx.fillRect(x, y, b.width, b.height);

    for (const w of b.windows) {
      const blink = Math.sin(time * w.blinkRate + w.phase);
      const alpha = blink > 0.2 ? 0.7 + blink * 0.3 : 0.05;
      ctx.fillStyle = windowColorOn.replace("ALPHA", String(alpha.toFixed(2)));
      ctx.fillRect(x + w.x, y + w.y, w.w, w.h);
    }
  }
}

function drawWebStrands(
  ctx: CanvasRenderingContext2D,
  time: number,
  mouseX: number,
  _mouseY: number,
) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  const anchors = [
    { x: w * 0.15, y: 0 },
    { x: w * 0.4, y: 0 },
    { x: w * 0.65, y: 0 },
    { x: w * 0.9, y: 0 },
  ];

  ctx.save();
  ctx.strokeStyle = "rgba(0, 255, 255, 0.12)";
  ctx.lineWidth = 0.8;

  for (const anchor of anchors) {
    const swingX =
      anchor.x + Math.sin(time * 0.4 + anchor.x) * 30 + mouseX * 15;
    const midX = swingX + Math.sin(time * 0.6 + anchor.x) * 50;
    const midY = h * 0.35 + Math.cos(time * 0.5) * 20;
    const endX = midX + Math.sin(time * 0.3 + anchor.x) * 40;
    const endY = h * 0.6 + Math.sin(time * 0.4) * 15;

    ctx.beginPath();
    ctx.moveTo(anchor.x, anchor.y);
    ctx.quadraticCurveTo(midX, midY, endX, endY);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(endX, endY, 2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 255, 255, 0.4)";
    ctx.fill();
  }

  ctx.restore();
}

function CityBackgroundInner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useMousePosition();
  const mouseRef = useRef(mouse);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    mouseRef.current = mouse;
  }, [mouse]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let scrollFar = 0;
    let scrollMid = 0;
    let scrollNear = 0;
    let startTime = performance.now();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const render = (now: number) => {
      const t = (now - startTime) / 1000;
      const { width: w, height: h } = canvas;
      const groundY = h;

      scrollFar = (t * 8) % (w + 200);
      scrollMid = (t * 18) % (w + 200);
      scrollNear = (t * 32) % (w + 200);

      const mx = mouseRef.current.x;

      ctx.clearRect(0, 0, w, h);

      // Night sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, "oklch(0.04 0 0)");
      skyGrad.addColorStop(0.6, "rgba(0,8,20,1)");
      skyGrad.addColorStop(1, "rgba(0,15,10,1)");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Atmospheric glow at horizon
      const glowGrad = ctx.createRadialGradient(
        w / 2,
        h * 0.75,
        0,
        w / 2,
        h * 0.75,
        w * 0.6,
      );
      glowGrad.addColorStop(0, "rgba(0, 40, 60, 0.3)");
      glowGrad.addColorStop(1, "transparent");
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, w, h);

      // Far layer — deep silhouette
      drawLayer(
        ctx,
        LAYER_FAR,
        groundY,
        scrollFar + mx * 8,
        "rgba(3, 8, 15, 0.95)",
        "rgba(0, 200, 255, ALPHA)",
        t,
      );

      // Mid layer — main buildings
      drawLayer(
        ctx,
        LAYER_MID,
        groundY,
        scrollMid + mx * 20,
        "rgba(5, 10, 18, 1)",
        "rgba(0, 255, 255, ALPHA)",
        t + 1,
      );

      // Red accent windows on mid
      drawLayer(
        ctx,
        LAYER_NEAR.slice(0, 6),
        groundY,
        (scrollNear * 0.5 + w * 0.3 + mx * 30) % (w + 200),
        "rgba(8, 5, 5, 1)",
        "rgba(255, 60, 60, ALPHA)",
        t + 2,
      );

      // Near layer — foreground
      drawLayer(
        ctx,
        LAYER_NEAR,
        groundY,
        scrollNear + mx * 40,
        "rgba(10, 6, 6, 1)",
        "rgba(255, 100, 100, ALPHA)",
        t + 3,
      );

      // Web strands
      drawWebStrands(ctx, t, mx, mouseRef.current.y);

      // Ground fog
      const fogGrad = ctx.createLinearGradient(0, h * 0.8, 0, h);
      fogGrad.addColorStop(0, "transparent");
      fogGrad.addColorStop(1, "rgba(0, 15, 20, 0.8)");
      ctx.fillStyle = fogGrad;
      ctx.fillRect(0, h * 0.8, w, h * 0.2);

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ imageRendering: "pixelated" }}
      tabIndex={-1}
    />
  );
}

export const CityBackground = memo(CityBackgroundInner);
