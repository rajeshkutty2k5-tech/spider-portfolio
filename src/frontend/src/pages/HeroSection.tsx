import { gsap } from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef } from "react";
import { VideoBackground } from "../components/VideoBackground";
import { useMousePosition } from "../hooks/useMousePosition";

// ─── Constants ────────────────────────────────────────────────────────────────

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: Math.random() * 2 + 1,
  x: Math.random() * 100,
  y: Math.random() * 100,
  color: i % 3 === 0 ? "rgba(255,0,0," : "rgba(0,255,255,",
  opacity: Math.random() * 0.2 + 0.15,
  duration: Math.random() * 12 + 8,
  delay: Math.random() * 5,
  driftX: (Math.random() - 0.5) * 30,
}));

const ORBS = [
  { angle: 0, color: "#00ffff", size: 10, radius: 270, speed: 14 },
  { angle: 90, color: "#ff0000", size: 8, radius: 290, speed: 18 },
  { angle: 200, color: "#00ffff", size: 12, radius: 260, speed: 22 },
  { angle: 300, color: "#ff4444", size: 7, radius: 280, speed: 16 },
];

// ─── Spider-Man Mask SVG ─────────────────────────────────────────────────────

function SpiderMaskIcon() {
  return (
    <svg
      viewBox="0 0 120 120"
      width="96"
      height="96"
      aria-hidden="true"
      style={{
        filter:
          "drop-shadow(0 0 18px rgba(255,0,0,0.85)) drop-shadow(0 0 40px rgba(255,60,60,0.45))",
      }}
    >
      {/* Mask base */}
      <ellipse cx="60" cy="58" rx="44" ry="48" fill="rgba(180,0,0,0.92)" />
      {/* Eyes */}
      <ellipse
        cx="38"
        cy="46"
        rx="16"
        ry="11"
        fill="rgba(255,255,255,0.95)"
        transform="rotate(-12,38,46)"
      />
      <ellipse
        cx="82"
        cy="46"
        rx="16"
        ry="11"
        fill="rgba(255,255,255,0.95)"
        transform="rotate(12,82,46)"
      />
      {/* Eye inner cyan tint */}
      <ellipse
        cx="38"
        cy="46"
        rx="11"
        ry="7.5"
        fill="rgba(0,220,255,0.25)"
        transform="rotate(-12,38,46)"
      />
      <ellipse
        cx="82"
        cy="46"
        rx="11"
        ry="7.5"
        fill="rgba(0,220,255,0.25)"
        transform="rotate(12,82,46)"
      />
      {/* Web lines */}
      <path
        d="M60 10 Q60 58 60 106"
        stroke="rgba(0,0,0,0.3)"
        strokeWidth="0.8"
        fill="none"
      />
      <path
        d="M16 58 Q60 58 104 58"
        stroke="rgba(0,0,0,0.3)"
        strokeWidth="0.8"
        fill="none"
      />
      <path
        d="M24 24 Q60 58 96 92"
        stroke="rgba(0,0,0,0.22)"
        strokeWidth="0.6"
        fill="none"
      />
      <path
        d="M96 24 Q60 58 24 92"
        stroke="rgba(0,0,0,0.22)"
        strokeWidth="0.6"
        fill="none"
      />
      <ellipse
        cx="60"
        cy="58"
        rx="24"
        ry="26"
        fill="none"
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="0.7"
      />
      <ellipse
        cx="60"
        cy="58"
        rx="40"
        ry="44"
        fill="none"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="0.6"
      />
    </svg>
  );
}

// ─── Spider Web SVG Pattern (faint, inside circle) ───────────────────────────

function WebPatternSVG() {
  return (
    <svg
      viewBox="0 0 300 300"
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
      style={{ opacity: 0.065 }}
    >
      {[30, 70, 110, 150].map((r) => (
        <circle
          key={r}
          cx="150"
          cy="150"
          r={r}
          fill="none"
          stroke="rgba(0,255,255,1)"
          strokeWidth="0.7"
        />
      ))}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const a = (deg * Math.PI) / 180;
        return (
          <line
            key={`web-line-${deg}`}
            x1="150"
            y1="150"
            x2={150 + Math.cos(a) * 155}
            y2={150 + Math.sin(a) * 155}
            stroke="rgba(0,255,255,1)"
            strokeWidth="0.6"
          />
        );
      })}
    </svg>
  );
}

