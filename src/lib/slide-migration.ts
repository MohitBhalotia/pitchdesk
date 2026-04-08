import { v4 as uuid } from "uuid";
import {
  AnySlide,
  ElementRole,
  ImageElement,
  LegacySlide,
  SlideElement,
  SlideV2,
  TextElement,
  isSlideV2,
} from "@/types/slide-elements";
import { layoutPresets } from "@/data/layout-presets";

// ─── Default layout positions per slide type ─────────────────────────────────
// All values are percentages of 1280×720

const CONTENT_SLIDES = [
  "problem",
  "solution",
  "product",
  "competition",
  "business_model",
];
const METRICS_SLIDES = ["market", "traction", "financials", "ask"];

function makeText(
  role: TextElement["role"],
  content: string,
  x: number,
  y: number,
  w: number,
  h: number,
  overrides: Partial<TextElement> = {}
): TextElement {
  return {
    id: uuid(),
    type: "text",
    role,
    content,
    x,
    y,
    width: w,
    height: h,
    ...overrides,
  };
}

function titleElements(slide: LegacySlide): SlideElement[] {
  const els: SlideElement[] = [];
  if (slide.heading) {
    els.push(
      makeText("heading", slide.heading, 10, 28, 80, 16, {
        fontSize: 48,
        fontWeight: "bold",
        textAlign: "center",
      })
    );
  }
  if (slide.subheading) {
    els.push(
      makeText("subheading", slide.subheading, 15, 46, 70, 10, {
        fontSize: 24,
        textAlign: "center",
      })
    );
  }
  if (slide.bodyText) {
    els.push(
      makeText("body", slide.bodyText, 15, 58, 70, 12, {
        fontSize: 16,
        textAlign: "center",
      })
    );
  }
  return els;
}

function contentElements(slide: LegacySlide): SlideElement[] {
  const els: SlideElement[] = [];
  if (slide.heading) {
    els.push(
      makeText("heading", slide.heading, 5, 8, 90, 12, {
        fontSize: 32,
        fontWeight: "bold",
      })
    );
  }
  if (slide.subheading) {
    els.push(
      makeText("subheading", slide.subheading, 5, 21, 90, 8, { fontSize: 20 })
    );
  }
  if (slide.bodyText) {
    const hasPoints = slide.bulletPoints && slide.bulletPoints.length > 0;
    els.push(
      makeText("body", slide.bodyText, 5, 22, 90, hasPoints ? 12 : 60, {
        fontSize: 18,
      })
    );
  }
  if (slide.bulletPoints && slide.bulletPoints.length > 0) {
    const startY = slide.bodyText ? 38 : 22;
    els.push(
      makeText(
        "bullet-group",
        slide.bulletPoints.join("\n"),
        5,
        startY,
        90,
        58 - (startY - 38),
        { fontSize: 16 }
      )
    );
  }
  return els;
}

function metricsElements(slide: LegacySlide): SlideElement[] {
  const els: SlideElement[] = [];
  if (slide.heading) {
    els.push(
      makeText("heading", slide.heading, 5, 8, 90, 12, {
        fontSize: 32,
        fontWeight: "bold",
      })
    );
  }
  if (slide.subheading) {
    els.push(
      makeText("subheading", slide.subheading, 5, 21, 90, 8, { fontSize: 20 })
    );
  }
  if (slide.bodyText) {
    els.push(
      makeText("body", slide.bodyText, 5, 22, 90, 10, { fontSize: 18 })
    );
  }
  if (slide.bulletPoints && slide.bulletPoints.length > 0) {
    els.push(
      makeText("bullet-group", slide.bulletPoints.join("\n"), 5, 35, 90, 30, {
        fontSize: 16,
      })
    );
  }
  if (slide.metrics && slide.metrics.length > 0) {
    const count = Math.min(slide.metrics.length, 4);
    const cardW = count > 0 ? Math.floor(90 / count) - 2 : 20;
    const gap = count > 1 ? (90 - cardW * count) / (count - 1) : 0;
    slide.metrics.slice(0, 4).forEach((m, i) => {
      const xPos = 5 + i * (cardW + gap);
      els.push(
        makeText("metric-value", m.value, xPos, 42, cardW, 20, {
          fontSize: 36,
          fontWeight: "bold",
          textAlign: "center",
        })
      );
      els.push(
        makeText("metric-label", m.label, xPos, 64, cardW, 12, {
          fontSize: 14,
          textAlign: "center",
        })
      );
    });
  }
  return els;
}

function teamElements(slide: LegacySlide): SlideElement[] {
  const els: SlideElement[] = [];
  if (slide.heading) {
    els.push(
      makeText("heading", slide.heading, 5, 8, 90, 12, {
        fontSize: 32,
        fontWeight: "bold",
      })
    );
  }
  if (slide.bodyText) {
    els.push(
      makeText("body", slide.bodyText, 5, 22, 90, 8, { fontSize: 18 })
    );
  }
  if (slide.teamMembers && slide.teamMembers.length > 0) {
    const count = Math.min(slide.teamMembers.length, 4);
    const cardW = count > 0 ? Math.floor(90 / count) - 2 : 20;
    const gap = count > 1 ? (90 - cardW * count) / (count - 1) : 0;
    slide.teamMembers.slice(0, 4).forEach((member, i) => {
      const xPos = 5 + i * (cardW + gap);
      const content = [member.name, member.role, member.bio]
        .filter(Boolean)
        .join("\n");
      els.push(makeText("team-card", content, xPos, 32, cardW, 58));
    });
  } else if (slide.bulletPoints && slide.bulletPoints.length > 0) {
    els.push(
      makeText("bullet-group", slide.bulletPoints.join("\n"), 5, 32, 90, 55, {
        fontSize: 16,
      })
    );
  }
  return els;
}

