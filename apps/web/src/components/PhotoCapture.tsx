"use client";

import type { ChangeEvent } from "react";

export interface PhotoCaptureProps {
  onSelect: (file: File) => void;
  fileName?: string;
}

// On phones the `capture` attribute opens the rear camera; on desktop it's a
// file picker. `// PROD:` live getUserMedia preview + retake.
export function PhotoCapture({ onSelect, fileName }: PhotoCaptureProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) onSelect(file);
  };

  return (
    <label className="flex cursor-pointer flex-col gap-2">
      <span className="text-xl font-bold">Take or upload a photo</span>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        className="rounded-2xl bg-white p-4 text-lg ring-1 ring-slate-300"
      />
      {fileName ? (
        <span className="text-base text-slate-600">Selected: {fileName}</span>
      ) : null}
    </label>
  );
}
