import { eq, and, count, desc } from "drizzle-orm";
import { injectable } from "tsyringe";
import { getDb } from "../../shared/drizzle-orm";
import { notifications } from "../../shared/schema";
import { Notification } from "../../domain/entities/notification.entity";
import { INotificationRepository } from "./notification.repository";

@injectable()
export class NotificationRepositoryImpl implements INotificationRepository {
  async sendLikeNotification(
    likerId: number,
    postOwnerId: number,
    postId: number,
    likerUsername: string
  ): Promise<void> {
    const notification = Notification.createLikeNotification(
      postOwnerId,
      likerId,
      postId,
      likerUsername
    );
    await this.save(notification);
  }

  async sendFollowNotification(
    followerId: number,
    followeeId: number,
    followerUsername: string
  ): Promise<void> {
    const notification = Notification.createFollowNotification(
      followeeId,
      followerId,
      followerUsername
    );
    await this.save(notification);
  }

  async save(notification: Notification): Promise<Notification> {
    const db = await getDb();
    const [row] = await db
      .insert(notifications)
      .values({
        user_id: notification.userId,
        actor_id: notification.actorId,
        type: notification.type,
        post_id: notification.postId ?? null,
        message: notification.message,
        is_read: notification.isRead,
        created_at: notification.createdAt,
      })
      .returning();

    return Notification.fromPersistence({
      id: row.id,
      userId: row.user_id,
      actorId: row.actor_id,
      type: row.type,
      postId: row.post_id,
      message: row.message,
      isRead: row.is_read,
      createdAt: row.created_at,
    });
  }

  async findByUserId(userId: number, limit = 20, offset = 0): Promise<Notification[]> {
    const db = await getDb();
    const rows = await db
      .select()
      .from(notifications)
      .where(eq(notifications.user_id, userId))
      .orderBy(desc(notifications.created_at))
      .limit(limit)
      .offset(offset);

    return rows.map(row =>
      Notification.fromPersistence({
        id: row.id,
        userId: row.user_id,
        actorId: row.actor_id,
        type: row.type,
        postId: row.post_id,
        message: row.message,
        isRead: row.is_read,
        createdAt: row.created_at,
      })
    );
  }

  async findById(notificationId: number): Promise<Notification | null> {
    const db = await getDb();
    const [row] = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, notificationId))
      .limit(1);

    if (!row) return null;

    return Notification.fromPersistence({
      id: row.id,
      userId: row.user_id,
      actorId: row.actor_id,
      type: row.type,
      postId: row.post_id,
      message: row.message,
      isRead: row.is_read,
      createdAt: row.created_at,
    });
  }

  async update(notification: Notification): Promise<Notification> {
    const db = await getDb();
    const [row] = await db
      .update(notifications)
      .set({
        is_read: notification.isRead,
      })
      .where(eq(notifications.id, notification.id))
      .returning();

    return Notification.fromPersistence({
      id: row.id,
      userId: row.user_id,
      actorId: row.actor_id,
      type: row.type,
      postId: row.post_id,
      message: row.message,
      isRead: row.is_read,
      createdAt: row.created_at,
    });
  }

  async countUnreadByUserId(userId: number): Promise<number> {
    const db = await getDb();
    const [result] = await db
      .select({ count: count() })
      .from(notifications)
      .where(and(eq(notifications.user_id, userId), eq(notifications.is_read, false)));

    return result.count;
  }
}
