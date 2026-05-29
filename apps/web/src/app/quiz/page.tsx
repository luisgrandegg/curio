"use client";

import "@livekit/components-styles";
import {
  BarVisualizer,
  LiveKitRoom,
  RoomAudioRenderer,
} from "@livekit/components-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type {
  CreateSessionResponse,
  LessonConcept,
  LessonResponse,
} from "@curio/types";
import { AudioControls } from "../../components/AudioControls";
import { QuizLayout } from "../../components/QuizLayout";
import { ScorecardPanel } from "../../components/ScorecardPanel";
import { StudySummaryModal } from "../../components/StudySummaryModal";
import { TranscriptPanel } from "../../components/TranscriptPanel";
import { TutorAvatarPanel } from "../../components/TutorAvatarPanel";
import { useAgentState } from "../../hooks/useAgentState";
import { useScorecard } from "../../hooks/useScorecard";
import { useTranscript } from "../../hooks/useTranscript";
import { endSession } from "../../lib/api-client";
import { loadLesson } from "../../lib/lesson-store";
import { clearSession, loadSession } from "../../lib/session-store";

// Rendered inside <LiveKitRoom> so the hooks can read the room context.
function QuizRoom({
  concepts,
  onEnd,
  error,
}: {
  concepts: LessonConcept[];
  onEnd: () => void;
  error: string | null;
}) {
  const entries = useTranscript();
  const { scorecard, answered, summary } = useScorecard(concepts);
  const { state, audioTrack } = useAgentState();
  const totalQuestions = Math.min(8, concepts.length + 2);

  return (
    <>
      <RoomAudioRenderer />
      {summary ? <StudySummaryModal summary={summary} onDone={onEnd} /> : null}
      <QuizLayout
        avatar={
          <TutorAvatarPanel
            state={state}
            bars={<BarVisualizer trackRef={audioTrack} barCount={5} />}
          />
        }
        center={
          error ? (
            <p role="alert" className="text-xl text-rose-700">
              {error}
            </p>
          ) : (
            <TranscriptPanel entries={entries} />
          )
        }
        scorecard={
          <ScorecardPanel
            concepts={concepts}
            scorecard={scorecard}
            questionNumber={answered}
            totalQuestions={totalQuestions}
          />
        }
        controls={<AudioControls onEnd={onEnd} />}
      />
    </>
  );
}

export default function QuizPage() {
  const router = useRouter();
  const [session, setSession] = useState<CreateSessionResponse | null>(null);
  const [lesson, setLesson] = useState<LessonResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedSession = loadSession();
    const storedLesson = loadLesson();
    if (!storedSession || !storedLesson) {
      router.replace("/");
      return;
    }
    setSession(storedSession);
    setLesson(storedLesson);
  }, [router]);

  if (!session || !lesson) return null;

  const end = async (): Promise<void> => {
    try {
      await endSession(session.sessionId);
    } catch {
      // Best-effort: leaving shouldn't depend on the call.
    }
    clearSession();
    router.push("/");
  };

  return (
    <LiveKitRoom
      serverUrl={session.livekitUrl}
      token={session.livekitToken}
      connect
      audio
      video={false}
      onError={() =>
        setError("Pip is taking a nap — check your microphone and try again.")
      }
    >
      <QuizRoom concepts={lesson.concepts} onEnd={end} error={error} />
    </LiveKitRoom>
  );
}
