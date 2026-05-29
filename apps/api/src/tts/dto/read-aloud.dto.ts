import { Type } from "class-transformer";
import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export class ReadAloudDto {
  // PROD: a 2000-char cap is a coarse guard; tune + rate-limit for production.
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  text!: string;

  // Cartesia speed range; defaults server-side from TTS_DEFAULT_SPEED.
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.6)
  @Max(2.0)
  speed?: number;
}
