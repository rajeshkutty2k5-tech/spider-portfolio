import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "../data/portfolio";
import { useScrollProgress } from "../hooks/useScrollProgress";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const { scrollY } = useScrollProgress();
  const scrolled = scrollY > 60;

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => l.href.replace("#", ""));
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -50% 0px" },
      );
      obs.observe(el);
      return obs;
    });
    return () => {
      for (const o of observers) o?.disconnect();
    };
  }, []);

  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${
        scrolled
          ? "bg-card/90 backdrop-blur-md border-b border-primary/20 shadow-elevated"
          : "bg-transparent"
      }`}
      data-ocid="navbar"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => scrollTo("#hero")}
          className="font-display font-bold text-xl tracking-tight glow-text-cyan cursor-pointer"
          style={{ color: "#00ffff" }}
          data-ocid="nav-logo"
        >
          <span style={{ color: "#ff0000" }}>⬡</span> SPIDER.DEV
        </button>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const id = link.href.replace("#", "");
            const isActive = activeSection === id;
            return (
              <li key={link.href}>
                <button
                  type="button"
                  onClick={() => scrollTo(link.href)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-md transition-smooth cursor-pointer ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-ocid={`nav-link-${id}`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-md"
                      style={{
                        background: "rgba(0, 255, 255, 0.08)",
                        border: "1px solid rgba(0, 255, 255, 0.25)",
                        boxShadow: "0 0 12px rgba(0, 255, 255, 0.15)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* CTA */}
        <button
          type="button"
          onClick={() => scrollTo("#contact")}
          className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md neon-border-red transition-smooth hover:glow-red"
          style={{ color: "#ff6666" }}
          data-ocid="nav-cta"
        >
          Hire Me
        </button>

        {/* Hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground transition-smooth"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          data-ocid="nav-hamburger"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden bg-card/95 backdrop-blur-md border-b border-primary/20 overflow-hidden"
            data-ocid="mobile-menu"
          >
            <ul className="px-6 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const id = link.href.replace("#", "");
                return (
                  <li key={link.href}>
                    <button
                      type="button"
                      onClick={() => scrollTo(link.href)}
                      className="w-full text-left px-4 py-3 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
                      data-ocid={`mobile-nav-${id}`}
                    >
                      {link.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
