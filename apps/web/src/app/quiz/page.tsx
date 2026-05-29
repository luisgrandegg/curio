"use client";

import "@livekit/components-styles";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { CreateSessionResponse } from "@curio/types";
import { AudioControls } from "../../components/AudioControls";
import { QuizLayout } from "../../components/QuizLayout";
import { endSession } from "../../lib/api-client";
import { clearSession, loadSession } from "../../lib/session-store";

export default function QuizPage() {
  const router = useRouter();
  const [session, setSession] = useState<CreateSessionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = loadSession();
    if (!stored) {
      router.replace("/");
      return;
    }
    setSession(stored);
  }, [router]);

  if (!session) return null;

  const end = async (): Promise<void> => {
    try {
      await endSession(session.sessionId);
    } catch {
      // Best-effort: leaving the screen shouldn't depend on the call.
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
      <RoomAudioRenderer />
      <QuizLayout
        avatar={<p className="text-2xl font-bold">Pip</p>}
        center={
          error ? (
            <p role="alert" className="text-xl text-rose-700">
              {error}
            </p>
          ) : (
            <p className="text-xl text-slate-600">Connecting to Pip…</p>
          )
        }
        scorecard={
          <p className="text-slate-500">Your progress appears here.</p>
        }
        controls={<AudioControls onEnd={end} />}
      />
    </LiveKitRoom>
  );
}
