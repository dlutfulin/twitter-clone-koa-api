import { eq, desc, sql } from "drizzle-orm";
import { IPostRepository } from "./post.repository";
import { getDb } from "../../shared/drizzle-orm";
import { posts } from "../../shared/schema";
import { Post } from "../../domain/entities/posts.entity";

export class PostRepositoryImpl implements IPostRepository {
  async save(post: Post): Promise<Post> {
    const db = await getDb();
    const [row] = await db
      .insert(posts)
      .values({
        user_id: post.userId,
        content: post.content,
        media_url: post.mediaUrl,
        likes_count: post.likesCount,
        retweets_count: post.retweetsCount,
        comments_count: post.commentsCount,
      })
      .returning();

    return Post.fromPersistence({
      id: row.id,
      userId: row.user_id,
      content: row.content,
      mediaUrl: row.media_url,
      likesCount: row.likes_count,
      retweetsCount: row.retweets_count,
      commentsCount: row.comments_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  async findById(id: number): Promise<Post> {
    const db = await getDb();

    const record = await db
      .select()
      .from(posts)
      .where(eq(posts.id, Number(id)))
      .limit(1);

    if (!record.length) throw new Error("User does not exist");

    const row = record[0];

    return Post.fromPersistence({
      id: row.id,
      userId: row.user_id,
      content: row.content,
      mediaUrl: row.media_url,
      likesCount: row.likes_count,
      retweetsCount: row.retweets_count,
      commentsCount: row.comments_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  async findByUserId(userId: number, limit = 20, offset = 0): Promise<Post[]> {
    const db = await getDb();
    const records = await db
      .select()
      .from(posts)
      .where(eq(posts.user_id, userId))
      .orderBy(desc(posts.created_at))
      .limit(limit)
      .offset(offset);

    return records.map((row) =>
      Post.fromPersistence({
        id: row.id,
        userId: row.user_id,
        content: row.content,
        mediaUrl: row.media_url,
        likesCount: row.likes_count,
        retweetsCount: row.retweets_count,
        commentsCount: row.comments_count,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })
    );
  }

  async findFeed(limit = 20, offset = 0): Promise<Post[]> {
    const db = await getDb();
    const records = await db
      .select()
      .from(posts)
      .orderBy(desc(posts.created_at))
      .limit(limit)
      .offset(offset);

    return records.map((row) =>
      Post.fromPersistence({
        id: row.id,
        userId: row.user_id,
        content: row.content,
        mediaUrl: row.media_url,
        likesCount: row.likes_count,
        retweetsCount: row.retweets_count,
        commentsCount: row.comments_count,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })
    );
  }

  async update(post: Post): Promise<Post> {
    if (!post.id) throw new Error("Post ID is required for update");

    const db = await getDb();
    const [row] = await db
      .update(posts)
      .set({
        content: post.content,
        media_url: post.mediaUrl,
        likes_count: post.likesCount,
        retweets_count: post.retweetsCount,
        comments_count: post.commentsCount,
        updated_at: new Date(),
      })
      .where(eq(posts.id, post.id))
      .returning();

    return Post.fromPersistence({
      id: row.id,
      userId: row.user_id,
      content: row.content,
      mediaUrl: row.media_url,
      likesCount: row.likes_count,
      retweetsCount: row.retweets_count,
      commentsCount: row.comments_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  async delete(id: number): Promise<void> {
    const db = await getDb();
    await db.delete(posts).where(eq(posts.id, id));
  }

  async incrementLikes(postId: number): Promise<void> {
    const db = await getDb();
    await db
      .update(posts)
      .set({
        likes_count: sql`${posts.likes_count} + 1`,
        updated_at: new Date(),
      })
      .where(eq(posts.id, postId));
  }

  async decrementLikes(postId: number): Promise<void> {
    const db = await getDb();
    await db
      .update(posts)
      .set({
        likes_count: sql`GREATEST(${posts.likes_count} - 1, 0)`,
        updated_at: new Date(),
      })
      .where(eq(posts.id, postId));
  }

  async incrementRetweets(postId: number): Promise<void> {
    const db = await getDb();
    await db
      .update(posts)
      .set({
        retweets_count: sql`${posts.retweets_count} + 1`,
        updated_at: new Date(),
      })
      .where(eq(posts.id, postId));
  }

  async incrementComments(postId: number): Promise<void> {
    const db = await getDb();
    await db
      .update(posts)
      .set({
        comments_count: sql`${posts.comments_count} + 1`,
        updated_at: new Date(),
      })
      .where(eq(posts.id, postId));
  }
}
