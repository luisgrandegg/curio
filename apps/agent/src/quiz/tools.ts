import { llm } from "@livekit/agents";
import { CONCEPT_STATUSES, QUIZ_VERDICTS } from "@curio/types";
import { z } from "zod";
import { type DataPublisher, publishQuizMessage } from "./publish.js";
import { buildStudySummary } from "./summary.js";
import type { QuizTracker } from "./tracker.js";

/**
 * Pip's tools. The verdict in `recordAnswer` is the agent's honest judgement
 * (warmth goes to the child; truth goes to the scorecard). Each tool publishes
 * a typed `QuizMessage` on the `quiz` data channel for the web app to react to.
 */
export function createQuizTools(
  publisher: DataPublisher,
  tracker: QuizTracker,
) {
  const recordAnswer = llm.tool({
    description:
      "Record your honest judgement of the child's spoken answer. Call this " +
      "BEFORE you say your feedback out loud.",
    parameters: z.object({
      conceptId: z.string(),
      verdict: z.enum(QUIZ_VERDICTS),
      childResponse: z.string(),
    }),
    execute: async ({ conceptId, verdict, childResponse }) => {
      await publishQuizMessage(publisher, {
        type: "recordAnswer",
        conceptId,
        verdict,
        childResponse,
      });
      return "recorded";
    },
  });

  const updateScorecard = llm.tool({
    description:
      "Mark a concept mastered (clearly understood) or needs_review (struggled " +
      "even after a hint).",
    parameters: z.object({
      conceptId: z.string(),
      status: z.enum(CONCEPT_STATUSES),
    }),
    execute: async ({ conceptId, status }) => {
      tracker.setStatus(conceptId, status);
      await publishQuizMessage(publisher, {
        type: "updateScorecard",
        conceptId,
        status,
      });
      return "updated";
    },
  });

  const generateStudySummary = llm.tool({
    description:
      "Call this once at the very end to build the study summary, then say a " +
      "warm, proud goodbye.",
    execute: async () => {
      const summary = buildStudySummary(tracker.snapshot());
      await publishQuizMessage(publisher, { type: "summary", summary });
      return { generated: true };
    },
  });

  return { recordAnswer, updateScorecard, generateStudySummary };
}
