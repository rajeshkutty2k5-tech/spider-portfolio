import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { MousePosition } from "../types";

const defaultPosition: MousePosition = { x: 0, y: 0, rawX: 0, rawY: 0 };

export const MousePositionContext =
  createContext<MousePosition>(defaultPosition);

export function useMousePosition(): MousePosition {
  return useContext(MousePositionContext);
}

export function useMousePositionState(): MousePosition {
  const [position, setPosition] = useState<MousePosition>(defaultPosition);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -((e.clientY / window.innerHeight) * 2 - 1);
    setPosition({ x, y, rawX: e.clientX, rawY: e.clientY });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return position;
}
