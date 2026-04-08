import { v4 as uuid } from "uuid";
import type { SlideElement, TextElement, ImageElement } from "@/types/slide-elements";

export interface LayoutPreset {
  id: string;
  name: string;
  icon: string;
  createElements: () => SlideElement[];
}

function text(overrides: Partial<TextElement> & { content: string }): TextElement {
  return {
    id: uuid(),
    type: "text",
    x: 0,
    y: 0,
    width: 100,
    height: 20,
    ...overrides,
  };
}

function image(overrides: Partial<ImageElement>): ImageElement {
  return {
    id: uuid(),
    type: "image",
    imageUrl: "",
    x: 0,
    y: 0,
    width: 40,
    height: 70,
    objectFit: "cover",
    ...overrides,
  };
}

export const layoutPresets: LayoutPreset[] = [
  {
    id: "blank",
    name: "Blank",
    icon: "⬜",
    createElements: () => [],
  },
  {
    id: "title-centered",
    name: "Title Centered",
    icon: "🎯",
    createElements: () => [
      text({ content: "Slide Title", role: "heading", fontSize: 48, fontWeight: "bold", textAlign: "center", x: 5, y: 25, width: 90, height: 25 }),
      text({ content: "Your subtitle goes here", role: "subheading", fontSize: 24, textAlign: "center", x: 10, y: 55, width: 80, height: 15 }),
    ],
  },
  {
    id: "title-left",
    name: "Title + Content",
    icon: "📄",
    createElements: () => [
      text({ content: "Slide Title", role: "heading", fontSize: 36, fontWeight: "bold", x: 5, y: 5, width: 90, height: 20 }),
      text({ content: "Add your content here. This is a great place for body text or key information.", role: "body", fontSize: 18, x: 5, y: 30, width: 90, height: 60 }),
    ],
  },
  {
    id: "two-column",
    name: "Two Column",
    icon: "⬛⬛",
    createElements: () => [
      text({ content: "Left Column", role: "heading", fontSize: 24, fontWeight: "bold", x: 3, y: 5, width: 44, height: 12 }),
      text({ content: "Content for the left column goes here. Add your key points.", role: "body", fontSize: 16, x: 3, y: 20, width: 44, height: 70 }),
      text({ content: "Right Column", role: "subheading", fontSize: 24, fontWeight: "bold", x: 53, y: 5, width: 44, height: 12 }),
      text({ content: "Content for the right column goes here. Add complementary information.", role: "body", fontSize: 16, x: 53, y: 20, width: 44, height: 70 }),
    ],
  },
  {
    id: "image-left",
    name: "Image Left",
    icon: "🖼️📝",
    createElements: () => [
      image({ x: 2, y: 5, width: 44, height: 88 }),
      text({ content: "Heading", role: "heading", fontSize: 32, fontWeight: "bold", x: 50, y: 10, width: 46, height: 18 }),
      text({ content: "Describe what this image shows or add supporting content here.", role: "body", fontSize: 16, x: 50, y: 32, width: 46, height: 55 }),
    ],
  },
  {
    id: "image-right",
    name: "Image Right",
    icon: "📝🖼️",
    createElements: () => [
      text({ content: "Heading", role: "heading", fontSize: 32, fontWeight: "bold", x: 4, y: 10, width: 46, height: 18 }),
      text({ content: "Describe what this image shows or add supporting content here.", role: "body", fontSize: 16, x: 4, y: 32, width: 46, height: 55 }),
      image({ x: 52, y: 5, width: 44, height: 88 }),
    ],
  },
  {
    id: "big-number",
    name: "Big Stat",
    icon: "🔢",
    createElements: () => [
      text({ content: "95%", role: "metric-value", fontSize: 96, fontWeight: "bold", textAlign: "center", x: 10, y: 15, width: 80, height: 50 }),
      text({ content: "Customer Satisfaction Rate", role: "metric-label", fontSize: 22, textAlign: "center", x: 10, y: 68, width: 80, height: 15 }),
    ],
  },
  {
    id: "four-metrics",
    name: "Four Metrics",
    icon: "📊",
    createElements: () => [
      text({ content: "Slide Title", role: "heading", fontSize: 28, fontWeight: "bold", textAlign: "center", x: 5, y: 3, width: 90, height: 14 }),
      // Metric 1
      text({ content: "$10M", role: "metric-value", fontSize: 36, fontWeight: "bold", textAlign: "center", x: 2, y: 22, width: 22, height: 35 }),
      text({ content: "Revenue", role: "metric-label", fontSize: 14, textAlign: "center", x: 2, y: 58, width: 22, height: 12 }),
      // Metric 2
      text({ content: "500K", role: "metric-value", fontSize: 36, fontWeight: "bold", textAlign: "center", x: 27, y: 22, width: 22, height: 35 }),
      text({ content: "Users", role: "metric-label", fontSize: 14, textAlign: "center", x: 27, y: 58, width: 22, height: 12 }),
      // Metric 3
      text({ content: "98%", role: "metric-value", fontSize: 36, fontWeight: "bold", textAlign: "center", x: 52, y: 22, width: 22, height: 35 }),
      text({ content: "Retention", role: "metric-label", fontSize: 14, textAlign: "center", x: 52, y: 58, width: 22, height: 12 }),
      // Metric 4
      text({ content: "3x", role: "metric-value", fontSize: 36, fontWeight: "bold", textAlign: "center", x: 77, y: 22, width: 22, height: 35 }),
      text({ content: "YoY Growth", role: "metric-label", fontSize: 14, textAlign: "center", x: 77, y: 58, width: 22, height: 12 }),
    ],
  },
  {
    id: "bullet-list",
    name: "Bullet List",
    icon: "📋",
    createElements: () => [
      text({ content: "Key Points", role: "heading", fontSize: 34, fontWeight: "bold", x: 5, y: 5, width: 90, height: 16 }),
      text({ content: "First key point\nSecond key point\nThird key point\nFourth key point", role: "bullet-group", fontSize: 20, x: 5, y: 24, width: 90, height: 68 }),
    ],
  },
  {
    id: "quote-card",
    name: "Quote",
    icon: "💬",
    createElements: () => [
      text({ content: "\"The best way to predict the future is to invent it.\"", role: "body", fontSize: 32, fontStyle: "italic", textAlign: "center", x: 10, y: 25, width: 80, height: 40 }),
      text({ content: "— Alan Kay", role: "caption", fontSize: 18, textAlign: "center", x: 10, y: 68, width: 80, height: 12 }),
    ],
  },
];
