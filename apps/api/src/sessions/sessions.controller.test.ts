import type { CreateSessionResponse, SessionState } from "@curio/types";
import { describe, expect, it, vi } from "vitest";
import { SessionsController } from "./sessions.controller.js";
import type { SessionsService } from "./sessions.service.js";

const controllerWith = (service: Partial<SessionsService>) =>
  new SessionsController(service as SessionsService);

describe("SessionsController", () => {
  it("delegates create to the service", async () => {
    const res = { sessionId: "s1" } as CreateSessionResponse;
    const create = vi.fn().mockResolvedValue(res);
    const controller = controllerWith({ create });

    expect(await controller.create({ lessonId: "l1" })).toBe(res);
    expect(create).toHaveBeenCalledWith("l1");
  });

  it("delegates get and end", () => {
    const state = { sessionId: "s1", status: "active" } as SessionState;
    const getOrThrow = vi.fn().mockReturnValue(state);
    const end = vi.fn().mockReturnValue({ ...state, status: "ended" });
    const controller = controllerWith({ getOrThrow, end });

    expect(controller.get("s1")).toBe(state);
    expect(getOrThrow).toHaveBeenCalledWith("s1");
    expect(controller.end("s1").status).toBe("ended");
    expect(end).toHaveBeenCalledWith("s1");
  });
});
