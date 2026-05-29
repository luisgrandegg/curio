import { describe, expect, it } from "vitest";
import { LivekitTokenMinter } from "./livekit-token.minter.js";

interface JwtVideoGrant {
  room?: string;
  roomJoin?: boolean;
  canPublish?: boolean;
  canSubscribe?: boolean;
}
interface JwtPayload {
  sub?: string;
  exp?: number;
  iat?: number;
  video?: JwtVideoGrant;
}

const decode = (jwt: string): JwtPayload => {
  const payload = jwt.split(".")[1] ?? "";
  return JSON.parse(Buffer.from(payload, "base64url").toString()) as JwtPayload;
};

describe("LivekitTokenMinter", () => {
  it("mints a 1h token scoped to the room with publish + subscribe", async () => {
    const minter = new LivekitTokenMinter(
      "key",
      "secret-secret-secret",
      "wss://lk",
    );
    const { token, url } = await minter.mint("room-123", "child-abc");

    expect(url).toBe("wss://lk");
    const payload = decode(token);
    expect(payload.sub).toBe("child-abc");
    expect(payload.video?.room).toBe("room-123");
    expect(payload.video?.roomJoin).toBe(true);
    expect(payload.video?.canPublish).toBe(true);
    expect(payload.video?.canSubscribe).toBe(true);

    // Token expires ~1h from now (the JWT may omit `iat`, so measure vs now).
    const secondsToExpiry = (payload.exp ?? 0) - Math.floor(Date.now() / 1000);
    expect(secondsToExpiry).toBeGreaterThan(3000);
    expect(secondsToExpiry).toBeLessThanOrEqual(3601);
  });
});
