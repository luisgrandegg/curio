import type { CreateSessionResponse, LessonResponse } from "@curio/types";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  SESSION_START_MESSAGE,
  UNREADABLE_MESSAGE,
  createLesson,
  createSession,
  endSession,
} from "./api-client";

const lesson: LessonResponse = {
  id: "l1",
  topicTitle: "Adding",
  summary: "We add numbers.",
  subject: "maths",
  childAge: 9,
  concepts: [{ id: "c1", label: "L", detail: "D" }],
};

const file = new File(["bytes"], "page.jpg", { type: "image/jpeg" });

afterEach(() => vi.restoreAllMocks());

describe("createLesson", () => {
  it("posts multipart form data and returns the lesson", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: () => Promise.resolve(lesson) });
    vi.stubGlobal("fetch", fetchMock);

    const result = await createLesson({
      subject: "maths",
      childAge: 9,
      image: file,
    });

    expect(result).toEqual(lesson);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(String(url)).toMatch(/\/lessons$/);
    expect(init.method).toBe("POST");
    const body = init.body as FormData;
    expect(body.get("subject")).toBe("maths");
    expect(body.get("childAge")).toBe("9");
    expect(body.get("image")).toBeInstanceOf(File);
  });

  it("throws a friendly message on a non-OK response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    await expect(
      createLesson({ subject: "science", childAge: 8, image: file }),
    ).rejects.toThrow(UNREADABLE_MESSAGE);
  });
});

const session: CreateSessionResponse = {
  sessionId: "s1",
  roomName: "s1",
  livekitToken: "jwt",
  livekitUrl: "wss://lk",
};

describe("createSession", () => {
  it("posts the lessonId and returns the connection details", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: () => Promise.resolve(session) });
    vi.stubGlobal("fetch", fetchMock);

    const result = await createSession("l1");

    expect(result).toEqual(session);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(String(url)).toMatch(/\/sessions$/);
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({ lessonId: "l1" });
  });

  it("throws a friendly message on a non-OK response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    await expect(createSession("l1")).rejects.toThrow(SESSION_START_MESSAGE);
  });
});

describe("endSession", () => {
  it("posts to the session end endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    await endSession("s1");

    const [url, init] = fetchMock.mock.calls[0]!;
    expect(String(url)).toMatch(/\/sessions\/s1\/end$/);
    expect(init.method).toBe("POST");
  });
});
