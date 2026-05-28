import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import type { LoginResponse } from "@curio/types";

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  // PROD: real parent accounts, hashed credentials, refresh tokens, lockout.
  async login(email: string, password: string): Promise<LoginResponse> {
    const expectedEmail =
      this.config.get<string>("MOCK_PARENT_EMAIL") ?? "parent@curio.local";
    const expectedPassword =
      this.config.get<string>("MOCK_PARENT_PASSWORD") ?? "demo1234";

    if (email !== expectedEmail || password !== expectedPassword) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const token = await this.jwt.signAsync({ sub: email, role: "parent" });
    return { token };
  }
}
