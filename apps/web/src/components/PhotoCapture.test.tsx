import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PhotoCapture } from "./PhotoCapture";

const fileInput = (): HTMLInputElement =>
  screen.getByLabelText(/take or upload a photo/i) as HTMLInputElement;

describe("PhotoCapture", () => {
  it("reports the chosen file and shows its name", () => {
    const onSelect = vi.fn();
    render(<PhotoCapture onSelect={onSelect} fileName="page.jpg" />);

    const file = new File(["bytes"], "page.jpg", { type: "image/jpeg" });
    fireEvent.change(fileInput(), { target: { files: [file] } });

    expect(onSelect).toHaveBeenCalledWith(file);
    expect(screen.getByText(/Selected: page\.jpg/)).toBeInTheDocument();
  });

  it("ignores a change with no file and shows no name by default", () => {
    const onSelect = vi.fn();
    render(<PhotoCapture onSelect={onSelect} />);

    fireEvent.change(fileInput(), { target: { files: [] } });

    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.queryByText(/Selected:/)).not.toBeInTheDocument();
  });
});
