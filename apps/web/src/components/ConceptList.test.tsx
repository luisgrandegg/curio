import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ConceptList } from "./ConceptList";

describe("ConceptList", () => {
  it("renders each concept's label and detail", () => {
    render(
      <ConceptList
        concepts={[
          { id: "c1", label: "Adding", detail: "Put numbers together." },
          { id: "c2", label: "Carrying", detail: "Move the extra ten over." },
        ]}
      />,
    );
    expect(screen.getByText("Adding")).toBeInTheDocument();
    expect(screen.getByText("Put numbers together.")).toBeInTheDocument();
    expect(screen.getByText("Carrying")).toBeInTheDocument();
    expect(screen.getByText("Move the extra ten over.")).toBeInTheDocument();
  });
});
