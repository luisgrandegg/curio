import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QuizLayout } from "./QuizLayout";

describe("QuizLayout", () => {
  it("renders three labelled regions with their content", () => {
    render(
      <QuizLayout
        avatar={<span>PIP-AVATAR</span>}
        center={<span>CENTER</span>}
        scorecard={<span>SCORE</span>}
        controls={<span>CONTROLS</span>}
      />,
    );

    expect(
      screen.getByRole("complementary", { name: "Pip the tutor" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("main", { name: "Conversation" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("complementary", { name: "Scorecard" }),
    ).toBeInTheDocument();

    expect(screen.getByText("PIP-AVATAR")).toBeInTheDocument();
    expect(screen.getByText("CENTER")).toBeInTheDocument();
    expect(screen.getByText("SCORE")).toBeInTheDocument();
    expect(screen.getByText("CONTROLS")).toBeInTheDocument();
  });
});
