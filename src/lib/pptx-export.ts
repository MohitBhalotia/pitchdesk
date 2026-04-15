import PptxGenJS from "pptxgenjs";
import { migrateSlide } from "@/lib/slide-migration";
import { isSlideV2 } from "@/types/slide-elements";
import type {
  AnySlide,
  SlideV2,
  TextElement,
  ImageElement,
  ShapeElement,
  TableElement,
  ChartElement,
} from "@/types/slide-elements";

// Map Google Font names to nearest available PPTX fonts
const FONT_MAP: Record<string, string> = {
  Inter: "Calibri",
  Montserrat: "Calibri",
  Poppins: "Calibri",
  "Plus Jakarta Sans": "Calibri",
  Outfit: "Calibri",
  "DM Sans": "Calibri",
  "Bricolage Grotesque": "Calibri",
  "Space Grotesk": "Calibri",
  Syne: "Calibri",
  Raleway: "Calibri",
  Nunito: "Calibri",
  Lato: "Calibri",
  Roboto: "Arial",
  "Source Sans 3": "Arial",
  "Playfair Display": "Georgia",
};
function mapFont(name: string | undefined): string {
  if (!name) return "Calibri";
  return FONT_MAP[name] || "Calibri";
}

function parseGradient(css: string): { stops: Array<{ color: string; pos: number }>; angle: number } | null {
  // Simple parser for: linear-gradient(135deg, #a 0%, #b 100%)
  const m = /linear-gradient\(([^)]+)\)/i.exec(css);
  if (!m) return null;
  const parts = m[1].split(",").map((s) => s.trim());
  let angle = 90;
  let startIdx = 0;
  if (/deg/i.test(parts[0])) {
    angle = parseFloat(parts[0]);
    startIdx = 1;
  }
  const stops: Array<{ color: string; pos: number }> = [];
  for (let i = startIdx; i < parts.length; i++) {
    const pm = /(#[0-9a-fA-F]{3,8})\s*(\d+)?%?/.exec(parts[i]);
    if (pm) {
      stops.push({ color: pm[1], pos: pm[2] ? parseInt(pm[2]) : (i === startIdx ? 0 : 100) });
    }
  }
  return stops.length ? { stops, angle } : null;
}

interface SlideData {
  slideType: string;
  heading?: string;
  subheading?: string;
  bodyText?: string;
  bulletPoints?: string[];
  metrics?: Array<{ label: string; value: string }>;
  teamMembers?: Array<{ name: string; role: string; bio: string }>;
  callToAction?: string;
  notes?: string;
  elements?: unknown[];
  background?: string;
}

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  accent: string;
}

function hexToRgb(hex: string): string {
  // Strip # and return 6-char hex for pptxgenjs
  return hex.replace("#", "").toUpperCase();
}

function isDark(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 < 128;
}

function addTitleSlide(pptx: PptxGenJS, slide: SlideData, colors: ThemeColors) {
  const s = pptx.addSlide();
  s.background = { fill: hexToRgb(colors.background) };
  if (slide.notes) s.addNotes(slide.notes);

  // Accent bar
  s.addShape(pptx.ShapeType.rect, {
    x: 4.1, y: 1.2, w: 1.8, h: 0.06,
    fill: { color: hexToRgb(colors.accent) },
  });

  if (slide.heading) {
    s.addText(slide.heading, {
      x: 1, y: 1.5, w: 8, h: 1.2,
      fontSize: 40, bold: true, color: hexToRgb(colors.text),
      align: "center", fontFace: "Calibri",
    });
  }
  if (slide.subheading) {
    s.addText(slide.subheading, {
      x: 1, y: 2.6, w: 8, h: 0.6,
      fontSize: 22, color: hexToRgb(colors.accent),
      align: "center", fontFace: "Calibri",
    });
  }
  if (slide.bodyText) {
    s.addText(slide.bodyText, {
      x: 1.5, y: 3.4, w: 7, h: 1,
      fontSize: 14, color: hexToRgb(colors.textSecondary),
      align: "center", fontFace: "Calibri",
    });
  }
}

