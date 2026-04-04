export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  category: "professional" | "startup" | "creative" | "industry";
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    accent: string;
  };
}

export interface SlideContentProps {
  slideType: string;
  heading?: string;
  subheading?: string;
  bodyText?: string;
  bulletPoints?: string[];
  metrics?: Array<{ label: string; value: string }>;
  teamMembers?: Array<{ name: string; role: string; bio: string }>;
  chartData?: {
    type: string;
    labels: string[];
    values: number[];
  };
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
  isEditing?: boolean;
  onContentChange?: (
    field: string,
    value:
      | string
      | string[]
      | Array<{ label: string; value: string }>
      | Array<{ name: string; role: string; bio: string }>
  ) => void;
}

export interface TemplateComponent {
  metadata: TemplateMetadata;
  SlideComponent: React.FC<SlideContentProps>;
}
