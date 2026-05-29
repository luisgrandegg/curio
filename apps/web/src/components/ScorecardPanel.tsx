import type {
  ConceptStatus,
  LessonConcept,
  ScorecardEntry,
} from "@curio/types";

export interface ScorecardPanelProps {
  concepts: LessonConcept[];
  scorecard: ScorecardEntry[];
  questionNumber: number;
  totalQuestions: number;
}

// Status conveyed by icon + label + colour (never colour alone) — redundant
// multimodality per the Constitution.
const STATUS: Record<
  ConceptStatus,
  { icon: string; label: string; className: string }
> = {
  pending: {
    icon: "•",
    label: "Not yet",
    className: "bg-slate-100 text-slate-600",
  },
  mastered: {
    icon: "★",
    label: "Got it!",
    className: "bg-emerald-100 text-emerald-800 motion-safe:animate-pulse",
  },
  needs_review: {
    icon: "↻",
    label: "Review",
    className: "bg-amber-100 text-amber-800",
  },
};

export function ScorecardPanel({
  concepts,
  scorecard,
  questionNumber,
  totalQuestions,
}: ScorecardPanelProps) {
  const statusOf = (id: string): ConceptStatus =>
    scorecard.find((e) => e.conceptId === id)?.status ?? "pending";

  return (
    <div className="flex h-full flex-col gap-4">
      <p className="text-lg font-bold" aria-live="polite">
        Question {questionNumber} of {totalQuestions}
      </p>
      <ul className="flex flex-col gap-3">
        {concepts.map((concept) => {
          const s = STATUS[statusOf(concept.id)];
          return (
            <li
              key={concept.id}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${s.className}`}
            >
              <span aria-hidden="true" className="text-2xl">
                {s.icon}
              </span>
              <span className="flex-1 font-semibold">{concept.label}</span>
              <span className="text-sm font-bold uppercase">{s.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
