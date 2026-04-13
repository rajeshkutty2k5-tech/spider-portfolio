# Design Brief

## Overview
Cinematic Spider-Man inspired portfolio with dark neon aesthetic, designed for high-energy visual impact and smooth 60fps animations.

## Tone & Differentiation
Futuristic tech-noir aesthetic blending street-art swagger with premium interactive design. Neon cyan (#00FFFF) and hot red (#FF0000) punctuate deep navy blacks. Web-strand patterns and animated parallax depth create immersive layered experience. Signature: glowing neon accents on interactive elements, smooth cubic-bezier motion, cinematic depth.

## Color Palette

| Role | OKLCH (Dark) | Purpose |
|------|------|---------|
| Background | `0.075 0 0` | Deep night black, minimal distraction |
| Foreground | `0.95 0 0` | High contrast text on dark |
| Card | `0.12 0 0` | Elevated surface, subtle depth |
| Primary | `0.68 0.28 262` | Neon cyan accent, CTAs, focus states |
| Accent | `0.68 0.28 262` | Interactive highlights, glow effects |
| Destructive | `0.72 0.25 22` | Hot red, secondary accents, warnings |
| Border | `0.22 0 0` | Subtle dividers in dark theme |
| Muted | `0.18 0 0` | Disabled states, secondary info |

## Typography
- **Display**: Bricolage Grotesque (geometric, sci-fi, bold headlines)
- **Body**: General Sans (clean, modern, 16px base)
- **Mono**: JetBrains Mono (code blocks, technical content)

## Structural Zones

| Zone | Background | Border | Shadow | Purpose |
|------|---|---|---|---|
| Hero | `bg-background` web-pattern | None | None | Cinematic immersive intro |
| Header | `bg-background` | `border-b border-border/20` | None | Minimal nav overlay |
| Section Card | `bg-card` | `border border-primary/20` | `shadow-elevated` | Content containers with glow on hover |
| Footer | `bg-background` | `border-t border-border/20` | None | Web-animation background |
| Interactive Elements | `bg-primary` | `border-primary` | `shadow-neon-cyan` or `shadow-neon-red` | Glowing CTAs with pulse |

## Motion & Animation

| Element | Animation | Timing | Purpose |
|---|---|---|---|
| Hero Text | Staggered fade-in-up | 0.6s cubic-bezier | Character reveal on load |
| Cards | fade-in-up on scroll | 0.6s with 100ms stagger | Section entrance |
| Buttons | pulse-glow loop | 3s ease-in-out | Neon breathing effect |
| Floating Cards | float | 6s ease-in-out infinite | Organic rise/fall motion |
| Parallax Layers | transform-based scroll | 60fps requestAnimationFrame | Depth parallax on scroll |
| Hover States | scale(1.02) + glow intensify | 0.3s cubic-bezier | Lift and highlight |

## Component Patterns
- **Buttons**: Neon glow shadow + hover scale, filled primary/outline secondary, no rounded excess
- **Cards**: `bg-card` border with `border-primary/20`, `shadow-elevated`, hover lift + `shadow-card-hover`
- **Links**: Cyan text with underline reveal on hover
- **Forms**: Dark inputs `bg-input/50` with cyan focus ring, neon placeholder text

## Spacing & Density
- Base unit: 4px, multiples of 8 (8, 16, 24, 32, 48, 64)
- Hero section: generous white space (80px+ vertical)
- Card sections: 32-48px margins, 24px padding internal
- Footer: compact 16px padding

## Signature Detail
**Web-strand glow pattern** in background texture (repeating 45deg lines at opacity 0.03 in cyan). Animated neon glow utility classes (`glow-cyan`, `glow-red`) applied to CTAs and hover states. Smooth box-shadow animations create "breathing" neon effect without blur artifacts.

## Constraints
- No harsh shadows or drop shadows; use glow effects instead
- No animated gradients; prefer solid color + glow
- Border-radius: 0 (sharp) for logo, 8px (small) for buttons, 16px (medium) for cards
- Always use token colors; never raw hex in components
- Cubic-bezier easing for all transitions, never linear

