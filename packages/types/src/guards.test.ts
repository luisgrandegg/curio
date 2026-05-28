import { describe, expect, it } from "vitest";
import {
  AGENT_STATES,
  CHILD_AGES,
  CONCEPT_STATUSES,
  QUIZ_DATA_TOPIC,
  QUIZ_VERDICTS,
  SUBJECTS,
  isAgentState,
  isChildAge,
  isConceptStatus,
  isQuizVerdict,
  isSubject,
} from "./index.js";

describe("subject guards", () => {
  it("accepts every declared subject", () => {
    for (const subject of SUBJECTS) expect(isSubject(subject)).toBe(true);
  });
  it("rejects unknown values", () => {
    expect(isSubject("biology")).toBe(false);
    expect(isSubject(42)).toBe(false);
    expect(isSubject(undefined)).toBe(false);
  });
});

describe("child-age guards", () => {
  it("accepts 8, 9, 10 only", () => {
    for (const age of CHILD_AGES) expect(isChildAge(age)).toBe(true);
    expect(isChildAge(7)).toBe(false);
    expect(isChildAge(11)).toBe(false);
    expect(isChildAge("8")).toBe(false);
  });
});

describe("concept-status guards", () => {
  it("accepts declared statuses and rejects others", () => {
    for (const status of CONCEPT_STATUSES)
      expect(isConceptStatus(status)).toBe(true);
    expect(isConceptStatus("done")).toBe(false);
    expect(isConceptStatus(null)).toBe(false);
  });
});

describe("agent-state guards", () => {
  it("accepts declared states and rejects others", () => {
    for (const state of AGENT_STATES) expect(isAgentState(state)).toBe(true);
    expect(isAgentState("paused")).toBe(false);
    expect(isAgentState(0)).toBe(false);
  });
});

describe("quiz message contract", () => {
  it("exposes the data-channel topic", () => {
    expect(QUIZ_DATA_TOPIC).toBe("quiz");
  });
  it("validates verdicts honestly", () => {
    for (const verdict of QUIZ_VERDICTS)
      expect(isQuizVerdict(verdict)).toBe(true);
    expect(isQuizVerdict("wrong")).toBe(false);
  });
});
