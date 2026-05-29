"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { StudySummary } from "@curio/types";

export interface StudySummaryModalProps {
  summary: StudySummary;
  onDone: () => void;
  /** Optional read-aloud control for the encouragement (dyslexia support). */
  readAloud?: ReactNode;
}

/** Parent-facing plain-text recap for the "Copy summary" button. */
export function summaryToText(s: StudySummary): string {
  return [
    "Curio study summary",
    `Concepts covered: ${s.conceptsCovered}`,
    `Got it: ${s.mastered.join(", ") || "—"}`,
    `To practise: ${s.needsReview.join(", ") || "—"}`,
    s.encouragement,
  ].join("\n");
}

export function StudySummaryModal({
  summary,
  onDone,
  readAloud,
}: StudySummaryModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  const copy = async (): Promise<void> => {
    await navigator.clipboard.writeText(summaryToText(summary));
    setCopied(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="summary-title"
        tabIndex={-1}
        className="flex w-full max-w-lg flex-col gap-4 rounded-3xl bg-white p-6"
      >
        <h2 id="summary-title" className="text-3xl font-extrabold">
          Great work today! 🎉
        </h2>
        <div className="flex items-center gap-2 text-lg text-slate-700">
          {readAloud}
          <p>{summary.encouragement}</p>
        </div>

        <section>
          <h3 className="text-xl font-bold">What you did great</h3>
          {summary.mastered.length > 0 ? (
            <ul className="mt-1">
              {summary.mastered.map((m) => (
                <li key={m}>⭐ {m}</li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-600">You gave it a great go!</p>
          )}
        </section>

        <section>
          <h3 className="text-xl font-bold">Let&apos;s practise next time</h3>
          {summary.needsReview.length > 0 ? (
            <ul className="mt-1">
              {summary.needsReview.map((m) => (
                <li key={m}>↻ {m}</li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-600">Nothing — you remembered it all!</p>
          )}
        </section>

        <div className="mt-2 flex gap-3">
          <button
            type="button"
            onClick={copy}
            className="rounded-2xl bg-slate-100 px-5 py-3 font-semibold ring-1 ring-slate-300"
          >
            {copied ? "Copied!" : "Copy summary"}
          </button>
          <button
            type="button"
            onClick={onDone}
            className="rounded-2xl bg-emerald-600 px-5 py-3 font-bold text-white"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
