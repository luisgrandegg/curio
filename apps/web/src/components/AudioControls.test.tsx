import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const setMicrophoneEnabled = vi.fn().mockResolvedValue(undefined);
vi.mock("@livekit/components-react", () => ({
  useLocalParticipant: () => ({ localParticipant: { setMicrophoneEnabled } }),
}));

import { AudioControls } from "./AudioControls";

describe("AudioControls", () => {
  it("toggles the microphone and reflects muted state", async () => {
    render(<AudioControls onEnd={vi.fn()} />);
    const muteButton = screen.getByRole("button", { name: "Mute" });

    fireEvent.click(muteButton);
    expect(setMicrophoneEnabled).toHaveBeenCalledWith(false);
    expect(
      await screen.findByRole("button", { name: "Unmute" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("calls onEnd when ending the quiz", () => {
    const onEnd = vi.fn();
    render(<AudioControls onEnd={onEnd} />);
    fireEvent.click(screen.getByRole("button", { name: "End quiz" }));
    expect(onEnd).toHaveBeenCalledOnce();
  });
});
