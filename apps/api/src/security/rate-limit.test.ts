import { describe, expect, it } from "vitest";
import { RateLimiter } from "./rate-limit.js";

describe("RateLimiter", () => {
  it("allows requests up to the limit, then blocks", () => {
    const limiter = new RateLimiter(3, 1000);
    expect(limiter.check("a", 0)).toBe(true);
    expect(limiter.check("a", 100)).toBe(true);
    expect(limiter.check("a", 200)).toBe(true);
    expect(limiter.check("a", 300)).toBe(false);
  });

  it("tracks keys independently", () => {
    const limiter = new RateLimiter(1, 1000);
    expect(limiter.check("a", 0)).toBe(true);
    expect(limiter.check("b", 0)).toBe(true);
    expect(limiter.check("a", 0)).toBe(false);
  });

  it("resets the window after it elapses", () => {
    const limiter = new RateLimiter(1, 1000);
    expect(limiter.check("a", 0)).toBe(true);
    expect(limiter.check("a", 500)).toBe(false);
    expect(limiter.check("a", 1000)).toBe(true);
  });

  it("sweeps expired windows so the map stays bounded", () => {
    const limiter = new RateLimiter(5, 1000);
    limiter.check("a", 0);
    limiter.check("b", 0);
    expect(limiter.size).toBe(2);
    // A request past the window triggers a sweep of the now-expired keys.
    limiter.check("c", 2000);
    expect(limiter.size).toBe(1);
  });

  it("defaults `now` to the current clock", () => {
    const limiter = new RateLimiter(1, 1000);
    expect(limiter.check("a")).toBe(true);
    expect(limiter.check("a")).toBe(false);
  });
});
