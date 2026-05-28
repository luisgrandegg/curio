// Placeholder entry for the Curio web app.
// PROD/B05: replaced by the Next.js 15 app (capture → review → quiz).
import type { Subject } from "@curio/types";

const DEFAULT_SUBJECT: Subject = "maths";

export const webPlaceholder = (): string =>
  `Curio web placeholder (${DEFAULT_SUBJECT}) — Next.js app lands in B05.`;
