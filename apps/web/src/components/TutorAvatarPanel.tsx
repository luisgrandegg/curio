import type { ReactNode } from "react";
import type { AgentState } from "@curio/types";
import { agentStateLabel } from "../lib/agent-state";

export interface TutorAvatarPanelProps {
  state: AgentState;
  /** Speaking visualizer (LiveKit BarVisualizer), shown while Pip talks. */
  bars?: ReactNode;
}

const RING: Record<AgentState, string> = {
  disconnected: "bg-slate-200",
  connecting: "bg-amber-200 motion-safe:animate-pulse",
  listening: "bg-emerald-200 motion-safe:animate-pulse",
  thinking: "bg-sky-200 motion-safe:animate-bounce",
  speaking: "bg-violet-200 motion-safe:animate-pulse",
};

export function TutorAvatarPanel({ state, bars }: TutorAvatarPanelProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div
        className={`flex h-32 w-32 items-center justify-center rounded-full text-6xl ${RING[state]}`}
        aria-hidden="true"
      >
        🦉
      </div>
      <p aria-live="polite" className="text-xl font-bold text-slate-800">
        {agentStateLabel(state)}
      </p>
      {state === "speaking" && bars ? (
        <div className="h-12 w-full">{bars}</div>
      ) : null}
    </div>
  );
}
