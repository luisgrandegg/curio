"use client";

import { useLocalParticipant } from "@livekit/components-react";
import { useState } from "react";

export interface AudioControlsProps {
  onEnd: () => void;
}

export function AudioControls({ onEnd }: AudioControlsProps) {
  const { localParticipant } = useLocalParticipant();
  const [muted, setMuted] = useState(false);

  const toggleMute = async (): Promise<void> => {
    const next = !muted;
    await localParticipant.setMicrophoneEnabled(!next);
    setMuted(next);
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        aria-pressed={muted}
        onClick={toggleMute}
        className="rounded-2xl bg-slate-100 px-4 py-3 text-lg font-semibold text-slate-800 ring-1 ring-slate-300"
      >
        {muted ? "Unmute" : "Mute"}
      </button>
      <button
        type="button"
        onClick={onEnd}
        className="rounded-2xl bg-rose-600 px-4 py-3 text-lg font-bold text-white"
      >
        End quiz
      </button>
    </div>
  );
}
