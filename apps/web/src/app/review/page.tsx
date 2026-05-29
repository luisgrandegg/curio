"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { LessonResponse } from "@curio/types";
import { ConceptList } from "../../components/ConceptList";
import { createSession } from "../../lib/api-client";
import { loadLesson } from "../../lib/lesson-store";
import { saveSession } from "../../lib/session-store";

export default function ReviewPage() {
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = loadLesson();
    if (!stored) {
      router.replace("/");
      return;
    }
    setLesson(stored);
  }, [router]);

  if (!lesson) return null;

  const startQuiz = async (): Promise<void> => {
    setBusy(true);
    setError(null);
    try {
      const session = await createSession(lesson.id);
      saveSession(session);
      router.push("/quiz");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold">{lesson.topicTitle}</h1>
        <p className="text-lg text-slate-700">{lesson.summary}</p>
      </header>

      <ConceptList concepts={lesson.concepts} />

      {error ? (
        <p role="alert" className="text-lg text-rose-700">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        disabled={busy}
        onClick={startQuiz}
        className="rounded-2xl bg-emerald-600 px-6 py-4 text-xl font-bold text-white disabled:opacity-40"
      >
        {busy ? "Getting Pip ready…" : "Start quiz with Pip"}
      </button>
    </main>
  );
}
