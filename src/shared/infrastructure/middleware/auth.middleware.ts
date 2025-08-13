import { Context, Next } from 'koa';
import { container } from '../container';
import { AuthService } from '../../../modules/user/application/auth.service';

export const authMiddleware = async (ctx: Context, next: Next) => {
  const authHeader = ctx.headers.authorization;

  if (!authHeader) {
    ctx.status = 401;
    ctx.body = { error: 'Authorization header required' };
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    ctx.status = 401;
    ctx.body = { error: 'Token required' };
    return;
  }

  try {
    const authService = container.resolve(AuthService);
    const user = await authService.verifyToken(token);
    
    ctx.state.user = user;
    
    await next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = { error: 'Invalid token' };
    return;
  }
};

export const activeUserMiddleware = async (ctx: Context, next: Next) => {
  if (!ctx.state.user?.isActive) {
    ctx.status = 403;
    ctx.body = { error: 'Account is deactivated' };
    return;
  }

  await next();
};