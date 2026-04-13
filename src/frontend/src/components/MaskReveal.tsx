import { AnimatePresence, motion } from "motion/react";

interface MaskRevealProps {
  onComplete: () => void;
}

export function MaskReveal({ onComplete }: MaskRevealProps) {
  return (
    <AnimatePresence>
      {/* Dark mask — shrinks away from center, revealing content beneath */}
      <motion.div
        key="mask-overlay"
        initial={{ clipPath: "circle(150% at 50% 50%)" }}
        animate={{ clipPath: "circle(0% at 50% 50%)" }}
        transition={{
          duration: 1.6,
          delay: 0.2,
          ease: [0.76, 0, 0.24, 1],
        }}
        onAnimationComplete={onComplete}
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "#0a0a0f",
          zIndex: 9999,
          willChange: "clip-path",
        }}
        aria-hidden="true"
      />

      {/* Neon cyan glow ring — follows the shrinking mask edge */}
      <motion.div
        key="mask-glow"
        initial={{ clipPath: "circle(150% at 50% 50%)", opacity: 1 }}
        animate={{ clipPath: "circle(0% at 50% 50%)", opacity: 0 }}
        transition={{
          clipPath: {
            duration: 1.6,
            delay: 0.2,
            ease: [0.76, 0, 0.24, 1],
          },
          opacity: {
            duration: 0.4,
            delay: 1.6,
            ease: "easeOut",
          },
        }}
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 0%, transparent 60%, rgba(0,255,255,0.18) 70%, rgba(0,255,255,0.08) 80%, transparent 90%)",
          zIndex: 10000,
          willChange: "clip-path, opacity",
        }}
        aria-hidden="true"
      />
    </AnimatePresence>
  );
}
