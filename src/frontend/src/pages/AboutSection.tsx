import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type Variants, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { useScrollIntoView } from "../hooks/useScrollProgress";

gsap.registerPlugin(ScrollTrigger);

// ── Spider-web SVG icon ───────────────────────────────────────────────────────
function SpiderWebIcon({ size = 80 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
    >
      {[0, 30, 60, 90, 120, 150].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <line
            key={angle}
            x1={40}
            y1={40}
            x2={40 + 34 * Math.cos(rad)}
            y2={40 + 34 * Math.sin(rad)}
            stroke="rgba(0,255,255,0.65)"
            strokeWidth="1"
          />
        );
      })}
      {[10, 18, 26, 34].map((r) => (
        <circle
          key={r}
          cx={40}
          cy={40}
          r={r}
          stroke="rgba(0,255,255,0.45)"
          strokeWidth="1"
          fill="none"
        />
      ))}
      <circle cx={40} cy={40} r={3} fill="#00ffff" opacity={0.9} />
    </svg>
  );
}

// ── Stat mini-card ────────────────────────────────────────────────────────────
const STATS = [
  { value: "3+", label: "Years Experience" },
  { value: "20+", label: "Projects Completed" },
  { value: "15+", label: "Technologies" },
];

function StatCard({
  value,
  label,
  index,
}: (typeof STATS)[0] & { index: number }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 28 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, delay: index * 0.14 },
        },
      }}
      whileHover={{
        scale: 1.04,
        boxShadow: "0 0 32px rgba(255,0,0,0.45), 0 0 64px rgba(255,0,0,0.2)",
      }}
      className="flex flex-col items-center justify-center px-5 py-4 rounded-xl cursor-default"
      style={{
        background: "rgba(0,255,255,0.04)",
        border: "1px solid rgba(0,255,255,0.22)",
        boxShadow:
          "0 0 14px rgba(0,255,255,0.1), inset 0 0 12px rgba(0,255,255,0.04)",
        transition: "box-shadow 0.3s ease",
      }}
      data-ocid={`stat-card-${index}`}
    >
      <span
        className="font-display font-extrabold text-3xl"
        style={{
          color: "#00ffff",
          textShadow:
            "0 0 16px rgba(0,255,255,0.9), 0 0 32px rgba(0,255,255,0.45)",
        }}
      >
        {value}
      </span>
      <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1 text-center">
        {label}
      </span>
    </motion.div>
  );
}

// ── Variants ─────────────────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const EASE_OUT: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

// ── Bio text with GSAP character stagger ─────────────────────────────────────
function BioParagraph({
  text,
  className,
}: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const words = ref.current.querySelectorAll(".bio-word");
    gsap.fromTo(
      words,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.03,
        duration: 0.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          once: true,
        },
      },
    );
  }, []);

  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <span
          key={`word-${i}-${word}`}
          className="bio-word inline-block mr-1"
          style={{ opacity: 0 }}
        >
          {word}
        </span>
      ))}
    </p>
  );
}

