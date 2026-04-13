import type { ReactNode } from "react";
import {
  MousePositionContext,
  useMousePositionState,
} from "../hooks/useMousePosition";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

function BrandingFooter() {
  const year = new Date().getFullYear();
  const utm = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "",
  );

  return (
    <footer className="relative bg-card border-t border-border/60 web-pattern">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div
            className="font-display font-bold text-lg glow-text-cyan"
            style={{ color: "#00ffff" }}
          >
            <span style={{ color: "#ff0000" }}>⬡</span> SPIDER.DEV
          </div>
          <p className="text-sm text-muted-foreground text-center">
            © {year}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${utm}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-smooth underline underline-offset-2"
            >
              Built with love using caffeine.ai
            </a>
          </p>
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <span
              className="w-2 h-2 rounded-full bg-primary animate-pulse-glow"
              style={{ boxShadow: "0 0 8px rgba(0, 255, 255, 0.6)" }}
            />
            Available for freelance
          </div>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: LayoutProps) {
  const mousePosition = useMousePositionState();

  return (
    <MousePositionContext.Provider value={mousePosition}>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <BrandingFooter />
      </div>
    </MousePositionContext.Provider>
  );
}
