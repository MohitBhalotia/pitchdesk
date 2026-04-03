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
  isEditing?: boolean;
  onContentChange?: (field: string, value: string | string[]) => void;
}

export interface TemplateComponent {
  metadata: TemplateMetadata;
  SlideComponent: React.FC<SlideContentProps>;
}
