import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ReadAloudButton } from "./ReadAloudButton";

describe("ReadAloudButton", () => {
  it("fires onClick and labels itself for reading", () => {
    const onClick = vi.fn();
    render(<ReadAloudButton onClick={onClick} label="the summary" />);
    const button = screen.getByRole("button", {
      name: "Read the summary aloud",
    });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("reflects the playing state", () => {
    render(<ReadAloudButton onClick={vi.fn()} playing label="it" />);
    const button = screen.getByRole("button", { name: "Stop reading it" });
    expect(button).toHaveAttribute("aria-pressed", "true");
  });
});
