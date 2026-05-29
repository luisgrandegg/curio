export interface ReadAloudButtonProps {
  onClick: () => void;
  playing?: boolean;
  /** What this button will read, for the accessible label. */
  label?: string;
}

export function ReadAloudButton({
  onClick,
  playing = false,
  label = "this",
}: ReadAloudButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={playing}
      aria-label={playing ? `Stop reading ${label}` : `Read ${label} aloud`}
      className="rounded-full bg-sky-100 px-3 py-2 text-lg ring-1 ring-sky-300"
    >
      <span aria-hidden="true">{playing ? "⏸" : "🔊"}</span>
    </button>
  );
}
