import { Context } from "koa";
import { inject, injectable } from "tsyringe";
import { UserService } from "../../../services/user/user.service";

@injectable()
export class UserController {
  constructor(@inject(UserService) private userService: UserService) {}

  async getAllUsers(ctx: Context) {
    try {
      const users = await this.userService.getAllUsers();
      ctx.status = 200;
      ctx.body = {
        users,
        total: users.length,
      };
    } catch (err: any) {
      ctx.status = 500;
      ctx.body = { error: err.message || "Failed to get users" };
    }
  }

  async getUser(ctx: Context) {
    try {
      const user = await this.userService.getUserById(ctx.params.id);
      ctx.status = 200;
      ctx.body = user;
    } catch (err: any) {
      if (err.message === "User not found") {
        ctx.status = 404;
        ctx.body = { error: "User not found" };
      } else {
        ctx.status = 500;
        ctx.body = { error: err.message || "Failed to get user" };
      }
    }
  }

  async getUserByUsername(ctx: Context) {
    try {
      const user = await this.userService.getUserByUsername(ctx.params.username);
      if (!user) {
        ctx.status = 404;
        ctx.body = { error: "User not found" };
        return;
      }
      ctx.status = 200;
      ctx.body = user;
    } catch (err: any) {
      ctx.status = 500;
      ctx.body = { error: err.message || "Failed to get user" };
    }
  }

  async updateUser(ctx: Context) {
    try {
      const updates = ctx.request.body as { email?: string; username?: string };
      const user = await this.userService.updateUser(ctx.params.id, updates);
      
      ctx.status = 200;
      ctx.body = {
        message: "User updated successfully",
        user,
      };
    } catch (err: any) {
      if (err.message.includes("already exists")) {
        ctx.status = 409;
      } else if (err.message === "User not found") {
        ctx.status = 404;
      } else {
        ctx.status = 400;
      }
      ctx.body = { error: err.message || "Failed to update user" };
    }
  }

  async deactivateUser(ctx: Context) {
    try {
      const user = await this.userService.deactivateUser(ctx.params.id);
      ctx.status = 200;
      ctx.body = {
        message: "User deactivated successfully",
        user,
      };
    } catch (err: any) {
      if (err.message === "User not found") {
        ctx.status = 404;
      } else {
        ctx.status = 500;
      }
      ctx.body = { error: err.message || "Failed to deactivate user" };
    }
  }

  async activateUser(ctx: Context) {
    try {
      const user = await this.userService.activateUser(ctx.params.id);
      ctx.status = 200;
      ctx.body = {
        message: "User activated successfully",
        user,
      };
    } catch (err: any) {
      if (err.message === "User not found") {
        ctx.status = 404;
      } else {
        ctx.status = 500;
      }
      ctx.body = { error: err.message || "Failed to activate user" };
    }
  }
}
