import type { CreateSessionResponse } from "@curio/types";
import { beforeEach, describe, expect, it } from "vitest";
import { clearSession, loadSession, saveSession } from "./session-store";

const session: CreateSessionResponse = {
  sessionId: "s1",
  roomName: "s1",
  livekitToken: "jwt",
  livekitUrl: "wss://lk",
};

describe("session-store", () => {
  beforeEach(() => sessionStorage.clear());

  it("returns null when nothing is stored", () => {
    expect(loadSession()).toBeNull();
  });

  it("round-trips a saved session", () => {
    saveSession(session);
    expect(loadSession()).toEqual(session);
  });

  it("clears the stored session", () => {
    saveSession(session);
    clearSession();
    expect(loadSession()).toBeNull();
  });
});
