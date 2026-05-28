// HTTP API request/response contracts between apps/web and apps/api.
import type { ChildAge, Lesson, Subject } from "./lesson.js";
import type { ScorecardEntry, StudySummary } from "./quiz.js";
import type { TranscriptEntry } from "./transcript.js";

// --- POST /auth/login (mock parent auth) ---
export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  token: string;
}

// --- POST /lessons (multipart image + these fields) ---
export interface CreateLessonRequest {
  subject: Subject;
  childAge: ChildAge;
}
/** A persisted lesson carries an id the session step references. */
export interface LessonResponse extends Lesson {
  id: string;
}

// --- POST /sessions ---
export interface CreateSessionRequest {
  lessonId: string;
}
export interface CreateSessionResponse {
  sessionId: string;
  roomName: string;
  livekitToken: string;
  livekitUrl: string;
}

// --- GET /sessions/:id ---
export const SESSION_STATUSES = ["active", "ended"] as const;
export type SessionStatus = (typeof SESSION_STATUSES)[number];
export interface SessionState {
  sessionId: string;
  status: SessionStatus;
  lesson: LessonResponse;
  scorecard: ScorecardEntry[];
  transcript: TranscriptEntry[];
  summary: StudySummary | null;
}

// --- POST /tts/read-aloud (dyslexia-friendly highlighting) ---
export interface ReadAloudRequest {
  text: string;
  /** Cartesia speed param, 0.6–2.0. Defaults server-side. */
  speed?: number;
}
export interface WordTimestamp {
  word: string;
  start: number;
  end: number;
}
export interface ReadAloudResponse {
  audioBase64: string;
  mimeType: string;
  words: WordTimestamp[];
}
