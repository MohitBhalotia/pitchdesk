export interface GenericAgentSettingsInput {
  vcId?: string | null;
  voice: string;
  systemPrompt: string;
  firstMessage: string;
}

/**
 * Builds the Deepgram Voice Agent `Settings` payload for the generic
 * (non-room) flow. Extracted from `stsConfig` in `src/lib/constants.ts`
 * verbatim — output must stay byte-for-byte identical, since this is the
 * regression baseline every existing session (practice, competition,
 * incubation) still relies on. Room sessions get their own builder
 * (`src/lib/voiceConfig/roomAgentSettings.server.ts`, implemented in Phase 3)
 * rather than branching inside this one.
 */
export function buildGenericAgentSettings(agent: GenericAgentSettingsInput) {
  const tts = agent.vcId
    ? {
        type: "cartesia" as const,
        model_id: "sonic-3",
        voice: {
          mode: "id" as const,
          id: agent.voice,
        },
        language: "en",
      }
    : { type: "deepgram" as const, model: agent.voice };

  return {
    type: "Settings" as const,
    audio: {
      input: {
        encoding: "linear16",
        sample_rate: 16000,
      },
      output: {
        encoding: "linear16",
        sample_rate: 24000,
        container: "none",
      },
    },
    agent: {
      language: "en",
      listen: {
        provider: {
          type: "deepgram" as const,
          model: "nova-3",
          smart_format: true,
        },
      },
      speak: {
        provider: tts,
      },
      think: {
        provider: {
          type: "open_ai" as const,
          model: "gpt-4o",
        },
        prompt: agent.systemPrompt,
      },
      greeting: agent.firstMessage,
    },
  };
}
