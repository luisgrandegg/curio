import type { TranscriptEntry } from "@curio/types";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TranscriptPanel } from "./TranscriptPanel";

const entry = (over: Partial<TranscriptEntry>): TranscriptEntry => ({
  id: "1",
  participant: "tutor",
  text: "Hello!",
  isFinal: true,
  timestamp: 1,
  ...over,
});

describe("TranscriptPanel", () => {
  it("is an aria-live log and labels each speaker", () => {
    render(
      <TranscriptPanel
        entries={[
          entry({ id: "1", participant: "tutor", text: "What is 2 + 2?" }),
          entry({ id: "2", participant: "child", text: "Four!" }),
        ]}
      />,
    );
    const log = screen.getByRole("log");
    expect(log).toHaveAttribute("aria-live", "polite");
    expect(screen.getByText("What is 2 + 2?")).toBeInTheDocument();
    expect(screen.getByText("Four!")).toBeInTheDocument();
  });

  it("renders a partial segment in italic", () => {
    render(
      <TranscriptPanel
        entries={[entry({ text: "thinking", isFinal: false })]}
      />,
    );
    expect(screen.getByText("thinking")).toHaveClass("italic");
  });
});
