"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { LessonResponse } from "@curio/types";
import { ConceptList } from "../../components/ConceptList";
import { loadLesson } from "../../lib/lesson-store";

export default function ReviewPage() {
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonResponse | null>(null);

  useEffect(() => {
    const stored = loadLesson();
    if (!stored) {
      router.replace("/");
      return;
    }
    setLesson(stored);
  }, [router]);

  if (!lesson) return null;

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold">{lesson.topicTitle}</h1>
        <p className="text-lg text-slate-700">{lesson.summary}</p>
      </header>

      <ConceptList concepts={lesson.concepts} />

      {/* B06 wires this to POST /sessions and navigates to /quiz. */}
      <button
        type="button"
        className="rounded-2xl bg-emerald-600 px-6 py-4 text-xl font-bold text-white"
      >
        Start quiz with Pip
      </button>
    </main>
  );
}
