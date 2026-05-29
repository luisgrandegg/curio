import { describe, expect, it } from "vitest";
import { type QuizPhase, quizBanner } from "./quiz-status";

describe("quizBanner", () => {
  it("shows no banner once the quiz is live", () => {
    expect(quizBanner("live")).toBeNull();
  });

  it("offers a retry only on recoverable faults", () => {
    expect(quizBanner("connecting")?.retry).toBe(false);
    expect(quizBanner("waiting")?.retry).toBe(false);
    expect(quizBanner("reconnecting")?.retry).toBe(false);
    expect(quizBanner("no-pip")?.retry).toBe(true);
    expect(quizBanner("mic-denied")?.retry).toBe(true);
    expect(quizBanner("failed")?.retry).toBe(true);
  });

  it("uses a kind message and the right tone per phase", () => {
    expect(quizBanner("no-pip")).toEqual({
      message: "Pip is taking a nap — let's try again.",
      tone: "warn",
      retry: true,
    });
    expect(quizBanner("mic-denied")?.tone).toBe("error");
    expect(quizBanner("mic-denied")?.message).toMatch(/microphone/);
  });

  it("covers every non-live phase", () => {
    const phases: QuizPhase[] = [
      "connecting",
      "waiting",
      "no-pip",
      "reconnecting",
      "mic-denied",
      "failed",
    ];
    for (const p of phases) expect(quizBanner(p)).not.toBeNull();
  });
});
