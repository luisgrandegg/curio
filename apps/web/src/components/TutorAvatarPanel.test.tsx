import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TutorAvatarPanel } from "./TutorAvatarPanel";

describe("TutorAvatarPanel", () => {
  it("announces the current state in an aria-live region", () => {
    render(<TutorAvatarPanel state="thinking" />);
    const label = screen.getByText("Pip is thinking…");
    expect(label).toHaveAttribute("aria-live", "polite");
  });

  it("shows the visualizer bars only while speaking", () => {
    const bars = <span>BARS</span>;
    const { rerender } = render(
      <TutorAvatarPanel state="listening" bars={bars} />,
    );
    expect(screen.queryByText("BARS")).not.toBeInTheDocument();

    rerender(<TutorAvatarPanel state="speaking" bars={bars} />);
    expect(screen.getByText("BARS")).toBeInTheDocument();
    expect(screen.getByText("Pip is talking!")).toBeInTheDocument();
  });
});
