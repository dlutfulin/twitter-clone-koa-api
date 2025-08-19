import { inject, injectable } from "tsyringe";
import { IPostRepository } from "./post.repository";
import { CreatePostDTO, PostResponse } from "../../domain/types/post.types";
import { Post } from "../../domain/entities/posts.entity";
import { IUserRepository } from "../user/user.repository";

@injectable()
export class PostService {
  constructor(
    @inject("IPostRepository") private postRepository: IPostRepository,
    @inject("IUserRepository") private userRepository: IUserRepository,
  ) {}

  async createPost(userId: number, data: CreatePostDTO): Promise<PostResponse> {
    const post = Post.create({
      userId,
      content: data.content,
      mediaUrl: data.mediaUrl,
    });

    const savedPost = await this.postRepository.save(post);
    const user = await this.userRepository.findById(userId.toString());
    
    return this.toPostResponse(savedPost, user, false, false);
  }

  private toPostResponse(post: Post, user: any, isLikedByCurrentUser: boolean, isRetweetedByCurrentUser: boolean): PostResponse {
    return {
      id: post.id!,
      userId: post.userId,
      content: post.content,
      mediaUrl: post.mediaUrl,
      likesCount: post.likesCount,
      retweetsCount: post.retweetsCount,
      commentsCount: post.commentsCount,
      isLikedByCurrentUser,
      isRetweetedByCurrentUser,
      user: {
        id: user.id!,
        username: user.username,
        email: user.email,
      },
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }
}