function closingElements(slide: LegacySlide): SlideElement[] {
  const els: SlideElement[] = [];
  if (slide.heading) {
    els.push(
      makeText("heading", slide.heading, 10, 25, 80, 16, {
        fontSize: 44,
        fontWeight: "bold",
        textAlign: "center",
      })
    );
  }
  if (slide.subheading) {
    els.push(
      makeText("subheading", slide.subheading, 15, 43, 70, 10, {
        fontSize: 20,
        textAlign: "center",
      })
    );
  }
  if (slide.bodyText) {
    els.push(
      makeText("body", slide.bodyText, 15, 44, 70, 12, {
        fontSize: 18,
        textAlign: "center",
      })
    );
  }
  if (slide.callToAction) {
    els.push(
      makeText("cta", slide.callToAction, 30, 62, 40, 10, {
        fontSize: 18,
        textAlign: "center",
        fontWeight: "bold",
      })
    );
  } else if (slide.bulletPoints && slide.bulletPoints.length > 0) {
    els.push(
      makeText("bullet-group", slide.bulletPoints.join("\n"), 10, 60, 80, 28, {
        fontSize: 16,
        textAlign: "center",
      })
    );
  }
  return els;
}

// ─── Main migration function ──────────────────────────────────────────────────

export function migrateSlide(slide: AnySlide): SlideV2 {
  if (isSlideV2(slide)) return slide;

  const legacy = slide as LegacySlide;
  let elements: SlideElement[] = [];

  if (legacy.slideType === "title") {
    elements = titleElements(legacy);
  } else if (legacy.slideType === "closing") {
    elements = closingElements(legacy);
  } else if (legacy.slideType === "team") {
    elements = teamElements(legacy);
  } else if (METRICS_SLIDES.includes(legacy.slideType)) {
    elements = metricsElements(legacy);
  } else {
    // problem, solution, product, competition, business_model, and unknown types
    elements = contentElements(legacy);
  }

  // Migrate legacy images[] → ImageElement[]
  if (legacy.images && legacy.images.length > 0) {
    const imageEls: ImageElement[] = legacy.images.map((img) => ({
      id: uuid(),
      type: "image",
      imageUrl: img.url,
      imagePublicId: img.publicId,
      x: img.x,
      y: img.y,
      width: img.width,
      height: img.height,
      zIndex: 10,
      objectFit: "contain",
    }));
    elements = [...elements, ...imageEls];
  }

  return {
    slideType: legacy.slideType,
    order: legacy.order ?? 0,
    elements,
    notes: legacy.notes,
  };
}

export function migrateDeck(slides: AnySlide[]): SlideV2[] {
  return slides.map(migrateSlide);
}

// ─── Default elements for blank new slides ────────────────────────────────────

export function createDefaultElements(slideType: string): SlideElement[] {
  const placeholder: LegacySlide = {
    slideType,
    order: 0,
    heading: "Slide Title",
    bodyText:
      slideType === "title" || slideType === "closing"
        ? "Your message here"
        : "Add your content here",
    bulletPoints:
      CONTENT_SLIDES.includes(slideType) || METRICS_SLIDES.includes(slideType)
        ? ["Key point one", "Key point two", "Key point three"]
        : undefined,
    metrics:
      METRICS_SLIDES.includes(slideType)
        ? [
            { label: "Metric 1", value: "0" },
            { label: "Metric 2", value: "0" },
            { label: "Metric 3", value: "0" },
            { label: "Metric 4", value: "0" },
          ]
        : undefined,
    teamMembers:
      slideType === "team"
        ? [
            {
              name: "Team Member",
              role: "Role / Title",
              bio: "Brief background",
            },
          ]
        : undefined,
    callToAction: slideType === "closing" ? "Get in Touch" : undefined,
  };
  return migrateSlide(placeholder).elements;
}


export function applyLayoutPreset(
  slide: SlideV2,
  presetId: string,
  preserveContent = true
): SlideV2 {
  const preset = layoutPresets.find((p) => p.id === presetId);
  if (!preset) return slide;

  const newElements = preset.createElements();

  if (preserveContent) {
    const oldByRole = new Map<ElementRole, TextElement>();
    for (const e of slide.elements) {
      if (e.type === "text" && (e as TextElement).role) {
        oldByRole.set((e as TextElement).role!, e as TextElement);
      }
    }
    for (const el of newElements) {
      if (el.type === "text") {
        const tel = el as TextElement;
        if (tel.role) {
          const existing = oldByRole.get(tel.role);
          if (existing?.content) tel.content = existing.content;
        }
      }
    }
  }

  return { ...slide, elements: newElements };
}
