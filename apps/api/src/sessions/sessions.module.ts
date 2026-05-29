import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LessonsModule } from "../lessons/lessons.module.js";
import { createTokenMinter } from "./livekit/livekit-token.factory.js";
import { TOKEN_MINTER } from "./livekit/token-minter.interface.js";
import { SessionsController } from "./sessions.controller.js";
import { SessionsService } from "./sessions.service.js";
import { SessionsStore } from "./sessions.store.js";

@Module({
  // LessonsModule exports LessonsStore so a session can read its lesson by id.
  imports: [LessonsModule],
  controllers: [SessionsController],
  providers: [
    SessionsService,
    SessionsStore,
    {
      provide: TOKEN_MINTER,
      useFactory: createTokenMinter,
      inject: [ConfigService],
    },
  ],
  exports: [SessionsStore],
})
export class SessionsModule {}
