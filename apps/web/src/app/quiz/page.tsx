"use client";

import "@livekit/components-styles";
import {
  BarVisualizer,
  LiveKitRoom,
  RoomAudioRenderer,
  useConnectionState,
  useRemoteParticipants,
} from "@livekit/components-react";
import { ConnectionState } from "livekit-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type {
  CreateSessionResponse,
  LessonConcept,
  LessonResponse,
} from "@curio/types";
import { AudioControls } from "../../components/AudioControls";
import { QuizBanner } from "../../components/QuizBanner";
import { QuizLayout } from "../../components/QuizLayout";
import { ReadAloud } from "../../components/ReadAloud";
import { ScorecardPanel } from "../../components/ScorecardPanel";
import { StudySummaryModal } from "../../components/StudySummaryModal";
import { TranscriptPanel } from "../../components/TranscriptPanel";
import { TutorAvatarPanel } from "../../components/TutorAvatarPanel";
import { useA11ySettings } from "../../hooks/useA11ySettings";
import { useAgentState } from "../../hooks/useAgentState";
import { useScorecard } from "../../hooks/useScorecard";
import { useTranscript } from "../../hooks/useTranscript";
import { endSession } from "../../lib/api-client";
import { loadLesson } from "../../lib/lesson-store";
import { type QuizPhase, quizBanner } from "../../lib/quiz-status";
import { clearSession, loadSession } from "../../lib/session-store";

type Fault = "mic" | "error" | null;

// Rendered inside <LiveKitRoom> so the hooks can read the room context.
function QuizRoom({
  concepts,
  onEnd,
  fault,
}: {
  concepts: LessonConcept[];
  onEnd: () => void;
  fault: Fault;
}) {
  const entries = useTranscript();
  const { scorecard, answered, summary } = useScorecard(concepts);
  const { state, audioTrack } = useAgentState();
  const { settings } = useA11ySettings();
  const connection = useConnectionState();
  const remotes = useRemoteParticipants();
  const [graceElapsed, setGraceElapsed] = useState(false);
  const totalQuestions = Math.min(8, concepts.length + 2);

  useEffect(() => {
    // Pip should join within ~10s; otherwise offer a retry.
    const timer = setTimeout(() => setGraceElapsed(true), 10_000);
    return () => clearTimeout(timer);
  }, []);

  const phase: QuizPhase =
    fault === "mic"
      ? "mic-denied"
      : fault === "error"
        ? "failed"
        : connection === ConnectionState.Reconnecting
          ? "reconnecting"
          : connection !== ConnectionState.Connected
            ? "connecting"
            : remotes.length > 0
              ? "live"
              : graceElapsed
                ? "no-pip"
                : "waiting";
  const banner = quizBanner(phase);

  return (
    <div className="flex h-screen flex-col">
      <RoomAudioRenderer />
      {summary ? (
        <StudySummaryModal
          summary={summary}
          onDone={onEnd}
          readAloud={
            <ReadAloud
              text={summary.encouragement}
              speed={settings.pipSpeed}
              highlight={false}
              label="the summary"
            />
          }
        />
      ) : null}
      {banner ? (
        <div className="p-3">
          <QuizBanner
            banner={banner}
            onRetry={() => window.location.reload()}
          />
        </div>
      ) : null}
      <div className="flex-1">
        <QuizLayout
          avatar={
            <TutorAvatarPanel
              state={state}
              bars={<BarVisualizer trackRef={audioTrack} barCount={5} />}
            />
          }
          center={<TranscriptPanel entries={entries} />}
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
      </div>
    </div>
  );
}

export default function QuizPage() {
  const router = useRouter();
  const [session, setSession] = useState<CreateSessionResponse | null>(null);
  const [lesson, setLesson] = useState<LessonResponse | null>(null);
  const [fault, setFault] = useState<Fault>(null);

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
      onMediaDeviceFailure={() => setFault("mic")}
      onError={() => setFault("error")}
    >
      <QuizRoom concepts={lesson.concepts} onEnd={end} fault={fault} />
    </LiveKitRoom>
  );
}
