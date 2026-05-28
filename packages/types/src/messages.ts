// Agent → frontend structured updates over the LiveKit data channel.
// Published by the agent tools (B08), consumed by the web hooks (B09).
import type { ConceptStatus } from "./quiz.js";
import type { StudySummary } from "./quiz.js";

/** Reliable, topic-scoped data channel for all quiz updates. */
export const QUIZ_DATA_TOPIC = "quiz";

/** The tutor's honest judgement of an answer (kind tone, true data). */
export const QUIZ_VERDICTS = ["correct", "partial", "incorrect"] as const;
export type QuizVerdict = (typeof QUIZ_VERDICTS)[number];

export interface RecordAnswerMessage {
  type: "recordAnswer";
  conceptId: string;
  verdict: QuizVerdict;
  childResponse: string;
}

export interface UpdateScorecardMessage {
  type: "updateScorecard";
  conceptId: string;
  status: ConceptStatus;
}

export interface SummaryMessage {
  type: "summary";
  summary: StudySummary;
}

/** Discriminated union of everything published on {@link QUIZ_DATA_TOPIC}. */
export type QuizMessage =
  | RecordAnswerMessage
  | UpdateScorecardMessage
  | SummaryMessage;

export const isQuizVerdict = (value: unknown): value is QuizVerdict =>
  typeof value === "string" &&
  (QUIZ_VERDICTS as readonly string[]).includes(value);
