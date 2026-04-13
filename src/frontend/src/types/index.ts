export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
  featured?: boolean;
  year: number;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 0-100
  category: "frontend" | "backend" | "tools" | "design";
  icon?: string;
  color: "cyan" | "red" | "white";
}

export interface NavLink {
  label: string;
  href: string;
}

export interface MousePosition {
  x: number; // normalized -1 to 1
  y: number; // normalized -1 to 1
  rawX: number; // px
  rawY: number; // px
}
