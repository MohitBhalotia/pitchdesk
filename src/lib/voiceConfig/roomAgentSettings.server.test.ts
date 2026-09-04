import { describe, it, expect } from "vitest";
import { buildRoomAgentSettings, type RoomAgentSettingsInput } from "./roomAgentSettings.server";

function baseInput(overrides: Partial<RoomAgentSettingsInput> = {}): RoomAgentSettingsInput {
  return {
    agent: {
      name: "Maya Shah",
      voice: "aura-asteria-en",
      systemPrompt: "You are Maya Shah, a balanced strategic validator.",
      firstMessage: "Hey, good to see you back.",
    },
    room: { name: "My Startup Room", practiceFocus: null },
    knowledgeBase: null,
    roomToolSessionToken: "signed.jwt.token",
    baseUrl: "https://app.pitchdesk.in",
    ...overrides,
  };
}

describe("buildRoomAgentSettings", () => {
  it("never truncates the agent persona, even when huge", () => {
    const hugePersona = "P".repeat(10_000);
    const settings = buildRoomAgentSettings(
      baseInput({ agent: { ...baseInput().agent, systemPrompt: hugePersona } })
    );
    expect(settings.agent.think.prompt).toContain(hugePersona);
  });

  it("truncates the startup brief to its character budget", () => {
    const longBrief = "B".repeat(5000);
    const settings = buildRoomAgentSettings(
      baseInput({ knowledgeBase: { startupBrief: longBrief, contradictions: [] } })
    );
    const briefSection = settings.agent.think.prompt.split("What you already know")[1];
    expect(briefSection.length).toBeLessThan(2100);
  });

  it("omits the practice-focus section when not set, includes it when set", () => {
    const without = buildRoomAgentSettings(baseInput());
    expect(without.agent.think.prompt).not.toContain("wants you to focus");

    const withFocus = buildRoomAgentSettings(
      baseInput({ room: { name: "Room", practiceFocus: "Grill me on unit economics" } })
    );
    expect(withFocus.agent.think.prompt).toContain("Grill me on unit economics");
  });

  it("includes contradiction notes, truncated to budget, when present", () => {
    const settings = buildRoomAgentSettings(
      baseInput({
        knowledgeBase: {
          startupBrief: null,
          contradictions: [{ metric: "ARR", period: "2025", note: "Two different ARR figures found" }],
        },
      })
    );
    expect(settings.agent.think.prompt).toContain("Two different ARR figures found");
  });

  it("omits the memory-digest section when absent, includes it (truncated) when present", () => {
    const without = buildRoomAgentSettings(baseInput());
    expect(without.agent.think.prompt).not.toContain("remember from previous sessions");

    const digest = "D".repeat(2000);
    const withDigest = buildRoomAgentSettings(baseInput({ memoryDigest: digest }));
    expect(withDigest.agent.think.prompt).toContain("remember from previous sessions");
    const digestSection = withDigest.agent.think.prompt.split("remember from previous sessions")[1];
    expect(digestSection.length).toBeLessThan(1300);
  });

  it("attaches exactly the three read-only room tools with the bearer token in their headers", () => {
    const settings = buildRoomAgentSettings(baseInput());
    const functions = settings.agent.think.functions;

    expect(functions).toHaveLength(3);
    expect(functions.map((f) => f.name)).toEqual([
      "search_knowledge_base",
      "get_startup_metrics",
      "search_previous_pitch_memory",
    ]);
    for (const fn of functions) {
      expect(fn.endpoint.url).toBe(`https://app.pitchdesk.in/api/pitch-rooms/tools/${fn.name.replace(/_/g, "-")}`);
      expect(fn.endpoint.headers.Authorization).toBe("Bearer signed.jwt.token");
      expect(fn.endpoint.method).toBe("POST");
    }
  });

  it("uses the deepgram TTS provider with the agent's voice (room agents have no vcId)", () => {
    const settings = buildRoomAgentSettings(baseInput());
    expect(settings.agent.speak.provider).toEqual({ type: "deepgram", model: "aura-asteria-en" });
  });

  it("uses the agent's firstMessage as the greeting", () => {
    const settings = buildRoomAgentSettings(baseInput());
    expect(settings.agent.greeting).toBe("Hey, good to see you back.");
  });
});
