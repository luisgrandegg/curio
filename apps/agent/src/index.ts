// Placeholder entry for the Curio "Pip" agent worker.
// PROD/B07: replaced by the LiveKit worker (defineAgent) + provider factory.
import type { AgentState } from "@curio/types";

const INITIAL_STATE: AgentState = "disconnected";

export const agentPlaceholder = (): string =>
  `Curio agent placeholder (${INITIAL_STATE}) — LiveKit worker lands in B07.`;
