import { Injectable } from "@nestjs/common";
import type { SessionState } from "@curio/types";

/** In-memory quiz-session state. `// PROD:` real persistence + TTL/eviction. */
@Injectable()
export class SessionsStore {
  private readonly sessions = new Map<string, SessionState>();

  create(state: SessionState): SessionState {
    this.sessions.set(state.sessionId, state);
    return state;
  }

  get(id: string): SessionState | undefined {
    return this.sessions.get(id);
  }
}
