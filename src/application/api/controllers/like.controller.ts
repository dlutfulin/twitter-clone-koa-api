import { Context } from "koa";
import { inject, injectable } from "tsyringe";
import { LikeService } from "../../../services/like/like.service";
import { SNSService } from "../../../services/aws/sns.service";
import { PostService } from "../../../services/post/post.service";
import { UserService } from "../../../services/user/user.service";

@injectable()
export class LikeController {
  constructor(
    @inject(LikeService) private likeService: LikeService,
    @inject(SNSService) private snsService: SNSService,
    @inject(PostService) private postService: PostService,
    @inject(UserService) private userService: UserService,
  ) {}
  async likePost(ctx: Context) {
    try {
      const userId = ctx.state.user.id;
      const postId = Number(ctx.params.postId);

      if (isNaN(postId)) {
        ctx.status = 400;
        ctx.body = { error: "Invalid post ID" };
        return;
      }

      const result = await this.likeService.likePost(userId, postId);
       
      try {
        const post = await this.postService.getPost(postId);
        const liker = await this.userService.getUserById(userId.toString());

         await this.snsService.sendLikeNotification(
          userId,
          post.userId,
          postId,
          liker.username
        );
      } catch (error) {
        console.error("Failed to send like notification:", error);
      }

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
