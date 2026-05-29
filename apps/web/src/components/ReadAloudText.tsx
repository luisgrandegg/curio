import type { WordTimestamp } from "@curio/types";

export interface ReadAloudTextProps {
  text: string;
  /** Per-word timings; when present, words render as individually highlightable spans. */
  words?: WordTimestamp[];
  /** Index of the word currently spoken, or -1. */
  activeIndex?: number;
}

// Word-by-word highlight is the single most helpful read-aloud feature for
// dyslexic readers; we drive it from Cartesia's word timestamps.
export function ReadAloudText({
  text,
  words,
  activeIndex = -1,
}: ReadAloudTextProps) {
  if (!words || words.length === 0) {
    return <span>{text}</span>;
  }
  return (
    <span>
      {words.map((w, i) => (
        <span
          key={`${w.word}-${i}`}
          data-active={i === activeIndex}
          className={
            i === activeIndex ? "rounded bg-yellow-200 text-slate-900" : ""
          }
        >
          {w.word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}
