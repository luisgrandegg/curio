import { UnauthorizedException } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthService } from "./auth.service.js";

const CREDS = {
  MOCK_PARENT_EMAIL: "parent@curio.local",
  MOCK_PARENT_PASSWORD: "demo1234",
  JWT_SECRET: "test-secret",
};

describe("AuthService", () => {
  let service: AuthService;
  let jwt: JwtService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ ignoreEnvFile: true, load: [() => CREDS] }),
        JwtModule.register({ secret: CREDS.JWT_SECRET }),
      ],
      providers: [AuthService],
    }).compile();
    service = moduleRef.get(AuthService);
    jwt = moduleRef.get(JwtService);
  });

  it("issues a parent JWT for valid credentials", async () => {
    const { token } = await service.login(
      CREDS.MOCK_PARENT_EMAIL,
      CREDS.MOCK_PARENT_PASSWORD,
    );
    const payload = jwt.verify<{ sub: string; role: string }>(token);
    expect(payload.sub).toBe(CREDS.MOCK_PARENT_EMAIL);
    expect(payload.role).toBe("parent");
  });

  it("rejects a wrong password", async () => {
    await expect(
      service.login(CREDS.MOCK_PARENT_EMAIL, "nope"),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("rejects an unknown email", async () => {
    await expect(
      service.login("stranger@example.com", CREDS.MOCK_PARENT_PASSWORD),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
