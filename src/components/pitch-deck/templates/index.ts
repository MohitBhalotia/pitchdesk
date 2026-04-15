import modernDark from "./modern-dark";
import startupGradient from "./startup-gradient";
import cleanMinimal from "./clean-minimal";
import midnightBlue from "./midnight-blue";
import ventureBold from "./venture-bold";
import siliconValley from "./silicon-valley";
import pitchBlack from "./pitch-black";
import forest from "./forest";
import coralSunrise from "./coral-sunrise";
import slateProfessional from "./slate-professional";
import royal from "./royal";
import {
  obsidian, carbon, eclipse, noir,
  ivory, paper, snow, cream,
  electric, candy, sunsetOrange, aurora,
  financeNavy, healthcareBlue, saasViolet, edtechOrange,
  outline, swiss, grid, letterpress,
} from "./extra-themes";
import type { TemplateComponent } from "./types";

export const templates: Record<string, TemplateComponent> = {
  // Original 11
  "modern-dark": modernDark,
  "startup-gradient": startupGradient,
  "clean-minimal": cleanMinimal,
  "midnight-blue": midnightBlue,
  "venture-bold": ventureBold,
  "silicon-valley": siliconValley,
  "pitch-black": pitchBlack,
  "forest": forest,
  "coral-sunrise": coralSunrise,
  "slate-professional": slateProfessional,
  "royal": royal,
  // Dark Premium
  "obsidian": obsidian,
  "carbon": carbon,
  "eclipse": eclipse,
  "noir": noir,
  // Light / Clean
  "ivory": ivory,
  "paper": paper,
  "snow": snow,
  "cream": cream,
  // Bold / Colorful
  "electric": electric,
  "candy": candy,
  "sunset-orange": sunsetOrange,
  "aurora": aurora,
  // Industry
  "finance-navy": financeNavy,
  "healthcare": healthcareBlue,
  "saas": saasViolet,
  "edtech": edtechOrange,
  // Minimalist
  "outline": outline,
  "swiss": swiss,
  "grid": grid,
  "letterpress": letterpress,
};

export const templateList = Object.values(templates);

export function getTemplate(id: string): TemplateComponent {
  return templates[id] || templates["modern-dark"];
}

export type { TemplateComponent, SlideContentProps, TemplateMetadata } from "./types";
