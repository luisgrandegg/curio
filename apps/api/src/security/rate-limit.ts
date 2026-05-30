interface Window {
  count: number;
  resetAt: number;
}

// In-memory fixed-window rate limiter. Pure and deterministic (inject `now`) so
// the throttling logic is unit-testable without timers.
// PROD: a single process keeps its own counts — back this with Redis (or another
// shared store) once the API runs more than one instance.
export class RateLimiter {
  private readonly hits = new Map<string, Window>();
  private lastSweep = 0;

  constructor(
    private readonly maxRequests: number,
    private readonly windowMs: number,
  ) {}

  /** True if the request is allowed; false if the key is over its budget. */
  check(key: string, now: number = Date.now()): boolean {
    this.maybeSweep(now);
    const window = this.hits.get(key);
    if (!window || now >= window.resetAt) {
      this.hits.set(key, { count: 1, resetAt: now + this.windowMs });
      return true;
    }
    if (window.count >= this.maxRequests) {
      return false;
    }
    window.count += 1;
    return true;
  }

  /** Number of keys currently tracked (used in tests to assert eviction). */
  get size(): number {
    return this.hits.size;
  }

  // Drop expired windows at most once per window so the map can't grow without
  // bound as new client IPs arrive.
  private maybeSweep(now: number): void {
    if (now - this.lastSweep < this.windowMs) {
      return;
    }
    this.lastSweep = now;
    for (const [key, window] of this.hits) {
      if (now >= window.resetAt) {
        this.hits.delete(key);
      }
    }
  }
}
