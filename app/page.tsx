"use client";

import { useEffect, useRef, useState } from "react";
import { Dancing_Script } from "next/font/google";

const dancingScript = Dancing_Script({
  weight: "700",
  subsets: ["latin"],
  display: "block", // "block" = invisible text until font loads (no FOUC)
});

export default function IntroPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"waiting" | "writing" | "glow" | "fadeout">("waiting");
  const timersStarted = useRef(false);

  // Particle background (same as login)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const count = 80;
    const particles: {
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; pulse: number; pulseSpeed: number;
    }[] = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.015 + 0.005,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.pulse += p.pulseSpeed;
        const glow = Math.sin(p.pulse) * 0.2 + 0.8;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * glow})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - d / 140) * 0.08})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Wait for the font to load, then kick off the full animation sequence
  useEffect(() => {
    const startAnimation = () => {
      if (timersStarted.current) return;
      timersStarted.current = true;

      setPhase("writing");

      // All timers fire from this single point — no cleanup issues
      setTimeout(() => setPhase("glow"), 1400);
      setTimeout(() => setPhase("fadeout"), 2000);
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 2700);
    };

    document.fonts.ready.then(startAnimation);
    // Fallback: start anyway after 500ms
    const fallback = setTimeout(startAnimation, 500);
    return () => clearTimeout(fallback);
  }, []);

  // The font family name from next/font
  const fontFamily = dancingScript.style.fontFamily;

  return (
    <>
      <style jsx global>{`
        body { margin: 0; padding: 0; overflow: hidden; }

        .intro-wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: radial-gradient(ellipse at 30% 50%, #0f1724 0%, #080c14 50%, #04060a 100%);
        }

        .intro-canvas {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .intro-center {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.2rem;
          transition: opacity 0.7s ease-out;
        }
        .intro-center.fadeout {
          opacity: 0;
          transform: scale(1.05);
          transition: opacity 0.7s ease-out, transform 0.7s ease-out;
        }

        .intro-svg-text {
          overflow: visible;
        }

        .intro-path {
          fill: none;
          stroke: url(#textGrad);
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 1200;
          stroke-dashoffset: 1200;
          animation: drawText 1.9s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes drawText {
          to {
            stroke-dashoffset: 0;
          }
        }

        .intro-fill-text {
          font-size: 154px;
          font-weight: 700;
          fill: transparent;
          animation: fillIn 0.4s ease-out 1s forwards;
        }

        @keyframes fillIn {
          to {
            fill: #ffffff;
          }
        }

        .intro-glow {
          opacity: 0;
          transition: opacity 0.6s ease;
        }
        .intro-glow.active {
          opacity: 1;
          animation: pulseGlow 0.8s ease-in-out;
        }
        @keyframes pulseGlow {
          0% { filter: drop-shadow(0 0 0px rgba(69, 156, 202, 0)); }
          50% { filter: drop-shadow(0 0 40px rgba(69, 156, 202, 0.8)) drop-shadow(0 0 80px rgba(69, 156, 202, 0.4)); }
          100% { filter: drop-shadow(0 0 20px rgba(69, 156, 202, 0.3)); }
        }
      `}</style>

      <div className="intro-wrap">
        <canvas ref={canvasRef} className="intro-canvas" />

        {/* Only render SVG once font is loaded and phase is past "waiting" */}
        {phase !== "waiting" && (
          <div className={`intro-center ${phase === "fadeout" ? "fadeout" : ""}`}>
            <svg
              className={`intro-svg-text ${phase === "glow" || phase === "fadeout" ? "intro-glow active" : ""}`}
              viewBox="0 0 950 220"
              width="950"
              height="220"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#459cca" />
                  <stop offset="50%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#459cca" />
                </linearGradient>
              </defs>

              <text
                className="intro-fill-text"
                x="50%"
                y="155"
                textAnchor="middle"
                dominantBaseline="auto"
                style={{ fontFamily }}
              >
                SlideFlow
              </text>

              <text
                x="50%"
                y="155"
                textAnchor="middle"
                dominantBaseline="auto"
                fontSize="154"
                fontWeight="700"
                className="intro-path"
                style={{ fontFamily }}
              >
                SlideFlow
              </text>
            </svg>
          </div>
        )}
      </div>
    </>
  );
}
