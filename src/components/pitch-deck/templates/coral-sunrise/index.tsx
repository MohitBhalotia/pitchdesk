"use client";

import { TemplateComponent } from "../types";
import { createThemeSlideComponent } from "../create-theme";

const coralSunrise: TemplateComponent = {
  metadata: {
    id: "coral-sunrise",
    name: "Coral Sunrise",
    description: "Warm coral and navy theme with energetic vibes for consumer startups",
    category: "startup",
    colors: {
      primary: "#f97316",
      secondary: "#ea580c",
      background: "#1e293b",
      surface: "#1e293b",
      text: "#f8fafc",
      textSecondary: "#94a3b8",
      accent: "#f97316",
    },
  },
  SlideComponent: createThemeSlideComponent({
    bg: "linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%)",
    bgContent: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
    accent: "#f97316",
    accentSecondary: "#ea580c",
    heading: "#f8fafc",
    body: "#cbd5e1",
    bodySecondary: "#94a3b8",
    metricValue: "#f97316",
    cardBg: "rgba(255,255,255,0.05)",
    cardBorder: "rgba(249,115,22,0.2)",
    focusRing: "#f97316",
  }),
};

export default coralSunrise;
