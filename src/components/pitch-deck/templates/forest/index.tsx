"use client";

import { TemplateComponent } from "../types";
import { createThemeSlideComponent } from "../create-theme";

const forest: TemplateComponent = {
  metadata: {
    id: "forest",
    name: "Forest",
    description: "Deep green and cream theme, perfect for sustainability and climate startups",
    category: "industry",
    colors: {
      primary: "#059669",
      secondary: "#047857",
      background: "#064e3b",
      surface: "#065f46",
      text: "#fef3c7",
      textSecondary: "#a7f3d0",
      accent: "#fbbf24",
    },
  },
  SlideComponent: createThemeSlideComponent({
    bg: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #064e3b 100%)",
    bgContent: "linear-gradient(180deg, #064e3b 0%, #065f46 100%)",
    accent: "#fbbf24",
    accentSecondary: "#059669",
    heading: "#fef3c7",
    body: "#d1fae5",
    bodySecondary: "#a7f3d0",
    metricValue: "#fbbf24",
    cardBg: "rgba(255,255,255,0.06)",
    cardBorder: "rgba(251,191,36,0.2)",
    focusRing: "#fbbf24",
  }),
};

export default forest;
