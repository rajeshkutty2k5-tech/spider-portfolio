import {
  Code2,
  Cpu,
  Database,
  Globe,
  Layout,
  Shield,
  Terminal,
  Zap,
} from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { SKILLS } from "../data/portfolio";
import { useScrollIntoView } from "../hooks/useScrollProgress";
import type { Skill } from "../types";

const TECH_ICONS = [
  { id: "react", label: "React", Icon: Globe, color: "cyan" },
  { id: "typescript", label: "TypeScript", Icon: Code2, color: "cyan" },
  { id: "nodejs", label: "Node.js", Icon: Zap, color: "red" },
  { id: "database", label: "Databases", Icon: Database, color: "red" },
  { id: "rust", label: "Rust", Icon: Cpu, color: "red" },
  { id: "infra", label: "DevOps", Icon: Terminal, color: "cyan" },
  { id: "ui", label: "UI Systems", Icon: Layout, color: "cyan" },
  { id: "security", label: "Security", Icon: Shield, color: "red" },
] as const;

function WebCorner() {
  return (
    <svg
      aria-hidden="true"
      className="absolute top-0 right-0 opacity-[0.08] pointer-events-none"
      width="320"
      height="320"
      viewBox="0 0 320 320"
      fill="none"
    >
      {[0, 20, 40, 60, 80, 100, 120, 140, 160].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <line
            key={angle}
            x1="320"
            y1="0"
            x2={320 - Math.cos(rad) * 320}
            y2={Math.sin(rad) * 320}
            stroke="#00ffff"
            strokeWidth="1"
          />
        );
      })}
      {[60, 120, 180, 240, 300].map((r) => (
        <path
          key={r}
          d={`M ${320 - r} 0 A ${r} ${r} 0 0 1 320 ${r}`}
          stroke="#00ffff"
          strokeWidth="1"
          fill="none"
        />
      ))}
    </svg>
  );
}

