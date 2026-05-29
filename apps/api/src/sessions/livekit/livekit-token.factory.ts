import type { ConfigService } from "@nestjs/config";
import { LivekitTokenMinter } from "./livekit-token.minter.js";
import type { TokenMinter } from "./token-minter.interface.js";

/** Build the LiveKit token minter from config. */
export function createTokenMinter(config: ConfigService): TokenMinter {
  return new LivekitTokenMinter(
    config.get<string>("LIVEKIT_API_KEY") ?? "",
    config.get<string>("LIVEKIT_API_SECRET") ?? "",
    config.get<string>("LIVEKIT_URL") ?? "",
  );
}
