import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  // Lock CORS to the configured web origin; allow all in local dev.
  app.enableCors({ origin: process.env.CORS_ORIGIN ?? true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
  // PROD: graceful shutdown hooks, helmet, request logging, rate limiting.
}

void bootstrap();
