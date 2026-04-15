export type ElementRole =
  | "heading"
  | "subheading"
  | "body"
  | "bullet-group"
  | "metric-value"
  | "metric-label"
  | "cta"
  | "team-card"
  | "caption";

export interface BaseElement {
  id: string;
  type: "text" | "shape" | "image" | "icon";
  x: number; // % of slide width, 0–100
  y: number; // % of slide height, 0–100
  width: number; // % of slide width, 0–100
  height: number; // % of slide height, 0–100
  zIndex?: number;
  locked?: boolean;
}

export interface TextElement extends BaseElement {
  type: "text";
  content: string;
  fontSize?: number; // px at 1280-wide canvas
  fontWeight?: "normal" | "bold";
  fontStyle?: "normal" | "italic";
  textAlign?: "left" | "center" | "right";
  color?: string;
  lineHeight?: number;
  fontFamily?: string;
  role?: ElementRole;
}

export interface ShapeElement extends BaseElement {
  type: "shape";
  shape: "rect" | "circle" | "line" | "arrow";
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
}

export interface ImageElement extends BaseElement {
  type: "image";
  imageUrl?: string;
  imagePublicId?: string;
  objectFit?: "contain" | "cover" | "fill";
}

export interface IconElement extends BaseElement {
  type: "icon";
  iconName: string;
  color?: string;
}

export type SlideElement = TextElement | ShapeElement | ImageElement | IconElement;

export interface SlideV2 {
  slideType: string;
  order: number;
  elements: SlideElement[];
  background?: string;
  notes?: string;
}

export interface LegacySlide {
  slideType: string;
  order?: number;
  heading?: string;
  subheading?: string;
  bodyText?: string;
  bulletPoints?: string[];
  metrics?: Array<{ label: string; value: string }>;
  teamMembers?: Array<{ name: string; role: string; bio: string }>;
  chartData?: { type: string; labels: string[]; values: number[] };
  callToAction?: string;
  notes?: string;
  decorativeElements?: Array<{
    type: "divider" | "accent-bar" | "circle" | "quote-box";
    position: "top" | "bottom" | "left" | "right" | "center";
    color?: string;
  }>;
  images?: Array<{
    url: string;
    publicId?: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
}

export type AnySlide = SlideV2 | LegacySlide;

export function isSlideV2(slide: AnySlide): slide is SlideV2 {
  return Array.isArray((slide as SlideV2).elements);
}
