import { NotFoundException } from "@nestjs/common";
import type { LessonResponse } from "@curio/types";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LessonsStore } from "../lessons/lessons.store.js";
import type { TokenMinter } from "./livekit/token-minter.interface.js";
import { SessionsService } from "./sessions.service.js";
import { SessionsStore } from "./sessions.store.js";

const lesson: LessonResponse = {
  id: "lesson-1",
  topicTitle: "Adding",
  summary: "We add numbers.",
  subject: "maths",
  childAge: 9,
  concepts: [
    { id: "c1", label: "L1", detail: "D1" },
    { id: "c2", label: "L2", detail: "D2" },
  ],
};

describe("SessionsService", () => {
  let lessons: LessonsStore;
  let sessions: SessionsStore;
  let tokens: TokenMinter;
  let service: SessionsService;

  beforeEach(() => {
    lessons = new LessonsStore();
    sessions = new SessionsStore();
    tokens = {
      mint: vi.fn().mockResolvedValue({ token: "jwt", url: "wss://lk" }),
    };
    service = new SessionsService(lessons, sessions, tokens);
  });

  it("creates a session: mints a token and seeds a pending scorecard", async () => {
    const stored = lessons.save(lesson); // store assigns its own id

    const res = await service.create(stored.id);

    expect(res.roomName).toBe(res.sessionId);
    expect(res.livekitToken).toBe("jwt");
    expect(res.livekitUrl).toBe("wss://lk");
    expect(tokens.mint).toHaveBeenCalledWith(
      res.sessionId,
      `child-${res.sessionId}`,
    );

    const state = service.getOrThrow(res.sessionId);
    expect(state.status).toBe("active");
    expect(state.scorecard).toHaveLength(2);
    expect(state.scorecard.every((e) => e.status === "pending")).toBe(true);
    expect(state.summary).toBeNull();
  });

  it("throws NotFound when the lesson is unknown", async () => {
    await expect(service.create("missing")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("throws NotFound when getting an unknown session", () => {
    expect(() => service.getOrThrow("nope")).toThrow(NotFoundException);
  });

  it("marks a session ended", async () => {
    const stored = lessons.save(lesson);
    const { sessionId } = await service.create(stored.id);
    expect(service.end(sessionId).status).toBe("ended");
  });
});
