import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QuizBanner } from "./QuizBanner";

describe("QuizBanner", () => {
  it("shows a retry that fires onRetry for recoverable faults", () => {
    const onRetry = vi.fn();
    render(
      <QuizBanner
        banner={{ message: "Pip is taking a nap.", tone: "warn", retry: true }}
        onRetry={onRetry}
      />,
    );
    expect(screen.getByText("Pip is taking a nap.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("omits retry and uses alert role for errors", () => {
    render(
      <QuizBanner
        banner={{ message: "Connecting…", tone: "info", retry: false }}
        onRetry={vi.fn()}
      />,
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();

    render(
      <QuizBanner
        banner={{ message: "Oops", tone: "error", retry: true }}
        onRetry={vi.fn()}
      />,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
