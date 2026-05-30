import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import type { Request } from "express";
import { RateLimiter } from "./rate-limit.js";

// Global per-IP throttle. Liveness checks are exempt so an upstream health probe
// can't lock itself out, and so a flood of probes never hides a real outage.
@Injectable()
export class ThrottleGuard implements CanActivate {
  constructor(private readonly limiter: RateLimiter) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    if (req.path?.endsWith("/health")) {
      return true;
    }
    const key = req.ip ?? "unknown";
    if (!this.limiter.check(key)) {
      throw new HttpException(
        "Too many requests. Please slow down and try again.",
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    return true;
  }
}
