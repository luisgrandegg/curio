"use client";

import { useEffect, useRef } from "react";
import type { TranscriptEntry } from "@curio/types";

export interface TranscriptPanelProps {
  entries: TranscriptEntry[];
}

export function TranscriptPanel({ entries }: TranscriptPanelProps) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries]);

  return (
    <div
      role="log"
      aria-live="polite"
      className="flex flex-col gap-3 overflow-y-auto"
    >
      {entries.map((entry) => {
        const isTutor = entry.participant === "tutor";
        return (
          <p
            key={entry.id}
            className={[
              "max-w-[80%] rounded-2xl px-4 py-2 text-lg",
              isTutor
                ? "self-start bg-sky-100 text-slate-800"
                : "self-end bg-emerald-100 text-slate-800",
              entry.isFinal ? "" : "italic opacity-70",
            ].join(" ")}
          >
            <span className="sr-only">{isTutor ? "Pip" : "You"}: </span>
            {entry.text}
          </p>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}
