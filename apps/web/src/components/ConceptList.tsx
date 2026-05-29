import type { ReactNode } from "react";
import type { LessonConcept } from "@curio/types";

export interface ConceptListProps {
  concepts: LessonConcept[];
  /** Optional per-concept slot (e.g. a read-aloud button). */
  actions?: (concept: LessonConcept) => ReactNode;
}

export function ConceptList({ concepts, actions }: ConceptListProps) {
  return (
    <ul className="flex flex-col gap-4">
      {concepts.map((concept) => (
        <li
          key={concept.id}
          className="rounded-2xl bg-white p-5 ring-1 ring-slate-200"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-xl font-bold">{concept.label}</p>
            {actions ? actions(concept) : null}
          </div>
          <p className="mt-1 text-lg text-slate-700">{concept.detail}</p>
        </li>
      ))}
    </ul>
  );
}
