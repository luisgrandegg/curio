import { AccessToken } from "livekit-server-sdk";
import type { TokenMinter } from "./token-minter.interface.js";

const ONE_HOUR = "1h";

/**
 * LiveKit-backed {@link TokenMinter} — the only `livekit-server-sdk` touchpoint.
 * The child gets a 1h token scoped to one room with publish + subscribe.
 */
export class LivekitTokenMinter implements TokenMinter {
  constructor(
    private readonly apiKey: string,
    private readonly apiSecret: string,
    private readonly url: string,
  ) {}

  async mint(
    roomName: string,
    identity: string,
  ): Promise<{ token: string; url: string }> {
    const at = new AccessToken(this.apiKey, this.apiSecret, {
      identity,
      ttl: ONE_HOUR,
    });
    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });
    return { token: await at.toJwt(), url: this.url };
  }
}
