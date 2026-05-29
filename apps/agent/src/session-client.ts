import type { SessionState } from "@curio/types";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3001";

/** Fetch the quiz session (room name = sessionId) so Pip can read its lesson. */
export async function fetchSession(sessionId: string): Promise<SessionState> {
  const res = await fetch(`${API_BASE_URL}/sessions/${sessionId}`);
  if (!res.ok) {
    throw new Error(`Failed to load session ${sessionId} (${res.status})`);
  }
  return (await res.json()) as SessionState;
}
