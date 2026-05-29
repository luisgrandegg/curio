import type { WordTimestamp } from "@curio/types";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ReadAloudText } from "./ReadAloudText";

const words: WordTimestamp[] = [
  { word: "Two", start: 0, end: 0.5 },
  { word: "plus", start: 0.5, end: 1 },
];

describe("ReadAloudText", () => {
  it("renders plain text when there are no word timings", () => {
    render(<ReadAloudText text="Two plus" />);
    expect(screen.getByText("Two plus")).toBeInTheDocument();
  });

  it("marks the active word", () => {
    render(<ReadAloudText text="Two plus" words={words} activeIndex={1} />);
    const active = screen.getByText("plus");
    expect(active).toHaveAttribute("data-active", "true");
    expect(screen.getByText("Two")).toHaveAttribute("data-active", "false");
  });
});
