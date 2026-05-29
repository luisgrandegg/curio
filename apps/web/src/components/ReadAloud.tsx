"use client";

import { useReadAloud } from "../hooks/useReadAloud";
import { ReadAloudButton } from "./ReadAloudButton";
import { ReadAloudText } from "./ReadAloudText";

export interface ReadAloudProps {
  text: string;
  speed?: number;
  label?: string;
  /** When false, show plain text with no word highlighting. */
  highlight?: boolean;
}

// Composition: button + synchronized text, wired to the read-aloud hook.
// Browser glue (audio) — verified manually, excluded from coverage.
export function ReadAloud({
  text,
  speed,
  label,
  highlight = true,
}: ReadAloudProps) {
  const { play, playing, words, activeIndex } = useReadAloud(text, speed);
  return (
    <span className="inline-flex items-start gap-2">
      <ReadAloudButton onClick={play} playing={playing} label={label} />
      <ReadAloudText
        text={text}
        words={highlight ? words : undefined}
        activeIndex={activeIndex}
      />
    </span>
  );
}
