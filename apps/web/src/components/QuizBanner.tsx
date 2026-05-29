import type { BannerInfo } from "../lib/quiz-status";

export interface QuizBannerProps {
  banner: BannerInfo;
  onRetry: () => void;
}

const TONE_CLASS: Record<BannerInfo["tone"], string> = {
  info: "bg-sky-100 text-sky-900",
  warn: "bg-amber-100 text-amber-900",
  error: "bg-rose-100 text-rose-900",
};

export function QuizBanner({ banner, onRetry }: QuizBannerProps) {
  return (
    <div
      // Errors interrupt (assertive); progress updates are polite.
      role={banner.tone === "error" ? "alert" : "status"}
      className={`flex items-center justify-center gap-4 rounded-2xl px-4 py-3 text-lg font-semibold ${TONE_CLASS[banner.tone]}`}
    >
      <span>{banner.message}</span>
      {banner.retry ? (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-xl bg-white px-4 py-2 font-bold ring-1 ring-slate-300"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
