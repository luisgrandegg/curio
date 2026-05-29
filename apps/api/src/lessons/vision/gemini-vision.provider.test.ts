import { describe, expect, it, vi } from "vitest";
import { GeminiVisionProvider } from "./gemini-vision.provider.js";

describe("GeminiVisionProvider", () => {
  it("prompts the model with the image and parses its reply", async () => {
    const generate = vi.fn().mockResolvedValue(
      "```json\n" +
        JSON.stringify({
          topicTitle: "Volcanoes",
          summary: "Mountains that erupt.",
          concepts: Array.from({ length: 5 }, (_, i) => ({
            label: `L${i}`,
            detail: `D${i}`,
          })),
        }) +
        "\n```",
    );
    const provider = new GeminiVisionProvider(generate);

    const lesson = await provider.extractLesson("BASE64", 8, "science");

    expect(lesson.topicTitle).toBe("Volcanoes");
    expect(lesson.subject).toBe("science");
    expect(lesson.childAge).toBe(8);
    expect(lesson.concepts).toHaveLength(5);

    const call = generate.mock.calls[0]?.[0];
    expect(call.imageBase64).toBe("BASE64");
    expect(call.prompt).toContain("science");
    expect(call.prompt).toContain("8-year-old");
  });
});