function SkillBar({ skill, index }: { skill: Skill; index: number }) {
  const { ref, isVisible } = useScrollIntoView(0.1);
  const isCyan = skill.color === "cyan";
  const accentColor = isCyan ? "#00ffff" : "#ff4444";

  return (
    <motion.div
      ref={ref as React.RefCallback<HTMLDivElement>}
      initial={{ opacity: 0, x: -28 }}
      animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -28 }}
      transition={{
        duration: 0.55,
        delay: index * 0.08,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="mb-5"
      data-ocid={`skill-bar-${skill.id}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">
          {skill.name}
        </span>
        <span
          className="text-xs font-mono tabular-nums"
          style={{ color: accentColor }}
        >
          {skill.level}%
        </span>
      </div>

      {/* Track */}
      <div
        className="relative h-2.5 rounded-full overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Neon gradient fill: red → cyan */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          initial={{ width: 0 }}
          animate={isVisible ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{
            duration: 1.4,
            delay: index * 0.08 + 0.18,
            ease: [0.4, 0, 0.2, 1],
          }}
          style={{
            background:
              "linear-gradient(90deg, #ff0000 0%, #ff4444 30%, #00aaff 70%, #00ffff 100%)",
            boxShadow: `0 0 12px ${accentColor}90, 0 0 24px ${accentColor}40`,
          }}
        />
        {/* Shimmer sweep */}
        <motion.div
          className="absolute inset-y-0 left-0 w-full rounded-full"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: [0, 0.5, 0] } : { opacity: 0 }}
          transition={{ duration: 2, delay: index * 0.08 + 0.35 }}
          style={{
            background:
              "linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.35) 50%, transparent 75%)",
          }}
        />
      </div>
    </motion.div>
  );
}

function SkillIconCard({
  id,
  label,
  Icon,
  color,
  index,
}: {
  id: string;
  label: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  color: "cyan" | "red";
  index: number;
}) {
  const isCyan = color === "cyan";
  const glowColor = isCyan ? "rgba(0,255,255,0.55)" : "rgba(255,0,0,0.55)";
  const iconColor = isCyan ? "#00ffff" : "#ff4444";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.75, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{
        duration: 0.5,
        delay: index * 0.09,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      whileHover={{
        scale: 1.12,
        boxShadow: `0 0 24px ${glowColor}, 0 0 48px ${isCyan ? "rgba(0,255,255,0.2)" : "rgba(255,0,0,0.2)"}`,
      }}
      className="group relative flex flex-col items-center justify-center gap-3 p-5 rounded-xl cursor-default"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        transition: "box-shadow 0.25s ease",
        willChange: "transform",
      }}
      data-ocid={`skill-icon-${id}`}
    >
      {/* Hover border overlay */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-smooth pointer-events-none"
        style={{
          border: `1px solid ${iconColor}`,
          boxShadow: `0 0 20px ${glowColor}, inset 0 0 20px ${isCyan ? "rgba(0,255,255,0.06)" : "rgba(255,0,0,0.06)"}`,
        }}
      />

      {/* Icon */}
      <motion.div
        whileHover={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.45 }}
        style={{
          color: iconColor,
          filter: `drop-shadow(0 0 8px ${glowColor})`,
        }}
      >
        <Icon size={28} />
      </motion.div>

      <span className="text-xs font-mono text-muted-foreground group-hover:text-foreground transition-smooth text-center leading-tight">
        {label}
      </span>
    </motion.div>
  );
}

function SectionHeading() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
      className="mb-16"
    >
      <p
        className="font-mono text-xs tracking-[0.3em] uppercase mb-3"
        style={{ color: "#00ffff" }}
      >
        04 / Skills
      </p>

      <h2
        className="font-display font-bold text-4xl md:text-5xl tracking-tight mb-4"
        style={{ textShadow: "0 0 30px rgba(0,255,255,0.2)" }}
      >
        My <span className="text-gradient-cyan glow-text-cyan">Skills</span>
      </h2>

      {/* Neon cyan underline */}
      <div className="relative w-24 h-0.5 mb-6 overflow-visible">
        <motion.div
          className="absolute inset-0 rounded-full"
          initial={{ scaleX: 0, originX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          style={{
            background: "linear-gradient(90deg, #00ffff, #0088ff)",
            boxShadow: "0 0 14px rgba(0,255,255,0.7)",
            transformOrigin: "left",
          }}
        />
      </div>

      <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
        Battle-tested technologies I wield to build production-grade systems.
      </p>
    </motion.div>
  );
}

export function SkillsSection() {
  return (
    <section
      id="skills"
      className="relative py-28 overflow-hidden"
      style={{ background: "oklch(0.075 0 0)" }}
      data-ocid="skills-section"
    >
      {/* Top separator */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(0,255,255,0.45), transparent)",
        }}
      />

      {/* Web corner */}
      <WebCorner />

      {/* Ambient radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,255,255,0.05) 0%, transparent 65%)",
        }}
      />

      {/* Section-glow accent */}
      <div
        className="absolute bottom-0 right-0 w-[400px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,0,0,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6">
        <SectionHeading />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Skill bars */}
          <div>
            <p
              className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-6 pb-3"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              Proficiency
            </p>
            {SKILLS.map((skill, i) => (
              <SkillBar key={skill.id} skill={skill} index={i} />
            ))}
          </div>

          {/* Right: Icon grid */}
          <div>
            <p
              className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-6 pb-3"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              Tech Stack
            </p>
            <div className="grid grid-cols-4 gap-3">
              {TECH_ICONS.map((tech, i) => (
                <SkillIconCard key={tech.id} {...tech} index={i} />
              ))}
            </div>

            {/* Additional tech badges — float in with stagger */}
            <div className="mt-8">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
                Also comfortable with
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "GraphQL",
                  "PostgreSQL",
                  "Redis",
                  "AWS",
                  "Terraform",
                  "Kubernetes",
                  "Kafka",
                  "WebAssembly",
                ].map((tech, i) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8, y: 8 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.06 }}
                    whileHover={{
                      scale: 1.1,
                      color: "#00ffff",
                      boxShadow: "0 0 14px rgba(0,255,255,0.35)",
                      borderColor: "rgba(0,255,255,0.45)",
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono text-muted-foreground cursor-default"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      transition:
                        "color 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                      willChange: "transform",
                    }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom separator */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,0,0,0.35), transparent)",
        }}
      />
    </section>
  );
}
