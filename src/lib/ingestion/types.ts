/** Raw element as returned by Unstructured's partition API (Auto strategy). */
export interface UnstructuredElement {
  type: string;
  text: string;
  metadata?: {
    page_number?: number;
    page_name?: string;
    text_as_html?: string;
    [key: string]: unknown;
  };
}

/** After normalizeElements: furniture stripped, type mapped to our enum. */
export interface NormalizedElement {
  elementType: ChunkElementType;
  text: string;
  locator: string | null;
  /** Present only for elementType "table" — preserves table structure for the chunker. */
  html?: string;
}

/** One chunk ready to embed and store as a KnowledgeChunk. */
export interface ChunkCandidate {
  elementType: ChunkElementType;
  text: string;
  locator: string | null;
  chunkIndex: number;
  tokenCount: number;
}
