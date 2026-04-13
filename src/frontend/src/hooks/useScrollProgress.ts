import { useCallback, useEffect, useState } from "react";

export interface ScrollProgress {
  progress: number; // 0-1 normalized total scroll
  scrollY: number; // raw pixel value
  direction: "up" | "down";
}

export function useScrollProgress(): ScrollProgress {
  const [state, setState] = useState<ScrollProgress>({
    progress: 0,
    scrollY: 0,
    direction: "down",
  });

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const totalScrollable =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress =
      totalScrollable > 0 ? Math.min(scrollY / totalScrollable, 1) : 0;

    setState((prev) => ({
      progress,
      scrollY,
      direction: scrollY > prev.scrollY ? "down" : "up",
    }));
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return state;
}

export function useScrollIntoView(threshold = 0.15) {
  const [isVisible, setIsVisible] = useState(false);

  const ref = useCallback(
    (node: HTMLElement | null) => {
      if (!node) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold },
      );
      observer.observe(node);
    },
    [threshold],
  );

  return { ref, isVisible };
}
