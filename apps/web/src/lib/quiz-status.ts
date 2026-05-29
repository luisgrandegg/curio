// Connection phases for the quiz screen, mapped to kind, kid-friendly banners.
export type QuizPhase =
  | "connecting"
  | "waiting" // connected, Pip hasn't joined yet (within grace period)
  | "live" // Pip is in the room — no banner
  | "no-pip" // Pip didn't join in time
  | "reconnecting"
  | "mic-denied"
  | "failed";

export type BannerTone = "info" | "warn" | "error";

export interface BannerInfo {
  message: string;
  tone: BannerTone;
  retry: boolean;
}

const BANNERS: Record<Exclude<QuizPhase, "live">, BannerInfo> = {
  connecting: { message: "Connecting to Pip…", tone: "info", retry: false },
  waiting: { message: "Pip is getting ready…", tone: "info", retry: false },
  "no-pip": {
    message: "Pip is taking a nap — let's try again.",
    tone: "warn",
    retry: true,
  },
  reconnecting: { message: "Reconnecting to Pip…", tone: "warn", retry: false },
  "mic-denied": {
    message:
      "I can't hear you yet — please allow your microphone, then try again.",
    tone: "error",
    retry: true,
  },
  failed: {
    message: "Something went wrong. Let's try again.",
    tone: "error",
    retry: true,
  },
};

/** Banner to show for a phase, or null when the quiz is live. */
export function quizBanner(phase: QuizPhase): BannerInfo | null {
  return phase === "live" ? null : BANNERS[phase];
}
