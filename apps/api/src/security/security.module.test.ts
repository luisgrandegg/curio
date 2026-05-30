import { Test } from "@nestjs/testing";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { RateLimiter } from "./rate-limit.js";
import { SecurityModule } from "./security.module.js";

describe("SecurityModule", () => {
  const original = { ...process.env };

  beforeEach(() => {
    delete process.env.RATE_LIMIT_MAX;
    delete process.env.RATE_LIMIT_WINDOW_MS;
  });

  afterEach(() => {
    process.env = { ...original };
  });

  it("provides a RateLimiter built from the default limits", async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [SecurityModule],
    }).compile();

    expect(moduleRef.get(RateLimiter)).toBeInstanceOf(RateLimiter);
  });

  it("reads limits from the environment", async () => {
    process.env.RATE_LIMIT_MAX = "1";
    process.env.RATE_LIMIT_WINDOW_MS = "1000";
    const moduleRef = await Test.createTestingModule({
      imports: [SecurityModule],
    }).compile();

    const limiter = moduleRef.get(RateLimiter);
    expect(limiter.check("k", 0)).toBe(true);
    expect(limiter.check("k", 0)).toBe(false);
  });
});
