import type { CreateSessionResponse } from "@curio/types";

// Carries the LiveKit connection details from `/review` to `/quiz`. Ephemeral.
const KEY = "curio.session";

export function saveSession(session: CreateSessionResponse): void {
  sessionStorage.setItem(KEY, JSON.stringify(session));
}

export function loadSession(): CreateSessionResponse | null {
  const raw = sessionStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as CreateSessionResponse) : null;
}

export function clearSession(): void {
  sessionStorage.removeItem(KEY);
}
