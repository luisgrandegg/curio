import type {
  LessonConcept,
  ScorecardEntry,
  TranscriptEntry,
} from "@curio/types";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS } from "../lib/a11y-settings";
import { ReadAloudButton } from "./ReadAloudButton";
import { ScorecardPanel } from "./ScorecardPanel";
import { SettingsPanel } from "./SettingsPanel";
import { TranscriptPanel } from "./TranscriptPanel";
import { TutorAvatarPanel } from "./TutorAvatarPanel";

// Cross-cutting accessibility guarantees (MVP "Accessibility" acceptance
// criteria) locked as a regression guard.
describe("accessibility baseline", () => {
  it("gates the mastery celebration behind motion-safe (reduced motion)", () => {
    const concepts: LessonConcept[] = [
      { id: "c1", label: "Adding", detail: "d" },
    ];
    const scorecard: ScorecardEntry[] = [
      { conceptId: "c1", status: "mastered", attempts: 1 },
    ];
    render(
      <ScorecardPanel
        concepts={concepts}
        scorecard={scorecard}
        questionNumber={1}
        totalQuestions={5}
      />,
    );
    // Animated card carries the animation only under motion-safe.
    const card = screen.getByText("Adding").closest("li");
    expect(card?.className).toMatch(/motion-safe:animate-/);
  });

  it("gates the avatar animation behind motion-safe", () => {
    render(<TutorAvatarPanel state="thinking" />);
    const owl = screen.getByText("🦉");
    expect(owl.className).toMatch(/motion-safe:animate-/);
  });

  it("announces transcript + agent state via aria-live", () => {
    render(<TutorAvatarPanel state="listening" />);
    expect(screen.getByText("Pip is listening!")).toHaveAttribute(
      "aria-live",
      "polite",
    );

    const entry: TranscriptEntry = {
      id: "1",
      participant: "tutor",
      text: "Hello",
      isFinal: true,
      timestamp: 1,
    };
    render(<TranscriptPanel entries={[entry]} />);
    expect(screen.getByRole("log")).toHaveAttribute("aria-live", "polite");
  });

  it("conveys scorecard status as text, not colour alone", () => {
    render(
      <ScorecardPanel
        concepts={[{ id: "c1", label: "Adding", detail: "d" }]}
        scorecard={[{ conceptId: "c1", status: "needs_review", attempts: 2 }]}
        questionNumber={1}
        totalQuestions={5}
      />,
    );
    expect(screen.getByText("Review")).toBeInTheDocument();
  });

  it("gives interactive controls accessible names", () => {
    render(<ReadAloudButton onClick={() => {}} label="the summary" />);
    expect(
      screen.getByRole("button", { name: "Read the summary aloud" }),
    ).toBeInTheDocument();

    render(<SettingsPanel settings={DEFAULT_SETTINGS} onChange={() => {}} />);
    expect(
      screen.getByRole("button", { name: "Accessibility settings" }),
    ).toBeInTheDocument();
  });
});