function addContentSlide(pptx: PptxGenJS, slide: SlideData, colors: ThemeColors) {
  const s = pptx.addSlide();
  s.background = { fill: hexToRgb(isDark(colors.background) ? colors.background : colors.surface) };
  if (slide.notes) s.addNotes(slide.notes);

  // Accent bar
  s.addShape(pptx.ShapeType.rect, {
    x: 0.6, y: 0.6, w: 1, h: 0.06,
    fill: { color: hexToRgb(colors.accent) },
  });

  if (slide.heading) {
    s.addText(slide.heading, {
      x: 0.6, y: 0.8, w: 8.5, h: 0.7,
      fontSize: 28, bold: true, color: hexToRgb(colors.text),
      fontFace: mapFont(undefined),
    });
  }
  if (slide.bodyText) {
    s.addText(slide.bodyText, {
      x: 0.6, y: 1.6, w: 8.5, h: 0.8,
      fontSize: 14, color: hexToRgb(colors.textSecondary),
      fontFace: mapFont(undefined),
    });
  }
  if (slide.bulletPoints && slide.bulletPoints.length > 0) {
    const bullets = slide.bulletPoints.map((bp) => ({
      text: bp,
      options: {
        fontSize: 13,
        color: hexToRgb(colors.text),
        bullet: { code: "2022", color: hexToRgb(colors.accent) },
        paraSpaceAfter: 8,
      },
    }));
    s.addText(bullets as PptxGenJS.TextProps[], {
      x: 0.6, y: 2.5, w: 8.5, h: 2.5,
      fontFace: mapFont(undefined),
      valign: "top",
    });
  }
}

function addMetricsSlide(pptx: PptxGenJS, slide: SlideData, colors: ThemeColors) {
  const s = pptx.addSlide();
  s.background = { fill: hexToRgb(isDark(colors.background) ? colors.background : colors.surface) };
  if (slide.notes) s.addNotes(slide.notes);

  // Accent bar
  s.addShape(pptx.ShapeType.rect, {
    x: 0.6, y: 0.6, w: 1, h: 0.06,
    fill: { color: hexToRgb(colors.accent) },
  });

  if (slide.heading) {
    s.addText(slide.heading, {
      x: 0.6, y: 0.8, w: 8.5, h: 0.7,
      fontSize: 28, bold: true, color: hexToRgb(colors.text),
      fontFace: mapFont(undefined),
    });
  }
  if (slide.bodyText) {
    s.addText(slide.bodyText, {
      x: 0.6, y: 1.6, w: 8.5, h: 0.6,
      fontSize: 14, color: hexToRgb(colors.textSecondary),
      fontFace: mapFont(undefined),
    });
  }

  if (slide.metrics && slide.metrics.length > 0) {
    const count = Math.min(slide.metrics.length, 4);
    const cardW = (8.5 - (count - 1) * 0.3) / count;
    slide.metrics.slice(0, 4).forEach((metric, i) => {
      const x = 0.6 + i * (cardW + 0.3);
      // Card background
      s.addShape(pptx.ShapeType.roundRect, {
        x, y: 2.5, w: cardW, h: 1.8,
        fill: { color: hexToRgb(colors.surface) },
        line: { color: hexToRgb(colors.accent), width: 0.5, dashType: "solid" },
        rectRadius: 0.1,
      });
      // Value
      s.addText(metric.value, {
        x, y: 2.7, w: cardW, h: 0.8,
        fontSize: 28, bold: true, color: hexToRgb(colors.accent),
        align: "center", fontFace: "Calibri",
      });
      // Label
      s.addText(metric.label.toUpperCase(), {
        x, y: 3.5, w: cardW, h: 0.5,
        fontSize: 10, color: hexToRgb(colors.textSecondary),
        align: "center", fontFace: "Calibri",
      });
    });
  }

  // Bullet points below metrics (for "ask" slides)
  if (slide.bulletPoints && slide.bulletPoints.length > 0) {
    const bullets = slide.bulletPoints.map((bp) => ({
      text: bp,
      options: {
        fontSize: 11,
        color: hexToRgb(colors.text),
        bullet: { code: "2022", color: hexToRgb(colors.accent) },
        paraSpaceAfter: 4,
      },
    }));
    s.addText(bullets as PptxGenJS.TextProps[], {
      x: 0.6, y: 4.5, w: 8.5, h: 0.8,
      fontFace: mapFont(undefined),
      valign: "top",
    });
  }
}

