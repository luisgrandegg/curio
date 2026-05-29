import type { LessonResponse } from "@curio/types";
import { afterEach, describe, expect, it, vi } from "vitest";
import { UNREADABLE_MESSAGE, createLesson } from "./api-client";

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
