import type { NavLink, Project, Skill } from "../types";

export const NAV_LINKS: NavLink[] = [
  { label: "Hero", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export const PROJECTS: Project[] = [
  {
    id: "web-shooter",
    title: "WebShooter API",
    description:
      "Real-time collaborative API platform with live schema diffing, WebSocket streaming, and automatic OpenAPI generation. Powers 50k+ monthly requests across 200+ developer teams.",
    tags: ["TypeScript", "Node.js", "WebSocket", "OpenAPI"],
    githubUrl: "https://github.com",
    liveUrl: "https://webshooter.dev",
    featured: true,
    year: 2024,
  },
  {
    id: "spidey-sense",
    title: "SpideySense ML",
    description:
      "Anomaly detection engine using transformer-based models to identify security threats in real-time network traffic. Reduced false positives by 78% vs previous rule-based system.",
    tags: ["Python", "PyTorch", "FastAPI", "Redis"],
    githubUrl: "https://github.com",
    liveUrl: "https://spideysense.ai",
    featured: true,
    year: 2024,
  },
  {
    id: "night-crawler",
    title: "NightCrawler CLI",
    description:
      "Zero-config performance profiler for Node.js microservices. Auto-instruments spans, produces flame graphs, and exports to Jaeger or Datadog with a single command.",
    tags: ["Rust", "Node.js", "eBPF", "CLI"],
    githubUrl: "https://github.com",
    year: 2023,
  },
  {
    id: "silk-thread",
    title: "SilkThread Design System",
    description:
      "Accessible, theme-able component library built with Radix UI primitives. Ships with 60+ components, dark mode support, and automatic WCAG 2.1 AA compliance testing.",
    tags: ["React", "Storybook", "Radix UI", "Tailwind"],
    githubUrl: "https://github.com",
    liveUrl: "https://silkthread.design",
    year: 2023,
  },
];

export const SKILLS: Skill[] = [
  {
    id: "typescript",
    name: "TypeScript",
    level: 96,
    category: "frontend",
    color: "cyan",
  },
  {
    id: "react",
    name: "React / Next.js",
    level: 94,
    category: "frontend",
    color: "cyan",
  },
  {
    id: "nodejs",
    name: "Node.js",
    level: 90,
    category: "backend",
    color: "red",
  },
  {
    id: "python",
    name: "Python",
    level: 85,
    category: "backend",
    color: "red",
  },
  { id: "rust", name: "Rust", level: 72, category: "backend", color: "red" },
  {
    id: "threejs",
    name: "Three.js / WebGL",
    level: 80,
    category: "frontend",
    color: "cyan",
  },
  {
    id: "docker",
    name: "Docker / K8s",
    level: 88,
    category: "tools",
    color: "white",
  },
  {
    id: "figma",
    name: "Figma / Design",
    level: 78,
    category: "design",
    color: "white",
  },
];
