import type { LessonConcept, ScorecardEntry } from "@curio/types";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScorecardPanel } from "./ScorecardPanel";

const concepts: LessonConcept[] = [
  { id: "c1", label: "Adding ones", detail: "d1" },
  { id: "c2", label: "Carrying tens", detail: "d2" },
  { id: "c3", label: "Estimating", detail: "d3" },
];

const scorecard: ScorecardEntry[] = [
  { conceptId: "c1", status: "mastered", attempts: 1 },
  { conceptId: "c2", status: "needs_review", attempts: 2 },
  { conceptId: "c3", status: "pending", attempts: 0 },
];

describe("ScorecardPanel", () => {
  it("shows progress and a text status per concept (not colour alone)", () => {
    render(
      <ScorecardPanel
        concepts={concepts}
        scorecard={scorecard}
        questionNumber={3}
        totalQuestions={6}
      />,
    );
    expect(screen.getByText("Question 3 of 6")).toBeInTheDocument();
    expect(screen.getByText("Adding ones")).toBeInTheDocument();
    expect(screen.getByText("Got it!")).toBeInTheDocument();
    expect(screen.getByText("Review")).toBeInTheDocument();
    expect(screen.getByText("Not yet")).toBeInTheDocument();
  });

  it("defaults to pending when a concept has no scorecard entry", () => {
    render(
      <ScorecardPanel
        concepts={concepts}
        scorecard={[]}
        questionNumber={0}
        totalQuestions={5}
      />,
    );
    expect(screen.getAllByText("Not yet")).toHaveLength(3);
  });
});
