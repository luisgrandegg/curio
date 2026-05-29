import type { SessionState } from "@curio/types";
import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchSession } from "./session-client.js";

const state: SessionState = {
  sessionId: "s1",
  status: "active",
  lesson: {
    id: "l1",
    topicTitle: "Adding",
    summary: "We add.",
    subject: "maths",
    childAge: 9,
    concepts: [{ id: "c1", label: "L", detail: "D" }],
  },
  scorecard: [],
  transcript: [],
  summary: null,
};

afterEach(() => vi.restoreAllMocks());

describe("fetchSession", () => {
  it("requests the session by id and returns its state", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: () => Promise.resolve(state) });
    vi.stubGlobal("fetch", fetchMock);

    const result = await fetchSession("s1");

    expect(result).toEqual(state);
    expect(String(fetchMock.mock.calls[0]![0])).toMatch(/\/sessions\/s1$/);
  });

  it("throws when the session can't be loaded", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 404 }),
    );
    await expect(fetchSession("missing")).rejects.toThrow(/Failed to load/);
  });
});
