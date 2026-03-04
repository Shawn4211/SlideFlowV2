"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User, Lock, Eye, EyeOff } from "lucide-react";

const ADMIN_ACCOUNTS: Record<string, string> = {
  "Admin": "admin@slideflow.app",
  "Admin2": "admin2@slideflow.app",
  "Admin3": "admin3@slideflow.app",
  "Admin4": "admin4@slideflow.app",
  "Admin5": "admin5@slideflow.app",
  "Admin6": "admin6@slideflow.app",
};

/* ───────── Particle System ───────── */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
}

function useParticles(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let mouse = { x: -1000, y: -1000 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Create particles
    const count = 120;
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.15,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
      });
    }

    const connectionDist = 150;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Pulse glow
        p.pulse += p.pulseSpeed;
        const glow = Math.sin(p.pulse) * 0.2 + 0.8;

        // Mouse repel
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120 * 0.8;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Damping
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle
        const alpha = p.opacity * glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();

        // Connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cx = p.x - p2.x;
          const cy = p.y - p2.y;
          const cd = Math.sqrt(cx * cx + cy * cy);
          if (cd < connectionDist) {
            const lineAlpha = (1 - cd / connectionDist) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
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
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [canvasRef]);
}

/* ───────── Login Page ───────── */
export default function LoginPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Load remembered username
    const saved = localStorage.getItem("slideflow_remember_user");
    if (saved) {
      setUsername(saved);
      setRememberMe(true);
    }
  }, []);

  useParticles(canvasRef);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const email = ADMIN_ACCOUNTS[username];
    if (!email) {
      setError("Invalid username or password");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError("Invalid username or password");
      } else {
        // Save or clear remembered username
        if (rememberMe) {
          localStorage.setItem("slideflow_remember_user", username);
        } else {
          localStorage.removeItem("slideflow_remember_user");
        }
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800;900&display=swap');

        body { margin: 0; padding: 0; }

        .lp {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: radial-gradient(ellipse at 30% 50%, #0f1724 0%, #080c14 50%, #04060a 100%);
          font-family: 'Outfit', sans-serif;
        }

        /* ---- Particle canvas ---- */
        .lp-canvas {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        /* ---- Content wrapper ---- */
        .lp-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 400px;
          margin: 1rem;
        }

        /* ---- SlideFlow brand ---- */
        .lp-brand {
          font-family: 'Outfit', sans-serif;
          font-weight: 900;
          font-size: 3.4rem;
          letter-spacing: -0.03em;
          color: #fff;
          text-align: center;
          margin: 0 0 2rem;
          text-shadow:
            0 0 40px rgba(100, 160, 255, 0.2),
            0 0 80px rgba(80, 140, 255, 0.08);
          line-height: 1.1;
          user-select: none;
        }

        /* ---- Glass Card ---- */
        .lp-card {
          width: 100%;
          padding: 2.2rem 2rem 1.8rem;
          background: linear-gradient(
            135deg,
            rgba(255,255,255,0.07) 0%,
            rgba(255,255,255,0.03) 50%,
            rgba(255,255,255,0.05) 100%
          );
          backdrop-filter: blur(20px) saturate(1.4);
          -webkit-backdrop-filter: blur(20px) saturate(1.4);
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow:
            0 10px 40px rgba(0,0,0,0.4),
            inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .lp-title {
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 1.6rem;
          color: #fff;
          text-align: center;
          margin: 0 0 1.5rem;
          letter-spacing: -0.01em;
        }

        .lp-ig {
          position: relative;
          margin-bottom: 0.9rem;
        }

        .lp-ic-l {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.3);
          width: 15px; height: 15px;
          pointer-events: none;
        }

        .lp-ic-r {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.12);
          width: 14px; height: 14px;
          pointer-events: none;
        }

        .lp-eye-btn {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255,255,255,0.3);
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
          z-index: 1;
        }
        .lp-eye-btn:hover {
          color: rgba(255,255,255,0.6);
        }

        .lp-input {
          width: 100%;
          padding: 11px 38px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px;
          color: #fff;
          font-family: 'Outfit', sans-serif;
          font-size: 0.88rem;
          outline: none;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .lp-input::placeholder {
          color: rgba(255,255,255,0.25);
          font-size: 0.85rem;
        }

        .lp-input:focus {
          border-color: rgba(100,160,255,0.4);
          background: rgba(255,255,255,0.08);
          box-shadow: 0 0 0 2px rgba(100,160,255,0.1);
        }

        .lp-row {
          display: flex;
          align-items: center;
          margin: 0.4rem 0 1rem;
          font-size: 0.78rem;
          font-family: 'Outfit', sans-serif;
          color: rgba(255,255,255,0.4);
        }
        .lp-row label {
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          user-select: none;
        }
        .lp-row input[type="checkbox"] {
          width: 13px; height: 13px;
          accent-color: rgba(100,160,255,0.8);
          cursor: pointer;
        }

        .lp-error {
          color: #ff6b6b;
          font-size: 0.8rem;
          text-align: center;
          margin-bottom: 0.6rem;
          font-family: 'Outfit', sans-serif;
        }

        .lp-btn {
          width: 100%;
          padding: 12px;
          background: #fff;
          border: none;
          border-radius: 10px;
          color: #0a0a14;
          font-family: 'Outfit', sans-serif;
          font-size: 0.92rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          letter-spacing: 0.2px;
        }

        .lp-btn:hover {
          background: #e8eeff;
          box-shadow: 0 6px 25px rgba(0,0,0,0.3);
          transform: translateY(-1px);
        }
        .lp-btn:active { transform: translateY(0); }
        .lp-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .lp-copyright {
          position: absolute;
          bottom: 16px;
          left: 0;
          right: 0;
          text-align: center;
          font-family: 'Outfit', sans-serif;
          font-size: 0.72rem;
          color: rgba(255,255,255,0.25);
          z-index: 2;
          user-select: none;
        }

        @media (max-width: 480px) {
          .lp-brand {
            font-size: 2.4rem;
            margin-bottom: 1.2rem;
          }
          .lp-content {
            margin: 1rem 0.8rem;
          }
        }
      `}</style>

      <div className={`lp${mounted ? " hydrated" : ""}`}>
        <canvas ref={canvasRef} className="lp-canvas" />

        <div className="lp-content">
          <h1 className="lp-brand">SlideFlow</h1>

          <div className="lp-card">
            <h2 className="lp-title">Login</h2>

            <form onSubmit={handleSubmit}>
              <div className="lp-ig">
                <User className="lp-ic-l" />
                <input type="text" className="lp-input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <User className="lp-ic-r" />
              </div>

              <div className="lp-ig">
                <Lock className="lp-ic-l" />
                <input type={showPassword ? "text" : "password"} className="lp-input" style={{ paddingRight: '42px' }} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" className="lp-eye-btn" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="lp-row">
                <label><input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} /> Remember me</label>
              </div>

              {error && <div className="lp-error">{error}</div>}

              <button type="submit" className="lp-btn" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Login"}
              </button>
            </form>
          </div>
        </div>

        <p className="lp-copyright">© {new Date().getFullYear()} SlideFlow. All rights reserved.</p>
      </div>
    </>
  );
}
