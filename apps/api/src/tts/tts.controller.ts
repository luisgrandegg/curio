import { Body, Controller, HttpCode, Inject, Post } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { ReadAloudResponse } from "@curio/types";
import { ReadAloudDto } from "./dto/read-aloud.dto.js";
import { TTS_PROVIDER, type TtsProvider } from "./tts-provider.interface.js";

@Controller("tts")
export class TtsController {
  private readonly defaultSpeed: number;

  constructor(
    @Inject(TTS_PROVIDER) private readonly tts: TtsProvider,
    config: ConfigService,
  ) {
    this.defaultSpeed = Number(
      config.get<string>("TTS_DEFAULT_SPEED") ?? "0.9",
    );
  }

  @Post("read-aloud")
  @HttpCode(200)
  readAloud(@Body() dto: ReadAloudDto): Promise<ReadAloudResponse> {
    return this.tts.synthesize(dto.text, dto.speed ?? this.defaultSpeed);
  }
}
