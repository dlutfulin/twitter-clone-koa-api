import { inject, injectable } from "tsyringe";
import { ILikeRepository } from "./like.repository";
import { IPostRepository } from "../post/post.repository";
import { Like } from "../../domain/entities/like.entity";

export interface LikePostResult {
  success: boolean;
  isNewLike: boolean;
  likesCount: number;
}

export interface UnlikePostResult {
  success: boolean;
  likesCount: number;
}

@injectable()
export class LikeService {
  constructor(
    @inject("ILikeRepository") private likeRepository: ILikeRepository,
    @inject("IPostRepository") private postRepository: IPostRepository
  ) {}

  async likePost(userId: number, postId: number): Promise<LikePostResult> {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const existingLike = await this.likeRepository.findByUserIdAndPostId(userId, postId);
    if (existingLike) {
      const likesCount = await this.likeRepository.countByPostId(postId);
      return {
        success: false,
        isNewLike: false,
        likesCount,
      };
    }

    const like = Like.create(userId, postId);
    await this.likeRepository.save(like);

    await this.postRepository.incrementLikes(postId);

    const likesCount = await this.likeRepository.countByPostId(postId);

    return {
      success: true,
      isNewLike: true,
      likesCount,
    };
  }

  async unlikePost(userId: number, postId: number): Promise<UnlikePostResult> {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const existingLike = await this.likeRepository.findByUserIdAndPostId(userId, postId);
    if (!existingLike) {
      const likesCount = await this.likeRepository.countByPostId(postId);
      return {
        success: false,
        likesCount,
      };
    }

    await this.likeRepository.delete(userId, postId);

    await this.postRepository.decrementLikes(postId);

    const likesCount = await this.likeRepository.countByPostId(postId);

    return {
      success: true,
      likesCount,
    };
  }

  async isPostLikedByUser(userId: number, postId: number): Promise<boolean> {
    const like = await this.likeRepository.findByUserIdAndPostId(userId, postId);
    return !!like;
  }

  async getPostLikesCount(postId: number): Promise<number> {
    return await this.likeRepository.countByPostId(postId);
  }

  async getPostLikes(postId: number, limit = 20, offset = 0): Promise<Like[]> {
    return await this.likeRepository.findByPostId(postId, limit, offset);
  }
}