// ─── Floating Orb ─────────────────────────────────────────────────────────────

function FloatingOrb({
  color,
  size,
  radius,
  startAngle,
  speed,
}: {
  color: string;
  size: number;
  radius: number;
  startAngle: number;
  speed: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        background: color,
        boxShadow: `0 0 ${size * 2.5}px ${color}, 0 0 ${size * 5}px ${color}40`,
        top: "50%",
        left: "50%",
        marginTop: -size / 2,
        marginLeft: -size / 2,
      }}
      animate={{
        x: Array.from(
          { length: 9 },
          (_, i) => Math.cos(((startAngle + i * 45) * Math.PI) / 180) * radius,
        ),
        y: Array.from(
          { length: 9 },
          (_, i) => Math.sin(((startAngle + i * 45) * Math.PI) / 180) * radius,
        ),
      }}
      transition={{
        duration: speed,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
    />
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

interface HeroSectionProps {
  maskDone?: boolean;
}

export function HeroSection({ maskDone = false }: HeroSectionProps) {
  const mouse = useMousePosition();
  const focalRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const gsapRan = useRef(false);

  const nameChars = useMemo(
    () =>
      "RAJESH".split("").map((char, i) => (
        <span
          key={`char-${i}-${char}`}
          className="char inline-block"
          style={{ opacity: 0 }}
          aria-hidden="true"
        >
          {char}
        </span>
      )),
    [],
  );

  // GSAP stagger fires only after mask reveal is complete
  useEffect(() => {
    if (!maskDone || gsapRan.current || !nameRef.current) return;
    gsapRan.current = true;
    gsap.fromTo(
      nameRef.current.querySelectorAll(".char"),
      { opacity: 0, y: 60, rotateX: -80, scale: 0.8 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        stagger: 0.06,
        duration: 0.8,
        ease: "back.out(1.5)",
        delay: 0.2,
      },
    );
  }, [maskDone]);

  // Gentle parallax for focal circle (×8 sensitivity)
  useEffect(() => {
    if (!focalRef.current) return;
    focalRef.current.style.transform = `translate(${mouse.x * -8}px, ${mouse.y * 8}px)`;
  }, [mouse]);

  const scrollTo = (id: string) => () => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-ocid="hero-section"
    >
      {/* ── 1. Video background ───────────────────────────────────── */}
      <VideoBackground />

      {/* ── Atmospheric gradient overlay ─────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,5,20,0.72) 0%, transparent 45%, rgba(5,5,20,0.92) 100%)",
          zIndex: 1,
        }}
      />

      {/* ── 2. Ghost SPIDER watermark ─────────────────────────────── */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ zIndex: 2 }}
        animate={{ y: [0, -12, 0] }}
        transition={{
          duration: 13,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        aria-hidden="true"
      >
        <span
          className="font-display ghost-spider-text"
          style={{
            fontSize: "clamp(120px, 22vw, 340px)",
            fontWeight: 900,
            color: "transparent",
            WebkitTextStroke: "1.5px rgba(200,230,255,0.09)",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          SPIDER
        </span>
      </motion.div>

      {/* ── 7. Floating particles ─────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 5 }}
      >
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              background: `${p.color}${p.opacity})`,
              filter: `blur(${p.size > 2 ? 1 : 0}px)`,
            }}
            animate={{
              y: [0, -80, 0],
              x: [0, p.driftX, 0],
              opacity: [p.opacity * 0.5, p.opacity, p.opacity * 0.4],
            }}
            transition={{
              duration: p.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: p.delay,
            }}
          />
        ))}
      </div>

      {/* ── Web pattern overlay ───────────────────────────────────── */}
      <div
        className="absolute inset-0 web-pattern opacity-20"
        style={{ zIndex: 6 }}
      />

      {/* ── 3. Focal Circle Layer ─────────────────────────────────── */}
      <div
        ref={focalRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          zIndex: 10,
          transition: "transform 80ms linear",
          willChange: "transform",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.75 }}
          animate={
            maskDone ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.75 }
          }
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-center hero-focal-circle"
          style={{
            width: "clamp(300px, 42vw, 560px)",
            height: "clamp(300px, 42vw, 560px)",
            borderRadius: "50%",
            background: "rgba(0,0,30,0.32)",
            border: "1.5px solid rgba(0,255,255,0.3)",
            boxShadow:
              "0 0 40px rgba(0,255,255,0.35), 0 0 80px rgba(0,255,255,0.15), 0 0 160px rgba(0,255,255,0.06), inset 0 0 60px rgba(0,0,60,0.3)",
          }}
        >
          {/* Inner web pattern */}
          <WebPatternSVG />

          {/* Spinning ring */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              border: "1px solid rgba(0,255,255,0.12)",
              boxShadow: "inset 0 0 20px rgba(0,255,255,0.05)",
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 40,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />

          {/* Spider-Man mask icon — centered */}
          <motion.div
            className="relative z-10 flex items-center justify-center"
            animate={{
              scale: [1, 1.04, 1],
              filter: ["brightness(1)", "brightness(1.25)", "brightness(1)"],
            }}
            transition={{
              duration: 3.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <SpiderMaskIcon />
          </motion.div>

          {/* Orbiting glowing orbs */}
          {ORBS.map((orb) => (
            <FloatingOrb
              key={`orb-${orb.angle}-${orb.color}`}
              color={orb.color}
              size={orb.size}
              radius={
                (orb.radius / 2) *
                (Number.parseFloat(
                  getComputedStyle(document.documentElement).fontSize,
                ) /
                  16)
              }
              startAngle={orb.angle}
              speed={orb.speed}
            />
          ))}
        </motion.div>
      </div>

      {/* ── 8. Top-right pill CTA ─────────────────────────────────── */}
      <motion.button
        type="button"
        onClick={scrollTo("projects")}
        initial={{ opacity: 0, x: 20 }}
        animate={maskDone ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        whileHover={{
          backgroundColor: "rgba(0,255,255,0.08)",
          boxShadow: "0 0 20px rgba(0,255,255,0.3)",
        }}
        className="absolute top-6 right-6 hidden md:flex items-center gap-2 px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-widest transition-all duration-200"
        style={{
          zIndex: 50,
          borderRadius: 999,
          border: "1px solid rgba(0,255,255,0.45)",
          color: "#00ffff",
          background: "transparent",
        }}
        data-ocid="hero-cta-explore"
      >
        Explore Work →
      </motion.button>

      {/* ── 5. Bottom-left headline block ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={maskDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="absolute bottom-12 left-10 max-w-xs md:max-w-sm"
        style={{ zIndex: 20 }}
        data-ocid="hero-headline-block"
      >
        {/* Small label */}
        <p
          className="font-mono uppercase mb-2"
          style={{
            fontSize: 11,
            letterSpacing: "0.3em",
            color: "#00ffff",
            opacity: 0.6,
          }}
        >
          Portfolio — 2025
        </p>

        {/* Ghost name GSAP chars (hidden accessible label) */}
        <h1
          className="sr-only"
          aria-label="Rajesh Kutty — Full Stack Developer"
        />

        {/* Tagline lines */}
        <div
          ref={nameRef}
          className="font-display font-black mb-0.5 hidden"
          style={{ fontSize: "clamp(28px, 3.5vw, 48px)", perspective: "800px" }}
          aria-hidden="true"
        >
          {nameChars}
        </div>

        <p
          className="font-display font-bold leading-tight mb-1"
          style={{
            fontSize: "clamp(24px, 3vw, 44px)",
            color: "rgba(255,255,255,0.95)",
          }}
        >
          Beyond the screen.
        </p>
        <p
          className="font-display font-bold leading-tight mb-3 text-gradient-cyan"
          style={{ fontSize: "clamp(24px, 3vw, 44px)" }}
        >
          Code that breaks gravity.
        </p>

        <p
          className="font-body"
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.48)",
            letterSpacing: "0.01em",
          }}
        >
          Full-Stack Developer · Spider-Man enthusiast
        </p>

        {/* Social pill links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={maskDone ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex items-center gap-3 mt-4"
        >
          {[
            { label: "GitHub", href: "https://github.com" },
            { label: "LinkedIn", href: "https://linkedin.com" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono px-3 py-1 rounded-full transition-all duration-200 hover:bg-[rgba(0,255,255,0.08)]"
              style={{
                border: "1px solid rgba(0,255,255,0.28)",
                color: "rgba(0,255,255,0.7)",
                letterSpacing: "0.1em",
              }}
              data-ocid={`hero-social-${label.toLowerCase()}`}
            >
              {label}
            </a>
          ))}
        </motion.div>
      </motion.div>

      {/* ── 6. Bottom-right slide indicator ──────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={maskDone ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
        transition={{ duration: 0.7, delay: 0.8 }}
        className="absolute bottom-12 right-10 hidden md:flex items-center gap-3"
        style={{ zIndex: 20 }}
        data-ocid="hero-slide-indicator"
      >
        {/* Arrow controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous section"
            onClick={scrollTo("hero")}
            className="flex items-center justify-center transition-all duration-200 hover:border-[rgba(0,255,255,0.8)] hover:shadow-[0_0_12px_rgba(0,255,255,0.4)]"
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "1px solid rgba(0,255,255,0.35)",
              color: "rgba(0,255,255,0.55)",
              background: "transparent",
            }}
            data-ocid="hero-nav-prev"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            aria-label="Next section"
            onClick={scrollTo("about")}
            className="flex items-center justify-center transition-all duration-200 hover:border-[rgba(0,255,255,0.8)] hover:shadow-[0_0_12px_rgba(0,255,255,0.4)]"
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "1px solid rgba(0,255,255,0.35)",
              color: "rgba(0,255,255,0.55)",
              background: "transparent",
            }}
            data-ocid="hero-nav-next"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Vertical divider + counter */}
        <div className="flex items-center gap-3">
          <div
            className="self-stretch"
            style={{
              width: 1,
              minHeight: 40,
              background: "rgba(0,255,255,0.35)",
            }}
          />
          <div className="flex flex-col gap-0.5">
            <div className="flex items-baseline gap-1">
              <span
                className="font-display font-semibold text-2xl"
                style={{ color: "rgba(255,255,255,0.9)" }}
              >
                01
              </span>
              <span
                className="font-mono"
                style={{ fontSize: 12, color: "#00ffff" }}
              >
                /
              </span>
              <span
                className="font-mono"
                style={{ fontSize: 14, color: "rgba(255,255,255,0.38)" }}
              >
                05
              </span>
            </div>
            <p
              className="font-mono uppercase"
              style={{
                fontSize: 10,
                letterSpacing: "0.25em",
                color: "rgba(0,255,255,0.7)",
              }}
            >
              FULL STACK DEV
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Scroll indicator ─────────────────────────────────────── */}
      <motion.button
        type="button"
        onClick={scrollTo("about")}
        initial={{ opacity: 0, y: 10 }}
        animate={maskDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 font-mono text-xs transition-colors duration-200 group"
        style={{ zIndex: 20, color: "rgba(255,255,255,0.4)" }}
        data-ocid="hero-scroll-down"
      >
        <span className="tracking-[0.25em] group-hover:text-[rgba(0,255,255,0.8)] transition-colors duration-200 hidden md:block">
          SCROLL
        </span>
        <div
          className="relative flex items-center justify-center"
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "1px solid rgba(0,255,255,0.35)",
          }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{
              duration: 1.6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 2 L6 10 M3 7 L6 10 L9 7"
                stroke="#00ffff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ border: "1px solid rgba(0,255,255,0.2)" }}
            animate={{ scale: [1, 1.7, 1], opacity: [0.5, 0, 0.5] }}
            transition={{
              duration: 2.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeOut",
            }}
          />
        </div>
      </motion.button>

      {/* ── Scanline CRT overlay ─────────────────────────────────── */}
      <div
        className="absolute inset-0 scanline-overlay pointer-events-none"
        style={{ zIndex: 8 }}
      />
    </section>
  );
}
