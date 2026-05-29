"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ChildAge, Subject } from "@curio/types";
import {
  SubjectAgePicker,
  type SubjectAgeValue,
} from "../components/SubjectAgePicker";
import { PhotoCapture } from "../components/PhotoCapture";
import { createLesson } from "../lib/api-client";
import { saveLesson } from "../lib/lesson-store";

export default function CapturePage() {
  const router = useRouter();
  const [picked, setPicked] = useState<SubjectAgeValue>({
    subject: null,
    childAge: null,
  });
  const [image, setImage] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ready =
    picked.subject !== null && picked.childAge !== null && image !== null;

  const start = async (): Promise<void> => {
    if (!ready) return;
    setBusy(true);
    setError(null);
    try {
      const lesson = await createLesson({
        subject: picked.subject as Subject,
        childAge: picked.childAge as ChildAge,
        image: image as File,
      });
      saveLesson(lesson);
      router.push("/review");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-6">
      <h1 className="text-4xl font-extrabold">Let&apos;s study with Pip!</h1>
      <SubjectAgePicker value={picked} onChange={setPicked} />
      <PhotoCapture onSelect={setImage} fileName={image?.name} />
      {error ? (
        <p role="alert" className="text-lg text-rose-700">
          {error}
        </p>
      ) : null}
      <button
        type="button"
        disabled={!ready || busy}
        onClick={start}
        className="rounded-2xl bg-emerald-600 px-6 py-4 text-xl font-bold text-white disabled:opacity-40"
      >
        {busy ? "Reading your page…" : "See what we'll learn"}
      </button>
    </main>
  );
}
