import { HttpException } from "@nestjs/common";
import type { ExecutionContext } from "@nestjs/common";
import { describe, expect, it } from "vitest";
import { RateLimiter } from "./rate-limit.js";
import { ThrottleGuard } from "./throttle.guard.js";

function contextFor(req: { ip?: string; path?: string }): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => req }),
  } as unknown as ExecutionContext;
}

describe("ThrottleGuard", () => {
  it("allows requests under the limit", () => {
    const guard = new ThrottleGuard(new RateLimiter(2, 1000));
    expect(guard.canActivate(contextFor({ ip: "1.1.1.1" }))).toBe(true);
  });

  it("throws 429 once the limit is exceeded", () => {
    const guard = new ThrottleGuard(new RateLimiter(1, 1000));
    const ctx = contextFor({ ip: "1.1.1.1" });
    expect(guard.canActivate(ctx)).toBe(true);
    try {
      guard.canActivate(ctx);
      expect.unreachable("should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      expect((err as HttpException).getStatus()).toBe(429);
    }
  });

  it("never throttles health checks", () => {
    const guard = new ThrottleGuard(new RateLimiter(1, 1000));
    const ctx = contextFor({ ip: "1.1.1.1", path: "/api/health" });
    expect(guard.canActivate(ctx)).toBe(true);
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it("falls back to a shared key when ip is missing", () => {
    const guard = new ThrottleGuard(new RateLimiter(1, 1000));
    expect(guard.canActivate(contextFor({}))).toBe(true);
    expect(() => guard.canActivate(contextFor({}))).toThrow(HttpException);
  });
});
