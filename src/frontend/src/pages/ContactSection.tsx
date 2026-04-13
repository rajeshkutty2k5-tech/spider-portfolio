import { useScrollIntoView } from "@/hooks/useScrollProgress";
import {
  ArrowRight,
  CheckCircle,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ── Canvas web-strand background ────────────────────────────────────────────

interface Strand {
  angle: number;
  length: number;
  segments: number;
}

interface Particle {
  strandIndex: number;
  progress: number;
  speed: number;
  size: number;
  opacity: number;
}

function WebCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const STRAND_COUNT = 18;
    const PARTICLE_COUNT = 40;

    const strands: Strand[] = Array.from({ length: STRAND_COUNT }, (_, i) => ({
      angle: (i / STRAND_COUNT) * Math.PI * 2,
      length: 0,
      segments: 8,
    }));

    const particles: Particle[] = Array.from(
      { length: PARTICLE_COUNT },
      () => ({
        strandIndex: Math.floor(Math.random() * STRAND_COUNT),
        progress: Math.random(),
        speed: 0.001 + Math.random() * 0.002,
        size: 1.5 + Math.random() * 2,
        opacity: 0.4 + Math.random() * 0.6,
      }),
    );

    let w = 0;
    let h = 0;
    let cx = 0;
    let cy = 0;

    function resize() {
      if (!canvas) return;
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
      cx = w / 2;
      cy = h / 2;
      const maxLen = Math.sqrt(cx * cx + cy * cy) * 1.1;
      for (const s of strands) s.length = maxLen;
    }

    function getPointOnStrand(strand: Strand, t: number) {
      const baseX = cx + Math.cos(strand.angle) * strand.length * t;
      const baseY = cy + Math.sin(strand.angle) * strand.length * t;
      const wave = Math.sin(t * Math.PI * 3 + strand.angle) * 8 * t;
      const perpX = -Math.sin(strand.angle) * wave;
      const perpY = Math.cos(strand.angle) * wave;
      return { x: baseX + perpX, y: baseY + perpY };
    }

    function drawStrand(strand: Strand) {
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      const steps = strand.segments * 4;
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const pt = getPointOnStrand(strand, t);
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.strokeStyle = "rgba(0,255,255,0.07)";
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    function drawCrossStrands() {
      if (!ctx) return;
      const rings = 6;
      for (let r = 1; r <= rings; r++) {
        const t = r / rings;
        ctx.beginPath();
        for (let i = 0; i < STRAND_COUNT; i++) {
          const pt = getPointOnStrand(strands[i], t);
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(0,255,255,${0.03 + r * 0.005})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }

    function drawParticle(p: Particle) {
      if (!ctx) return;
      const strand = strands[p.strandIndex];
      const pt = getPointOnStrand(strand, p.progress);
      const gradient = ctx.createRadialGradient(
        pt.x,
        pt.y,
        0,
        pt.x,
        pt.y,
        p.size * 2,
      );
      gradient.addColorStop(0, `rgba(0,255,255,${p.opacity})`);
      gradient.addColorStop(1, "rgba(0,255,255,0)");
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, p.size * 2, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, w, h);
      drawCrossStrands();
      for (const s of strands) drawStrand(s);
      for (const p of particles) {
        p.progress += p.speed;
        if (p.progress > 1) {
          p.progress = 0;
          p.strandIndex = Math.floor(Math.random() * STRAND_COUNT);
        }
        drawParticle(p);
      }
      rafRef.current = requestAnimationFrame(animate);
    }

    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);
    resize();
    animate();

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      tabIndex={-1}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}

// ── Social links ─────────────────────────────────────────────────────────────

const SOCIAL_LINKS = [
  { icon: Github, label: "GitHub", href: "https://github.com" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
];

// ── Form state ────────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  email: string;
  message: string;
}

// ── Success Overlay ───────────────────────────────────────────────────────────

function SuccessOverlay() {
  return (
    <motion.div
      key="success-overlay"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center z-20"
      style={{
        background: "rgba(0,10,10,0.92)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(0,255,136,0.25)",
        boxShadow:
          "0 0 40px rgba(0,255,136,0.12), inset 0 0 30px rgba(0,255,136,0.04)",
      }}
      data-ocid="contact-success-overlay"
    >
      {/* Animated checkmark */}
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          duration: 0.55,
          delay: 0.1,
          type: "spring",
          stiffness: 200,
        }}
        className="mb-6"
        style={{
          filter:
            "drop-shadow(0 0 16px rgba(0,255,136,0.7)) drop-shadow(0 0 32px rgba(0,255,136,0.4))",
        }}
      >
        <CheckCircle size={64} strokeWidth={1.5} style={{ color: "#00ff88" }} />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="font-display font-bold text-3xl mb-3"
        style={{
          color: "#00ff88",
          textShadow:
            "0 0 14px rgba(0,255,136,0.7), 0 0 28px rgba(0,255,136,0.4)",
        }}
      >
        Message Sent!
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.45 }}
        className="text-sm"
        style={{ color: "rgba(0,255,136,0.7)" }}
      >
        Thanks! I'll get back to you soon.
      </motion.p>

      {/* Pulsing ring */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        animate={{ scale: [1, 1.6], opacity: [0.3, 0] }}
        transition={{
          duration: 1.6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeOut",
        }}
        style={{
          width: 90,
          height: 90,
          border: "1px solid rgba(0,255,136,0.5)",
        }}
      />
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

// Formspree endpoint — uses legacy email URL format.
// Replace with your Formspree form ID: https://formspree.io/f/<YOUR_FORM_ID>
const FORMSPREE_ENDPOINT = "https://formspree.io/rajeshkutty2k5@gmail.com";

export function ContactSection() {
  const { ref: sectionRef, isVisible } = useScrollIntoView(0.1);

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError("Submission failed, please try again.");
      }
    } catch {
      setError("Submission failed, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full px-4 py-3 rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none transition-smooth";

  function inputStyle(field: string, hasError = false): React.CSSProperties {
    const focused = focusedField === field;
    if (hasError) {
      return {
        background: "rgba(255,0,0,0.04)",
        border: "1px solid rgba(255,0,0,0.6)",
        boxShadow: "0 0 10px rgba(255,0,0,0.35), 0 0 20px rgba(255,0,0,0.15)",
      };
    }
    return {
      background: "rgba(0,255,255,0.03)",
      border: focused
        ? "1px solid rgba(0,255,255,0.6)"
        : "1px solid rgba(0,255,255,0.15)",
      boxShadow: focused
        ? "0 0 10px rgba(0,255,255,0.5), 0 0 20px rgba(0,255,255,0.25)"
        : "none",
    };
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{ background: "oklch(0.065 0 0)" }}
      data-ocid="contact-section"
    >
      {/* Animated web canvas */}
      <WebCanvas />

      {/* Radial glow center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,255,255,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        {/* ── Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <p
            className="font-mono text-xs tracking-[0.3em] uppercase mb-4"
            style={{ color: "rgba(0,255,255,0.6)" }}
          >
            05 / Contact
          </p>
          <h2
            className="font-display font-bold text-5xl md:text-6xl tracking-tight mb-4 glow-text-cyan"
            style={{ color: "#00ffff" }}
          >
            Get In Touch
          </h2>
          <div
            className="w-24 h-0.5 mx-auto mb-6"
            style={{
              background:
                "linear-gradient(90deg, transparent, #00ffff, transparent)",
            }}
          />
          <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
            Have a project in mind or want to swing by for a chat? Drop me a
            message and I'll get back to you.
          </p>
        </motion.div>

        {/* ── Contact Form ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Relative wrapper so success overlay can be absolutely positioned */}
          <div className="relative">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl p-8 md:p-10"
              style={{
                background: "rgba(0,255,255,0.02)",
                border: "1px solid rgba(0,255,255,0.1)",
                backdropFilter: "blur(12px)",
              }}
              data-ocid="contact-form"
              noValidate
            >
              {/* Name */}
              <div className="mb-5">
                <label
                  htmlFor="name"
                  className="block text-xs font-medium mb-2"
                  style={{ color: "rgba(0,255,255,0.7)" }}
                >
                  Name <span style={{ color: "#ff4444" }}>*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Peter Parker"
                  value={form.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  required
                  disabled={loading}
                  className={inputBase}
                  style={inputStyle("name")}
                  data-ocid="contact-input-name"
                />
              </div>

              {/* Email */}
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="block text-xs font-medium mb-2"
                  style={{ color: "rgba(0,255,255,0.7)" }}
                >
                  Email <span style={{ color: "#ff4444" }}>*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="peter@daily-bugle.com"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  required
                  disabled={loading}
                  className={inputBase}
                  style={inputStyle("email")}
                  data-ocid="contact-input-email"
                />
              </div>

              {/* Message */}
              <div className="mb-8">
                <label
                  htmlFor="message"
                  className="block text-xs font-medium mb-2"
                  style={{ color: "rgba(0,255,255,0.7)" }}
                >
                  Message <span style={{ color: "#ff4444" }}>*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell me about your project, your ideas, or just say hello..."
                  value={form.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField(null)}
                  required
                  disabled={loading}
                  className={`${inputBase} resize-none`}
                  style={inputStyle("message")}
                  data-ocid="contact-input-message"
                />
              </div>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="mb-5 flex items-center justify-between px-4 py-3 rounded-lg text-sm"
                    style={{
                      background: "rgba(255,0,0,0.07)",
                      border: "1px solid rgba(255,0,0,0.4)",
                      boxShadow: "0 0 12px rgba(255,0,0,0.15)",
                      color: "#ff6666",
                    }}
                    data-ocid="contact-error"
                  >
                    <span>{error}</span>
                    <button
                      type="button"
                      onClick={() => setError(null)}
                      className="ml-3 underline text-xs opacity-70 hover:opacity-100 transition-smooth"
                      aria-label="Dismiss error"
                    >
                      Retry
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-sm transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: loading
                    ? "rgba(255,0,0,0.1)"
                    : "rgba(255,0,0,0.18)",
                  border: "1px solid rgba(255,0,0,0.5)",
                  color: "#ff6666",
                  boxShadow: loading
                    ? "none"
                    : "0 0 24px rgba(255,0,0,0.2), 0 0 8px rgba(255,0,0,0.1)",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(255,0,0,0.28)";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#ff9999";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 0 32px rgba(255,0,0,0.4), 0 0 16px rgba(255,0,0,0.2)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(255,0,0,0.18)";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#ff6666";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 0 24px rgba(255,0,0,0.2), 0 0 8px rgba(255,0,0,0.1)";
                  }
                }}
                data-ocid="contact-submit"
              >
                {loading ? (
                  <>
                    <span
                      className="w-4 h-4 border-2 rounded-full animate-spin"
                      style={{
                        borderColor: "rgba(255,102,102,0.3)",
                        borderTopColor: "#ff6666",
                      }}
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <ArrowRight size={16} />
                  </>
                )}
              </motion.button>
            </form>

            {/* Full-form success overlay */}
            <AnimatePresence>{success && <SuccessOverlay />}</AnimatePresence>
          </div>
        </motion.div>

        {/* ── Social links ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex items-center justify-center gap-5"
          data-ocid="social-links"
        >
          {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.92 }}
              className="flex items-center justify-center w-12 h-12 rounded-xl transition-smooth"
              style={{
                background: "rgba(0,255,255,0.06)",
                border: "1px solid rgba(0,255,255,0.15)",
                color: "#00ffff",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "rgba(0,255,255,0.14)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 0 20px rgba(0,255,255,0.35), 0 0 40px rgba(0,255,255,0.15)";
                (e.currentTarget as HTMLAnchorElement).style.border =
                  "1px solid rgba(0,255,255,0.5)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "rgba(0,255,255,0.06)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                (e.currentTarget as HTMLAnchorElement).style.border =
                  "1px solid rgba(0,255,255,0.15)";
              }}
              data-ocid={`social-${label.toLowerCase()}`}
            >
              <Icon size={20} />
            </motion.a>
          ))}
        </motion.div>

        {/* ── Footer ── */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-16 text-center"
          data-ocid="contact-footer"
        >
          <div
            className="w-32 h-px mx-auto mb-6"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(0,255,255,0.2), transparent)",
            }}
          />
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            Spider.dev © {new Date().getFullYear()}
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: "rgba(255,255,255,0.15)" }}
          >
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-smooth hover:opacity-80"
              style={{ color: "rgba(0,255,255,0.4)" }}
            >
              caffeine.ai
            </a>
          </p>
        </motion.footer>
      </div>
    </section>
  );
}
