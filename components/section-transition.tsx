"use client";
import { useEffect, useRef } from "react";

const CHARS = "01ABCDEFabcdef01█▓░┼╬╋◆◇01アイウエオカキ01";
const FONT_SIZE = 13;
const COL_W = 18;

interface Col {
  x: number;
  y: number;
  speed: number;
  trail: number;
  opacity: number;
}

function makeCols(w: number, h: number): Col[] {
  const n = Math.ceil(w / COL_W);
  return Array.from({ length: n }, (_, i) => ({
    x: i * COL_W + COL_W / 2,
    y: -Math.random() * h * 1.5,
    speed: 0.7 + Math.random() * 1.6,
    trail: Math.floor(7 + Math.random() * 16),
    opacity: 0.35 + Math.random() * 0.65,
  }));
}

export default function SectionTransition({ variant = "a" }: { variant?: "a" | "b" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef   = useRef(0);
  const colsRef  = useRef<Col[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      const p = canvas!.parentElement;
      if (!p) return;
      canvas!.width  = p.clientWidth;
      canvas!.height = p.clientHeight;
      colsRef.current = makeCols(canvas!.width, canvas!.height);
    }

    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    resize();

    let tick = 0;

    function draw() {
      rafRef.current = requestAnimationFrame(draw);
      const w = canvas!.width;
      const h = canvas!.height;

      // Semi-transparent black — creates the trail smear
      ctx!.fillStyle = "rgba(0,0,0,0.15)";
      ctx!.fillRect(0, 0, w, h);

      ctx!.font = `${FONT_SIZE}px "Roboto Mono", monospace`;
      ctx!.textAlign = "center";

      for (const col of colsRef.current) {
        for (let i = 0; i < col.trail; i++) {
          const yPos = col.y - i * FONT_SIZE;
          if (yPos < -FONT_SIZE || yPos > h + FONT_SIZE) continue;

          const ratio = 1 - i / col.trail;
          const alpha = ratio * ratio * col.opacity;

          if (i === 0) {
            // Head — bright white with glow
            ctx!.shadowColor = "rgba(255,255,255,0.9)";
            ctx!.shadowBlur  = 10;
            ctx!.fillStyle   = `rgba(255,255,255,${Math.min(1, col.opacity * 1.3)})`;
          } else {
            ctx!.shadowBlur = 0;
            // Slight blue-white tint for depth
            ctx!.fillStyle = `rgba(210,215,255,${alpha * 0.9})`;
          }

          // Randomise character each frame for the "data flickering" feel
          const char = CHARS[Math.floor(Math.random() * CHARS.length)];
          ctx!.fillText(char, col.x, yPos);
        }
        ctx!.shadowBlur = 0;

        col.y += col.speed;
        if (col.y - col.trail * FONT_SIZE > h) {
          col.y       = -Math.random() * h * 0.4;
          col.speed   = 0.7 + Math.random() * 1.6;
          col.opacity = 0.35 + Math.random() * 0.65;
        }
      }

      // ── Centre horizon line ────────────────────────────────────────────────
      const cy = h / 2;

      // Soft halo band
      const halo = ctx!.createLinearGradient(0, cy - 30, 0, cy + 30);
      halo.addColorStop(0, "rgba(0,0,0,0)");
      halo.addColorStop(0.5, "rgba(255,255,255,0.05)");
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx!.fillStyle = halo;
      ctx!.fillRect(0, cy - 30, w, 60);

      // Pulsing bright line
      const pulse = 0.6 + 0.4 * Math.sin(tick * 0.04);
      const lineGrad = ctx!.createLinearGradient(0, 0, w, 0);
      lineGrad.addColorStop(0,   "transparent");
      lineGrad.addColorStop(0.05, `rgba(255,255,255,${0.5 * pulse})`);
      lineGrad.addColorStop(0.5,  `rgba(255,255,255,${pulse})`);
      lineGrad.addColorStop(0.95, `rgba(255,255,255,${0.5 * pulse})`);
      lineGrad.addColorStop(1,   "transparent");
      ctx!.fillStyle = lineGrad;
      ctx!.fillRect(0, cy - 1, w, 2);

      // ── Edge vignettes ─────────────────────────────────────────────────────
      const topFade = ctx!.createLinearGradient(0, 0, 0, h * 0.28);
      topFade.addColorStop(0, "rgba(0,0,0,1)");
      topFade.addColorStop(1, "rgba(0,0,0,0)");
      ctx!.fillStyle = topFade;
      ctx!.fillRect(0, 0, w, h * 0.28);

      const botFade = ctx!.createLinearGradient(0, h * 0.72, 0, h);
      botFade.addColorStop(0, "rgba(0,0,0,0)");
      botFade.addColorStop(1, "rgba(0,0,0,1)");
      ctx!.fillStyle = botFade;
      ctx!.fillRect(0, h * 0.72, w, h * 0.28);

      // ── "scroll to explore" hint (variant b only) ──────────────────────────
      if (variant === "b") {
        const textAlpha = 0.25 + 0.15 * Math.sin(tick * 0.06);
        ctx!.font = `10px "Roboto Mono", monospace`;
        ctx!.fillStyle = `rgba(255,255,255,${textAlpha})`;
        ctx!.textAlign = "center";
        ctx!.letterSpacing = "0.4em";
        ctx!.fillText("▼  SCROLL TO EXPLORE  ▼", w / 2, h - 28);
        ctx!.letterSpacing = "0";
      }

      tick++;
    }

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [variant]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "280px",
        background: "#000",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, display: "block" }}
      />
      {/* Smooth black gradient at the bottom to blend with next section */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "120px",
          background: "linear-gradient(to bottom, transparent, #000)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
