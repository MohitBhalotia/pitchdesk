"use client";

import { TemplateComponent } from "../types";
import { createThemeSlideComponent } from "../create-theme";

const siliconValley: TemplateComponent = {
  metadata: {
    id: "silicon-valley",
    name: "Silicon Valley",
    description: "Clean white and blue theme, the classic tech startup look",
    category: "professional",
    colors: {
      primary: "#2563eb",
      secondary: "#1d4ed8",
      background: "#ffffff",
      surface: "#f8fafc",
      text: "#0f172a",
      textSecondary: "#64748b",
      accent: "#2563eb",
    },
  },
  SlideComponent: createThemeSlideComponent(
    {
      bg: "#ffffff",
      bgContent: "#ffffff",
      accent: "#2563eb",
      accentSecondary: "#1d4ed8",
      heading: "#0f172a",
      body: "#334155",
      bodySecondary: "#64748b",
      metricValue: "#2563eb",
      cardBg: "#f8fafc",
      cardBorder: "#e2e8f0",
      focusRing: "#2563eb",
    },
    "left-accent"
  ),
};

export default siliconValley;
