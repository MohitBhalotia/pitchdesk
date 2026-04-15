"use client";

import { createThemeSlideComponent } from "./create-theme";
import type { TemplateComponent } from "./types";

function makeTemplate(
  id: string,
  name: string,
  description: string,
  category: "professional" | "startup" | "creative" | "industry",
  colors: TemplateComponent["metadata"]["colors"],
  bg: string,
  bgContent: string,
  accent: string,
  accentSecondary: string,
  heading: string,
  body: string,
  bodySecondary: string,
  layout: "centered" | "left-accent" | "card-heavy" = "centered"
): TemplateComponent {
  return {
    metadata: { id, name, description, category, colors },
    SlideComponent: createThemeSlideComponent(
      {
        bg,
        bgContent,
        accent,
        accentSecondary,
        heading,
        body,
        bodySecondary,
        metricValue: accent,
        cardBg: `${accent}10`,
        cardBorder: `${accent}25`,
        focusRing: accent,
      },
      layout
    ),
  };
}

// ─── Dark Premium ──────────────────────────────────────────────────────────

export const obsidian: TemplateComponent = makeTemplate(
  "obsidian", "Obsidian", "Deep black with gold accents — ultra premium", "professional",
  { primary: "#d4af37", secondary: "#b8860b", background: "#0a0a0a", surface: "#111111", text: "#f5f5f0", textSecondary: "#9a9a8a", accent: "#d4af37" },
  "#0a0a0a", "#0f0f0f", "#d4af37", "#b8860b", "#f5f5f0", "#d4d4c8", "#9a9a8a", "left-accent"
);

export const carbon: TemplateComponent = makeTemplate(
  "carbon", "Carbon", "Textured dark carbon — strong and industrial", "professional",
  { primary: "#ef4444", secondary: "#b91c1c", background: "#0d0d0d", surface: "#1a1a1a", text: "#f8fafc", textSecondary: "#94a3b8", accent: "#ef4444" },
  "#0d0d0d", "#161616", "#ef4444", "#b91c1c", "#f8fafc", "#e2e8f0", "#94a3b8", "left-accent"
);

export const eclipse: TemplateComponent = makeTemplate(
  "eclipse", "Eclipse", "Dark indigo with cyan glow — futuristic", "startup",
  { primary: "#06b6d4", secondary: "#0e7490", background: "#0a0e1a", surface: "#0f1629", text: "#e2f8ff", textSecondary: "#7dd3fc", accent: "#06b6d4" },
  "#0a0e1a", "#0f1629", "#06b6d4", "#0e7490", "#e2f8ff", "#bae6fd", "#7dd3fc"
);

export const noir: TemplateComponent = makeTemplate(
  "noir", "Noir", "Pure black and white — editorial and minimal", "creative",
  { primary: "#ffffff", secondary: "#e5e5e5", background: "#000000", surface: "#111111", text: "#ffffff", textSecondary: "#a3a3a3", accent: "#ffffff" },
  "#000000", "#0a0a0a", "#ffffff", "#cccccc", "#ffffff", "#d4d4d4", "#a3a3a3", "left-accent"
);

// ─── Light / Clean ─────────────────────────────────────────────────────────

export const ivory: TemplateComponent = makeTemplate(
  "ivory", "Ivory", "Warm cream tones — timeless and elegant", "professional",
  { primary: "#92400e", secondary: "#78350f", background: "#fdf8f0", surface: "#faf3e8", text: "#1c1003", textSecondary: "#78350f", accent: "#92400e" },
  "#fdf8f0", "#faf3e8", "#92400e", "#b45309", "#1c1003", "#44230a", "#78350f"
);

export const paper: TemplateComponent = makeTemplate(
  "paper", "Paper", "Light paper texture — clean and readable", "professional",
  { primary: "#1d4ed8", secondary: "#1e40af", background: "#fefefe", surface: "#f8f9fa", text: "#0f172a", textSecondary: "#475569", accent: "#1d4ed8" },
  "#fefefe", "#f8f9fa", "#1d4ed8", "#3b82f6", "#0f172a", "#1e293b", "#475569"
);

export const snow: TemplateComponent = makeTemplate(
  "snow", "Snow", "Pure white with cool blue — crisp and modern", "professional",
  { primary: "#0284c7", secondary: "#0369a1", background: "#ffffff", surface: "#f0f9ff", text: "#0c4a6e", textSecondary: "#0369a1", accent: "#0284c7" },
  "#ffffff", "#f0f9ff", "#0284c7", "#38bdf8", "#0c4a6e", "#075985", "#0369a1"
);

export const cream: TemplateComponent = makeTemplate(
  "cream", "Cream", "Soft cream with emerald — organic and trustworthy", "industry",
  { primary: "#059669", secondary: "#047857", background: "#fdfdf5", surface: "#f0fdf4", text: "#064e3b", textSecondary: "#065f46", accent: "#059669" },
  "#fdfdf5", "#f0fdf4", "#059669", "#34d399", "#064e3b", "#065f46", "#047857"
);

// ─── Bold / Colorful ───────────────────────────────────────────────────────

export const electric: TemplateComponent = makeTemplate(
  "electric", "Electric", "Vibrant electric blue with neon accents", "startup",
  { primary: "#4f46e5", secondary: "#7c3aed", background: "#0f0a2e", surface: "#1a1040", text: "#e0e7ff", textSecondary: "#a5b4fc", accent: "#818cf8" },
  "#0f0a2e", "#1a1040", "#818cf8", "#7c3aed", "#e0e7ff", "#c7d2fe", "#a5b4fc"
);

