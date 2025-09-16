import { Post } from "../../domain/entities/posts.entity";

export interface IPostRepository {
    save(post: Post): Promise<Post>;
    findById(id: number): Promise<Post | null>;
    findByUserId(userId: number, limit?: number, offset?: number): Promise<Post[]>;
    findFeed(limit?: number, offset?: number): Promise<Post[]>;
    update(post: Post): Promise<Post>;
    delete(id: number): Promise<void>;
    incrementLikes(postId: number): Promise<void>;
    decrementLikes(postId: number): Promise<void>;
    incrementRetweets(postId: number): Promise<void>;
    incrementComments(postId: number): Promise<void>;
}