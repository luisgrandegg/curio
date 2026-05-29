import { QUIZ_DATA_TOPIC, type QuizMessage } from "@curio/types";
import { describe, expect, it, vi } from "vitest";
import { type DataPublisher, publishQuizMessage } from "./publish.js";

describe("publishQuizMessage", () => {
  it("publishes the JSON-encoded message reliably on the quiz topic", async () => {
    const publishData = vi.fn();
    const publisher: DataPublisher = { publishData };
    const message: QuizMessage = {
      type: "recordAnswer",
      conceptId: "c1",
      verdict: "correct",
      childResponse: "forty two",
    };

    await publishQuizMessage(publisher, message);

    const [bytes, options] = publishData.mock.calls[0]!;
    expect(options).toEqual({ reliable: true, topic: QUIZ_DATA_TOPIC });
    expect(JSON.parse(new TextDecoder().decode(bytes as Uint8Array))).toEqual(
      message,
    );
  });
});
