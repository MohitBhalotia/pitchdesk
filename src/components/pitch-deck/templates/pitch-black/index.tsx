"use client";

import { TemplateComponent } from "../types";
import { createThemeSlideComponent } from "../create-theme";

const pitchBlack: TemplateComponent = {
  metadata: {
    id: "pitch-black",
    name: "Pitch Black",
    description: "Ultra-minimal black theme with cyan accents, for maximum impact",
    category: "creative",
    colors: {
      primary: "#06b6d4",
      secondary: "#0891b2",
      background: "#0a0a0a",
      surface: "#111111",
      text: "#fafafa",
      textSecondary: "#71717a",
      accent: "#06b6d4",
    },
  },
  SlideComponent: createThemeSlideComponent({
    bg: "#0a0a0a",
    bgContent: "#0a0a0a",
    accent: "#06b6d4",
    accentSecondary: "#0891b2",
    heading: "#fafafa",
    body: "#d4d4d8",
    bodySecondary: "#71717a",
    metricValue: "#06b6d4",
    cardBg: "rgba(255,255,255,0.03)",
    cardBorder: "rgba(6,182,212,0.15)",
    focusRing: "#06b6d4",
  }),
};

export default pitchBlack;