// ── Main section ─────────────────────────────────────────────────────────────
export function AboutSection() {
  const { ref, isVisible } = useScrollIntoView(0.12);
  const prefersReducedMotion = useReducedMotion();

  const animateState = prefersReducedMotion
    ? "visible"
    : isVisible
      ? "visible"
      : "hidden";

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-28 overflow-hidden"
      style={{ background: "oklch(0.09 0 0)" }}
      data-ocid="about-section"
    >
      {/* Diagonal web-pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            rgba(0,255,255,0.025) 0px,
            rgba(0,255,255,0.025) 1px,
            transparent 1px,
            transparent 28px
          ), repeating-linear-gradient(
            45deg,
            rgba(0,255,255,0.018) 0px,
            rgba(0,255,255,0.018) 1px,
            transparent 1px,
            transparent 28px
          )`,
        }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(0,255,255,0.55), transparent)",
        }}
      />

      {/* Ambient section glow behind avatar */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(0,255,255,0.07) 0%, transparent 65%)",
          animation: "breathe-glow 4s ease-in-out infinite",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="font-mono text-xs tracking-[0.3em] uppercase mb-3"
          style={{ color: "#00ffff" }}
        >
          02 / About
        </motion.p>

        {/* Split layout */}
        <div className="flex flex-col lg:flex-row items-start gap-16 lg:gap-20">
          {/* LEFT — Avatar */}
          <motion.div
            variants={slideFromLeft}
            initial="hidden"
            animate={animateState}
            className="flex-shrink-0 flex flex-col items-center gap-6 lg:sticky lg:top-24"
            data-ocid="about-avatar"
          >
            <div className="relative">
              {/* Breathing cyan aura */}
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  inset: "-20px",
                  background:
                    "radial-gradient(circle, rgba(0,255,255,0.12) 0%, transparent 70%)",
                  animation: "breathe-glow 3.5s ease-in-out infinite",
                }}
              />
              {/* Outer slow-pulse ring */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  border: "1px solid rgba(0,255,255,0.2)",
                  borderRadius: "50%",
                  animation: "ping 3s cubic-bezier(0, 0, 0.2, 1) infinite",
                  scale: "1.1",
                }}
              />
              {/* Main avatar circle */}
              <div
                className="relative w-52 h-52 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "radial-gradient(circle at 35% 35%, rgba(0,255,255,0.14) 0%, rgba(0,0,0,0.85) 70%)",
                  border: "2px solid rgba(0,255,255,0.6)",
                  boxShadow:
                    "0 0 40px rgba(0,255,255,0.4), 0 0 80px rgba(0,255,255,0.18), 0 0 120px rgba(0,255,255,0.08), inset 0 0 28px rgba(0,255,255,0.1)",
                }}
              >
                <SpiderWebIcon size={90} />
              </div>

              {/* Red accent badge */}
              <div
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold"
                style={{
                  background: "rgba(255,0,0,0.18)",
                  border: "1px solid rgba(255,0,0,0.55)",
                  color: "#ff4444",
                  boxShadow: "0 0 16px rgba(255,0,0,0.45)",
                }}
              >
                SP
              </div>
            </div>

            <div
              className="font-mono text-xs tracking-widest uppercase"
              style={{ color: "rgba(0,255,255,0.5)" }}
            >
              {"// full-stack dev"}
            </div>
          </motion.div>

          {/* RIGHT — Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={animateState}
            className="flex-1 min-w-0"
          >
            {/* Heading */}
            <motion.div variants={slideFromRight} className="mb-6">
              <h2
                className="font-display font-bold text-4xl md:text-5xl tracking-tight mb-3"
                style={{
                  textShadow: "0 0 30px rgba(0,255,255,0.3)",
                }}
              >
                About <span className="text-gradient-cyan">Me</span>
              </h2>
              <div
                className="w-20 h-0.5 rounded-full"
                style={{
                  background: "linear-gradient(90deg, #00ffff, transparent)",
                  boxShadow: "0 0 10px rgba(0,255,255,0.6)",
                }}
              />
            </motion.div>

            {/* Bio with word-level stagger */}
            <motion.div variants={fadeUp} className="mb-10 space-y-4">
              <BioParagraph
                text="I'm a passionate full-stack developer who thrives at the intersection of design and engineering. I build digital experiences that are fast, accessible, and visually striking."
                className="text-foreground/80 text-lg leading-relaxed"
              />
              <BioParagraph
                text="From crafting pixel-perfect UIs to architecting resilient backends, I obsess over the details that transform good software into something users love. Clean code and creative design are not opposites — they're the same goal."
                className="text-foreground/70 text-base leading-relaxed"
              />
              <BioParagraph
                text="When I'm not writing code, I'm studying animation physics, exploring generative art, or contributing to open-source projects that push the web forward."
                className="text-foreground/60 text-base leading-relaxed"
              />
            </motion.div>

            {/* Stat cards */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-3 gap-4"
              data-ocid="about-stats"
            >
              {STATS.map((stat, i) => (
                <StatCard key={stat.label} {...stat} index={i} />
              ))}
            </motion.div>

            {/* Tech stack pills */}
            <motion.div variants={fadeUp} className="mt-8">
              <p
                className="font-mono text-xs tracking-widest uppercase mb-3"
                style={{ color: "rgba(0,255,255,0.45)" }}
              >
                {"// stack"}
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "React",
                  "TypeScript",
                  "Motoko",
                  "Tailwind CSS",
                  "Framer Motion",
                  "Node.js",
                  "GSAP",
                  "Three.js",
                ].map((tech) => (
                  <motion.span
                    key={tech}
                    whileHover={{
                      scale: 1.08,
                      boxShadow: "0 0 14px rgba(0,255,255,0.35)",
                    }}
                    className="font-mono text-xs px-3 py-1 rounded-full cursor-default"
                    style={{
                      background: "rgba(0,255,255,0.06)",
                      border: "1px solid rgba(0,255,255,0.22)",
                      color: "rgba(0,255,255,0.8)",
                      transition: "box-shadow 0.2s ease",
                    }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,0,0,0.4), transparent)",
        }}
      />
    </section>
  );
}
