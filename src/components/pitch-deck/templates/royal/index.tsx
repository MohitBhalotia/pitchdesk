"use client";

import { TemplateComponent } from "../types";
import { createThemeSlideComponent } from "../create-theme";

const royal: TemplateComponent = {
  metadata: {
    id: "royal",
    name: "Royal",
    description: "Deep purple and gold theme for premium, high-stakes investor meetings",
    category: "creative",
    colors: {
      primary: "#eab308",
      secondary: "#a855f7",
      background: "#4c1d95",
      surface: "#5b21b6",
      text: "#faf5ff",
      textSecondary: "#c4b5fd",
      accent: "#eab308",
    },
  },
  SlideComponent: createThemeSlideComponent({
    bg: "linear-gradient(135deg, #4c1d95 0%, #5b21b6 50%, #4c1d95 100%)",
    bgContent: "linear-gradient(180deg, #4c1d95 0%, #5b21b6 100%)",
    accent: "#eab308",
    accentSecondary: "#a855f7",
    heading: "#faf5ff",
    body: "#e9d5ff",
    bodySecondary: "#c4b5fd",
    metricValue: "#eab308",
    cardBg: "rgba(255,255,255,0.06)",
    cardBorder: "rgba(234,179,8,0.2)",
    focusRing: "#eab308",
  }),
};

export default royal;
