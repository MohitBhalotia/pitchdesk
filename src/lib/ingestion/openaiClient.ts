import OpenAI from "openai";

declare global {
  var __pitchdeskOpenAI: OpenAI | undefined;
}

export function getOpenAIClient(): OpenAI {
  if (!global.__pitchdeskOpenAI) {
    global.__pitchdeskOpenAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return global.__pitchdeskOpenAI;
}
