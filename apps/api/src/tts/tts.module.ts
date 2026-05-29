import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createTtsProvider } from "./tts.factory.js";
import { TtsController } from "./tts.controller.js";
import { TTS_PROVIDER } from "./tts-provider.interface.js";

@Module({
  controllers: [TtsController],
  providers: [
    {
      provide: TTS_PROVIDER,
      useFactory: createTtsProvider,
      inject: [ConfigService],
    },
  ],
})
export class TtsModule {}
