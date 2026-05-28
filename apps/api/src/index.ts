// Placeholder entry for the Curio API.
// PROD/B02: replaced by the NestJS bootstrap (ConfigModule, CORS, /health).
import type { Subject } from "@curio/types";

const DEFAULT_SUBJECT: Subject = "maths";

export const apiPlaceholder = (): string =>
  `Curio API placeholder (${DEFAULT_SUBJECT}) — NestJS app lands in B02.`;
