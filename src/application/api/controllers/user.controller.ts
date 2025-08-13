import { Context } from "koa";
import { AuthService } from "../../../modules/user/application/auth.service";
import { registerSchema } from "../../../modules/user/interfaces/validators/register.validator";
import { RegisterDTO } from "../../../modules/user/interfaces/dtos/register.dto";
import { LoginDTO } from "../../../modules/user/interfaces/dtos/login.dto";
import { loginSchema } from "../../../modules/user/interfaces/validators/login.validator";
import { inject, injectable } from "tsyringe";
import { UserService } from "../../../modules/user/application/user.service";
import { User } from "../../../modules/user/domain/user.entity";

@injectable()
export class UserController {
  constructor(
    @inject(AuthService) private authService: AuthService,
    @inject(UserService) private userService: UserService
  ) {}

  async register(ctx: Context) {
    try {
      const data: RegisterDTO = registerSchema.parse(ctx.request.body);
      const user = await this.authService.register(data);

      ctx.status = 201;
      ctx.body = {
        id: user.id,
        email: user.email,
        username: user.username,
      };
    } catch (err: any) {
      ctx.status = 400;
      ctx.body = { error: err.message || err.errors || "Error" };
    }
  }

  async login(ctx: Context) {
    try {
      const data: LoginDTO = loginSchema.parse(ctx.request.body);
      const token = await this.authService.login(data);

      ctx.status = 200;
      ctx.body = { token };
    } catch (err: any) {
      ctx.status = 401;
      ctx.body = { error: err.message || err.errors || "Unauthorized" };
    }
  }

  async getAllUsers(ctx: Context) {
    try {
      const users = await this.userService.getAllUsers();
      ctx.body = users.map((user: User) => ({
        id: user.id,
        email: user.email,
        username: user.username,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));
      ctx.status = 200;
    } catch (err: any) {
      ctx.status = 500;
      ctx.body = { error: err.message };
    }
  }

  async getUser(ctx: Context) {
    try {
      const user = await this.userService.getUser(ctx.params.id);
      if (!user) {
        ctx.status = 404;
        ctx.body = { error: "User not found" };
        return;
      }
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
      ctx.body = { error: err.message };
    }
  }
}