function addTeamSlide(pptx: PptxGenJS, slide: SlideData, colors: ThemeColors) {
  const s = pptx.addSlide();
  s.background = { fill: hexToRgb(isDark(colors.background) ? colors.background : colors.surface) };
  if (slide.notes) s.addNotes(slide.notes);

  s.addShape(pptx.ShapeType.rect, {
    x: 0.6, y: 0.6, w: 1, h: 0.06,
    fill: { color: hexToRgb(colors.accent) },
  });

  if (slide.heading) {
    s.addText(slide.heading, {
      x: 0.6, y: 0.8, w: 8.5, h: 0.7,
      fontSize: 28, bold: true, color: hexToRgb(colors.text),
      fontFace: mapFont(undefined),
    });
  }
  if (slide.bodyText) {
    s.addText(slide.bodyText, {
      x: 0.6, y: 1.6, w: 8.5, h: 0.5,
      fontSize: 14, color: hexToRgb(colors.textSecondary),
      fontFace: mapFont(undefined),
    });
  }

  if (slide.teamMembers && slide.teamMembers.length > 0) {
    const count = Math.min(slide.teamMembers.length, 4);
    const cardW = (8.5 - (count - 1) * 0.3) / count;
    slide.teamMembers.slice(0, 4).forEach((member, i) => {
      const x = 0.6 + i * (cardW + 0.3);
      // Card
      s.addShape(pptx.ShapeType.roundRect, {
        x, y: 2.3, w: cardW, h: 2.4,
        fill: { color: hexToRgb(colors.surface) },
        line: { color: hexToRgb(colors.accent), width: 0.5, dashType: "solid" },
        rectRadius: 0.1,
      });
      // Avatar circle
      s.addShape(pptx.ShapeType.ellipse, {
        x: x + cardW / 2 - 0.35, y: 2.5, w: 0.7, h: 0.7,
        fill: { color: hexToRgb(colors.accent) },
      });
      s.addText(member.name.charAt(0), {
        x: x + cardW / 2 - 0.35, y: 2.5, w: 0.7, h: 0.7,
        fontSize: 20, bold: true, color: "FFFFFF",
        align: "center", valign: "middle", fontFace: "Calibri",
      });
      // Name
      s.addText(member.name, {
        x, y: 3.3, w: cardW, h: 0.4,
        fontSize: 14, bold: true, color: hexToRgb(colors.text),
        align: "center", fontFace: "Calibri",
      });
      // Role
      s.addText(member.role, {
        x, y: 3.65, w: cardW, h: 0.3,
        fontSize: 10, color: hexToRgb(colors.accent),
        align: "center", fontFace: "Calibri",
      });
      // Bio
      s.addText(member.bio, {
        x: x + 0.15, y: 3.95, w: cardW - 0.3, h: 0.6,
        fontSize: 8, color: hexToRgb(colors.textSecondary),
        align: "center", fontFace: "Calibri",
      });
    });
  }
}

function addClosingSlide(pptx: PptxGenJS, slide: SlideData, colors: ThemeColors) {
  const s = pptx.addSlide();
  s.background = { fill: hexToRgb(colors.background) };
  if (slide.notes) s.addNotes(slide.notes);

  s.addShape(pptx.ShapeType.rect, {
    x: 4.1, y: 1.5, w: 1.8, h: 0.06,
    fill: { color: hexToRgb(colors.accent) },
  });

  if (slide.heading) {
    s.addText(slide.heading, {
      x: 1, y: 1.8, w: 8, h: 1,
      fontSize: 36, bold: true, color: hexToRgb(colors.text),
      align: "center", fontFace: "Calibri",
    });
  }
  if (slide.bodyText) {
    s.addText(slide.bodyText, {
      x: 1.5, y: 2.9, w: 7, h: 0.8,
      fontSize: 16, color: hexToRgb(colors.textSecondary),
      align: "center", fontFace: "Calibri",
    });
  }
  if (slide.callToAction) {
    s.addShape(pptx.ShapeType.roundRect, {
      x: 2.5, y: 4, w: 5, h: 0.6,
      fill: { type: "none" } as unknown as PptxGenJS.ShapeFillProps,
      line: { color: hexToRgb(colors.accent), width: 2 },
      rectRadius: 0.3,
    });
    s.addText(slide.callToAction, {
      x: 2.5, y: 4, w: 5, h: 0.6,
      fontSize: 14, color: hexToRgb(colors.accent),
      align: "center", valign: "middle", fontFace: "Calibri",
    });
  }
}

