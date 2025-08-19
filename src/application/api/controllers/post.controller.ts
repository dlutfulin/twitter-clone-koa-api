import { Context } from "koa";
import { inject, injectable } from "tsyringe";
import { PostService } from "../../../services/post/post.service";
import { createPostSchema } from "../../../services/post/validators";

@injectable()
export class PostController {
  constructor(@inject(PostService) private postService: PostService) {}

  async createPost(ctx: Context) {
    try {
      const data: any = createPostSchema.parse(ctx.request.body);
      const userId = ctx.state.user.id;

      const post = await this.postService.createPost(userId, data);

      ctx.status = 201;
      ctx.body = {
        message: "Post created successfully",
        post,
      };
    } catch (err: any) {
      ctx.status = 400;
      ctx.body = {
        error: err.message || "Failed to create post",
        details: err.errors || undefined,
      };
    }
  }
}