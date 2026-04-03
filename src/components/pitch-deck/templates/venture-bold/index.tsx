"use client";

import { TemplateComponent } from "../types";
import { createThemeSlideComponent } from "../create-theme";

const ventureBold: TemplateComponent = {
  metadata: {
    id: "venture-bold",
    name: "Venture Bold",
    description: "High-contrast black and red theme for bold, confident pitches",
    category: "startup",
    colors: {
      primary: "#dc2626",
      secondary: "#991b1b",
      background: "#000000",
      surface: "#0a0a0a",
      text: "#ffffff",
      textSecondary: "#a1a1aa",
      accent: "#dc2626",
    },
  },
  SlideComponent: createThemeSlideComponent({
    bg: "linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #1a0000 100%)",
    bgContent: "linear-gradient(180deg, #000000 0%, #0a0a0a 100%)",
    accent: "#dc2626",
    accentSecondary: "#991b1b",
    heading: "#ffffff",
    body: "#d4d4d8",
    bodySecondary: "#a1a1aa",
    metricValue: "#dc2626",
    cardBg: "rgba(255,255,255,0.04)",
    cardBorder: "rgba(220,38,38,0.2)",
    focusRing: "#dc2626",
  }),
};

export default ventureBold;
