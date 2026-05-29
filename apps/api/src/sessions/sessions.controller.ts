import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import type { CreateSessionResponse, SessionState } from "@curio/types";
import { CreateSessionDto } from "./dto/create-session.dto.js";
import { SessionsService } from "./sessions.service.js";

@Controller("sessions")
export class SessionsController {
  constructor(private readonly sessions: SessionsService) {}

  @Post()
  create(@Body() dto: CreateSessionDto): Promise<CreateSessionResponse> {
    return this.sessions.create(dto.lessonId);
  }

  @Get(":id")
  get(@Param("id") id: string): SessionState {
    return this.sessions.getOrThrow(id);
  }

  @Post(":id/end")
  @HttpCode(200)
  end(@Param("id") id: string): SessionState {
    return this.sessions.end(id);
  }
}
