"use client";

import { useRoomContext } from "@livekit/components-react";
import { RoomEvent } from "livekit-client";
import { useEffect, useState } from "react";
import {
  type LessonConcept,
  QUIZ_DATA_TOPIC,
  type ScorecardEntry,
  type StudySummary,
} from "@curio/types";
import { decodeQuizMessage } from "../lib/quiz-decode";
import { reduceScorecard, seedScorecard } from "../lib/scorecard";

export interface QuizState {
  scorecard: ScorecardEntry[];
  summary: StudySummary | null;
  answered: number;
}

/** Subscribe to `quiz` data messages and fold them into quiz state. */
export function useScorecard(concepts: LessonConcept[]): QuizState {
  const room = useRoomContext();
  const [state, setState] = useState<QuizState>(() => ({
    scorecard: seedScorecard(concepts),
    summary: null,
    answered: 0,
  }));

  useEffect(() => {
    const onData = (
      payload: Uint8Array,
      _p: unknown,
      _k: unknown,
      topic?: string,
    ): void => {
      if (topic !== QUIZ_DATA_TOPIC) return;
      const message = decodeQuizMessage(payload);
      if (!message) return;
      setState((prev) => ({
        scorecard: reduceScorecard(prev.scorecard, message),
        summary: message.type === "summary" ? message.summary : prev.summary,
        answered:
          message.type === "recordAnswer" ? prev.answered + 1 : prev.answered,
      }));
    };
    room.on(RoomEvent.DataReceived, onData);
    return () => {
      room.off(RoomEvent.DataReceived, onData);
    };
  }, [room]);

  return state;
}
