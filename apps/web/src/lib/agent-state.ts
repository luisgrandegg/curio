import type { AgentState } from "@curio/types";

/** Map LiveKit's voice-assistant state to our kid-facing `AgentState`. */
export function normalizeAgentState(raw: string): AgentState {
  switch (raw) {
    case "listening":
    case "idle": // connected and waiting for the child — show as listening
      return "listening";
    case "thinking":
      return "thinking";
    case "speaking":
      return "speaking";
    case "connecting":
    case "initializing":
    case "pre-connect-buffering":
      return "connecting";
    default:
      return "disconnected";
  }
}

const LABELS: Record<AgentState, string> = {
  disconnected: "Pip is getting ready…",
  connecting: "Pip is waking up…",
  listening: "Pip is listening!",
  thinking: "Pip is thinking…",
  speaking: "Pip is talking!",
};

/** A warm, simple label a young child can read or hear. */
export function agentStateLabel(state: AgentState): string {
  return LABELS[state];
}
