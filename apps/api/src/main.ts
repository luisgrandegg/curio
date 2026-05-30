import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import helmet from "helmet";
import { AppModule } from "./app.module.js";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Trust the Caddy reverse proxy so req.ip is the real client for rate
  // limiting (see docker-compose.yml / docs/deploy/vps.md).
  app.set("trust proxy", 1);
  // Baseline security headers. CSP is disabled — this is a JSON-only API served
  // cross-origin to the web app, so a restrictive default-src would break it.
  app.use(helmet({ contentSecurityPolicy: false }));
  // Lock CORS to the configured web origin; allow all in local dev.
  app.enableCors({ origin: process.env.CORS_ORIGIN ?? true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // Drain in-flight requests on SIGTERM/SIGINT instead of dying mid-quiz.
  app.enableShutdownHooks();
  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
  // PROD: structured request logging — wire a logger (Pino/Winston) to a sink.
}

void bootstrap();