export const candy: TemplateComponent = makeTemplate(
  "candy", "Candy", "Sweet pink and violet — bold and playful", "creative",
  { primary: "#ec4899", secondary: "#be185d", background: "#0d0018", surface: "#1a0029", text: "#fdf2f8", textSecondary: "#f9a8d4", accent: "#ec4899" },
  "#0d0018", "#1a0029", "#ec4899", "#a855f7", "#fdf2f8", "#fce7f3", "#f9a8d4"
);

export const sunsetOrange: TemplateComponent = makeTemplate(
  "sunset-orange", "Sunset", "Warm orange and deep navy — energetic", "startup",
  { primary: "#f97316", secondary: "#ea580c", background: "#0c1222", surface: "#131929", text: "#fff7ed", textSecondary: "#fed7aa", accent: "#f97316" },
  "#0c1222", "#131929", "#f97316", "#fbbf24", "#fff7ed", "#ffedd5", "#fed7aa"
);

export const aurora: TemplateComponent = makeTemplate(
  "aurora", "Aurora", "Northern lights — purple to teal gradient", "creative",
  { primary: "#34d399", secondary: "#10b981", background: "#0a0520", surface: "#110730", text: "#d1fae5", textSecondary: "#6ee7b7", accent: "#34d399" },
  "#0a0520", "#110730", "#34d399", "#a855f7", "#d1fae5", "#a7f3d0", "#6ee7b7"
);

// ─── Industry Specific ─────────────────────────────────────────────────────

export const financeNavy: TemplateComponent = makeTemplate(
  "finance-navy", "Finance", "Navy and gold — Wall Street gravitas", "industry",
  { primary: "#c9a84c", secondary: "#a07830", background: "#0a1628", surface: "#0e1e38", text: "#e8d5a3", textSecondary: "#c9b57c", accent: "#c9a84c" },
  "#0a1628", "#0e1e38", "#c9a84c", "#e5c97a", "#e8d5a3", "#d4bc86", "#c9b57c", "left-accent"
);

export const healthcareBlue: TemplateComponent = makeTemplate(
  "healthcare", "Healthcare", "Clinical blue and green — trust and care", "industry",
  { primary: "#0891b2", secondary: "#0e7490", background: "#f8fbff", surface: "#f0f9ff", text: "#0c4a6e", textSecondary: "#0369a1", accent: "#0891b2" },
  "#f8fbff", "#f0f9ff", "#0891b2", "#10b981", "#0c4a6e", "#075985", "#0369a1"
);

export const saasViolet: TemplateComponent = makeTemplate(
  "saas", "SaaS", "Deep violet with neon purple — B2B SaaS", "startup",
  { primary: "#8b5cf6", secondary: "#7c3aed", background: "#0d0d1f", surface: "#13132d", text: "#ede9fe", textSecondary: "#a78bfa", accent: "#8b5cf6" },
  "#0d0d1f", "#13132d", "#8b5cf6", "#a855f7", "#ede9fe", "#ddd6fe", "#a78bfa"
);

export const edtechOrange: TemplateComponent = makeTemplate(
  "edtech", "EdTech", "Energetic orange and yellow — learning and growth", "industry",
  { primary: "#f59e0b", secondary: "#d97706", background: "#fffbeb", surface: "#fef3c7", text: "#451a03", textSecondary: "#92400e", accent: "#f59e0b" },
  "#fffbeb", "#fef3c7", "#f59e0b", "#f97316", "#451a03", "#78350f", "#92400e"
);

// ─── Minimalist ────────────────────────────────────────────────────────────

export const outline: TemplateComponent = makeTemplate(
  "outline", "Outline", "White with thin borders — ultra minimal", "professional",
  { primary: "#0f172a", secondary: "#1e293b", background: "#ffffff", surface: "#fafafa", text: "#0f172a", textSecondary: "#64748b", accent: "#0f172a" },
  "#ffffff", "#fafafa", "#0f172a", "#334155", "#0f172a", "#1e293b", "#64748b"
);

export const swiss: TemplateComponent = makeTemplate(
  "swiss", "Swiss", "Red and white Swiss-inspired — bold grid system", "creative",
  { primary: "#dc2626", secondary: "#991b1b", background: "#ffffff", surface: "#fff5f5", text: "#0c0c0c", textSecondary: "#374151", accent: "#dc2626" },
  "#ffffff", "#fff5f5", "#dc2626", "#ef4444", "#0c0c0c", "#111827", "#374151", "left-accent"
);

export const grid: TemplateComponent = makeTemplate(
  "grid", "Grid", "Graph paper look — data-driven and analytical", "professional",
  { primary: "#2563eb", secondary: "#1d4ed8", background: "#f9fafb", surface: "#f3f4f6", text: "#111827", textSecondary: "#4b5563", accent: "#2563eb" },
  "#f9fafb", "#f3f4f6", "#2563eb", "#60a5fa", "#111827", "#1f2937", "#4b5563"
);

export const letterpress: TemplateComponent = makeTemplate(
  "letterpress", "Letterpress", "Ink-on-paper aesthetic — editorial and artisan", "creative",
  { primary: "#1a1a1a", secondary: "#333333", background: "#f5f0e8", surface: "#ede8df", text: "#1a1a1a", textSecondary: "#4a4a4a", accent: "#8b1a1a" },
  "#f5f0e8", "#ede8df", "#8b1a1a", "#333333", "#1a1a1a", "#2a2a2a", "#4a4a4a"
);
