import { describe, it, expect } from "vitest";
import { buildGenericAgentSettings } from "./genericAgentSettings";

describe("buildGenericAgentSettings (generic flow regression baseline)", () => {
  it("builds a deepgram-voice Settings payload for an agent with no vcId", () => {
    const settings = buildGenericAgentSettings({
      vcId: null,
      voice: "aura-asteria-en",
      systemPrompt: "You are a VC.",
      firstMessage: "Hi, tell me about your startup.",
    });

    expect(settings).toEqual({
      type: "Settings",
      audio: {
        input: { encoding: "linear16", sample_rate: 16000 },
        output: { encoding: "linear16", sample_rate: 24000, container: "none" },
      },
      agent: {
        language: "en",
        listen: {
          provider: { type: "deepgram", model: "nova-3", smart_format: true },
        },
        speak: {
          provider: { type: "deepgram", model: "aura-asteria-en" },
        },
        think: {
          provider: { type: "open_ai", model: "gpt-4o" },
          prompt: "You are a VC.",
        },
        greeting: "Hi, tell me about your startup.",
      },
    });
  });

  it("builds a cartesia-voice Settings payload for a VC-owned agent", () => {
    const settings = buildGenericAgentSettings({
      vcId: "vc-123",
      voice: "cartesia-voice-id",
      systemPrompt: "You are a sharp VC.",
      firstMessage: "Walk me through your pitch.",
    });

    expect(settings.agent.speak.provider).toEqual({
      type: "cartesia",
      model_id: "sonic-3",
      voice: { mode: "id", id: "cartesia-voice-id" },
      language: "en",
    });
    expect(settings.type).toBe("Settings");
    expect(settings.agent.think).toEqual({
      provider: { type: "open_ai", model: "gpt-4o" },
      prompt: "You are a sharp VC.",
    });
  });
});
