import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SubjectAgePicker } from "./SubjectAgePicker";

describe("SubjectAgePicker", () => {
  it("reports the chosen subject and age", () => {
    const onChange = vi.fn();
    render(
      <SubjectAgePicker
        value={{ subject: null, childAge: null }}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "maths" }));
    expect(onChange).toHaveBeenLastCalledWith({
      subject: "maths",
      childAge: null,
    });

    fireEvent.click(screen.getByRole("button", { name: "9" }));
    expect(onChange).toHaveBeenLastCalledWith({ subject: null, childAge: 9 });
  });

  it("marks the active selection with aria-pressed", () => {
    render(
      <SubjectAgePicker
        value={{ subject: "science", childAge: 8 }}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: "science" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "8" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
