import { describe, it, expect } from "vitest";
import { normalizeElements } from "./normalizeElements";
import type { UnstructuredElement } from "./types";

function page(n: number, type: string, text: string): UnstructuredElement {
  return { type, text, metadata: { page_number: n } };
}

describe("normalizeElements", () => {
  it("drops Footer and PageBreak elements outright", () => {
    const result = normalizeElements([
      page(1, "Footer", "Confidential — do not distribute"),
      page(1, "PageBreak", ""),
      page(1, "NarrativeText", "Real content here."),
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].text).toBe("Real content here.");
  });

  it("drops empty/whitespace-only elements", () => {
    const result = normalizeElements([page(1, "NarrativeText", "   \n  ")]);
    expect(result).toHaveLength(0);
  });

  it("maps element types to the canonical enum", () => {
    const result = normalizeElements([
      page(1, "Title", "Section heading"),
      page(1, "NarrativeText", "Body text"),
      page(1, "Table", "row1 | row2"),
      page(1, "FigureCaption", "Figure 1: growth chart"),
      page(1, "SomeUnknownType", "fallback text"),
    ]);

    expect(result.map((el) => el.elementType)).toEqual([
      "heading",
      "paragraph",
      "table",
      "image_caption",
      "paragraph",
    ]);
  });

  it("removes repeated running-header furniture across many pages", () => {
    const elements: UnstructuredElement[] = [];
    for (let i = 1; i <= 6; i++) {
      elements.push(page(i, "Header", "Acme Pitch Deck 2026"));
      elements.push(page(i, "NarrativeText", `Unique content for page ${i}`));
    }

    const result = normalizeElements(elements);

    expect(result.every((el) => el.text !== "Acme Pitch Deck 2026")).toBe(true);
    expect(result).toHaveLength(6);
  });

  it("keeps a one-off heading that doesn't repeat across pages", () => {
    const result = normalizeElements([
      page(1, "Title", "Executive Summary"),
      page(1, "NarrativeText", "We are building the future."),
    ]);

    expect(result.map((el) => el.text)).toContain("Executive Summary");
  });

  it("drops consecutive exact-duplicate elements", () => {
    const result = normalizeElements([
      page(1, "NarrativeText", "Same line"),
      page(1, "NarrativeText", "Same line"),
      page(1, "NarrativeText", "Different line"),
    ]);

    expect(result).toHaveLength(2);
  });

  it("builds a sheet locator for spreadsheet elements", () => {
    const result = normalizeElements([
      { type: "Table", text: "revenue table", metadata: { page_name: "Financials" } },
    ]);

    expect(result[0].locator).toBe("Sheet Financials");
  });

  it("preserves text_as_html on table elements", () => {
    const result = normalizeElements([
      {
        type: "Table",
        text: "Q1 | 100k",
        metadata: { page_number: 3, text_as_html: "<table><tr><td>Q1</td></tr></table>" },
      },
    ]);

    expect(result[0].html).toBe("<table><tr><td>Q1</td></tr></table>");
  });
});
