import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { RateLimiter } from "./rate-limit.js";
import { ThrottleGuard } from "./throttle.guard.js";

// Defaults are generous for one child's session but cap abusive bursts that
// would otherwise run up the paid vision/TTS bills. Tune via env in production.
const DEFAULT_MAX = 120;
const DEFAULT_WINDOW_MS = 60_000;

@Module({
  providers: [
    {
      provide: RateLimiter,
      useFactory: (): RateLimiter => {
        const max = Number(process.env.RATE_LIMIT_MAX ?? DEFAULT_MAX);
        const windowMs = Number(
          process.env.RATE_LIMIT_WINDOW_MS ?? DEFAULT_WINDOW_MS,
        );
        return new RateLimiter(max, windowMs);
      },
    },
    { provide: APP_GUARD, useClass: ThrottleGuard },
  ],
})
export class SecurityModule {}
