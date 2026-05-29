import type { QuizMessage } from "@curio/types";
import { describe, expect, it } from "vitest";
import { type DataPublisher } from "./publish.js";
import { createQuizTools } from "./tools.js";

const captured = (): { publisher: DataPublisher; messages: QuizMessage[] } => {
  const messages: QuizMessage[] = [];
  return {
    messages,
    publisher: {
      publishData: (bytes) => {
        messages.push(
          JSON.parse(new TextDecoder().decode(bytes)) as QuizMessage,
        );
      },
    },
  };
};

// The execute opts (RunContext) are unused by our handlers.
const noCtx = undefined as never;

describe("createQuizTools", () => {
  it("recordAnswer publishes the honest verdict and the child's words", async () => {
    const { publisher, messages } = captured();
    const tools = createQuizTools(publisher);

    await tools.recordAnswer.execute(
      { conceptId: "c1", verdict: "partial", childResponse: "almost" },
      noCtx,
    );

    expect(messages[0]).toEqual({
      type: "recordAnswer",
      conceptId: "c1",
      verdict: "partial",
      childResponse: "almost",
    });
  });

  it("updateScorecard publishes the concept status", async () => {
    const { publisher, messages } = captured();
    const tools = createQuizTools(publisher);

    await tools.updateScorecard.execute(
      { conceptId: "c2", status: "mastered" },
      noCtx,
    );

    expect(messages[0]).toEqual({
      type: "updateScorecard",
      conceptId: "c2",
      status: "mastered",
    });
  });
});
