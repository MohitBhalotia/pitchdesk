/** Phase 4 (plans/RAG_feature.md) memory bounds -- keep prompts/storage bounded regardless of transcript length. */
export const MAX_TRANSCRIPT_CHARS_FOR_EXTRACTION = 20_000;
export const MAX_ITEMS_PER_MEMORY_CATEGORY = 8;
export const MAX_MEMORY_SUMMARY_CHARS = 1500;
export const MAX_MEMORY_DIGEST_CHARS = 1200;
/** How many of a room's most recent memories feed the digest -- keeps digest generation itself bounded. */
export const MAX_MEMORIES_PER_DIGEST = 8;
