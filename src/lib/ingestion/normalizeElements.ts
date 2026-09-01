import type { NormalizedElement, UnstructuredElement } from "./types";

const DROPPED_TYPES = new Set(["Footer", "PageBreak"]);

const TYPE_MAP: Record<string, ChunkElementType> = {
  Title: "heading",
  Header: "heading",
  Table: "table",
  Image: "image_caption",
  FigureCaption: "image_caption",
};

function mapElementType(rawType: string): ChunkElementType {
  return TYPE_MAP[rawType] ?? "paragraph";
}

function buildLocator(metadata: UnstructuredElement["metadata"]): string | null {
  if (!metadata) return null;
  if (typeof metadata.page_name === "string" && metadata.page_name.length > 0) {
    return `Sheet ${metadata.page_name}`;
  }
  if (typeof metadata.page_number === "number") {
    return `Page ${metadata.page_number}`;
  }
  return null;
}

function collapseWhitespace(text: string): string {
  return text.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

/**
 * Normalizes raw Unstructured elements per Section 2 of
 * plans/RAG_feature.md: strips headers/footers/repeated furniture,
 * collapses whitespace, drops empty/duplicate elements, and maps to our
 * canonical element type before chunking.
 */
export function normalizeElements(elements: UnstructuredElement[]): NormalizedElement[] {
  const cleaned = elements
    .filter((el) => !DROPPED_TYPES.has(el.type))
    .map((el) => ({
      ...el,
      text: collapseWhitespace(el.text ?? ""),
    }))
    .filter((el) => el.text.length > 0);

  // Detect repeated furniture (running headers/titles that appear on most
  // pages/slides verbatim) by counting how many distinct locators each exact
  // text string appears on.
  const locatorsByText = new Map<string, Set<string>>();
  for (const el of cleaned) {
    const locator = buildLocator(el.metadata) ?? "";
    if (!locatorsByText.has(el.text)) {
      locatorsByText.set(el.text, new Set());
    }
    locatorsByText.get(el.text)!.add(locator);
  }

  const distinctLocatorCount = new Set(
    cleaned.map((el) => buildLocator(el.metadata) ?? "")
  ).size;

  const isFurniture = (text: string): boolean => {
    if (distinctLocatorCount < 3) return false;
    const occurrences = locatorsByText.get(text)?.size ?? 0;
    return occurrences >= 3 && occurrences / distinctLocatorCount >= 0.4;
  };

  const result: NormalizedElement[] = [];
  let previousText: string | null = null;

  for (const el of cleaned) {
    if (isFurniture(el.text)) continue;
    if (el.text === previousText) continue; // drop consecutive exact duplicates

    result.push({
      elementType: mapElementType(el.type),
      text: el.text,
      locator: buildLocator(el.metadata),
      ...(el.type === "Table" && el.metadata?.text_as_html
        ? { html: el.metadata.text_as_html }
        : {}),
    });
    previousText = el.text;
  }

  return result;
}
