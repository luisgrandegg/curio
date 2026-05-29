import type { LessonConcept } from "@curio/types";

export interface ConceptListProps {
  concepts: LessonConcept[];
}

export function ConceptList({ concepts }: ConceptListProps) {
  return (
    <ul className="flex flex-col gap-4">
      {concepts.map((concept) => (
        <li
          key={concept.id}
          className="rounded-2xl bg-white p-5 ring-1 ring-slate-200"
        >
          <p className="text-xl font-bold">{concept.label}</p>
          <p className="mt-1 text-lg text-slate-700">{concept.detail}</p>
        </li>
      ))}
    </ul>
  );
}
