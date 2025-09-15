import { Context } from "koa";
import { inject, injectable } from "tsyringe";
import { AuthService } from "../../../services/auth/auth.service";
import { RegisterDTO, LoginDTO } from "../../../domain/types/auth.types";
import { loginSchema, registerSchema } from "../../../services/auth/validators";

@injectable()
export class AuthController {
  constructor(@inject(AuthService) private authService: AuthService) {}

  async register(ctx: Context) {
    try {
      const data: RegisterDTO = registerSchema.parse(ctx.request.body);
      const user = await this.authService.register(data);

      ctx.status = 201;
      ctx.body = {
        message: "User registered successfully",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      };
    } catch (err: any) {
      ctx.status = 400;
      ctx.body = {
        error: err.message || "Registration failed",
        details: err.errors || undefined,
      };
    }
  }

  async login(ctx: Context) {
    try {
      const data: LoginDTO = loginSchema.parse(ctx.request.body);
      const loginResult = await this.authService.login(data);

      ctx.cookies.set("refreshToken", loginResult.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      ctx.status = 200;
      ctx.body = {
        message: "Login successful",
        user: loginResult.user,
        accessToken: loginResult.tokens.accessToken,
      };
    } catch (err: any) {
      ctx.status = 401;
      ctx.body = {
        error: err.message || "Authentication failed",
        details: err.errors || undefined,
      };
    }
  }

  async refresh(ctx: Context) {
    try {
      const refreshToken = ctx.cookies.get("refreshToken");

      if (!refreshToken) {
        ctx.status = 401;
        ctx.body = { error: "Refresh token not provided" };
        return;
      }

      const tokens = await this.authService.refreshTokens(refreshToken);

      ctx.cookies.set("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      ctx.status = 200;
      ctx.body = {
        message: "Tokens refreshed successfully",
        accessToken: tokens.accessToken,
      };
    } catch (err: any) {
      ctx.cookies.set("refreshToken", "", { maxAge: 0 });

      ctx.status = 401;
      ctx.body = { error: err.message || "Token refresh failed" };
    }
  }

  async logout(ctx: Context) {
    try {
      const refreshToken = ctx.cookies.get("refreshToken");

      if (refreshToken) {
        await this.authService.logout(refreshToken);
      }

      ctx.cookies.set("refreshToken", "", { maxAge: 0 });

      ctx.status = 200;
      ctx.body = { message: "Logout successful" };
    } catch (err: any) {
      ctx.status = 500;
      ctx.body = { error: err.message || "Logout failed" };
    }
  }

  async me(ctx: Context) {
    try {
      const user = ctx.state.user;
      ctx.status = 200;
      ctx.body = {
        id: user.id,
        email: user.email,
        username: user.username,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (err: any) {
      ctx.status = 500;
      ctx.body = { error: err.message || "Failed to get user info" };
    }
  }
}
