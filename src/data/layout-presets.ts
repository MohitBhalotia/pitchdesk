import { v4 as uuid } from "uuid";
import type { SlideElement, TextElement, ShapeElement, ImageElement } from "@/types/slide-elements";

export interface LayoutPreset {
  id: string;
  name: string;
  icon: string;
  description: string;
  createElements: () => SlideElement[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function text(overrides: Partial<TextElement> & { content: string }): TextElement {
  return { id: uuid(), type: "text", x: 0, y: 0, width: 100, height: 20, ...overrides };
}

function shape(overrides: Partial<ShapeElement> & { shape: ShapeElement["shape"] }): ShapeElement {
  return { id: uuid(), type: "shape", x: 0, y: 0, width: 10, height: 10, fill: "#3b82f6", ...overrides };
}

function image(overrides: Partial<ImageElement>): ImageElement {
  return { id: uuid(), type: "image", imageUrl: "", x: 0, y: 0, width: 40, height: 70, objectFit: "cover", ...overrides };
}

// ─── Presets ──────────────────────────────────────────────────────────────────

export const layoutPresets: LayoutPreset[] = [
  // ── Blank / Basic ──────────────────────────────────────────────────────────
  {
    id: "blank",
    name: "Blank",
    icon: "blank",
    description: "Empty canvas",
    createElements: () => [],
  },
  {
    id: "title-centered",
    name: "Title Centered",
    icon: "title-centered",
    description: "Large centered title + subtitle",
    createElements: () => [
      text({ content: "Slide Title", role: "heading", fontSize: 52, fontWeight: "bold", textAlign: "center", x: 5, y: 22, width: 90, height: 28 }),
      text({ content: "Your subtitle goes here", role: "subheading", fontSize: 24, textAlign: "center", x: 10, y: 55, width: 80, height: 15 }),
    ],
  },
  {
    id: "title-left",
    name: "Title + Content",
    icon: "title-left",
    description: "Title at top, body content below",
    createElements: () => [
      text({ content: "Slide Title", role: "heading", fontSize: 38, fontWeight: "bold", x: 5, y: 5, width: 90, height: 18 }),
      shape({ shape: "line", x: 5, y: 24, width: 90, height: 3, fill: "#3b82f6", strokeWidth: 0 }),
      text({ content: "Add your content here. This is a great place for body text or key information.", role: "body", fontSize: 18, x: 5, y: 30, width: 90, height: 62 }),
    ],
  },

  // ── Two-column layouts ─────────────────────────────────────────────────────
  {
    id: "two-column",
    name: "Two Column",
    icon: "two-column",
    description: "Two equal content columns",
    createElements: () => [
      text({ content: "Left Heading", role: "heading", fontSize: 24, fontWeight: "bold", x: 3, y: 5, width: 44, height: 12 }),
      text({ content: "Content for the left column. Add your key points here.", role: "body", fontSize: 16, x: 3, y: 20, width: 44, height: 72 }),
      shape({ shape: "line", x: 50, y: 5, width: 1, height: 90, fill: "#e2e8f0", strokeWidth: 0 }),
      text({ content: "Right Heading", role: "subheading", fontSize: 24, fontWeight: "bold", x: 53, y: 5, width: 44, height: 12 }),
      text({ content: "Content for the right column. Add complementary information.", role: "body", fontSize: 16, x: 53, y: 20, width: 44, height: 72 }),
    ],
  },
  {
    id: "problem-solution",
    name: "Problem / Solution",
    icon: "problem-solution",
    description: "Side-by-side problem and solution",
    createElements: () => [
      text({ content: "The Problem", role: "heading", fontSize: 22, fontWeight: "bold", textAlign: "center", x: 3, y: 4, width: 44, height: 10 }),
      text({ content: "Describe the pain point in vivid detail. Make the audience feel the frustration.\n\nWhy does this matter?\nWho is affected?\nWhat does it cost?", role: "body", fontSize: 16, x: 3, y: 17, width: 44, height: 75 }),
      text({ content: "Our Solution", role: "cta", fontSize: 22, fontWeight: "bold", textAlign: "center", x: 53, y: 4, width: 44, height: 10 }),
      text({ content: "Describe the transformation. Lead with the outcome.\n\nHow it works\nWhy now\nWhy us", role: "body", fontSize: 16, x: 53, y: 17, width: 44, height: 75 }),
    ],
  },

  // ── Image layouts ──────────────────────────────────────────────────────────
  {
    id: "image-left",
    name: "Image Left",
    icon: "image-left",
    description: "Image on left, text on right",
    createElements: () => [
      image({ x: 2, y: 5, width: 44, height: 90 }),
      text({ content: "Heading", role: "heading", fontSize: 32, fontWeight: "bold", x: 50, y: 10, width: 46, height: 18 }),
      text({ content: "Supporting content goes here. Explain what this image shows and why it matters.", role: "body", fontSize: 16, x: 50, y: 32, width: 46, height: 55 }),
    ],
  },
  {
    id: "image-right",
    name: "Image Right",
    icon: "image-right",
    description: "Text on left, image on right",
    createElements: () => [
      text({ content: "Heading", role: "heading", fontSize: 32, fontWeight: "bold", x: 4, y: 10, width: 46, height: 18 }),
      text({ content: "Supporting content goes here. Explain what this image shows and why it matters.", role: "body", fontSize: 16, x: 4, y: 32, width: 46, height: 55 }),
      image({ x: 52, y: 5, width: 44, height: 90 }),
    ],
  },
  {
    id: "full-image",
    name: "Full Image",
    icon: "full-image",
    description: "Full-bleed image with text overlay",
    createElements: () => [
      image({ x: 0, y: 0, width: 100, height: 100, objectFit: "cover", zIndex: 1 }),
      shape({ shape: "rect", x: 0, y: 55, width: 100, height: 45, fill: "rgba(0,0,0,0.6)", zIndex: 2 }),
      text({ content: "Your Headline", role: "heading", fontSize: 42, fontWeight: "bold", textAlign: "center", color: "#ffffff", x: 5, y: 58, width: 90, height: 22, zIndex: 3 }),
      text({ content: "Supporting subtitle text", role: "subheading", fontSize: 20, textAlign: "center", color: "#e2e8f0", x: 10, y: 80, width: 80, height: 12, zIndex: 3 }),
    ],
  },

  // ── Metrics / Stats ────────────────────────────────────────────────────────
  {
    id: "big-number",
    name: "Big Stat",
    icon: "big-number",
    description: "One large metric front and center",
    createElements: () => [
      text({ content: "95%", role: "metric-value", fontSize: 96, fontWeight: "bold", textAlign: "center", x: 10, y: 12, width: 80, height: 52 }),
      text({ content: "Customer Satisfaction Rate", role: "metric-label", fontSize: 22, textAlign: "center", x: 10, y: 66, width: 80, height: 14 }),
      text({ content: "Based on 1,200+ customer surveys Q4 2024", role: "caption", fontSize: 14, textAlign: "center", x: 15, y: 82, width: 70, height: 10 }),
    ],
  },
  {
    id: "three-stats",
    name: "Three Stats",
    icon: "three-stats",
    description: "Three key metrics side by side",
    createElements: () => [
      text({ content: "Key Metrics", role: "heading", fontSize: 28, fontWeight: "bold", textAlign: "center", x: 5, y: 4, width: 90, height: 13 }),
      text({ content: "$10M", role: "metric-value", fontSize: 44, fontWeight: "bold", textAlign: "center", x: 3, y: 22, width: 30, height: 35 }),
      text({ content: "ARR", role: "metric-label", fontSize: 16, textAlign: "center", x: 3, y: 58, width: 30, height: 12 }),
      text({ content: "500K", role: "metric-value", fontSize: 44, fontWeight: "bold", textAlign: "center", x: 35, y: 22, width: 30, height: 35 }),
      text({ content: "Active Users", role: "metric-label", fontSize: 16, textAlign: "center", x: 35, y: 58, width: 30, height: 12 }),
      text({ content: "3x", role: "metric-value", fontSize: 44, fontWeight: "bold", textAlign: "center", x: 67, y: 22, width: 30, height: 35 }),
      text({ content: "YoY Growth", role: "metric-label", fontSize: 16, textAlign: "center", x: 67, y: 58, width: 30, height: 12 }),
    ],
  },
  {
    id: "four-metrics",
    name: "Four Metrics",
    icon: "four-metrics",
    description: "Four key metrics in a grid",
    createElements: () => [
      text({ content: "Traction", role: "heading", fontSize: 28, fontWeight: "bold", textAlign: "center", x: 5, y: 3, width: 90, height: 14 }),
      text({ content: "$10M", role: "metric-value", fontSize: 36, fontWeight: "bold", textAlign: "center", x: 2, y: 22, width: 22, height: 35 }),
      text({ content: "Revenue", role: "metric-label", fontSize: 14, textAlign: "center", x: 2, y: 58, width: 22, height: 12 }),
      text({ content: "500K", role: "metric-value", fontSize: 36, fontWeight: "bold", textAlign: "center", x: 27, y: 22, width: 22, height: 35 }),
      text({ content: "Users", role: "metric-label", fontSize: 14, textAlign: "center", x: 27, y: 58, width: 22, height: 12 }),
      text({ content: "98%", role: "metric-value", fontSize: 36, fontWeight: "bold", textAlign: "center", x: 52, y: 22, width: 22, height: 35 }),
      text({ content: "Retention", role: "metric-label", fontSize: 14, textAlign: "center", x: 52, y: 58, width: 22, height: 12 }),
      text({ content: "3x", role: "metric-value", fontSize: 36, fontWeight: "bold", textAlign: "center", x: 77, y: 22, width: 22, height: 35 }),
      text({ content: "YoY Growth", role: "metric-label", fontSize: 14, textAlign: "center", x: 77, y: 58, width: 22, height: 12 }),
    ],
  },

  // ── Lists ──────────────────────────────────────────────────────────────────
  {
    id: "bullet-list",
    name: "Bullet List",
    icon: "bullet-list",
    description: "Title + bulleted key points",
    createElements: () => [
      text({ content: "Key Points", role: "heading", fontSize: 34, fontWeight: "bold", x: 5, y: 5, width: 90, height: 16 }),
      text({ content: "First key point\nSecond key point\nThird key point\nFourth key point", role: "bullet-group", fontSize: 20, x: 5, y: 24, width: 90, height: 68 }),
    ],
  },
  {
    id: "numbered-steps",
    name: "3 Steps",
    icon: "numbered-steps",
    description: "Three numbered steps in a row",
    createElements: () => [
      text({ content: "How It Works", role: "heading", fontSize: 30, fontWeight: "bold", textAlign: "center", x: 5, y: 4, width: 90, height: 13 }),
      // Step circles
      shape({ shape: "circle", x: 10, y: 24, width: 12, height: 21, fill: "#3b82f6", zIndex: 1 }),
      text({ content: "1", role: "metric-value", fontSize: 22, fontWeight: "bold", textAlign: "center", color: "#ffffff", x: 10, y: 26, width: 12, height: 17, zIndex: 2 }),
      shape({ shape: "circle", x: 44, y: 24, width: 12, height: 21, fill: "#3b82f6", zIndex: 1 }),
      text({ content: "2", role: "metric-value", fontSize: 22, fontWeight: "bold", textAlign: "center", color: "#ffffff", x: 44, y: 26, width: 12, height: 17, zIndex: 2 }),
      shape({ shape: "circle", x: 78, y: 24, width: 12, height: 21, fill: "#3b82f6", zIndex: 1 }),
      text({ content: "3", role: "metric-value", fontSize: 22, fontWeight: "bold", textAlign: "center", color: "#ffffff", x: 78, y: 26, width: 12, height: 17, zIndex: 2 }),
      // Connector lines
      shape({ shape: "line", x: 22, y: 33, width: 22, height: 3, fill: "#94a3b8", zIndex: 1 }),
      shape({ shape: "line", x: 56, y: 33, width: 22, height: 3, fill: "#94a3b8", zIndex: 1 }),
      // Step labels
      text({ content: "Step One", role: "subheading", fontSize: 16, fontWeight: "bold", textAlign: "center", x: 3, y: 47, width: 26, height: 10 }),
      text({ content: "Describe the first step in the process clearly and concisely.", role: "body", fontSize: 14, textAlign: "center", x: 3, y: 59, width: 26, height: 30 }),
      text({ content: "Step Two", role: "subheading", fontSize: 16, fontWeight: "bold", textAlign: "center", x: 37, y: 47, width: 26, height: 10 }),
      text({ content: "Describe the second step. What happens next?", role: "body", fontSize: 14, textAlign: "center", x: 37, y: 59, width: 26, height: 30 }),
      text({ content: "Step Three", role: "subheading", fontSize: 16, fontWeight: "bold", textAlign: "center", x: 71, y: 47, width: 26, height: 10 }),
      text({ content: "The final outcome. What does success look like?", role: "body", fontSize: 14, textAlign: "center", x: 71, y: 59, width: 26, height: 30 }),
    ],
  },

  // ── Quote / Callout ────────────────────────────────────────────────────────
  {
    id: "quote-card",
    name: "Quote",
    icon: "quote-card",
    description: "Large pull quote with attribution",
    createElements: () => [
      text({ content: "\u201c", role: "metric-value", fontSize: 120, fontWeight: "bold", textAlign: "center", x: 5, y: 5, width: 20, height: 30, color: "#3b82f6" }),
      text({ content: "The best way to predict the future is to invent it.", role: "body", fontSize: 30, fontStyle: "italic", textAlign: "center", x: 10, y: 22, width: 80, height: 42 }),
      text({ content: "\u2014 Alan Kay", role: "caption", fontSize: 18, textAlign: "center", x: 10, y: 68, width: 80, height: 12 }),
    ],
  },

  // ── Team ───────────────────────────────────────────────────────────────────
  {
    id: "team-three",
    name: "Team (3)",
    icon: "team-three",
    description: "Three team members in a row",
    createElements: () => [
      text({ content: "Our Team", role: "heading", fontSize: 30, fontWeight: "bold", textAlign: "center", x: 5, y: 4, width: 90, height: 13 }),
      image({ x: 5, y: 20, width: 26, height: 40, objectFit: "cover" }),
      text({ content: "Jane Smith\nCEO & Co-founder\n10 years in SaaS. Previously VP at Acme Corp.", role: "team-card", fontSize: 14, x: 5, y: 62, width: 26, height: 32 }),
      image({ x: 37, y: 20, width: 26, height: 40, objectFit: "cover" }),
      text({ content: "John Doe\nCTO & Co-founder\nEx-Google engineer. Built products used by 50M+ users.", role: "team-card", fontSize: 14, x: 37, y: 62, width: 26, height: 32 }),
      image({ x: 69, y: 20, width: 26, height: 40, objectFit: "cover" }),
      text({ content: "Sara Lee\nHead of Sales\n$30M+ quota retired. Former Salesforce Enterprise.", role: "team-card", fontSize: 14, x: 69, y: 62, width: 26, height: 32 }),
    ],
  },
  {
    id: "team-two",
    name: "Team (2)",
    icon: "team-two",
    description: "Two founders with bios",
    createElements: () => [
      text({ content: "The Founders", role: "heading", fontSize: 32, fontWeight: "bold", textAlign: "center", x: 5, y: 4, width: 90, height: 14 }),
      image({ x: 5, y: 22, width: 38, height: 52, objectFit: "cover" }),
      text({ content: "Jane Smith\nCEO & Co-founder\nFormer VP at Acme Corp with 10 years building B2B SaaS products.", role: "team-card", fontSize: 15, x: 5, y: 76, width: 38, height: 20 }),
      image({ x: 57, y: 22, width: 38, height: 52, objectFit: "cover" }),
      text({ content: "John Doe\nCTO & Co-founder\nEx-Google engineer. Built products used by 50M+ people globally.", role: "team-card", fontSize: 15, x: 57, y: 76, width: 38, height: 20 }),
    ],
  },

  // ── Process / Timeline ─────────────────────────────────────────────────────
  {
    id: "timeline",
    name: "Timeline",
    icon: "timeline",
    description: "Horizontal milestone timeline",
    createElements: () => [
      text({ content: "Company Timeline", role: "heading", fontSize: 30, fontWeight: "bold", textAlign: "center", x: 5, y: 4, width: 90, height: 13 }),
      // Main line
      shape({ shape: "line", x: 8, y: 44, width: 84, height: 3, fill: "#3b82f6", zIndex: 1 }),
      // Dots
      shape({ shape: "circle", x: 10, y: 40, width: 7, height: 12, fill: "#3b82f6", zIndex: 2 }),
      shape({ shape: "circle", x: 31, y: 40, width: 7, height: 12, fill: "#3b82f6", zIndex: 2 }),
      shape({ shape: "circle", x: 52, y: 40, width: 7, height: 12, fill: "#3b82f6", zIndex: 2 }),
      shape({ shape: "circle", x: 73, y: 40, width: 7, height: 12, fill: "#3b82f6", zIndex: 2 }),
      shape({ shape: "circle", x: 88, y: 40, width: 7, height: 12, fill: "#60a5fa", zIndex: 2 }),
      // Labels above line
      text({ content: "Q1 2022", role: "caption", fontSize: 13, textAlign: "center", x: 7, y: 26, width: 13, height: 12 }),
      text({ content: "Q3 2022", role: "caption", fontSize: 13, textAlign: "center", x: 28, y: 26, width: 13, height: 12 }),
      text({ content: "Q1 2023", role: "caption", fontSize: 13, textAlign: "center", x: 49, y: 26, width: 13, height: 12 }),
      text({ content: "Q3 2023", role: "caption", fontSize: 13, textAlign: "center", x: 70, y: 26, width: 13, height: 12 }),
      text({ content: "Today", role: "caption", fontSize: 13, textAlign: "center", color: "#3b82f6", x: 85, y: 26, width: 13, height: 12 }),
      // Events below line
      text({ content: "Founded\nSeed raised", role: "body", fontSize: 13, textAlign: "center", x: 5, y: 55, width: 18, height: 18 }),
      text({ content: "Product\nlaunched", role: "body", fontSize: 13, textAlign: "center", x: 26, y: 55, width: 18, height: 18 }),
      text({ content: "1K users\nSeries A", role: "body", fontSize: 13, textAlign: "center", x: 47, y: 55, width: 18, height: 18 }),
      text({ content: "10K users\n$5M ARR", role: "body", fontSize: 13, textAlign: "center", x: 68, y: 55, width: 18, height: 18 }),
      text({ content: "Series B\nraise", role: "body", fontSize: 13, textAlign: "center", color: "#3b82f6", fontWeight: "bold", x: 83, y: 55, width: 18, height: 18 }),
    ],
  },

  // ── Comparison ─────────────────────────────────────────────────────────────
  {
    id: "comparison",
    name: "Comparison",
    icon: "comparison",
    description: "Side-by-side product comparison",
    createElements: () => [
      text({ content: "Why We Win", role: "heading", fontSize: 30, fontWeight: "bold", textAlign: "center", x: 5, y: 4, width: 90, height: 13 }),
      // Left col header
      shape({ shape: "rect", x: 3, y: 20, width: 44, height: 14, fill: "#f1f5f9", zIndex: 1 }),
      text({ content: "Competitors", role: "subheading", fontSize: 18, fontWeight: "bold", textAlign: "center", x: 3, y: 22, width: 44, height: 10, zIndex: 2 }),
      // Right col header
      shape({ shape: "rect", x: 53, y: 20, width: 44, height: 14, fill: "#3b82f6", zIndex: 1 }),
      text({ content: "Our Product", role: "subheading", fontSize: 18, fontWeight: "bold", textAlign: "center", color: "#ffffff", x: 53, y: 22, width: 44, height: 10, zIndex: 2 }),
      // Rows
      text({ content: "Manual setup required\nLimited integrations\nSlower performance\nBasic reporting only\nHigh per-seat pricing", role: "bullet-group", fontSize: 16, x: 5, y: 37, width: 40, height: 55 }),
      text({ content: "5-min automated setup\n200+ native integrations\n10x faster processing\nAI-powered analytics\nFlat team pricing", role: "bullet-group", fontSize: 16, x: 55, y: 37, width: 40, height: 55 }),
    ],
  },

  // ── Agenda / Contents ──────────────────────────────────────────────────────
  {
    id: "agenda",
    name: "Agenda",
    icon: "agenda",
    description: "Numbered agenda or table of contents",
    createElements: () => [
      text({ content: "Agenda", role: "heading", fontSize: 36, fontWeight: "bold", x: 5, y: 5, width: 40, height: 18 }),
      shape({ shape: "line", x: 5, y: 24, width: 40, height: 3, fill: "#3b82f6" }),
      // Items
      ...[
        ["01", "The Problem"],
        ["02", "Our Solution"],
        ["03", "Market Opportunity"],
        ["04", "Business Model"],
        ["05", "Team & Ask"],
      ].flatMap(([num, title], i) => [
        text({ content: num, role: "metric-value", fontSize: 18, fontWeight: "bold", color: "#3b82f6", x: 5, y: 30 + i * 12, width: 10, height: 10 }),
        text({ content: title, role: "body", fontSize: 20, x: 18, y: 30 + i * 12, width: 70, height: 10 }),
      ]),
    ],
  },

  // ── SWOT ───────────────────────────────────────────────────────────────────
  {
    id: "swot",
    name: "SWOT",
    icon: "swot",
    description: "2×2 SWOT analysis grid",
    createElements: () => [
      text({ content: "SWOT Analysis", role: "heading", fontSize: 28, fontWeight: "bold", textAlign: "center", x: 5, y: 2, width: 90, height: 12 }),
      // Quadrant backgrounds
      shape({ shape: "rect", x: 2, y: 16, width: 46, height: 38, fill: "#dbeafe", zIndex: 1 }),
      shape({ shape: "rect", x: 52, y: 16, width: 46, height: 38, fill: "#fef3c7", zIndex: 1 }),
      shape({ shape: "rect", x: 2, y: 56, width: 46, height: 38, fill: "#dcfce7", zIndex: 1 }),
      shape({ shape: "rect", x: 52, y: 56, width: 46, height: 38, fill: "#fee2e2", zIndex: 1 }),
      // Quadrant titles
      text({ content: "Strengths", role: "subheading", fontSize: 16, fontWeight: "bold", textAlign: "center", x: 2, y: 18, width: 46, height: 8, zIndex: 2 }),
      text({ content: "Weaknesses", role: "subheading", fontSize: 16, fontWeight: "bold", textAlign: "center", x: 52, y: 18, width: 46, height: 8, zIndex: 2 }),
      text({ content: "Opportunities", role: "subheading", fontSize: 16, fontWeight: "bold", textAlign: "center", x: 2, y: 58, width: 46, height: 8, zIndex: 2 }),
      text({ content: "Threats", role: "subheading", fontSize: 16, fontWeight: "bold", textAlign: "center", x: 52, y: 58, width: 46, height: 8, zIndex: 2 }),
      // Content
      text({ content: "Strong brand\nProprietary tech\nExperienced team", role: "body", fontSize: 13, textAlign: "center", x: 4, y: 27, width: 42, height: 24, zIndex: 2 }),
      text({ content: "Limited market reach\nEarly stage product\nSmall team", role: "body", fontSize: 13, textAlign: "center", x: 54, y: 27, width: 42, height: 24, zIndex: 2 }),
      text({ content: "Growing market\nRegulatory tailwinds\nPartnership potential", role: "body", fontSize: 13, textAlign: "center", x: 4, y: 67, width: 42, height: 24, zIndex: 2 }),
      text({ content: "Large incumbents\nNew entrants\nEconomy slowdown", role: "body", fontSize: 13, textAlign: "center", x: 54, y: 67, width: 42, height: 24, zIndex: 2 }),
    ],
  },

  // ── Closing / CTA ──────────────────────────────────────────────────────────
  {
    id: "closing-cta",
    name: "CTA Slide",
    icon: "closing-cta",
    description: "Bold closing / call-to-action",
    createElements: () => [
      text({ content: "Let\u2019s Build the Future Together", role: "heading", fontSize: 46, fontWeight: "bold", textAlign: "center", x: 5, y: 15, width: 90, height: 30 }),
      shape({ shape: "rect", x: 32, y: 52, width: 36, height: 12, fill: "#3b82f6", zIndex: 1 }),
      text({ content: "Schedule a Demo", role: "cta", fontSize: 20, fontWeight: "bold", textAlign: "center", color: "#ffffff", x: 32, y: 54, width: 36, height: 8, zIndex: 2 }),
      text({ content: "contact@company.com  \u2022  www.company.com", role: "caption", fontSize: 16, textAlign: "center", x: 10, y: 72, width: 80, height: 10 }),
    ],
  },
];
