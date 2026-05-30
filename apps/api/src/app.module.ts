import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module.js";
import { HealthModule } from "./health/health.module.js";
import { LessonsModule } from "./lessons/lessons.module.js";
import { SessionsModule } from "./sessions/sessions.module.js";
import { TtsModule } from "./tts/tts.module.js";
import { SecurityModule } from "./security/security.module.js";

@Module({
  imports: [
    // Global so any provider can inject ConfigService without re-importing.
    ConfigModule.forRoot({ isGlobal: true }),
    // Registers the global per-IP throttle guard.
    SecurityModule,
    AuthModule,
    HealthModule,
    LessonsModule,
    SessionsModule,
    TtsModule,
  ],
})
export class AppModule {}
