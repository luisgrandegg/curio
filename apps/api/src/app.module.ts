import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module.js";
import { HealthModule } from "./health/health.module.js";
import { LessonsModule } from "./lessons/lessons.module.js";
import { SessionsModule } from "./sessions/sessions.module.js";

@Module({
  imports: [
    // Global so any provider can inject ConfigService without re-importing.
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    HealthModule,
    LessonsModule,
    SessionsModule,
  ],
})
export class AppModule {}
