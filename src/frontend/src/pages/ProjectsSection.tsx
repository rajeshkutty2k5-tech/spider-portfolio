import { ArrowRight, ExternalLink, Github, Star } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { PROJECTS } from "../data/portfolio";
import type { Project } from "../types";

// ── Web Strand SVG ────────────────────────────────────────────────────────────

function WebStrands({ count }: { count: number }) {
  const shouldReduce = useReducedMotion();
  const cx = 50;
  const cy = 0;

  const endpoints = Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0.5 : i / (count - 1);
    return { x: 8 + t * 84, y: 100, id: `strand-${i}` };
  });

  const knots = endpoints.map((ep) => ({
    x: cx + (ep.x - cx) * 0.4,
    y: cy + (ep.y - cy) * 0.55,
  }));

  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full pointer-events-none"
      style={{ height: "100%", overflow: "visible" }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <radialGradient id="strandGradCyan" cx="50%" cy="0%" r="100%">
          <stop offset="0%" stopColor="#00ffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#00ffff" stopOpacity="0" />
        </radialGradient>
        <filter id="strandGlow">
          <feGaussianBlur stdDeviation="0.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {endpoints.map((ep, i) => {
        const k = knots[i];
        const d = `M ${cx} ${cy} Q ${k.x} ${k.y} ${ep.x} ${ep.y}`;
        return (
          <g key={ep.id} filter="url(#strandGlow)">
            <path
              d={d}
              fill="none"
              stroke="rgba(0,255,255,0.1)"
              strokeWidth="0.35"
            />
            <motion.path
              d={d}
              fill="none"
              stroke="url(#strandGradCyan)"
              strokeWidth="0.3"
              strokeDasharray="8 30"
              initial={{ strokeDashoffset: 0 }}
              animate={shouldReduce ? {} : { strokeDashoffset: -38 }}
              transition={{
                duration: 2.4 + i * 0.3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
                delay: i * 0.5,
              }}
            />
            <motion.circle
              cx={cx}
              cy={cy}
              r="0.7"
              fill="#00ffff"
              opacity={0.6}
              animate={shouldReduce ? {} : { opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <motion.circle
              cx={ep.x}
              cy={ep.y}
              r="0.6"
              fill="#00ffff"
              opacity={0.4}
              animate={shouldReduce ? {} : { opacity: [0.2, 0.8, 0.2] }}
              transition={{
                duration: 2.4 + i * 0.3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: i * 0.4,
              }}
            />
          </g>
        );
      })}
    </svg>
  );
}

