import { Like } from "../../domain/entities/like.entity";

export interface ILikeRepository {
  save(like: Like): Promise<Like>;
  delete(userId: number, postId: number): Promise<void>;
  findByUserIdAndPostId(userId: number, postId: number): Promise<Like | null>;
  countByPostId(postId: number): Promise<number>;
  findByPostId(
    postId: number,
    limit?: number,
    offset?: number
  ): Promise<Like[]>;
}
