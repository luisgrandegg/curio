import { ConfigModule } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { describe, expect, it } from "vitest";
import { AppModule } from "./app.module.js";
import { AuthController } from "./auth/auth.controller.js";
import { HealthController } from "./health/health.controller.js";

// Integration: compile the whole app graph and exercise both controllers
// through real DI (covers module wiring + the JwtModule async factory).
describe("AppModule", () => {
  it("wires controllers and the login flow end to end", async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true }),
        AppModule,
      ],
    }).compile();

    expect(moduleRef.get(HealthController).check()).toEqual({ ok: true });

    const auth = moduleRef.get(AuthController);
    const { token } = await auth.login({
      email: "parent@curio.local",
      password: "demo1234",
    });
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);
  });
});
