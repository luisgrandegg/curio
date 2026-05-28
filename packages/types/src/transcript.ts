// Live transcript + agent presentation state. Mirrors MVP.md.

/** Pip's visible state, surfaced to the avatar and aria-live regions. */
export const AGENT_STATES = [
  "disconnected",
  "connecting",
  "listening",
  "thinking",
  "speaking",
] as const;
export type AgentState = (typeof AGENT_STATES)[number];

export type Participant = "tutor" | "child";

export interface TranscriptEntry {
  id: string;
  participant: Participant;
  text: string;
  /** Partial (streaming) vs finalized transcription. */
  isFinal: boolean;
  timestamp: number;
}

export const isAgentState = (value: unknown): value is AgentState =>
  typeof value === "string" &&
  (AGENT_STATES as readonly string[]).includes(value);
