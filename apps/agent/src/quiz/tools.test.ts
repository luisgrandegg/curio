import type { LessonConcept, QuizMessage } from "@curio/types";
import { describe, expect, it } from "vitest";
import { type DataPublisher } from "./publish.js";
import { createQuizTracker } from "./tracker.js";
import { createQuizTools } from "./tools.js";

const concepts: LessonConcept[] = [
  { id: "c1", label: "Adding", detail: "d1" },
  { id: "c2", label: "Carrying", detail: "d2" },
];

const setup = () => {
  const messages: QuizMessage[] = [];
  const publisher: DataPublisher = {
    publishData: (bytes) => {
      messages.push(JSON.parse(new TextDecoder().decode(bytes)) as QuizMessage);
    },
  };
  const tracker = createQuizTracker(concepts);
  return { messages, tools: createQuizTools(publisher, tracker), tracker };
};

// The execute opts (RunContext) are unused by our handlers.
const noCtx = undefined as never;

describe("createQuizTools", () => {
  it("recordAnswer publishes the honest verdict and the child's words", async () => {
    const { tools, messages } = setup();
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

  it("updateScorecard publishes the status and updates the tracker", async () => {
    const { tools, messages, tracker } = setup();
    await tools.updateScorecard.execute(
      { conceptId: "c2", status: "mastered" },
      noCtx,
    );
    expect(messages[0]).toEqual({
      type: "updateScorecard",
      conceptId: "c2",
      status: "mastered",
    });
    expect(tracker.snapshot()[1]).toMatchObject({ status: "mastered" });
  });

  it("generateStudySummary publishes the summary built from the tracker", async () => {
    const { tools, messages } = setup();
    await tools.updateScorecard.execute(
      { conceptId: "c1", status: "mastered" },
      noCtx,
    );
    const result = await tools.generateStudySummary.execute({}, noCtx);

    expect(result).toEqual({ generated: true });
    const summaryMsg = messages.find((m) => m.type === "summary");
    expect(summaryMsg).toMatchObject({
      type: "summary",
      summary: { mastered: ["Adding"], conceptsCovered: 1 },
    });
  });
});
