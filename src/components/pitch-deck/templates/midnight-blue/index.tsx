"use client";

import { TemplateComponent } from "../types";
import { createThemeSlideComponent } from "../create-theme";

const midnightBlue: TemplateComponent = {
  metadata: {
    id: "midnight-blue",
    name: "Midnight Blue",
    description: "Elegant navy and gold theme, ideal for VC boardroom presentations",
    category: "professional",
    colors: {
      primary: "#d4a843",
      secondary: "#1e3a5f",
      background: "#0a1628",
      surface: "#112240",
      text: "#e2e8f0",
      textSecondary: "#94a3b8",
      accent: "#d4a843",
    },
  },
  SlideComponent: createThemeSlideComponent({
    bg: "linear-gradient(135deg, #0a1628 0%, #112240 50%, #0d2137 100%)",
    bgContent: "linear-gradient(180deg, #0a1628 0%, #112240 100%)",
    accent: "#d4a843",
    accentSecondary: "#b8942e",
    heading: "#e2e8f0",
    body: "#cbd5e1",
    bodySecondary: "#94a3b8",
    metricValue: "#d4a843",
    cardBg: "rgba(255,255,255,0.05)",
    cardBorder: "rgba(212,168,67,0.2)",
    focusRing: "#d4a843",
  }),
};

export default midnightBlue;