const PPTX_W = 13.33;
const PPTX_H = 7.5;

function htmlToPlainText(html: string): string {
  if (!html.trimStart().startsWith("<")) return html;
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const SHAPE_KIND_MAP: Record<string, keyof typeof PptxGenJS.prototype.ShapeType | string> = {
  rect: "rect",
  "rounded-rect": "roundRect",
  circle: "ellipse",
  triangle: "triangle",
  diamond: "diamond",
  star: "star5",
  pentagon: "pentagon",
  hexagon: "hexagon",
  parallelogram: "parallelogram",
  "process-arrow": "rightArrow",
  cloud: "cloud",
};

function addElementsSlide(pptx: PptxGenJS, slide: SlideV2, colors: ThemeColors) {
  const s = pptx.addSlide();
  const bg = slide.background || colors.background;
  const grad = typeof bg === "string" ? parseGradient(bg) : null;
  if (grad && grad.stops.length >= 2) {
    // pptxgenjs doesn't support true gradients on slide bg; approximate with first stop
    s.background = { fill: hexToRgb(grad.stops[0].color) };
  } else if (typeof bg === "string" && bg.startsWith("#") && bg.replace("#", "").length === 6) {
    s.background = { fill: hexToRgb(bg) };
  } else {
    s.background = { fill: hexToRgb(colors.background) };
  }
  if (slide.notes) s.addNotes(slide.notes);

  for (const el of slide.elements) {
    const x = (el.x / 100) * PPTX_W;
    const y = (el.y / 100) * PPTX_H;
    const w = (el.width / 100) * PPTX_W;
    const h = (el.height / 100) * PPTX_H;

    if (el.type === "text") {
      const t = el as TextElement;
      const fontSize = t.fontSize || 16;
      const textColor =
        t.color ||
        (() => {
          switch (t.role) {
            case "metric-value":
            case "cta":
              return colors.accent;
            case "heading":
            case "subheading":
              return colors.text;
            default:
              return colors.textSecondary;
          }
        })();

      if (t.role === "bullet-group") {
        const items = htmlToPlainText(t.content).split("\n").filter(Boolean);
        const bullets = items.map((item) => ({
          text: item,
          options: {
            fontSize: Math.round(fontSize),
            color: hexToRgb(textColor),
            bullet: { code: "2022", color: hexToRgb(colors.accent) },
            paraSpaceAfter: 6,
          },
        }));
        s.addText(bullets as PptxGenJS.TextProps[], {
          x, y, w, h,
          fontFace: mapFont(t.fontFamily),
          valign: "top",
        });
      } else {
        const content = t.textTransform === "uppercase"
          ? htmlToPlainText(t.content || "").toUpperCase()
          : htmlToPlainText(t.content || "");
        s.addText(content, {
          x, y, w, h,
          fontSize: Math.round(fontSize),
          bold: t.fontWeight === "bold",
          italic: t.fontStyle === "italic",
          color: hexToRgb(textColor),
          align: (t.textAlign as PptxGenJS.HAlign) || "left",
          fontFace: mapFont(t.fontFamily),
          valign: "top",
          wrap: true,
          charSpacing: t.letterSpacing ? Math.round(t.letterSpacing * 100) : undefined,
          highlight: t.highlight ? hexToRgb(t.highlight) : undefined,
        });
      }
    } else if (el.type === "image") {
      const img = el as ImageElement;
      if (!img.imageUrl) continue;
      try {
        s.addImage({ path: img.imageUrl, x, y, w, h });
      } catch {
        // ignore
      }
    } else if (el.type === "shape") {
      const shape = el as ShapeElement;
      const fill = shape.fill || colors.primary;
      const strokeColor = shape.stroke;
      const strokeWidth = shape.strokeWidth || 0;
      const dashType: "solid" | "dash" | "sysDot" =
        shape.strokeStyle === "dashed"
          ? "dash"
          : shape.strokeStyle === "dotted"
          ? "sysDot"
          : "solid";
      const line = strokeColor && strokeWidth > 0
        ? { color: hexToRgb(strokeColor), width: strokeWidth, dashType }
        : undefined;

      if (shape.shape === "line") {
        const lineColor = strokeWidth > 0 ? strokeColor || fill : fill;
        s.addShape(pptx.ShapeType.line, {
          x, y, w, h: 0,
          line: { color: hexToRgb(lineColor), width: strokeWidth || 2 },
        });
        continue;
      }
      if (shape.shape === "arrow") {
        const arrowColor = strokeWidth > 0 ? strokeColor || fill : fill;
        s.addShape(pptx.ShapeType.rightArrow, {
          x, y, w, h: Math.max(h, 0.15),
          fill: { color: hexToRgb(arrowColor) },
          line: { color: hexToRgb(arrowColor), width: 1 },
        });
        continue;
      }

      const kind = SHAPE_KIND_MAP[shape.shape] || "rect";
      const shapeTypeMap = pptx.ShapeType as unknown as Record<string, PptxGenJS.SHAPE_NAME>;
      const shapeType = shapeTypeMap[kind] || pptx.ShapeType.rect;
      s.addShape(shapeType, {
        x, y, w, h,
        fill: { color: hexToRgb(fill) },
        line,
        rectRadius: shape.shape === "rounded-rect" ? (shape.cornerRadius || 20) / 100 : undefined,
      });
    } else if (el.type === "table") {
      const tbl = el as TableElement;
      if (!tbl.rows || tbl.rows.length === 0) continue;
      const fontSize = tbl.fontSize || 12;
      const headerFill = tbl.headerFill || colors.accent;
      const headerColor = tbl.headerColor || "#FFFFFF";
      const bodyFill = tbl.bodyFill || colors.surface;
      const bodyColor = tbl.bodyColor || colors.text;
      const tableData = tbl.rows.map((row, ri) =>
        row.map((cell) => ({
          text: cell,
          options: {
            fill: { color: hexToRgb(tbl.headerRow && ri === 0 ? headerFill : bodyFill) },
            color: hexToRgb(tbl.headerRow && ri === 0 ? headerColor : bodyColor),
            bold: tbl.headerRow && ri === 0,
            fontSize,
            fontFace: mapFont(undefined),
          },
        }))
      );
      try {
        s.addTable(tableData as PptxGenJS.TableRow[], {
          x, y, w, h,
          border: { type: "solid", color: hexToRgb(tbl.borderColor || colors.textSecondary), pt: 0.5 },
          fontSize,
        });
      } catch {
        // ignore
      }
    } else if (el.type === "chart") {
      const ch = el as ChartElement;
      const chartTypeMap: Record<string, string> = {
        bar: "bar",
        line: "line",
        area: "area",
        pie: "pie",
        donut: "doughnut",
      };
      const chartType = chartTypeMap[ch.chartKind] || "bar";
      try {
        // @ts-expect-error chart type string accepted at runtime
        s.addChart(chartType, [
          {
            name: ch.title || "Series",
            labels: ch.labels,
            values: ch.values,
          },
        ], {
          x, y, w, h,
          showLegend: ch.chartKind === "pie" || ch.chartKind === "donut",
          chartColors: (ch.colors && ch.colors.length > 0 ? ch.colors : [colors.accent, colors.primary, colors.secondary])
            .map((c) => hexToRgb(c)),
          title: ch.title || undefined,
        });
      } catch {
        // ignore
      }
    }
  }
}

export async function exportDeckToPPTX(
  title: string,
  slides: SlideData[],
  colors: ThemeColors
): Promise<void> {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 inches
  pptx.title = title;
  pptx.author = "PitchDesk";

  for (const slide of slides) {
    const anySlide = slide as AnySlide;
    // Use the new element-based export path if slide has elements[]
    const slideV2 = isSlideV2(anySlide) ? anySlide : migrateSlide(anySlide);
    if (slideV2.elements && slideV2.elements.length > 0) {
      addElementsSlide(pptx, slideV2, colors);
      continue;
    }

    // Legacy fallback (for any slide that didn't migrate)
    switch (slide.slideType) {
      case "title":
        addTitleSlide(pptx, slide, colors);
        break;
      case "closing":
        addClosingSlide(pptx, slide, colors);
        break;
      case "team":
        addTeamSlide(pptx, slide, colors);
        break;
      case "market":
      case "traction":
      case "financials":
      case "ask":
        addMetricsSlide(pptx, slide, colors);
        break;
      default:
        addContentSlide(pptx, slide, colors);
        break;
    }
  }

  await pptx.writeFile({ fileName: `${title.replace(/\s+/g, "-").toLowerCase()}.pptx` });
}
