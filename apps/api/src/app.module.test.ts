import { ConfigModule } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import type { Lesson } from "@curio/types";
import { describe, expect, it } from "vitest";
import { AppModule } from "./app.module.js";
import { AuthController } from "./auth/auth.controller.js";
import { HealthController } from "./health/health.controller.js";
import { LessonsController } from "./lessons/lessons.controller.js";
import { VISION_PROVIDER } from "./lessons/vision/vision-provider.interface.js";
import { SessionsController } from "./sessions/sessions.controller.js";
import { TOKEN_MINTER } from "./sessions/livekit/token-minter.interface.js";

const fakeLesson: Lesson = {
  topicTitle: "Adding",
  summary: "We add numbers.",
  subject: "maths",
  childAge: 9,
  concepts: Array.from({ length: 5 }, (_, i) => ({
    id: `c${i}`,
    label: `L${i}`,
    detail: `D${i}`,
  })),
};

// Integration: compile the whole app graph and exercise each controller through
// real DI. The vision provider is overridden so no live model call is made.
describe("AppModule", () => {
  it("wires controllers, login, and the lessons pipeline end to end", async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true }),
        AppModule,
      ],
    })
      .overrideProvider(VISION_PROVIDER)
      .useValue({ extractLesson: () => Promise.resolve(fakeLesson) })
      .overrideProvider(TOKEN_MINTER)
      .useValue({
        mint: () =>
          Promise.resolve({ token: "test.jwt.token", url: "wss://lk" }),
      })
      .compile();

    expect(moduleRef.get(HealthController).check()).toEqual({ ok: true });

    const { token } = await moduleRef.get(AuthController).login({
      email: "parent@curio.local",
      password: "demo1234",
    });
    expect(token.length).toBeGreaterThan(0);

    const lesson = await moduleRef
      .get(LessonsController)
      .create({ buffer: Buffer.from("photo-bytes") } as Express.Multer.File, {
        subject: "maths",
        childAge: 9,
      });
    expect(lesson.id).toBeTruthy();
    expect(lesson.concepts).toHaveLength(5);

    // Start a session from that lesson, read it back, then end it.
    const sessions = moduleRef.get(SessionsController);
    const created = await sessions.create({ lessonId: lesson.id });
    expect(created.roomName).toBe(created.sessionId);
    expect(created.livekitToken.length).toBeGreaterThan(0);

    const state = sessions.get(created.sessionId);
    expect(state.lesson.id).toBe(lesson.id);
    expect(state.scorecard).toHaveLength(5);
    expect(sessions.end(created.sessionId).status).toBe("ended");
  });
});