// ── Project Card ──────────────────────────────────────────────────────────────

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 56 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.65,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -10, scale: 1.02 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: hovered
          ? "1px solid rgba(0,255,255,0.5)"
          : "1px solid rgba(0,255,255,0.12)",
        boxShadow: hovered
          ? "0 24px 64px rgba(255,0,0,0.22), 0 0 0 1px rgba(0,255,255,0.12) inset, 0 0 40px rgba(0,255,255,0.08)"
          : "0 0 20px rgba(0,255,255,0.06), 0 4px 24px rgba(0,0,0,0.5)",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        willChange: "transform",
      }}
      data-ocid={`project-card-${project.id}`}
    >
      {/* Featured badge — glowing */}
      {project.featured && (
        <div
          className="absolute top-4 right-4 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono"
          style={{
            background: "rgba(255,0,0,0.18)",
            border: "1px solid rgba(255,0,0,0.5)",
            color: "#ff6666",
            boxShadow: "0 0 16px rgba(255,0,0,0.5), 0 0 32px rgba(255,0,0,0.2)",
            animation: "pulse-glow-red 2.5s ease-in-out infinite",
          }}
        >
          <Star size={10} fill="currentColor" />
          Featured
        </div>
      )}

      <div className="flex flex-col flex-1 p-7">
        <div className="font-mono text-xs tracking-widest text-muted-foreground mb-4">
          {project.year}
        </div>

        <h3
          className="font-display font-bold text-xl mb-3 transition-colors duration-300"
          style={{
            color: hovered ? "#00ffff" : "#ffffff",
            textShadow: hovered ? "0 0 16px rgba(0,255,255,0.6)" : "none",
          }}
        >
          {project.title}
        </h3>

        <p
          className="text-sm leading-relaxed mb-6"
          style={{ color: "rgba(160,160,180,1)" }}
        >
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-7">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-full text-xs font-mono tracking-wide"
              style={{
                background: "rgba(0,255,255,0.07)",
                border: "1px solid rgba(0,255,255,0.22)",
                color: "rgba(0,255,255,0.9)",
                textShadow: "0 0 8px rgba(0,255,255,0.45)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="mt-auto flex items-center gap-5">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} GitHub repository`}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
              data-ocid={`project-github-${project.id}`}
            >
              <Github size={14} />
              Source
            </a>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} live`}
              className="ml-auto flex items-center gap-1.5 text-xs font-semibold group/link relative"
              style={{ color: "#00ffff" }}
              data-ocid={`project-view-${project.id}`}
            >
              View Project
              <motion.span
                animate={hovered ? { x: 4 } : { x: 0 }}
                transition={{ duration: 0.2 }}
                className="inline-flex"
              >
                <ArrowRight size={13} />
              </motion.span>
            </a>
          )}

          {!project.liveUrl && project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1.5 text-xs font-semibold"
              style={{ color: "#00ffff" }}
              data-ocid={`project-view-alt-${project.id}`}
            >
              <ExternalLink size={13} />
              View Project
            </a>
          )}
        </div>
      </div>

      {/* Bottom glow line on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, #ff0000 30%, #00ffff 70%, transparent 100%)",
              transformOrigin: "center",
              boxShadow: "0 0 8px rgba(0,255,255,0.5)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Corner accent on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 left-0 w-16 h-16 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 0 0, rgba(0,255,255,0.14) 0%, transparent 70%)",
            }}
          />
        )}
      </AnimatePresence>
    </motion.article>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative py-28 overflow-hidden"
      style={{ background: "rgba(6, 8, 14, 1)" }}
      data-ocid="projects-section"
    >
      {/* Radial cyan glow at top */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(0,255,255,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Ambient red glow at bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 110%, rgba(255,0,0,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <p
            className="font-mono text-xs tracking-[0.35em] uppercase mb-3"
            style={{ color: "#ff4444" }}
          >
            03 / Projects
          </p>

          <h2
            className="font-display font-bold text-4xl md:text-5xl tracking-tight mb-4"
            style={{ textShadow: "0 0 30px rgba(255,0,0,0.2)" }}
          >
            My{" "}
            <span
              style={{
                color: "#ff0000",
                textShadow:
                  "0 0 24px rgba(255,0,0,0.8), 0 0 48px rgba(255,0,0,0.4)",
              }}
            >
              Projects
            </span>
          </h2>

          {/* Neon red accent underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-20 h-0.5 mb-6 origin-left"
            style={{
              background:
                "linear-gradient(90deg, #ff0000 0%, rgba(255,0,0,0.2) 100%)",
              boxShadow: "0 0 10px rgba(255,0,0,0.6)",
            }}
          />

          <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
            A selection of real-world projects — from developer tools to
            production ML systems.
          </p>
        </motion.div>

        {/* Web strands + grid */}
        <div className="relative">
          <div
            className="absolute inset-x-0 pointer-events-none"
            style={{ top: "-40px", height: "calc(100% + 40px)", zIndex: 0 }}
          >
            <WebStrands count={PROJECTS.length} />
          </div>

          <div className="relative z-10 grid md:grid-cols-2 gap-6">
            {PROJECTS.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 text-center"
        >
          <motion.a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{
              scale: 1.06,
              boxShadow: "0 0 24px rgba(0,255,255,0.3)",
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-mono text-sm font-medium"
            style={{
              border: "1px solid rgba(0,255,255,0.3)",
              color: "rgba(0,255,255,0.9)",
              background: "rgba(0,255,255,0.05)",
              transition: "box-shadow 0.3s ease",
            }}
            data-ocid="projects-view-all"
          >
            <Github size={15} />
            View all on GitHub
            <ArrowRight size={14} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
