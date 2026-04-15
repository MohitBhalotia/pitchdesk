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
  type: "text" | "shape" | "image" | "icon" | "chart" | "table" | "group";
  x: number; // % of slide width, 0–100
  y: number; // % of slide height, 0–100
  width: number; // % of slide width, 0–100
  height: number; // % of slide height, 0–100
  zIndex?: number;
  locked?: boolean;
  groupId?: string; // if part of a group
}

export interface TextShadow {
  x: number;
  y: number;
  blur: number;
  color: string;
}

export interface TextElement extends BaseElement {
  type: "text";
  content: string;
  fontSize?: number;
  fontWeight?: "normal" | "bold";
  fontStyle?: "normal" | "italic";
  textAlign?: "left" | "center" | "right";
  color?: string;
  lineHeight?: number;
  fontFamily?: string;
  role?: ElementRole;
  // Phase 3.7 enhancements
  letterSpacing?: number; // em
  textShadow?: TextShadow;
  highlight?: string; // background color behind text
  textTransform?: "none" | "uppercase" | "capitalize" | "lowercase";
  verticalAlign?: "script-baseline" | "sub" | "super";
}

export type ShapeKind =
  | "rect"
  | "circle"
  | "line"
  | "arrow"
  | "triangle"
  | "diamond"
  | "star"
  | "pentagon"
  | "hexagon"
  | "parallelogram"
  | "rounded-rect"
  | "process-arrow"
  | "cloud";

export interface BoxShadow {
  x: number;
  y: number;
  blur: number;
  color: string;
}

export interface ShapeElement extends BaseElement {
  type: "shape";
  shape: ShapeKind;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeStyle?: "solid" | "dashed" | "dotted";
  opacity?: number;
  fillGradient?: string; // CSS linear-gradient string
  boxShadow?: BoxShadow;
  cornerRadius?: number; // for rounded-rect
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

export type ChartKind = "bar" | "line" | "pie" | "donut" | "area";

export interface ChartElement extends BaseElement {
  type: "chart";
  chartKind: ChartKind;
  labels: string[];
  values: number[];
  title?: string;
  colors?: string[];
}

export interface TableElement extends BaseElement {
  type: "table";
  rows: string[][];
  headerRow?: boolean;
  headerFill?: string;
  headerColor?: string;
  bodyFill?: string;
  bodyColor?: string;
  borderColor?: string;
  fontSize?: number;
}

export interface GroupElement extends BaseElement {
  type: "group";
  childIds: string[];
}

export type SlideElement =
  | TextElement
  | ShapeElement
  | ImageElement
  | IconElement
  | ChartElement
  | TableElement
  | GroupElement;

export type SlideTransition = "none" | "fade" | "slide-left" | "slide-right" | "zoom";

export interface SlideV2 {
  slideType: string;
  order: number;
  elements: SlideElement[];
  background?: string;
  notes?: string;
  transition?: SlideTransition;
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
