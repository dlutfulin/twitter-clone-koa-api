import { eq, and, count } from "drizzle-orm";
import { ILikeRepository } from "./like.repository";
import { getDb } from "../../shared/drizzle-orm";
import { likes } from "../../shared/schema";
import { Like } from "../../domain/entities/like.entity";
import { injectable } from "tsyringe";

@injectable()
export class LikeRepositoryImpl implements ILikeRepository {
  async save(like: Like): Promise<Like> {
    const db = await getDb();
    const [row] = await db
      .insert(likes)
      .values({
        user_id: like.userId,
        post_id: like.postId,
      })
      .returning();

    return Like.fromPersistence({
      id: row.id,
      userId: row.user_id,
      postId: row.post_id,
      createdAt: row.created_at,
    });
  }

  async delete(userId: number, postId: number): Promise<void> {
    const db = await getDb();
    await db
      .delete(likes)
      .where(and(eq(likes.user_id, userId), eq(likes.post_id, postId)));
  }

  async findByUserIdAndPostId(
    userId: number,
    postId: number
  ): Promise<Like | null> {
    const db = await getDb();
    const [row] = await db
      .select()
      .from(likes)
      .where(and(eq(likes.user_id, userId), eq(likes.post_id, postId)))
      .limit(1);

    if (!row) return null;

    return Like.fromPersistence({
      id: row.id,
      userId: row.user_id,
      postId: row.post_id,
      createdAt: row.created_at,
    });
  }

  async countByPostId(postId: number): Promise<number> {
    const db = await getDb();
    const [result] = await db
      .select({ count: count() })
      .from(likes)
      .where(eq(likes.post_id, postId));

    return result.count;
  }

   async findByPostId(postId: number, limit = 20, offset = 0): Promise<Like[]> {
    const db = await getDb();
    const rows = await db
      .select()
      .from(likes)
      .where(eq(likes.post_id, postId))
      .limit(limit)
      .offset(offset);

    return rows.map(row =>
      Like.fromPersistence({
        id: row.id,
        userId: row.user_id,
        postId: row.post_id,
        createdAt: row.created_at,
      })
    );
  }
}
