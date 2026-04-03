import modernDark from "./modern-dark";
import startupGradient from "./startup-gradient";
import cleanMinimal from "./clean-minimal";
import type { TemplateComponent } from "./types";

export const templates: Record<string, TemplateComponent> = {
  "modern-dark": modernDark,
  "startup-gradient": startupGradient,
  "clean-minimal": cleanMinimal,
};

export const templateList = Object.values(templates);

export function getTemplate(id: string): TemplateComponent {
  return templates[id] || templates["modern-dark"];
}

export type { TemplateComponent, SlideContentProps, TemplateMetadata } from "./types";
