import type { UnstructuredElement } from "./types";

/**
 * Parses a document with Unstructured's Auto strategy (Section 1/9): simple
 * pages go through fast extraction, complex pages through layout/OCR/vision
 * processing, all decided by Unstructured itself. Called over plain HTTP --
 * no SDK dependency, per Section 4.
 */
export async function parseDocumentWithUnstructured(
  fileBuffer: Buffer,
  fileName: string
): Promise<UnstructuredElement[]> {
  const apiUrl = process.env.UNSTRUCTURED_API_URL ?? "https://api.unstructuredapp.io";
  const apiKey = process.env.UNSTRUCTURED_API_KEY;
  if (!apiKey) {
    throw new Error("UNSTRUCTURED_API_KEY is not configured");
  }

  const form = new FormData();
  form.append("files", new Blob([new Uint8Array(fileBuffer)]), fileName);
  form.append("strategy", "auto");

  const response = await fetch(`${apiUrl.replace(/\/$/, "")}/general/v0/general`, {
    method: "POST",
    headers: { "unstructured-api-key": apiKey },
    body: form,
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Unstructured API error ${response.status}: ${body.slice(0, 500)}`);
  }

  return (await response.json()) as UnstructuredElement[];
}
