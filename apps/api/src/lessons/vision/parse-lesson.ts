import type { ChildAge, Lesson, LessonConcept, Subject } from "@curio/types";

/** Thrown when the model output can't be turned into a usable lesson. */
export class LessonParseError extends Error {}

export interface ParseContext {
  subject: Subject;
  childAge: ChildAge;
}

const MIN_CONCEPTS = 5;
const MAX_CONCEPTS = 8;

/** Pull the JSON object out of a model reply that may wrap it in prose/fences. */
function extractJsonObject(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced?.[1] ?? raw).trim();
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) {
    throw new LessonParseError("No JSON object found in model output");
  }
  return candidate.slice(start, end + 1);
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toConcepts(value: unknown): LessonConcept[] {
  if (!Array.isArray(value)) {
    throw new LessonParseError("Lesson concepts missing or not a list");
  }
  const concepts: LessonConcept[] = [];
  for (const item of value) {
    const record = (item ?? {}) as Record<string, unknown>;
    const label = asString(record.label);
    const detail = asString(record.detail);
    if (label === "" || detail === "") continue;
    concepts.push({
      id: asString(record.id) || `concept-${concepts.length + 1}`,
      label,
      detail,
    });
    if (concepts.length === MAX_CONCEPTS) break;
  }
  if (concepts.length < MIN_CONCEPTS) {
    throw new LessonParseError(
      `Expected at least ${MIN_CONCEPTS} concepts, got ${concepts.length}`,
    );
  }
  return concepts;
}

/**
 * Defensively parse a model reply into a {@link Lesson}. Subject and age come
 * from the trusted request context, never from the model.
 */
export function parseLessonResponse(raw: string, ctx: ParseContext): Lesson {
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(extractJsonObject(raw)) as Record<string, unknown>;
  } catch (error) {
    if (error instanceof LessonParseError) throw error;
    throw new LessonParseError("Model output was not valid JSON");
  }

  const topicTitle = asString(data.topicTitle);
  const summary = asString(data.summary);
  if (topicTitle === "" || summary === "") {
    throw new LessonParseError("Lesson is missing a topic title or summary");
  }

  return {
    topicTitle,
    summary,
    subject: ctx.subject,
    childAge: ctx.childAge,
    concepts: toConcepts(data.concepts),
  };
}
