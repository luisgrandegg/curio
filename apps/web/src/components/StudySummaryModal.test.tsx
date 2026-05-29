import type { StudySummary } from "@curio/types";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StudySummaryModal, summaryToText } from "./StudySummaryModal";

const summary: StudySummary = {
  conceptsCovered: 2,
  mastered: ["Adding ones"],
  needsReview: ["Carrying tens"],
  encouragement: "Great job — you've got 1 down!",
};

describe("StudySummaryModal", () => {
  it("is a labelled dialog that takes focus and lists both groups", () => {
    render(<StudySummaryModal summary={summary} onDone={vi.fn()} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveFocus();
    expect(screen.getByText(/Adding ones/)).toBeInTheDocument();
    expect(screen.getByText(/Carrying tens/)).toBeInTheDocument();
    expect(screen.getByText(summary.encouragement)).toBeInTheDocument();
  });

  it("copies a plain-text recap for the parent", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<StudySummaryModal summary={summary} onDone={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Copy summary" }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Copied!" }),
      ).toBeInTheDocument(),
    );
    expect(writeText).toHaveBeenCalledWith(summaryToText(summary));
  });

  it("calls onDone when finished", () => {
    const onDone = vi.fn();
    render(<StudySummaryModal summary={summary} onDone={onDone} />);
    fireEvent.click(screen.getByRole("button", { name: "Done" }));
    expect(onDone).toHaveBeenCalledOnce();
  });
});
