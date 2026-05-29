import type { ReactNode } from "react";

export interface QuizLayoutProps {
  avatar: ReactNode;
  center: ReactNode;
  scorecard: ReactNode;
  controls: ReactNode;
}

// Three-panel quiz shell (avatar / transcript / scorecard). The panels are
// placeholders here; B09/B10 fill them. Desktop/tablet-first (documented).
export function QuizLayout({
  avatar,
  center,
  scorecard,
  controls,
}: QuizLayoutProps) {
  return (
    <div className="flex h-screen w-full gap-4 p-4">
      <aside
        aria-label="Pip the tutor"
        className="flex w-[280px] flex-col justify-between rounded-3xl bg-white p-5 ring-1 ring-slate-200"
      >
        <div className="flex flex-1 flex-col items-center justify-center">
          {avatar}
        </div>
        {controls}
      </aside>

      <main
        aria-label="Conversation"
        className="flex flex-1 flex-col rounded-3xl bg-white p-6 ring-1 ring-slate-200"
      >
        {center}
      </main>

      <aside
        aria-label="Scorecard"
        className="w-[360px] rounded-3xl bg-white p-5 ring-1 ring-slate-200"
      >
        {scorecard}
      </aside>
    </div>
  );
}
