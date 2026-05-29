import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DEFAULT_SETTINGS } from "../lib/a11y-settings";
import { SettingsPanel } from "./SettingsPanel";

describe("SettingsPanel", () => {
  it("opens from the gear and changes settings", () => {
    const onChange = vi.fn();
    render(<SettingsPanel settings={DEFAULT_SETTINGS} onChange={onChange} />);

    // Panel closed until the gear is pressed.
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Accessibility settings" }),
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "OpenDyslexic" }));
    expect(onChange).toHaveBeenLastCalledWith({ font: "opendyslexic" });

    fireEvent.click(screen.getByRole("button", { name: "Extra large" }));
    expect(onChange).toHaveBeenLastCalledWith({ size: "xlarge" });

    fireEvent.click(screen.getByRole("button", { name: "High contrast" }));
    expect(onChange).toHaveBeenLastCalledWith({ theme: "high-contrast" });
  });

  it("changes Pip speed and the highlight toggle", () => {
    const onChange = vi.fn();
    render(<SettingsPanel settings={DEFAULT_SETTINGS} onChange={onChange} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Accessibility settings" }),
    );

    fireEvent.change(screen.getByLabelText("Pip's speaking speed"), {
      target: { value: "1.5" },
    });
    expect(onChange).toHaveBeenLastCalledWith({ pipSpeed: 1.5 });

    fireEvent.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenLastCalledWith({ highlight: false });
  });
});
