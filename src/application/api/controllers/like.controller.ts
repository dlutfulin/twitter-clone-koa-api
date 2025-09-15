import { Context } from "koa";
import { inject, injectable } from "tsyringe";
import { LikeService } from "../../../services/like/like.service";

@injectable()
export class LikeController {
  constructor(@inject(LikeService) private likeService: LikeService) {}
  async likePost(ctx: Context) {
    try {
      const userId = ctx.state.user.id;
      const postId = Number(ctx.params.postId);

      const result = await this.likeService.likePost(userId, postId);

      ctx.status = 200;
      ctx.body = {
        message: "Liked post successfully",
        result,
      };
    } catch (err: any) {
      ctx.status = 400;
      ctx.body = {
        error: err.message || "Failed to create like",
        details: err.errors || undefined,
      };
    }
  }

  async unlikePost(ctx: Context) {
    try {
      const postId = Number(ctx.params.postId);
      const userId = ctx.state.user.id;

      const result = await this.likeService.unlikePost(userId, postId);

      ctx.status = 200;
      ctx.body = result;
    } catch (err: any) {
      ctx.status = 400;
      ctx.body = { error: err.message };
    }
  }

  async isLiked(ctx: Context) {
    try {
      const postId = Number(ctx.params.postId);
      const userId = ctx.state.user.id;

      const isLiked = await this.likeService.isPostLikedByUser(userId, postId);

      ctx.status = 200;
      ctx.body = { isLiked };
    } catch (err: any) {
      ctx.status = 400;
      ctx.body = { error: err.message };
    }
  }

  async getLikesCount(ctx: Context) {
    try {
      const postId = Number(ctx.params.postId);

      const count = await this.likeService.getPostLikesCount(postId);

      ctx.status = 200;
      ctx.body = { count };
    } catch (err: any) {
      ctx.status = 400;
      ctx.body = { error: err.message };
    }
  }
}
