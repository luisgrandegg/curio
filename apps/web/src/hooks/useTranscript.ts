"use client";

import { useRoomContext } from "@livekit/components-react";
import type { Participant, TranscriptionSegment } from "livekit-client";
import { RoomEvent } from "livekit-client";
import { useEffect, useState } from "react";
import type { TranscriptEntry } from "@curio/types";
import { reduceTranscript } from "../lib/transcript";

// Child identity is `child-<sessionId>` (see API token minting); anyone else
// speaking in the room is the tutor (Pip).
const sideOf = (p?: Participant): "tutor" | "child" =>
  p?.identity?.startsWith("child-") ? "child" : "tutor";

export function useTranscript(): TranscriptEntry[] {
  const room = useRoomContext();
  const [entries, setEntries] = useState<TranscriptEntry[]>([]);

  useEffect(() => {
    const onTranscription = (
      segments: TranscriptionSegment[],
      participant?: Participant,
    ): void => {
      setEntries((prev) => {
        let next = prev;
        for (const seg of segments) {
          next = reduceTranscript(next, {
            id: seg.id,
            participant: sideOf(participant),
            text: seg.text,
            isFinal: seg.final,
            timestamp: seg.firstReceivedTime,
          });
        }
        return next;
      });
    };
    room.on(RoomEvent.TranscriptionReceived, onTranscription);
    return () => {
      room.off(RoomEvent.TranscriptionReceived, onTranscription);
    };
  }, [room]);

  return entries;
}
