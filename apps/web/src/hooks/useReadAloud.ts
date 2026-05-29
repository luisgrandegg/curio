"use client";

import { useCallback, useState } from "react";
import type { WordTimestamp } from "@curio/types";
import { readAloud } from "../lib/api-client";
import { wordIndexAt } from "../lib/read-aloud";

export interface ReadAloudController {
  play: () => void;
  playing: boolean;
  words: WordTimestamp[];
  activeIndex: number;
}

// Browser glue: fetch synthesized audio + word timestamps, play it, and track
// the spoken word via `timeupdate`. The pure timing lives in lib/read-aloud.
export function useReadAloud(
  text: string,
  speed?: number,
): ReadAloudController {
  const [playing, setPlaying] = useState(false);
  const [words, setWords] = useState<WordTimestamp[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const start = useCallback(async (): Promise<void> => {
    const res = await readAloud(text, speed);
    setWords(res.words);
    const audio = new Audio(`data:${res.mimeType};base64,${res.audioBase64}`);
    audio.ontimeupdate = () =>
      setActiveIndex(wordIndexAt(res.words, audio.currentTime));
    audio.onended = () => {
      setPlaying(false);
      setActiveIndex(-1);
    };
    setPlaying(true);
    await audio.play();
  }, [text, speed]);

  return { play: () => void start(), playing, words, activeIndex };
}
