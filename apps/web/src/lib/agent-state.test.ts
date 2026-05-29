import type { AgentState } from "@curio/types";
import { describe, expect, it } from "vitest";
import { agentStateLabel, normalizeAgentState } from "./agent-state";

describe("normalizeAgentState", () => {
  it("passes through the active states", () => {
    expect(normalizeAgentState("listening")).toBe("listening");
    expect(normalizeAgentState("thinking")).toBe("thinking");
    expect(normalizeAgentState("speaking")).toBe("speaking");
  });

  it("treats idle as listening (connected and waiting)", () => {
    expect(normalizeAgentState("idle")).toBe("listening");
  });

  it("collapses startup states to connecting", () => {
    expect(normalizeAgentState("connecting")).toBe("connecting");
    expect(normalizeAgentState("initializing")).toBe("connecting");
    expect(normalizeAgentState("pre-connect-buffering")).toBe("connecting");
  });

  it("maps failed/unknown to disconnected", () => {
    expect(normalizeAgentState("failed")).toBe("disconnected");
    expect(normalizeAgentState("whatever")).toBe("disconnected");
  });
});

describe("agentStateLabel", () => {
  it("gives a warm label for every state", () => {
    const states: AgentState[] = [
      "disconnected",
      "connecting",
      "listening",
      "thinking",
      "speaking",
    ];
    for (const s of states) expect(agentStateLabel(s)).toMatch(/Pip/);
    expect(agentStateLabel("listening")).toBe("Pip is listening!");
    expect(agentStateLabel("speaking")).toBe("Pip is talking!");
  });
});
