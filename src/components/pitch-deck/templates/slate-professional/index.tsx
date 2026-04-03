"use client";

import { TemplateComponent } from "../types";
import { createThemeSlideComponent } from "../create-theme";

const slateProfessional: TemplateComponent = {
  metadata: {
    id: "slate-professional",
    name: "Slate Professional",
    description: "Charcoal and teal theme, polished enterprise-grade presentation style",
    category: "professional",
    colors: {
      primary: "#14b8a6",
      secondary: "#0d9488",
      background: "#1e293b",
      surface: "#334155",
      text: "#f1f5f9",
      textSecondary: "#94a3b8",
      accent: "#14b8a6",
    },
  },
  SlideComponent: createThemeSlideComponent({
    bg: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)",
    bgContent: "linear-gradient(180deg, #1e293b 0%, #334155 100%)",
    accent: "#14b8a6",
    accentSecondary: "#0d9488",
    heading: "#f1f5f9",
    body: "#cbd5e1",
    bodySecondary: "#94a3b8",
    metricValue: "#14b8a6",
    cardBg: "rgba(255,255,255,0.05)",
    cardBorder: "rgba(20,184,166,0.2)",
    focusRing: "#14b8a6",
  }),
};

export default slateProfessional;
