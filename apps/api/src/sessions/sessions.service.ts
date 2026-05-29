import { randomUUID } from "node:crypto";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type {
  CreateSessionResponse,
  ScorecardEntry,
  SessionState,
} from "@curio/types";
import { LessonsStore } from "../lessons/lessons.store.js";
import {
  TOKEN_MINTER,
  type TokenMinter,
} from "./livekit/token-minter.interface.js";
import { SessionsStore } from "./sessions.store.js";

@Injectable()
export class SessionsService {
  constructor(
    private readonly lessons: LessonsStore,
    private readonly sessions: SessionsStore,
    @Inject(TOKEN_MINTER) private readonly tokens: TokenMinter,
  ) {}

  async create(lessonId: string): Promise<CreateSessionResponse> {
    const lesson = this.lessons.get(lessonId);
    if (!lesson) throw new NotFoundException("Lesson not found");

    const sessionId = randomUUID();
    // Room name = sessionId so the agent can fetch the session it joined.
    const identity = `child-${sessionId}`;
    const { token, url } = await this.tokens.mint(sessionId, identity);

    const scorecard: ScorecardEntry[] = lesson.concepts.map((concept) => ({
      conceptId: concept.id,
      status: "pending",
      attempts: 0,
    }));
    this.sessions.create({
      sessionId,
      status: "active",
      lesson,
      scorecard,
      transcript: [],
      summary: null,
    });

    return {
      sessionId,
      roomName: sessionId,
      livekitToken: token,
      livekitUrl: url,
    };
  }

  getOrThrow(id: string): SessionState {
    const state = this.sessions.get(id);
    if (!state) throw new NotFoundException("Session not found");
    return state;
  }

  // PROD/B11: persist the agent-generated study summary on end.
  end(id: string): SessionState {
    const state = this.getOrThrow(id);
    state.status = "ended";
    return state;
  }
}
