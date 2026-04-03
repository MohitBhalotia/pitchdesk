import PptxGenJS from "pptxgenjs";

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
      fontFace: "Calibri",
    });
  }
  if (slide.bodyText) {
    s.addText(slide.bodyText, {
      x: 0.6, y: 1.6, w: 8.5, h: 0.8,
      fontSize: 14, color: hexToRgb(colors.textSecondary),
      fontFace: "Calibri",
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
      fontFace: "Calibri",
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
      fontFace: "Calibri",
    });
  }
  if (slide.bodyText) {
    s.addText(slide.bodyText, {
      x: 0.6, y: 1.6, w: 8.5, h: 0.6,
      fontSize: 14, color: hexToRgb(colors.textSecondary),
      fontFace: "Calibri",
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
      fontFace: "Calibri",
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
      fontFace: "Calibri",
    });
  }
  if (slide.bodyText) {
    s.addText(slide.bodyText, {
      x: 0.6, y: 1.6, w: 8.5, h: 0.5,
      fontSize: 14, color: hexToRgb(colors.textSecondary),
      fontFace: "Calibri",
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
