"use client";

import { useVoiceAssistant } from "@livekit/components-react";
import type { TrackReference } from "@livekit/components-react";
import type { AgentState } from "@curio/types";
import { normalizeAgentState } from "../lib/agent-state";

export interface AgentPresence {
  state: AgentState;
  audioTrack: TrackReference | undefined;
}

/** Pip's normalized state + audio track, from the LiveKit voice assistant. */
export function useAgentState(): AgentPresence {
  const { state, audioTrack } = useVoiceAssistant();
  return { state: normalizeAgentState(state), audioTrack };
}
