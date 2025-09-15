import { Context, Next } from "koa";
import { container } from "../container";
import { AuthService } from "../../services/auth/auth.service";

export const authMiddleware = async (ctx: Context, next: Next) => {
  const authHeader = ctx.headers.authorization;

  if (!authHeader) {
    ctx.status = 401;
    ctx.body = { error: "Authorization header required" };
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    ctx.status = 401;
    ctx.body = { error: "Bearer token required" };
    return;
  }

  try {
    const authService = container.resolve(AuthService);
    const user = await authService.verifyAccessToken(token);

    ctx.state.user = user;

    await next();
  } catch (error: any) {
    ctx.status = 401;
    ctx.body = {
      error: "Invalid or expired token",
      message: error.message,
    };
    return;
  }
};

export const activeUserMiddleware = async (ctx: Context, next: Next) => {
  if (!ctx.state.user?.isActive) {
    ctx.status = 403;
    ctx.body = {
      error: "Account is deactivated",
      message: "Please contact support to reactivate your account",
    };
    return;
  }

  await next();
};
